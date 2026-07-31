#!/usr/bin/env python3
"""Capture keyboard, semantics, media-preference, and reflow evidence in Chrome."""

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


ACTIVE_ELEMENT = """(() => {
  const e = document.activeElement;
  if (!e) return null;
  const text = (e.innerText || e.textContent || "").trim().replace(/\\s+/g, " ");
  return {
    tag: e.tagName.toLowerCase(),
    id: e.id || null,
    type: e.getAttribute("type"),
    text: text.slice(0, 120),
    ariaLabel: e.getAttribute("aria-label"),
    disabled: Boolean(e.disabled),
    expanded: e.getAttribute("aria-expanded"),
    detailsOpen: e.closest("details")?.open ?? null
  };
})()"""


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


def set_viewport(
    devtools: DevTools,
    width: int,
    height: int,
    device_scale_factor: int = 1,
) -> None:
    devtools.call(
        "Emulation.setDeviceMetricsOverride",
        {
            "width": width,
            "height": height,
            "deviceScaleFactor": device_scale_factor,
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


KEYS = {
    "Tab": {"code": "Tab", "windowsVirtualKeyCode": 9, "nativeVirtualKeyCode": 9},
    "Enter": {"code": "Enter", "windowsVirtualKeyCode": 13, "nativeVirtualKeyCode": 13},
    "Space": {"code": "Space", "windowsVirtualKeyCode": 32, "nativeVirtualKeyCode": 32},
    "Escape": {"code": "Escape", "windowsVirtualKeyCode": 27, "nativeVirtualKeyCode": 27},
    "+": {"code": "Equal", "windowsVirtualKeyCode": 187, "nativeVirtualKeyCode": 187},
}


def press_key(devtools: DevTools, key: str, modifiers: int = 0) -> None:
    common = {"key": key, "modifiers": modifiers, **KEYS[key]}
    text_values = {"+": "+", "Enter": "\r", "Space": " "}
    if key in text_values:
        common["text"] = text_values[key]
        common["unmodifiedText"] = text_values[key]
    devtools.call("Input.dispatchKeyEvent", {"type": "keyDown", **common})
    devtools.call("Input.dispatchKeyEvent", {"type": "keyUp", **common})


def active_element(devtools: DevTools) -> dict[str, Any] | None:
    return evaluate(devtools, ACTIVE_ELEMENT)


def tab_until(
    devtools: DevTools,
    predicate,
    maximum: int = 40,
) -> list[dict[str, Any] | None]:
    sequence: list[dict[str, Any] | None] = []
    for _ in range(maximum):
        press_key(devtools, "Tab")
        current = active_element(devtools)
        sequence.append(current)
        if predicate(current):
            return sequence
    raise ValueError(f"Focus target was not reached within {maximum} Tab presses")


def capture(devtools: DevTools, target: Path) -> dict[str, int]:
    result = devtools.call(
        "Page.captureScreenshot",
        {
            "format": "png",
            "fromSurface": True,
            "captureBeyondViewport": False,
        },
    )
    data = base64.b64decode(result["data"])
    target.write_bytes(data)
    return {"bytes": len(data)}


def check(
    devtools: DevTools,
    expression: str,
    expected: Any,
    *,
    enforce: bool = True,
    note: str | None = None,
) -> dict[str, Any]:
    observed = evaluate(devtools, expression)
    passed = observed == expected
    result = {
        "expression": expression,
        "expected": expected,
        "observed": observed,
        "passed": passed,
        "enforced": enforce,
    }
    if note:
        result["note"] = note
    if enforce and not passed:
        raise ValueError(
            f"Assertion failed: {expression} expected {expected!r}, observed {observed!r}"
        )
    return result


def record_state(
    devtools: DevTools,
    output_dir: Path,
    trace: dict[str, Any],
    state_id: str,
    viewport: dict[str, int],
    actions: list[dict[str, Any]],
    checks: list[dict[str, Any]],
    *,
    extra: dict[str, Any] | None = None,
) -> None:
    filename = f"dashboard-a11y-{state_id}.png"
    capture_meta = capture(devtools, output_dir / filename)
    state = {
        "id": state_id,
        "viewport": viewport,
        "actions": actions,
        "checks": checks,
        "screenshot": filename,
        "capture": capture_meta,
    }
    if extra:
        state.update(extra)
    trace["states"].append(state)
    failures = sum(not item["passed"] for item in checks)
    print(f"Captured {state_id}: {filename} ({failures} contract failure(s))")


def property_value(node: dict[str, Any], name: str) -> Any:
    for item in node.get("properties", []):
        if item.get("name") == name:
            return item.get("value", {}).get("value")
    return None


def simplify_ax_tree(nodes: list[dict[str, Any]]) -> list[dict[str, Any]]:
    kept = []
    useful_roles = {
        "button",
        "checkbox",
        "heading",
        "link",
        "main",
        "search",
        "searchbox",
        "status",
        "alert",
        "table",
    }
    useful_names = {
        "Assign owner",
        "Assigning…",
        "Retry assignment",
        "Assigned to Maya",
        "More",
        "Skip to operations",
    }
    for node in nodes:
        role = node.get("role", {}).get("value")
        name = node.get("name", {}).get("value")
        properties = {
            key: property_value(node, key)
            for key in ("focusable", "focused", "disabled", "busy", "expanded")
            if property_value(node, key) is not None
        }
        if role in useful_roles or name in useful_names or properties.get("focused"):
            kept.append(
                {
                    "node_id": node.get("nodeId"),
                    "backend_dom_node_id": node.get("backendDOMNodeId"),
                    "ignored": node.get("ignored", False),
                    "role": role,
                    "name": name,
                    "description": node.get("description", {}).get("value"),
                    "properties": properties,
                }
            )
    return kept


def snapshot_ax(devtools: DevTools, label: str) -> dict[str, Any]:
    result = devtools.call("Accessibility.getFullAXTree")
    nodes = result.get("nodes", [])
    return {
        "id": label,
        "scope": (
            "Browser accessibility-tree semantics only; this is not evidence of "
            "VoiceOver, NVDA, JAWS, TalkBack, or any spoken output."
        ),
        "total_nodes": len(nodes),
        "relevant_nodes": simplify_ax_tree(nodes),
    }


def focus_labels(sequence: list[dict[str, Any] | None]) -> list[str]:
    labels = []
    for item in sequence:
        if not item:
            labels.append("<none>")
            continue
        labels.append(
            item.get("id")
            or item.get("ariaLabel")
            or item.get("text")
            or item.get("tag")
            or "<unnamed>"
        )
    return labels


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
    trace_path = output_dir / "dashboard-accessibility-trace.json"
    ax_path = output_dir / "dashboard-accessibility-tree.json"
    expected = [
        output_dir / f"dashboard-a11y-{state}.png"
        for state in (
            "keyboard-assign-focus-1440x1000",
            "keyboard-loading-1440x1000",
            "keyboard-error-focus-1440x1000",
            "keyboard-success-focus-1440x1000",
            "mobile-menu-focus-390x1000",
            "mobile-menu-open-390x1000",
            "mobile-menu-escape-390x1000",
            "forced-colors-1440x1000",
            "reduced-motion-1440x1000",
            "reflow-200pct-equivalent-720x500-at-2x",
        )
    ]
    existing = [path for path in [*expected, trace_path, ax_path] if path.exists()]
    if existing and not args.force:
        print("[ERROR] Refusing to overwrite existing accessibility evidence:")
        for path in existing:
            print(f"- {path}")
        return 1

    trace: dict[str, Any] = {
        "schema_version": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "source": {"file": html.name, "sha256": sha256(html)},
        "harness": {"file": harness_path.name, "sha256": sha256(harness_path)},
        "evidence_boundaries": {
            "keyboard": (
                "The recorded key sequence proves only the reproduced Chrome path "
                "and observed focus targets."
            ),
            "accessibility_tree": (
                "Chrome's AX tree is semantic evidence, not a screen-reader transcript."
            ),
            "forced_colors": (
                "Media emulation plus a screenshot proves the emulated rendering only."
            ),
            "reduced_motion": (
                "A matching media query proves preference activation, not that every "
                "transition is safe or that assistive technology was used."
            ),
            "reflow": (
                "The 720 CSS px viewport at device scale factor 2 is a 200%-scale "
                "reflow equivalent for a 1440 px capture, not actual browser zoom."
            ),
        },
        "states": [],
    }
    ax_snapshots: dict[str, Any] = {
        "schema_version": 1,
        "created_at": trace["created_at"],
        "source": trace["source"],
        "harness": trace["harness"],
        "snapshots": [],
    }

    with tempfile.TemporaryDirectory(prefix="design-agent-a11y-") as temp:
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
            devtools.call("Accessibility.enable")
            trace["browser"] = devtools.call("Browser.getVersion")

            desktop = {"width": 1440, "height": 1000, "device_scale_factor": 1}
            set_viewport(devtools, 1440, 1000)
            navigate(devtools, html, harness)
            ax_snapshots["snapshots"].append(snapshot_ax(devtools, "desktop-default"))

            to_assign = tab_until(
                devtools, lambda item: bool(item and item.get("id") == "assign-owner")
            )
            record_state(
                devtools,
                output_dir,
                trace,
                "keyboard-assign-focus-1440x1000",
                desktop,
                [{"type": "keyboard", "key": "Tab", "repeat": len(to_assign)}],
                [
                    check(devtools, "document.activeElement.id", "assign-owner"),
                    check(
                        devtools,
                        "document.activeElement.matches(':focus-visible')",
                        True,
                    ),
                ],
                extra={
                    "focus_sequence": to_assign,
                    "focus_order_labels": focus_labels(to_assign),
                },
            )

            press_key(devtools, "Enter")
            loading_focus = active_element(devtools)
            record_state(
                devtools,
                output_dir,
                trace,
                "keyboard-loading-1440x1000",
                desktop,
                [{"type": "keyboard", "key": "Enter"}],
                [
                    check(devtools, "window.__interactionHarness.assignment", "loading"),
                    check(devtools, "document.querySelector('#assign-owner').disabled", True),
                    check(
                        devtools,
                        "document.querySelector('#assign-owner').getAttribute('aria-busy')",
                        "true",
                    ),
                    check(
                        devtools,
                        "document.activeElement.id",
                        "assign-owner",
                        enforce=False,
                        note=(
                            "Focus is expected to remain task-local. Native disabled "
                            "often removes the active control from focus."
                        ),
                    ),
                ],
                extra={"active_element": loading_focus},
            )
            ax_snapshots["snapshots"].append(snapshot_ax(devtools, "assignment-loading"))

            time.sleep(1.0)
            error_focus = active_element(devtools)
            record_state(
                devtools,
                output_dir,
                trace,
                "keyboard-error-focus-1440x1000",
                desktop,
                [{"type": "wait", "milliseconds": 1000}],
                [
                    check(devtools, "window.__interactionHarness.assignment", "error"),
                    check(devtools, "document.querySelector('#assignment-error').hidden", False),
                    check(
                        devtools,
                        "document.activeElement.id",
                        "assign-owner",
                        enforce=False,
                        note="Error recovery should preserve or restore focus to the retry action.",
                    ),
                ],
                extra={"active_element": error_focus},
            )
            ax_snapshots["snapshots"].append(snapshot_ax(devtools, "assignment-error"))

            retry_path = tab_until(
                devtools, lambda item: bool(item and item.get("id") == "assign-owner")
            )
            press_key(devtools, "Enter")
            time.sleep(1.0)
            success_focus = active_element(devtools)
            record_state(
                devtools,
                output_dir,
                trace,
                "keyboard-success-focus-1440x1000",
                desktop,
                [
                    {"type": "keyboard", "key": "Tab", "repeat": len(retry_path)},
                    {"type": "keyboard", "key": "Enter"},
                    {"type": "wait", "milliseconds": 1000},
                ],
                [
                    check(devtools, "window.__interactionHarness.assignment", "success"),
                    check(
                        devtools,
                        "document.querySelector('#assignment-status').textContent",
                        "Payments API assigned to Maya.",
                    ),
                    check(
                        devtools,
                        "document.activeElement.id",
                        "assign-owner",
                        enforce=False,
                        note="Completion should not strand focus on the document body.",
                    ),
                ],
                extra={
                    "retry_focus_sequence": retry_path,
                    "retry_focus_order_labels": focus_labels(retry_path),
                    "active_element": success_focus,
                },
            )
            ax_snapshots["snapshots"].append(snapshot_ax(devtools, "assignment-success"))

            mobile = {"width": 390, "height": 1000, "device_scale_factor": 1}
            set_viewport(devtools, 390, 1000)
            navigate(devtools, html, harness)
            to_menu = tab_until(
                devtools,
                lambda item: bool(
                    item and item.get("tag") == "summary" and item.get("text") == "More"
                ),
            )
            record_state(
                devtools,
                output_dir,
                trace,
                "mobile-menu-focus-390x1000",
                mobile,
                [{"type": "keyboard", "key": "Tab", "repeat": len(to_menu)}],
                [
                    check(devtools, "document.activeElement.tagName", "SUMMARY"),
                    check(
                        devtools,
                        "document.activeElement.matches(':focus-visible')",
                        True,
                    ),
                ],
                extra={
                    "focus_sequence": to_menu,
                    "focus_order_labels": focus_labels(to_menu),
                    "dom_visual_order_note": (
                        "The trace records DOM focus order; compare it with the screenshot's "
                        "visual header order before making an order claim."
                    ),
                },
            )

            press_key(devtools, "Enter")
            record_state(
                devtools,
                output_dir,
                trace,
                "mobile-menu-open-390x1000",
                mobile,
                [{"type": "keyboard", "key": "Enter"}],
                [
                    check(devtools, "document.querySelector('.header-menu').open", True),
                    check(devtools, "document.activeElement.tagName", "SUMMARY"),
                ],
            )
            ax_snapshots["snapshots"].append(snapshot_ax(devtools, "mobile-menu-open"))

            press_key(devtools, "Escape")
            record_state(
                devtools,
                output_dir,
                trace,
                "mobile-menu-escape-390x1000",
                mobile,
                [{"type": "keyboard", "key": "Escape"}],
                [
                    check(
                        devtools,
                        "document.querySelector('.header-menu').open",
                        False,
                        enforce=False,
                        note="Dismissible disclosure contract: Escape closes the last-opened UI.",
                    ),
                    check(
                        devtools,
                        "document.activeElement.tagName",
                        "SUMMARY",
                        enforce=False,
                        note="After dismissal, focus should remain on the trigger.",
                    ),
                ],
            )

            set_viewport(devtools, 1440, 1000)
            navigate(devtools, html, harness)
            devtools.call(
                "Emulation.setEmulatedMedia",
                {"features": [{"name": "forced-colors", "value": "active"}]},
            )
            record_state(
                devtools,
                output_dir,
                trace,
                "forced-colors-1440x1000",
                desktop,
                [{"type": "emulate-media", "feature": "forced-colors", "value": "active"}],
                [
                    check(
                        devtools,
                        "matchMedia('(forced-colors: active)').matches",
                        True,
                    )
                ],
            )

            devtools.call("Emulation.setEmulatedMedia", {"features": []})
            navigate(devtools, html, harness)
            devtools.call(
                "Emulation.setEmulatedMedia",
                {
                    "features": [
                        {"name": "prefers-reduced-motion", "value": "reduce"},
                        {"name": "forced-colors", "value": "none"},
                    ]
                },
            )
            motion_inventory = evaluate(
                devtools,
                """(() => {
                  const nodes = [...document.querySelectorAll('*')];
                  const animated = nodes.map(e => {
                    const s = getComputedStyle(e);
                    return {
                      tag: e.tagName.toLowerCase(),
                      id: e.id || null,
                      className: typeof e.className === 'string' ? e.className : null,
                      animationName: s.animationName,
                      animationDuration: s.animationDuration,
                      transitionProperty: s.transitionProperty,
                      transitionDuration: s.transitionDuration
                    };
                  }).filter(x =>
                    x.animationName !== 'none' ||
                    (x.transitionProperty !== 'all' && x.transitionProperty !== 'none') ||
                    !/^0s(?:, 0s)*$/.test(x.transitionDuration)
                  );
                  return animated;
                })()""",
            )
            record_state(
                devtools,
                output_dir,
                trace,
                "reduced-motion-1440x1000",
                desktop,
                [
                    {
                        "type": "emulate-media",
                        "feature": "prefers-reduced-motion",
                        "value": "reduce",
                    }
                ],
                [
                    check(
                        devtools,
                        "matchMedia('(prefers-reduced-motion: reduce)').matches",
                        True,
                    ),
                    check(
                        devtools,
                        "matchMedia('(forced-colors: active)').matches",
                        False,
                    ),
                ],
                extra={
                    "computed_motion_inventory": motion_inventory,
                    "motion_claim_boundary": (
                        "The inventory reports computed CSS only; JS, canvas, video, "
                        "scroll-linked motion, and subjective comfort remain unverified."
                    ),
                },
            )

            devtools.call("Emulation.setEmulatedMedia", {"features": []})
            reflow = {"width": 720, "height": 500, "device_scale_factor": 2}
            set_viewport(devtools, 720, 500, 2)
            navigate(devtools, html, harness)
            reflow_metrics = evaluate(
                devtools,
                """({
                  innerWidth,
                  innerHeight,
                  devicePixelRatio,
                  documentScrollWidth: document.documentElement.scrollWidth,
                  documentClientWidth: document.documentElement.clientWidth,
                  horizontalDocumentOverflow:
                    document.documentElement.scrollWidth > document.documentElement.clientWidth
                })""",
            )
            record_state(
                devtools,
                output_dir,
                trace,
                "reflow-200pct-equivalent-720x500-at-2x",
                reflow,
                [
                    {
                        "type": "device-metrics",
                        "method": "200%-scale reflow equivalent",
                        "source_width_css_px": 1440,
                        "effective_width_css_px": 720,
                        "device_scale_factor": 2,
                        "actual_browser_zoom": False,
                    }
                ],
                [
                    check(devtools, "innerWidth", 720),
                    check(devtools, "devicePixelRatio", 2),
                    check(
                        devtools,
                        "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
                        True,
                        enforce=False,
                        note=(
                            "This checks page-level horizontal overflow only; internal "
                            "two-dimensional regions and reachability require inspection."
                        ),
                    ),
                ],
                extra={"metrics": reflow_metrics},
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

    trace["summary"] = {
        "recorded_states": len(trace["states"]),
        "contract_failures": [
            {
                "state": state["id"],
                "expression": item["expression"],
                "expected": item["expected"],
                "observed": item["observed"],
                "note": item.get("note"),
            }
            for state in trace["states"]
            for item in state["checks"]
            if not item["passed"]
        ],
    }
    trace_path.write_text(
        json.dumps(trace, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    ax_path.write_text(
        json.dumps(ax_snapshots, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Trace written: {trace_path}")
    print(f"Accessibility tree snapshots written: {ax_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
