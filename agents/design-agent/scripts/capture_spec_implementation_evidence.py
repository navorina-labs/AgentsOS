#!/usr/bin/env python3
"""Capture deterministic evidence for the spec-to-implementation eval fixture."""

from __future__ import annotations

import base64
import hashlib
import json
import shutil
import subprocess
import tempfile
import time
import urllib.request
from pathlib import Path

try:
    import websocket
except ImportError:  # pragma: no cover
    websocket = None

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "evals" / "assets"
SPEC = ASSETS / "ui-spec-valid.json"
SOURCE = ASSETS / "transfer-implementation-workbench.html"
MANIFEST = ASSETS / "transfer-implementation-evidence.json"
CHROME = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def wait_for_port(profile: Path, process: subprocess.Popen[bytes]) -> int:
    marker = profile / "DevToolsActivePort"
    for _ in range(120):
        if process.poll() is not None:
            raise RuntimeError("Chrome exited before the debugging endpoint was ready")
        if marker.is_file():
            value = marker.read_text(encoding="utf-8").splitlines()[0]
            if value.isdigit():
                return int(value)
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
        request_id = self.request_id
        self.socket.send(json.dumps({"id": request_id, "method": method, "params": params or {}}))
        while True:
            message = json.loads(self.socket.recv())
            if message.get("id") != request_id:
                continue
            if "error" in message:
                raise RuntimeError(f"{method}: {message['error']}")
            return message.get("result", {})

    def evaluate(self, expression: str):
        result = self.call(
            "Runtime.evaluate",
            {"expression": expression, "returnByValue": True, "awaitPromise": True},
        )
        return result["result"].get("value")


INSPECT = r"""
(() => {
  const q = selector => document.querySelector(selector);
  const rect = selector => {
    const r = q(selector).getBoundingClientRect();
    return {left:r.left,right:r.right,width:r.width,top:r.top,bottom:r.bottom};
  };
  const focus = getComputedStyle(q('#confirm'));
  const recipient = q('.recipient');
  return {
    viewport: {
      width: innerWidth,
      height: innerHeight,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    },
    content: {
      recipientText: recipient.textContent.trim(),
      recipientClipped: recipient.scrollWidth > recipient.clientWidth,
      recipientFullTextReachable: Boolean(recipient.getAttribute('title') || recipient.getAttribute('aria-label')),
      totalText: q('.total + .total').textContent.trim(),
      summaryLabelOrder: [...document.querySelectorAll('dt')].map(node => node.textContent.trim()),
      confirmText: q('#confirm').textContent.trim(),
      errorText: q('.error').textContent.trim(),
      errorVisible: getComputedStyle(q('.error')).display !== 'none',
      recoveryActionPresent: [...document.querySelectorAll('button,a')].some(node => /retry|try again/i.test(node.textContent))
    },
    semantics: {
      confirmTag: q('#confirm').tagName,
      confirmDisabled: q('#confirm').disabled,
      confirmAriaBusy: q('#confirm').getAttribute('aria-busy'),
      resultLiveRegion: Boolean(document.querySelector('[role=status],[role=alert],[aria-live]'))
    },
    styles: {
      focusOutlineStyle: focus.outlineStyle,
      focusOutlineWidth: focus.outlineWidth,
      spinnerAnimationName: getComputedStyle(q('.spinner')).animationName,
      spinnerAnimationDuration: getComputedStyle(q('.spinner')).animationDuration,
      spinnerAnimationIterationCount: getComputedStyle(q('.spinner')).animationIterationCount
    },
    geometry: {main: rect('main'), confirm: rect('#confirm')}
  };
})()
"""


def navigate(devtools: DevTools, width: int, reduced_motion: bool = False) -> None:
    devtools.call(
        "Emulation.setDeviceMetricsOverride",
        {"width": width, "height": 900, "deviceScaleFactor": 1, "mobile": False},
    )
    devtools.call(
        "Emulation.setEmulatedMedia",
        {
            "features": [
                {
                    "name": "prefers-reduced-motion",
                    "value": "reduce" if reduced_motion else "no-preference",
                }
            ]
        },
    )
    devtools.call("Page.navigate", {"url": SOURCE.resolve().as_uri()})
    devtools.evaluate(
        "new Promise(resolve => document.readyState === 'complete' ? "
        "resolve(true) : addEventListener('load', () => resolve(true), {once:true}))"
    )


def click(devtools: DevTools, selector: str) -> dict:
    point = devtools.evaluate(
        f"""(() => {{
          const r = document.querySelector({json.dumps(selector)}).getBoundingClientRect();
          return {{x:r.left+r.width/2,y:r.top+r.height/2}};
        }})()"""
    )
    for event_type in ("mousePressed", "mouseReleased"):
        devtools.call(
            "Input.dispatchMouseEvent",
            {"type": event_type, "x": point["x"], "y": point["y"], "button": "left", "clickCount": 1},
        )
    return {"type": "pointer-click", "selector": selector, "point": point}


def capture(devtools: DevTools, name: str, actions: list[dict]) -> dict:
    evidence = devtools.evaluate(INSPECT)
    target = ASSETS / f"transfer-implementation-{name}.png"
    image = devtools.call(
        "Page.captureScreenshot",
        {"format": "png", "fromSurface": True, "captureBeyondViewport": False},
    )
    target.write_bytes(base64.b64decode(image["data"]))
    return {"id": name, "screenshot": target.name, "actions": actions, "observed": evidence}


def assertion(
    assertion_id: str,
    expected,
    observed,
    passed: bool | None,
    surface: str,
    *evidence: str,
) -> dict:
    return {
        "id": assertion_id,
        "expected": expected,
        "observed": observed,
        "passed": passed,
        "surface": surface,
        "evidence": list(evidence),
    }


def main() -> int:
    if websocket is None:
        raise RuntimeError("websocket-client is required")
    chrome = CHROME if CHROME.is_file() else Path(shutil.which("google-chrome") or shutil.which("chromium") or "")
    if not chrome.is_file():
        raise RuntimeError("Chrome or Chromium was not found")

    with tempfile.TemporaryDirectory(prefix="spec-implementation-chrome-") as temp:
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
            targets = json.load(urllib.request.urlopen(f"http://127.0.0.1:{port}/json", timeout=5))
            page = next(item for item in targets if item.get("type") == "page")
            devtools = DevTools(page["webSocketDebuggerUrl"])
            devtools.call("Page.enable")
            devtools.call("Runtime.enable")

            navigate(devtools, 720)
            default = capture(devtools, "default-720x900", [{"type": "navigate"}])

            devtools.call("Runtime.evaluate", {"expression": "document.querySelector('#confirm').focus()"})
            focused = devtools.evaluate(INSPECT)

            action = click(devtools, "#confirm")
            devtools.evaluate("new Promise(resolve => setTimeout(resolve, 500))")
            error = capture(devtools, "error-720x900", [action])

            navigate(devtools, 320)
            narrow = capture(devtools, "narrow-320x900", [{"type": "navigate"}])

            navigate(devtools, 720, reduced_motion=True)
            reduced_match = devtools.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")
            reduced = capture(devtools, "reduced-motion-720x900", [{"type": "navigate"}])

            d = default["observed"]
            e = error["observed"]
            n = narrow["observed"]
            r = reduced["observed"]
            results = [
                {
                    "contract_id": "contract-review-before-submit",
                    "status": "unverified",
                    "assertions": [
                        assertion(
                            "incomplete-review-gating",
                            "submission unavailable until complete review content is present",
                            "Only a complete default review state was captured",
                            None,
                            "interaction_trace",
                            default["screenshot"],
                            "transfer-implementation-workbench.html:#confirm",
                        )
                    ],
                    "notes": "The complete state exposes an explicit confirmation action, but no incomplete state proves the gating requirement.",
                },
                {
                    "contract_id": "contract-total-hierarchy",
                    "status": "fail",
                    "assertions": [
                        assertion(
                            "total-adjacent-to-amount-and-fee",
                            "Amount, Fee, and Total debit remain adjacent",
                            d["content"]["summaryLabelOrder"],
                            False,
                            "dom",
                            default["screenshot"],
                            "transfer-implementation-workbench.html:dl",
                        ),
                        assertion(
                            "total-visually-dominant",
                            "Total debit uses stronger type",
                            {"text": d["content"]["totalText"], "source": ".total"},
                            True,
                            "screenshot",
                            default["screenshot"],
                            "transfer-implementation-workbench.html:.total",
                        ),
                    ],
                    "notes": "Total debit is visually dominant, but Date and Note separate it from Amount and Fee.",
                },
                {
                    "contract_id": "contract-failure-recovery",
                    "status": "fail",
                    "assertions": [
                        assertion("distinct-failure-and-recovery", "named failure plus next action", {"error": e["content"]["errorText"], "recoveryActionPresent": e["content"]["recoveryActionPresent"]}, False, "interaction_trace", error["screenshot"], "pointer click #confirm then 500 ms"),
                        assertion("duplicate-submit-protection", "button busy or disabled during submission", {"disabled": e["semantics"]["confirmDisabled"], "ariaBusy": e["semantics"]["confirmAriaBusy"]}, False, "dom", error["screenshot"])
                    ],
                    "notes": "The generic error has no recovery action and submission protection was not exposed.",
                },
                {
                    "contract_id": "contract-responsive-parity",
                    "status": "fail",
                    "assertions": [
                        assertion("no-page-horizontal-scroll-320", False, n["viewport"]["horizontalOverflow"], False, "dom", narrow["screenshot"])
                    ],
                    "notes": "The fixed-width main surface causes page-level horizontal overflow at 320 CSS px.",
                },
                {
                    "contract_id": "contract-accessible-commit",
                    "status": "fail",
                    "assertions": [
                        assertion("visible-focus", "non-none focus indicator", {"outlineStyle": focused["styles"]["focusOutlineStyle"], "outlineWidth": focused["styles"]["focusOutlineWidth"]}, False, "computed_style", "transfer-implementation-workbench.html:button:focus"),
                        assertion("task-local-result-announcement", True, e["semantics"]["resultLiveRegion"], False, "dom", error["screenshot"]),
                        assertion("native-button-semantics", "BUTTON", d["semantics"]["confirmTag"], True, "dom", "transfer-implementation-workbench.html:#confirm")
                    ],
                    "notes": "Native button semantics pass, but focus visibility and result announcement fail.",
                },
                {
                    "contract_id": "contract-content-growth",
                    "status": "fail",
                    "assertions": [
                        assertion("recipient-content-complete", "wrap, reflow, or full text reachable", {"clipped": n["content"]["recipientClipped"], "fullTextReachable": n["content"]["recipientFullTextReachable"]}, False, "dom", narrow["screenshot"], "transfer-implementation-workbench.html:.recipient")
                    ],
                    "notes": "The long recipient is silently truncated and its empty title does not expose full content.",
                },
                {
                    "contract_id": "contract-motion-restraint",
                    "status": "fail",
                    "assertions": [
                        assertion("reduced-motion-media-active", True, reduced_match, True, "dom", reduced["screenshot"]),
                        assertion("spinner-adapts-under-reduce", "no infinite rotation", {"animationName": r["styles"]["spinnerAnimationName"], "iterationCount": r["styles"]["spinnerAnimationIterationCount"]}, False, "computed_style", reduced["screenshot"], "transfer-implementation-workbench.html:@keyframes spin")
                    ],
                    "notes": "The emulated preference matches, while the infinite spinner remains authored unchanged.",
                },
            ]
            manifest = {
                "schema_version": 1,
                "comparison_id": "transfer-review-fixture-v1",
                "specification": {"path": "ui-spec-valid.json", "sha256": digest(SPEC)},
                "implementation": {"path": "transfer-implementation-workbench.html", "sha256": digest(SOURCE)},
                "environment": {
                    "browser": devtools.call("Browser.getVersion")["product"],
                    "viewports": [
                        {"width": 720, "height": 900, "device_scale_factor": 1},
                        {"width": 320, "height": 900, "device_scale_factor": 1},
                    ],
                    "reduced_motion_emulated": True,
                    "states": [default, error, narrow, reduced],
                },
                "contract_results": results,
                "evidence_boundaries": [
                    "The pointer trace proves one local browser path, not complete keyboard, touch, retry, race, or network behavior.",
                    "DOM and computed-style evidence is not a named screen-reader or assistive-technology test.",
                    "The local timeout is not backend submission, persistence, authorization, or real network recovery.",
                    "Screenshots and short state samples do not prove usability outcomes, performance, or product-wide conformance.",
                    "The requires_decision session-policy contract is excluded from implementation conformance.",
                ],
            }
            MANIFEST.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        finally:
            if devtools is not None:
                devtools.close()
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)

    print(f"Evidence written: {MANIFEST}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
