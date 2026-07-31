#!/usr/bin/env python3
"""Capture deterministic holistic-review states and evidence from the fixture."""

from __future__ import annotations

import base64
import hashlib
import json
import shutil
import subprocess
import tempfile
import time
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

try:
    import websocket
except ImportError:  # pragma: no cover
    websocket = None


ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "evals" / "assets"
SOURCE = ASSETS / "holistic-review-workbench.html"
TRACE = ASSETS / "holistic-review-trace.json"
CHROME = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


def wait_for_port(profile: Path, process: subprocess.Popen[bytes]) -> int:
    marker = profile / "DevToolsActivePort"
    for _ in range(120):
        if process.poll() is not None:
            raise RuntimeError("Chrome exited before its debugging endpoint was ready")
        if marker.is_file():
            line = marker.read_text(encoding="utf-8").splitlines()[0]
            if line.isdigit():
                return int(line)
        time.sleep(0.05)
    raise RuntimeError("Chrome debugging endpoint did not become ready")


class DevTools:
    def __init__(self, url: str):
        self.socket = websocket.create_connection(url, timeout=10)
        self.request_id = 0

    def close(self) -> None:
        self.socket.close()

    def call(self, method: str, params: dict | None = None) -> dict:
        self.request_id += 1
        current = self.request_id
        self.socket.send(
            json.dumps({"id": current, "method": method, "params": params or {}})
        )
        while True:
            message = json.loads(self.socket.recv())
            if message.get("id") != current:
                continue
            if "error" in message:
                raise RuntimeError(f"{method}: {message['error']}")
            return message.get("result", {})

    def evaluate(self, expression: str):
        result = self.call(
            "Runtime.evaluate",
            {
                "expression": expression,
                "returnByValue": True,
                "awaitPromise": True,
            },
        )
        return result["result"].get("value")


INSPECT = r"""
(() => {
  const q = (selector) => document.querySelector(selector);
  const style = (selector) => {
    const node = q(selector);
    if (!node) return null;
    const s = getComputedStyle(node);
    return {
      color: s.color,
      backgroundColor: s.backgroundColor,
      fontSize: s.fontSize,
      fontWeight: s.fontWeight,
      lineHeight: s.lineHeight,
      overflow: s.overflow,
      textOverflow: s.textOverflow,
      whiteSpace: s.whiteSpace,
      borderRadius: s.borderRadius,
      transitionProperty: s.transitionProperty,
      outlineStyle: s.outlineStyle,
      outlineWidth: s.outlineWidth
    };
  };
  const rect = (selector) => {
    const r = q(selector)?.getBoundingClientRect();
    return r ? {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom} : null;
  };
  const contrastChannel = (channel) => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  };
  const rgb = (value) => {
    const parts = value.match(/\d+(?:\.\d+)?/g).slice(0, 3).map(Number);
    return parts;
  };
  const ratio = (foreground, background) => {
    const lum = (value) => {
      const [r,g,b] = rgb(value).map(contrastChannel);
      return 0.2126*r + 0.7152*g + 0.0722*b;
    };
    const a = lum(foreground);
    const b = lum(background);
    return (Math.max(a,b)+0.05)/(Math.min(a,b)+0.05);
  };
  const muted = style('.lede');
  const surface = style('.review-card');
  const close = q('#dialog-close');
  const name = q('.member-name');
  const email = q('.member-email');
  const table = q('.member-table');
  const tableScroller = q('.table-scroll');
  const reviewCard = q('.review-card');
  return {
    viewport: {
      width: innerWidth,
      height: innerHeight,
      dpr: devicePixelRatio,
      documentClientWidth: document.documentElement.clientWidth,
      documentScrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    },
    labState: window.__holisticLab.state,
    focus: {
      activeElement: document.activeElement.id || document.activeElement.tagName,
      trigger: style('#deactivate-trigger'),
      closeAccessibleName: close.getAttribute('aria-label') || close.textContent.trim(),
      closeAriaLabel: close.getAttribute('aria-label'),
      backgroundInert: q('#page-main').inert,
      dialogAriaModal: q('.dialog').getAttribute('aria-modal'),
      dialogLabelledBy: q('.dialog').getAttribute('aria-labelledby')
    },
    typography: {
      lede: muted,
      memberName: style('.member-name'),
      memberNameClipped: name.scrollWidth > name.clientWidth,
      memberNameFullTextReachable:
        Boolean(name.getAttribute('title') || name.getAttribute('aria-label')),
      memberEmail: style('.member-email'),
      memberEmailClipped: email.scrollWidth > email.clientWidth,
      memberEmailFullTextReachable:
        Boolean(email.getAttribute('title') || email.getAttribute('aria-label'))
    },
    color: {
      mutedForeground: muted.color,
      surfaceBackground: surface.backgroundColor,
      mutedContrastRatio: Number(ratio(muted.color, surface.backgroundColor).toFixed(2)),
      selectedRowBackground: style('.row-selected').backgroundColor,
      selectedCheckboxChecked: q('.row-selected input').checked
    },
    layout: {
      tableRect: rect('.member-table'),
      reviewCardRect: rect('.review-card'),
      triggerRect: rect('#deactivate-trigger'),
      tableClippedByCard:
        table.getBoundingClientRect().right > reviewCard.getBoundingClientRect().right,
      internalHorizontalScroller:
        tableScroller.scrollWidth > tableScroller.clientWidth &&
        ['auto', 'scroll'].includes(getComputedStyle(tableScroller).overflowX)
    },
    ui: {
      buttonTransition: style('#deactivate-trigger').transitionProperty,
      dialogRadius: style('.dialog').borderRadius,
      dialogInnerRadius: style('.dialog-inner').borderRadius
    },
    content: {
      triggerText: q('#deactivate-trigger').textContent.trim(),
      confirmText: q('#dialog-confirm').textContent.trim(),
      errorText: q('#dialog-error').textContent.trim(),
      errorRole: q('#dialog-error').getAttribute('role'),
      recoveryActionPresent: Boolean(
        [...q('#dialog-error').parentElement.querySelectorAll('button')]
          .find(button => /retry|try again/i.test(button.textContent))
      )
    }
  };
})()
"""


def navigate(devtools: DevTools, width: int, height: int = 900) -> None:
    devtools.call(
        "Emulation.setDeviceMetricsOverride",
        {
            "width": width,
            "height": height,
            "deviceScaleFactor": 1,
            "mobile": False,
        },
    )
    devtools.call("Page.navigate", {"url": SOURCE.resolve().as_uri()})
    devtools.evaluate(
        "new Promise(resolve => {"
        "if (document.readyState === 'complete') resolve(true);"
        "else addEventListener('load', () => resolve(true), {once:true});"
        "})"
    )


def click(devtools: DevTools, selector: str) -> dict:
    center = devtools.evaluate(
        f"""(() => {{
          const r = document.querySelector({json.dumps(selector)}).getBoundingClientRect();
          return {{x:r.left+r.width/2,y:r.top+r.height/2}};
        }})()"""
    )
    for event_type in ("mousePressed", "mouseReleased"):
        devtools.call(
            "Input.dispatchMouseEvent",
            {
                "type": event_type,
                "x": center["x"],
                "y": center["y"],
                "button": "left",
                "clickCount": 1,
            },
        )
    return {"type": "pointer-click", "selector": selector, "point": center}


def capture(devtools: DevTools, state_id: str, actions: list[dict]) -> dict:
    evidence = devtools.evaluate(INSPECT)
    target = ASSETS / f"holistic-review-{state_id}-1280x900.png"
    if evidence["viewport"]["width"] == 390:
        target = ASSETS / f"holistic-review-{state_id}-390x900.png"
    image = devtools.call(
        "Page.captureScreenshot",
        {"format": "png", "fromSurface": True, "captureBeyondViewport": False},
    )
    target.write_bytes(base64.b64decode(image["data"]))
    return {
        "id": state_id,
        "screenshot": target.name,
        "actions": actions,
        "evidence": evidence,
    }


def main() -> int:
    if websocket is None:
        raise RuntimeError("websocket-client is required")
    if not CHROME.is_file():
        fallback = shutil.which("google-chrome") or shutil.which("chromium")
        if not fallback:
            raise RuntimeError("Chrome or Chromium was not found")
        chrome = Path(fallback)
    else:
        chrome = CHROME

    with tempfile.TemporaryDirectory(prefix="holistic-review-chrome-") as temp:
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
            port = wait_for_port(profile, process)
            targets = json.load(
                urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=5)
            )
            page = next(item for item in targets if item.get("type") == "page")
            devtools = DevTools(page["webSocketDebuggerUrl"])
            devtools.call("Page.enable")
            devtools.call("Runtime.enable")

            states = []
            navigate(devtools, 1280)
            states.append(capture(devtools, "default", [{"type": "navigate"}]))

            open_action = click(devtools, "#deactivate-trigger")
            states.append(capture(devtools, "dialog-open", [open_action]))

            error_action = click(devtools, "#dialog-confirm")
            states.append(
                capture(devtools, "dialog-error", [open_action, error_action])
            )

            navigate(devtools, 390)
            states.append(capture(devtools, "narrow", [{"type": "navigate"}]))

            failures = [
                {
                    "contract": "task-critical table columns remain reachable at 390 CSS px",
                    "state": "narrow",
                    "expected": {
                        "tableClippedByCard": False,
                        "internalHorizontalScroller": True,
                    },
                    "observed": {
                        "tableClippedByCard": states[3]["evidence"]["layout"][
                            "tableClippedByCard"
                        ],
                        "internalHorizontalScroller": states[3]["evidence"]["layout"][
                            "internalHorizontalScroller"
                        ],
                    },
                },
                {
                    "contract": "dialog receives focus on open",
                    "state": "dialog-open",
                    "expected": "dialog descendant",
                    "observed": states[1]["evidence"]["focus"]["activeElement"],
                },
                {
                    "contract": "background becomes inert while modal is open",
                    "state": "dialog-open",
                    "expected": True,
                    "observed": states[1]["evidence"]["focus"]["backgroundInert"],
                },
                {
                    "contract": "destructive confirmation names the consequence",
                    "state": "dialog-open",
                    "expected": "Deactivate 4 accounts",
                    "observed": states[1]["evidence"]["content"]["confirmText"],
                },
                {
                    "contract": "error explains recovery",
                    "state": "dialog-error",
                    "expected": "specific failure plus recovery",
                    "observed": states[2]["evidence"]["content"]["errorText"],
                },
                {
                    "contract": "task-supporting muted text meets 4.5:1",
                    "state": "default",
                    "expected": ">= 4.5",
                    "observed": states[0]["evidence"]["color"]["mutedContrastRatio"],
                },
            ]
            trace = {
                "schema_version": 1,
                "created_at": datetime.now(timezone.utc).isoformat(),
                "source": {
                    "path": SOURCE.name,
                    "sha256": hashlib.sha256(SOURCE.read_bytes()).hexdigest(),
                },
                "browser": devtools.call("Browser.getVersion"),
                "evidence_boundaries": [
                    "Computed contrast is WCAG 2 relative luminance for the recorded CSS colors, not APCA.",
                    "DOM and focus observations are not a named screen-reader transcript.",
                    "The narrow capture proves page-level overflow at 390 CSS px only.",
                    "A source-level transition-property value does not prove runtime smoothness or compositor behavior.",
                    "One dialog path does not prove every keyboard, pointer, touch, or error path.",
                ],
                "states": states,
                "contract_failures": failures,
            }
            TRACE.write_text(
                json.dumps(trace, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
        finally:
            if devtools is not None:
                devtools.close()
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)

    print(f"Captured {len(states)} state(s)")
    print(f"Trace written: {TRACE}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
