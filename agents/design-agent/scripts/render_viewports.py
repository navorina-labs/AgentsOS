#!/usr/bin/env python3
"""Render one local HTML fixture at exact matched CSS viewports with Chrome."""

from __future__ import annotations

import argparse
import base64
import json
import shutil
import subprocess
import tempfile
import time
import urllib.error
import urllib.request
from pathlib import Path

try:
    import websocket
except ImportError:  # pragma: no cover - environment-dependent failure path
    websocket = None

DEFAULT_CHROME_PATHS = (
    Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"),
    Path("/Applications/Chromium.app/Contents/MacOS/Chromium"),
)


def find_chrome(explicit: Path | None) -> Path:
    if explicit:
        candidate = explicit.expanduser().resolve()
        if candidate.is_file():
            return candidate
        raise ValueError(f"Chrome executable does not exist: {candidate}")
    for candidate in DEFAULT_CHROME_PATHS:
        if candidate.is_file():
            return candidate
    for command in ("google-chrome", "chromium", "chromium-browser"):
        resolved = shutil.which(command)
        if resolved:
            return Path(resolved)
    raise ValueError("Chrome or Chromium was not found; pass --chrome")


def parse_widths(values: list[int]) -> list[int]:
    if not values:
        return [1440, 1024, 768, 390]
    if any(width < 240 or width > 5000 for width in values):
        raise ValueError("viewport widths must be between 240 and 5000 CSS pixels")
    if len(set(values)) != len(values):
        raise ValueError("viewport widths must be unique")
    return values


def wait_for_debug_port(profile: Path, process: subprocess.Popen[bytes]) -> int:
    marker = profile / "DevToolsActivePort"
    for _ in range(100):
        if process.poll() is not None:
            raise ValueError("Chrome exited before opening its debugging endpoint")
        if marker.is_file():
            lines = marker.read_text(encoding="utf-8").splitlines()
            if lines and lines[0].isdigit():
                return int(lines[0])
        time.sleep(0.05)
    raise ValueError("Chrome debugging endpoint did not become ready")


class DevTools:
    def __init__(self, url: str):
        if websocket is None:
            raise ValueError(
                "Python package 'websocket-client' is required for exact viewport rendering"
            )
        self.connection = websocket.create_connection(url, timeout=10)
        self.next_id = 1

    def close(self) -> None:
        self.connection.close()

    def call(self, method: str, params: dict | None = None) -> dict:
        request_id = self.next_id
        self.next_id += 1
        self.connection.send(
            json.dumps(
                {"id": request_id, "method": method, "params": params or {}}
            )
        )
        while True:
            message = json.loads(self.connection.recv())
            if message.get("id") != request_id:
                continue
            if "error" in message:
                raise ValueError(
                    f"Chrome DevTools error for {method}: {message['error']}"
                )
            return message.get("result", {})


def render_all(
    chrome: Path,
    html: Path,
    targets: list[Path],
    widths: list[int],
    height: int,
) -> None:
    with tempfile.TemporaryDirectory(prefix="design-agent-chrome-") as temp:
        profile = Path(temp)
        process = subprocess.Popen(
            [
                str(chrome),
                "--headless=new",
                "--disable-gpu",
                "--remote-debugging-port=0",
                "--remote-allow-origins=*",
                f"--user-data-dir={profile}",
                "about:blank",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        devtools = None
        try:
            port = wait_for_debug_port(profile, process)
            targets_json = json.load(
                urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=5)
            )
            page = next(item for item in targets_json if item.get("type") == "page")
            devtools = DevTools(page["webSocketDebuggerUrl"])
            devtools.call("Page.enable")
            for width, target in zip(widths, targets):
                devtools.call(
                    "Emulation.setDeviceMetricsOverride",
                    {
                        "width": width,
                        "height": height,
                        "deviceScaleFactor": 1,
                        "mobile": False,
                    },
                )
                devtools.call("Page.navigate", {"url": html.as_uri()})
                devtools.call(
                    "Runtime.evaluate",
                    {
                        "expression": (
                            "new Promise(resolve => {"
                            "if (document.readyState === 'complete') resolve(true);"
                            "else addEventListener('load', () => resolve(true), {once:true});"
                            "})"
                        ),
                        "awaitPromise": True,
                        "returnByValue": True,
                    },
                )
                metrics = devtools.call(
                    "Runtime.evaluate",
                    {
                        "expression": (
                            "({width: innerWidth, height: innerHeight, "
                            "dpr: devicePixelRatio})"
                        ),
                        "returnByValue": True,
                    },
                )["result"]["value"]
                if metrics != {"width": width, "height": height, "dpr": 1}:
                    raise ValueError(
                        f"Chrome viewport mismatch: requested {width}x{height}@1, "
                        f"observed {metrics}"
                    )
                capture = devtools.call(
                    "Page.captureScreenshot",
                    {
                        "format": "png",
                        "fromSurface": True,
                        "captureBeyondViewport": False,
                    },
                )
                target.write_bytes(base64.b64decode(capture["data"]))
                print(f"Rendered {width} × {height}: {target}")
        finally:
            if devtools is not None:
                devtools.close()
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--width", action="append", type=int, dest="widths")
    parser.add_argument("--height", type=int, default=1000)
    parser.add_argument("--chrome", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    try:
        html = args.html.expanduser().resolve(strict=True)
        if not html.is_file() or html.suffix.casefold() not in {".html", ".htm"}:
            raise ValueError("input must be an existing HTML file")
        if args.height < 240 or args.height > 5000:
            raise ValueError("viewport height must be between 240 and 5000 CSS pixels")
        widths = parse_widths(args.widths or [])
        chrome = find_chrome(args.chrome)
        if websocket is None:
            raise ValueError(
                "Python package 'websocket-client' is required for exact viewport rendering"
            )
    except (OSError, ValueError) as exc:
        print(f"[ERROR] {exc}")
        return 1

    output_dir = args.output_dir.expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    targets = [
        output_dir / f"{html.stem}-{width}x{args.height}.png" for width in widths
    ]
    existing = [target for target in targets if target.exists()]
    if existing and not args.force:
        print("[ERROR] Refusing to overwrite existing render(s):")
        for target in existing:
            print(f"- {target}")
        return 1

    try:
        render_all(chrome, html, targets, widths, args.height)
    except (
        OSError,
        ValueError,
        StopIteration,
        subprocess.SubprocessError,
        urllib.error.URLError,
    ) as exc:
        print(f"[ERROR] {exc}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
