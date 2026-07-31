#!/usr/bin/env python3
"""Capture and verify a repaired transfer fixture against its structured specification."""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import os
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

from check_spec import DEFAULT_SCHEMA
from compare_spec_implementation import (
    DEFAULT_EVIDENCE_SCHEMA,
    compare,
    load_object,
)

CHROME = Path("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")


def digest(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def wait_for_port(profile: Path, process: subprocess.Popen[bytes]) -> int:
    marker = profile / "DevToolsActivePort"
    for _ in range(120):
        if process.poll() is not None:
            raise RuntimeError("Chrome exited before its debugging endpoint was ready")
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
        if result["result"].get("subtype") == "error":
            raise RuntimeError(result["result"].get("description", "Runtime evaluation failed"))
        return result["result"].get("value")


INSPECT = r"""
(() => {
  const q = selector => document.querySelector(selector);
  const confirm = q('#confirm');
  const recipient = q('.recipient');
  const total = q('[data-field="total"]') || q('.total + .total');
  const amount = q('[data-field="amount"]');
  const result = q('[role="alert"], [role="status"], [aria-live]');
  const retry = q('[data-action="retry"], #retry');
  const spinner = q('.spinner');
  const main = q('main');
  if (!confirm || !recipient || !total || !amount || !main) {
    return {fixtureError: 'Required nodes: #confirm, .recipient, [data-field=amount], [data-field=total], main'};
  }
  const confirmStyle = getComputedStyle(confirm);
  const spinnerStyle = spinner ? getComputedStyle(spinner) : null;
  const recipientStyle = getComputedStyle(recipient);
  const amountStyle = getComputedStyle(amount);
  const totalStyle = getComputedStyle(total);
  const r = confirm.getBoundingClientRect();
  return {
    viewport: {
      width: innerWidth,
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      confirmReachable: r.left >= 0 && r.right <= document.documentElement.clientWidth
    },
    lab: {
      present: Boolean(window.__transferLab),
      submissionCount: window.__transferLab?.submissionCount ?? null
    },
    review: {
      confirmDisabled: confirm.disabled,
      confirmAriaBusy: confirm.getAttribute('aria-busy'),
      recipientText: recipient.textContent.trim(),
      recipientClipped: recipient.scrollWidth > recipient.clientWidth,
      recipientWhiteSpace: recipientStyle.whiteSpace,
      labels: [...document.querySelectorAll('dt')].map(node => node.textContent.trim()),
      amountFontSize: amountStyle.fontSize,
      amountFontWeight: amountStyle.fontWeight,
      totalFontSize: totalStyle.fontSize,
      totalFontWeight: totalStyle.fontWeight
    },
    accessibility: {
      confirmTag: confirm.tagName,
      activeElement: document.activeElement?.id || document.activeElement?.tagName || null,
      focusOutlineStyle: confirmStyle.outlineStyle,
      focusOutlineWidth: confirmStyle.outlineWidth,
      resultRole: result?.getAttribute('role') || null,
      resultLive: result?.getAttribute('aria-live') || null
    },
    state: {
      resultText: result?.textContent.trim() || '',
      retryPresent: Boolean(retry),
      spinnerAnimationName: spinnerStyle?.animationName || 'none',
      spinnerAnimationDuration: spinnerStyle?.animationDuration || '0s',
      spinnerIterationCount: spinnerStyle?.animationIterationCount || '1'
    }
  };
})()
"""


def navigate(devtools: DevTools, source: Path, width: int, reduced_motion: bool = False) -> None:
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
    devtools.call("Page.navigate", {"url": source.as_uri()})
    devtools.evaluate(
        "new Promise(resolve => document.readyState === 'complete' ? "
        "resolve(true) : addEventListener('load', () => resolve(true), {once:true}))"
    )
    present = devtools.evaluate("Boolean(window.__transferLab)")
    if not present:
        raise RuntimeError(
            "Fixture must expose window.__transferLab with reset(), setComplete(boolean), "
            "setOutcome(name), and submissionCount"
        )


def inspect(devtools: DevTools) -> dict:
    value = devtools.evaluate(INSPECT)
    if value.get("fixtureError"):
        raise RuntimeError(value["fixtureError"])
    return value


def screenshot(devtools: DevTools, target: Path) -> None:
    image = devtools.call(
        "Page.captureScreenshot",
        {"format": "png", "fromSurface": True, "captureBeyondViewport": False},
    )
    target.write_bytes(base64.b64decode(image["data"]))


def click(devtools: DevTools, selector: str) -> None:
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


def press_tab(devtools: DevTools, count: int = 1) -> None:
    for _ in range(count):
        devtools.call(
            "Input.dispatchKeyEvent",
            {"type": "keyDown", "key": "Tab", "code": "Tab", "windowsVirtualKeyCode": 9},
        )
        devtools.call(
            "Input.dispatchKeyEvent",
            {"type": "keyUp", "key": "Tab", "code": "Tab", "windowsVirtualKeyCode": 9},
        )


def assertion(assertion_id: str, expected, observed, passed: bool, surface: str, evidence: list[str]) -> dict:
    return {
        "id": assertion_id,
        "expected": expected,
        "observed": observed,
        "passed": passed,
        "surface": surface,
        "evidence": evidence,
    }


def contract_result(contract_id: str, assertions: list[dict], notes: str) -> dict:
    return {
        "contract_id": contract_id,
        "status": "pass" if all(item["passed"] for item in assertions) else "fail",
        "assertions": assertions,
        "notes": notes,
    }


def numeric_weight(value: str) -> int:
    return {"normal": 400, "bold": 700}.get(value, int(value) if value.isdigit() else 400)


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("specification", type=Path)
    parser.add_argument("implementation", type=Path)
    parser.add_argument("output_dir", type=Path)
    args = parser.parse_args()
    spec = args.specification.resolve()
    source = args.implementation.resolve()
    output = args.output_dir.resolve()
    output.mkdir(parents=True, exist_ok=True)
    if websocket is None:
        raise RuntimeError("websocket-client is required")
    chrome = CHROME if CHROME.is_file() else Path(shutil.which("google-chrome") or shutil.which("chromium") or "")
    if not chrome.is_file():
        raise RuntimeError("Chrome or Chromium was not found")

    with tempfile.TemporaryDirectory(prefix="transfer-repair-chrome-") as temp:
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

            navigate(devtools, source, 720)
            devtools.evaluate("window.__transferLab.reset(); window.__transferLab.setComplete(false)")
            incomplete = inspect(devtools)
            screenshot(devtools, output / "repair-incomplete-720x900.png")

            devtools.evaluate("window.__transferLab.setComplete(true); document.activeElement?.blur()")
            press_tab(devtools, 2)
            complete = inspect(devtools)
            screenshot(devtools, output / "repair-complete-720x900.png")

            devtools.evaluate("window.__transferLab.setOutcome('network')")
            click(devtools, "#confirm")
            pending = inspect(devtools)
            screenshot(devtools, output / "repair-pending-720x900.png")
            devtools.evaluate("new Promise(resolve => setTimeout(resolve, 650))")
            failed = inspect(devtools)
            screenshot(devtools, output / "repair-error-720x900.png")

            navigate(devtools, source, 320)
            devtools.evaluate("window.__transferLab.reset(); window.__transferLab.setComplete(true)")
            narrow = inspect(devtools)
            screenshot(devtools, output / "repair-narrow-320x900.png")

            navigate(devtools, source, 720, reduced_motion=True)
            devtools.evaluate("window.__transferLab.reset(); window.__transferLab.setComplete(true); window.__transferLab.setOutcome('success')")
            reduced_match = devtools.evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches")
            click(devtools, "#confirm")
            reduced = inspect(devtools)
            screenshot(devtools, output / "repair-reduced-motion-720x900.png")

            labels = complete["review"]["labels"]
            financial_sequence = False
            for index in range(len(labels) - 2):
                if labels[index:index + 3] == ["Amount", "Fee", "Total debit"]:
                    financial_sequence = True
            focus_visible = (
                complete["accessibility"]["activeElement"] == "confirm"
                and
                complete["accessibility"]["focusOutlineStyle"] not in {"none", "hidden"}
                and complete["accessibility"]["focusOutlineWidth"] != "0px"
            )
            total_dominant = (
                float(complete["review"]["totalFontSize"].removesuffix("px"))
                > float(complete["review"]["amountFontSize"].removesuffix("px"))
                or numeric_weight(complete["review"]["totalFontWeight"])
                > numeric_weight(complete["review"]["amountFontWeight"])
            )
            context_preserved = failed["review"]["recipientText"] == complete["review"]["recipientText"]
            results = [
                contract_result(
                    "contract-review-before-submit",
                    [
                        assertion("incomplete-disabled", True, incomplete["review"]["confirmDisabled"], incomplete["review"]["confirmDisabled"] is True, "dom", ["repair-incomplete-720x900.png"]),
                        assertion("complete-enabled", False, complete["review"]["confirmDisabled"], complete["review"]["confirmDisabled"] is False, "dom", ["repair-complete-720x900.png"]),
                    ],
                    "Deterministic completeness states exercise the commit gate.",
                ),
                contract_result(
                    "contract-total-hierarchy",
                    [
                        assertion("financial-order", ["Amount", "Fee", "Total debit"], labels, financial_sequence, "dom", ["repair-complete-720x900.png"]),
                        assertion("total-dominant", True, {"amount": [complete["review"]["amountFontSize"], complete["review"]["amountFontWeight"]], "total": [complete["review"]["totalFontSize"], complete["review"]["totalFontWeight"]]}, total_dominant, "computed_style", ["repair-complete-720x900.png"]),
                    ],
                    "Financial order and computed type hierarchy are checked separately.",
                ),
                contract_result(
                    "contract-failure-recovery",
                    [
                        assertion("pending-protection", {"disabled": True, "busy": "true", "submissions": 1}, {"disabled": pending["review"]["confirmDisabled"], "busy": pending["review"]["confirmAriaBusy"], "submissions": pending["lab"]["submissionCount"]}, pending["review"]["confirmDisabled"] is True and pending["review"]["confirmAriaBusy"] == "true" and pending["lab"]["submissionCount"] == 1, "interaction_trace", ["repair-pending-720x900.png"]),
                        assertion("network-recovery", {"named_error": True, "retry": True, "context": True}, {"text": failed["state"]["resultText"], "retry": failed["state"]["retryPresent"], "context": context_preserved}, "network" in failed["state"]["resultText"].casefold() and failed["state"]["retryPresent"] and context_preserved, "interaction_trace", ["repair-error-720x900.png"]),
                    ],
                    "One deterministic network path proves task-local recovery and duplicate protection for the harness.",
                ),
                contract_result(
                    "contract-responsive-parity",
                    [
                        assertion("narrow-no-overflow", {"horizontalOverflow": False, "confirmReachable": True}, narrow["viewport"], not narrow["viewport"]["horizontalOverflow"] and narrow["viewport"]["confirmReachable"], "dom", ["repair-narrow-320x900.png"])
                    ],
                    "The repaired task remains reachable at the narrow boundary.",
                ),
                contract_result(
                    "contract-accessible-commit",
                    [
                        assertion("native-visible-focus", {"tag": "BUTTON", "activeElement": "confirm", "focusVisible": True}, {"tag": complete["accessibility"]["confirmTag"], "activeElement": complete["accessibility"]["activeElement"], "focusVisible": focus_visible}, complete["accessibility"]["confirmTag"] == "BUTTON" and focus_visible, "interaction_trace", ["repair-complete-720x900.png", "two Tab key events"]),
                        assertion("busy-and-result-semantics", {"busy": "true", "resultRole": ["alert", "status"]}, {"busy": pending["review"]["confirmAriaBusy"], "resultRole": failed["accessibility"]["resultRole"], "resultLive": failed["accessibility"]["resultLive"]}, pending["review"]["confirmAriaBusy"] == "true" and (failed["accessibility"]["resultRole"] in {"alert", "status"} or failed["accessibility"]["resultLive"] in {"polite", "assertive"}), "dom", ["repair-pending-720x900.png", "repair-error-720x900.png"]),
                    ],
                    "Browser DOM and computed-style evidence is not a named screen-reader test.",
                ),
                contract_result(
                    "contract-content-growth",
                    [
                        assertion("recipient-complete", {"clipped": False}, {"clipped": narrow["review"]["recipientClipped"], "whiteSpace": narrow["review"]["recipientWhiteSpace"]}, not narrow["review"]["recipientClipped"], "dom", ["repair-narrow-320x900.png"])
                    ],
                    "The supplied long recipient remains complete at 320 CSS px.",
                ),
                contract_result(
                    "contract-motion-restraint",
                    [
                        assertion("reduced-motion-active", True, reduced_match, reduced_match is True, "dom", ["repair-reduced-motion-720x900.png"]),
                        assertion("no-infinite-spinner", {"animationName": "none", "iterationCount": "not infinite"}, {"animationName": reduced["state"]["spinnerAnimationName"], "duration": reduced["state"]["spinnerAnimationDuration"], "iterationCount": reduced["state"]["spinnerIterationCount"]}, reduced["state"]["spinnerAnimationName"] == "none" or reduced["state"]["spinnerAnimationDuration"] == "0s" or reduced["state"]["spinnerIterationCount"] != "infinite", "computed_style", ["repair-reduced-motion-720x900.png"]),
                    ],
                    "Reduced-motion media emulation and computed animation properties are both recorded.",
                ),
            ]
            evidence_path = output / "implementation-evidence.json"
            manifest = {
                "schema_version": 1,
                "comparison_id": "transfer-repair-verification-v1",
                "specification": {"path": os.path.relpath(spec, output), "sha256": digest(spec)},
                "implementation": {"path": os.path.relpath(source, output), "sha256": digest(source)},
                "environment": {
                    "browser": devtools.call("Browser.getVersion")["product"],
                    "viewports": [
                        {"width": 720, "height": 900, "device_scale_factor": 1},
                        {"width": 320, "height": 900, "device_scale_factor": 1},
                    ],
                    "harness": "window.__transferLab",
                },
                "contract_results": results,
                "evidence_boundaries": [
                    "The deterministic harness is local implementation evidence, not production backend, persistence, authorization, or real network recovery.",
                    "DOM and computed-style results are not a named screen-reader or complete keyboard, touch, or assistive-technology test.",
                    "The viewports and states prove only the frozen Chrome fixture represented here, not product-wide conformance.",
                    "The requires_decision session-policy contract remains excluded.",
                ],
            }
            evidence_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        finally:
            if devtools is not None:
                devtools.close()
            process.terminate()
            try:
                process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                process.kill()
                process.wait(timeout=5)

    result = compare(
        spec,
        evidence_path,
        load_object(DEFAULT_SCHEMA),
        load_object(DEFAULT_EVIDENCE_SCHEMA),
    )
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 0 if result["valid"] and result["verdict"] == "conforms" else 1


if __name__ == "__main__":
    raise SystemExit(main())
