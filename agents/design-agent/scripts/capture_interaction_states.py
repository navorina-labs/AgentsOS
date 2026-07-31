#!/usr/bin/env python3
"""Reproduce dashboard interactions in Chrome and capture evidence plus a trace."""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import subprocess
import tempfile
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from render_viewports import DevTools, find_chrome, wait_for_debug_port


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def evaluate(devtools: DevTools, expression: str, await_promise: bool = False) -> Any:
    result = devtools.call(
        "Runtime.evaluate",
        {
            "expression": expression,
            "awaitPromise": await_promise,
            "returnByValue": True,
        },
    )
    value = result.get("result", {})
    if value.get("subtype") == "error":
        raise ValueError(value.get("description", "JavaScript evaluation failed"))
    return value.get("value")


def set_viewport(devtools: DevTools, width: int, height: int) -> None:
    devtools.call(
        "Emulation.setDeviceMetricsOverride",
        {
            "width": width,
            "height": height,
            "deviceScaleFactor": 1,
            "mobile": False,
        },
    )


def navigate(devtools: DevTools, html: Path, harness: str) -> None:
    devtools.call("Page.navigate", {"url": html.as_uri()})
    evaluate(
        devtools,
        (
            "new Promise(resolve => {"
            "if (document.readyState === 'complete') resolve(true);"
            "else addEventListener('load', () => resolve(true), {once:true});"
            "})"
        ),
        await_promise=True,
    )
    evaluate(devtools, harness)


def click(devtools: DevTools, selector: str) -> dict[str, float]:
    rect = evaluate(
        devtools,
        (
            "(() => {"
            f"const element=document.querySelector({json.dumps(selector)});"
            "if(!element) throw new Error('Missing click target');"
            "element.scrollIntoView({block:'center',inline:'center'});"
            "const r=element.getBoundingClientRect();"
            "return {x:r.left+r.width/2,y:r.top+r.height/2};"
            "})()"
        ),
    )
    for event_type in ("mousePressed", "mouseReleased"):
        devtools.call(
            "Input.dispatchMouseEvent",
            {
                "type": event_type,
                "x": rect["x"],
                "y": rect["y"],
                "button": "left",
                "clickCount": 1,
            },
        )
    return rect


def press_tab(devtools: DevTools) -> None:
    common = {
        "key": "Tab",
        "code": "Tab",
        "windowsVirtualKeyCode": 9,
        "nativeVirtualKeyCode": 9,
    }
    devtools.call("Input.dispatchKeyEvent", {"type": "keyDown", **common})
    devtools.call("Input.dispatchKeyEvent", {"type": "keyUp", **common})


def assert_equal(devtools: DevTools, expression: str, expected: Any) -> Any:
    observed = evaluate(devtools, expression)
    if observed != expected:
        raise ValueError(
            f"Assertion failed: {expression} expected {expected!r}, observed {observed!r}"
        )
    return observed


def capture(devtools: DevTools, target: Path) -> None:
    result = devtools.call(
        "Page.captureScreenshot",
        {
            "format": "png",
            "fromSurface": True,
            "captureBeyondViewport": False,
        },
    )
    target.write_bytes(base64.b64decode(result["data"]))


def record_state(
    devtools: DevTools,
    output_dir: Path,
    trace: dict[str, Any],
    state_id: str,
    width: int,
    height: int,
    actions: list[dict[str, Any]],
    assertions: list[tuple[str, Any]],
) -> None:
    observed = []
    for expression, expected in assertions:
        value = assert_equal(devtools, expression, expected)
        observed.append(
            {"expression": expression, "expected": expected, "observed": value}
        )
    filename = f"dashboard-interaction-{state_id}-{width}x{height}.png"
    capture(devtools, output_dir / filename)
    trace["states"].append(
        {
            "id": state_id,
            "viewport": {"width": width, "height": height, "device_scale_factor": 1},
            "actions": actions,
            "assertions": observed,
            "screenshot": filename,
        }
    )
    print(f"Captured {state_id}: {filename}")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html", type=Path)
    parser.add_argument("harness", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--chrome", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    try:
        html = args.html.expanduser().resolve(strict=True)
        harness_path = args.harness.expanduser().resolve(strict=True)
        chrome = find_chrome(args.chrome)
        harness = harness_path.read_text(encoding="utf-8")
    except (OSError, ValueError) as exc:
        print(f"[ERROR] {exc}")
        return 1

    output_dir = args.output_dir.expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    expected_files = [
        output_dir / f"dashboard-interaction-{state}-{width}x1000.png"
        for state, width in (
            ("default", 1440),
            ("keyboard-focus", 1440),
            ("ticket-selected", 1440),
            ("assignment-loading", 1440),
            ("assignment-error", 1440),
            ("assignment-success", 1440),
            ("menu-open", 390),
        )
    ]
    trace_path = output_dir / "dashboard-interaction-trace.json"
    existing = [path for path in [*expected_files, trace_path] if path.exists()]
    if existing and not args.force:
        print("[ERROR] Refusing to overwrite existing interaction evidence:")
        for path in existing:
            print(f"- {path}")
        return 1

    trace: dict[str, Any] = {
        "schema_version": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "source": {"file": html.name, "sha256": sha256(html)},
        "harness": {"file": harness_path.name, "sha256": sha256(harness_path)},
        "states": [],
    }

    with tempfile.TemporaryDirectory(prefix="design-agent-interaction-") as temp:
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
            targets = json.load(
                urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=5)
            )
            page = next(item for item in targets if item.get("type") == "page")
            devtools = DevTools(page["webSocketDebuggerUrl"])
            devtools.call("Page.enable")
            trace["browser"] = devtools.call("Browser.getVersion")

            set_viewport(devtools, 1440, 1000)
            navigate(devtools, html, harness)
            assert_equal(
                devtools,
                "JSON.stringify({width:innerWidth,height:innerHeight,dpr:devicePixelRatio})",
                '{"width":1440,"height":1000,"dpr":1}',
            )
            record_state(
                devtools,
                output_dir,
                trace,
                "default",
                1440,
                1000,
                [{"type": "navigate"}, {"type": "inject-harness"}],
                [
                    ("window.__interactionHarness.ready", True),
                    ("document.querySelector('#bulk-edit').disabled", True),
                    ("document.querySelector('#assign-owner').textContent", "Assign owner"),
                ],
            )

            press_tab(devtools)
            record_state(
                devtools,
                output_dir,
                trace,
                "keyboard-focus",
                1440,
                1000,
                [{"type": "keyboard", "key": "Tab"}],
                [
                    (
                        "document.activeElement.textContent.trim()",
                        "Skip to operations",
                    )
                ],
            )

            selection_point = click(devtools, "#t8941")
            record_state(
                devtools,
                output_dir,
                trace,
                "ticket-selected",
                1440,
                1000,
                [{"type": "pointer-click", "selector": "#t8941", "point": selection_point}],
                [
                    ("document.querySelector('#t8941').checked", True),
                    ("document.querySelector('#bulk-edit').disabled", False),
                    (
                        "document.querySelector('.selection-status').textContent",
                        "1 ticket selected",
                    ),
                ],
            )

            assignment_point = click(devtools, "#assign-owner")
            record_state(
                devtools,
                output_dir,
                trace,
                "assignment-loading",
                1440,
                1000,
                [
                    {
                        "type": "pointer-click",
                        "selector": "#assign-owner",
                        "point": assignment_point,
                    }
                ],
                [
                    ("window.__interactionHarness.assignment", "loading"),
                    ("document.querySelector('#assign-owner').disabled", True),
                    (
                        "document.querySelector('#assign-owner').getAttribute('aria-busy')",
                        "true",
                    ),
                ],
            )

            time.sleep(1.0)
            record_state(
                devtools,
                output_dir,
                trace,
                "assignment-error",
                1440,
                1000,
                [{"type": "wait", "milliseconds": 1000}],
                [
                    ("window.__interactionHarness.assignment", "error"),
                    ("document.querySelector('#assignment-error').hidden", False),
                    ("document.querySelector('#assign-owner').disabled", False),
                ],
            )

            retry_point = click(devtools, "#assign-owner")
            time.sleep(1.0)
            record_state(
                devtools,
                output_dir,
                trace,
                "assignment-success",
                1440,
                1000,
                [
                    {
                        "type": "pointer-click",
                        "selector": "#assign-owner",
                        "point": retry_point,
                    },
                    {"type": "wait", "milliseconds": 1000},
                ],
                [
                    ("window.__interactionHarness.assignment", "success"),
                    (
                        "document.querySelector('.incident.critical p').textContent",
                        "Owner: Maya · 142 tickets",
                    ),
                    (
                        "document.querySelector('#assignment-status').textContent",
                        "Payments API assigned to Maya.",
                    ),
                ],
            )

            set_viewport(devtools, 390, 1000)
            navigate(devtools, html, harness)
            menu_point = click(devtools, ".header-menu summary")
            record_state(
                devtools,
                output_dir,
                trace,
                "menu-open",
                390,
                1000,
                [
                    {
                        "type": "pointer-click",
                        "selector": ".header-menu summary",
                        "point": menu_point,
                    }
                ],
                [
                    ("innerWidth", 390),
                    ("document.querySelector('.header-menu').open", True),
                    (
                        "[...document.querySelectorAll('.menu-panel button')].map(b=>b.textContent.trim()).join(',')",
                        "Export,Settings",
                    ),
                ],
            )
        except (OSError, ValueError, StopIteration, subprocess.SubprocessError) as exc:
            print(f"[ERROR] {exc}")
            return 1
        finally:
            if devtools is not None:
                devtools.close()
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)

    trace_path.write_text(
        json.dumps(trace, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Trace written: {trace_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
