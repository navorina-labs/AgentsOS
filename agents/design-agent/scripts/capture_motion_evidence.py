#!/usr/bin/env python3
"""Capture deterministic motion timelines, interruption, preferences, and timed UI."""

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


def navigate(devtools: DevTools, html: Path) -> None:
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


def click(devtools: DevTools, selector: str) -> dict[str, float]:
    point = evaluate(
        devtools,
        (
            "(() => {"
            f"const e=document.querySelector({json.dumps(selector)});"
            "if(!e) throw new Error('Missing click target');"
            "e.scrollIntoView({block:'center',inline:'center'});"
            "const r=e.getBoundingClientRect();"
            "return {x:r.left+r.width/2,y:r.top+r.height/2};"
            "})()"
        ),
    )
    for event_type in ("mousePressed", "mouseReleased"):
        devtools.call(
            "Input.dispatchMouseEvent",
            {
                "type": event_type,
                "x": point["x"],
                "y": point["y"],
                "button": "left",
                "clickCount": 1,
            },
        )
    return point


def capture(devtools: DevTools, target: Path) -> int:
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
    return len(data)


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


def pause_animations(devtools: DevTools, current_time: float) -> int:
    return evaluate(
        devtools,
        f"""(() => {{
          const animations = document.getAnimations({{subtree:true}});
          animations.forEach(animation => {{
            animation.pause();
            const timing = animation.effect?.getComputedTiming();
            const end = Number.isFinite(timing?.endTime) ? timing.endTime : {current_time};
            animation.currentTime = Math.min({current_time}, end);
          }});
          return animations.length;
        }})()""",
    )


MOTION_INVENTORY = r"""(() => {
  const selectorFor = element => {
    if (!element) return null;
    if (element.id) return `#${element.id}`;
    const cls = typeof element.className === 'string'
      ? element.className.trim().split(/\s+/).filter(Boolean).join('.')
      : '';
    return `${element.tagName.toLowerCase()}${cls ? `.${cls}` : ''}`;
  };
  const animations = document.getAnimations({subtree:true}).map(animation => {
    const timing = animation.effect?.getComputedTiming() || {};
    const target = animation.effect?.target || null;
    return {
      target: selectorFor(target),
      animationName: animation.animationName || null,
      playState: animation.playState,
      currentTime: animation.currentTime,
      startTime: animation.startTime,
      delay: timing.delay,
      duration: timing.duration,
      iterations: timing.iterations,
      progress: timing.progress,
      endTime: timing.endTime,
      keyframes: animation.effect?.getKeyframes().map(frame => ({
        offset: frame.offset,
        easing: frame.easing,
        opacity: frame.opacity ?? null,
        transform: frame.transform ?? null,
        right: frame.right ?? null
      })) || []
    };
  });
  const computed = selector => {
    const e = document.querySelector(selector);
    if (!e) return null;
    const s = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    return {
      selector,
      transitionProperty: s.transitionProperty,
      transitionDuration: s.transitionDuration,
      transitionTimingFunction: s.transitionTimingFunction,
      animationName: s.animationName,
      animationDuration: s.animationDuration,
      animationIterationCount: s.animationIterationCount,
      opacity: s.opacity,
      transform: s.transform,
      right: s.right,
      rect: {left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height}
    };
  };
  return {
    reducedMotion: matchMedia('(prefers-reduced-motion: reduce)').matches,
    animations,
    computed: [
      computed('.live-dot'),
      computed('.details-panel'),
      computed('.backdrop'),
      computed('.toast'),
      ...[...document.querySelectorAll('.queue-card')].map((_, i) =>
        computed(`.queue-card:nth-child(${i + 1})`)
      )
    ].filter(Boolean),
    labState: window.__motionLab?.state || null
  };
})()"""


def performance_metrics(devtools: DevTools) -> dict[str, float]:
    result = devtools.call("Performance.getMetrics")
    wanted = {
        "Timestamp",
        "Documents",
        "Frames",
        "Nodes",
        "LayoutCount",
        "RecalcStyleCount",
        "LayoutDuration",
        "RecalcStyleDuration",
        "ScriptDuration",
        "TaskDuration",
        "JSHeapUsedSize",
    }
    return {
        item["name"]: item["value"]
        for item in result.get("metrics", [])
        if item.get("name") in wanted
    }


def delta_metrics(before: dict[str, float], after: dict[str, float]) -> dict[str, float]:
    return {
        key: round(after[key] - before.get(key, 0), 6)
        for key in after
        if key not in {"Timestamp", "JSHeapUsedSize"}
    } | {
        "JSHeapUsedSize_delta": round(
            after.get("JSHeapUsedSize", 0) - before.get("JSHeapUsedSize", 0), 2
        )
    }


def record_state(
    devtools: DevTools,
    output_dir: Path,
    trace: dict[str, Any],
    state_id: str,
    actions: list[dict[str, Any]],
    checks: list[dict[str, Any]],
    *,
    extra: dict[str, Any] | None = None,
) -> None:
    filename = f"motion-workbench-{state_id}-1280x900.png"
    byte_count = capture(devtools, output_dir / filename)
    state = {
        "id": state_id,
        "viewport": {"width": 1280, "height": 900, "device_scale_factor": 1},
        "actions": actions,
        "checks": checks,
        "motion_inventory": evaluate(devtools, MOTION_INVENTORY),
        "screenshot": filename,
        "capture": {"bytes": byte_count},
    }
    if extra:
        state.update(extra)
    trace["states"].append(state)
    failures = sum(not item["passed"] for item in checks)
    print(f"Captured {state_id}: {failures} contract failure(s)")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("html", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--chrome", type=Path)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    try:
        html = args.html.expanduser().resolve(strict=True)
        chrome = find_chrome(args.chrome)
    except (OSError, ValueError) as exc:
        print(f"[ERROR] {exc}")
        return 1

    output_dir = args.output_dir.expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    state_ids = (
        "default",
        "panel-opening-mid",
        "panel-reversing-mid",
        "reduced-motion-panel-mid",
        "toast-visible",
        "toast-expired",
        "refresh-stagger-mid",
    )
    expected = [
        output_dir / f"motion-workbench-{state_id}-1280x900.png"
        for state_id in state_ids
    ]
    trace_path = output_dir / "motion-workbench-trace.json"
    existing = [path for path in [*expected, trace_path] if path.exists()]
    if existing and not args.force:
        print("[ERROR] Refusing to overwrite existing motion evidence:")
        for path in existing:
            print(f"- {path}")
        return 1

    trace: dict[str, Any] = {
        "schema_version": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "source": {"file": html.name, "sha256": sha256(html)},
        "evidence_boundaries": {
            "timeline": (
                "Paused Web Animations API snapshots prove only the recorded Chrome "
                "timeline and DOM state, not subjective smoothness on target hardware."
            ),
            "interruption": (
                "One mid-flight reversal proves that reproduced reversal only; rapid "
                "retargeting, cancellation, race handling, and other inputs remain unverified."
            ),
            "performance": (
                "A short Performance.getMetrics delta is diagnostic evidence, not a frame "
                "rate, Core Web Vital, GPU profile, long-session result, or memory-leak proof."
            ),
            "reduced_motion": (
                "Media emulation and computed timings prove this fixture's response only; "
                "they do not prove platform-wide policy or subjective comfort."
            ),
            "timed_ui": (
                "The recorded local timer proves disappearance in this fixture, not user "
                "attention, reading completion, or production notification behavior."
            ),
        },
        "states": [],
    }

    with tempfile.TemporaryDirectory(prefix="design-agent-motion-") as temp:
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
            devtools.call("Performance.enable")
            trace["browser"] = devtools.call("Browser.getVersion")
            set_viewport(devtools, 1280, 900)

            devtools.call("Emulation.setEmulatedMedia", {"features": []})
            navigate(devtools, html)
            record_state(
                devtools,
                output_dir,
                trace,
                "default",
                [{"type": "navigate"}],
                [
                    check(devtools, "window.__motionLab.ready", True),
                    check(devtools, "window.__motionLab.state.panelOpen", False),
                    check(
                        devtools,
                        "getComputedStyle(document.querySelector('.live-dot')).animationIterationCount",
                        "infinite",
                        enforce=False,
                        note="Continuous decorative motion requires a pause/reduced-motion contract.",
                    ),
                ],
            )

            navigate(devtools, html)
            before = performance_metrics(devtools)
            panel_point = click(devtools, "#toggle-panel")
            time.sleep(0.06)
            animation_count = pause_animations(devtools, 210)
            after = performance_metrics(devtools)
            record_state(
                devtools,
                output_dir,
                trace,
                "panel-opening-mid",
                [
                    {"type": "pointer-click", "selector": "#toggle-panel", "point": panel_point},
                    {"type": "wait", "milliseconds": 60},
                    {"type": "pause-animations", "current_time": 210},
                ],
                [
                    check(devtools, "window.__motionLab.state.panelOpen", True),
                    check(
                        devtools,
                        "getComputedStyle(document.querySelector('.details-panel')).transitionProperty",
                        "all",
                        enforce=False,
                        note="Motion contracts should enumerate the exact animated properties.",
                    ),
                ],
                extra={
                    "paused_animation_count": animation_count,
                    "performance_before": before,
                    "performance_after": after,
                    "performance_delta": delta_metrics(before, after),
                },
            )

            navigate(devtools, html)
            click(devtools, "#toggle-panel")
            time.sleep(0.13)
            rect_before_interrupt = evaluate(
                devtools,
                "(() => {const r=document.querySelector('.details-panel').getBoundingClientRect(); return {left:r.left,right:r.right};})()",
            )
            reverse_point = click(devtools, "#panel-backdrop")
            time.sleep(0.05)
            pause_animations(devtools, 80)
            rect_after_interrupt = evaluate(
                devtools,
                "(() => {const r=document.querySelector('.details-panel').getBoundingClientRect(); return {left:r.left,right:r.right};})()",
            )
            record_state(
                devtools,
                output_dir,
                trace,
                "panel-reversing-mid",
                [
                    {"type": "pointer-click", "selector": "#toggle-panel"},
                    {"type": "wait", "milliseconds": 130},
                    {
                        "type": "pointer-click",
                        "selector": "#panel-backdrop",
                        "point": reverse_point,
                        "intent": "reverse while opening",
                    },
                    {"type": "wait", "milliseconds": 50},
                    {"type": "pause-animations", "current_time": 80},
                ],
                [
                    check(devtools, "window.__motionLab.state.panelOpen", False),
                    check(
                        devtools,
                        "document.querySelector('.details-panel').getAttribute('aria-hidden')",
                        "true",
                    ),
                ],
                extra={
                    "rect_before_interrupt": rect_before_interrupt,
                    "rect_after_interrupt": rect_after_interrupt,
                    "continuity_boundary": (
                        "Two sampled rectangles do not prove a smooth or velocity-continuous reversal."
                    ),
                },
            )

            devtools.call(
                "Emulation.setEmulatedMedia",
                {
                    "features": [
                        {"name": "prefers-reduced-motion", "value": "reduce"}
                    ]
                },
            )
            navigate(devtools, html)
            click(devtools, "#toggle-panel")
            time.sleep(0.06)
            pause_animations(devtools, 210)
            record_state(
                devtools,
                output_dir,
                trace,
                "reduced-motion-panel-mid",
                [
                    {
                        "type": "emulate-media",
                        "feature": "prefers-reduced-motion",
                        "value": "reduce",
                    },
                    {"type": "pointer-click", "selector": "#toggle-panel"},
                    {"type": "pause-animations", "current_time": 210},
                ],
                [
                    check(
                        devtools,
                        "matchMedia('(prefers-reduced-motion: reduce)').matches",
                        True,
                    ),
                    check(
                        devtools,
                        "getComputedStyle(document.querySelector('.details-panel')).transitionDuration",
                        "0s",
                        enforce=False,
                        note="Large panel translation should become immediate or a non-spatial alternative.",
                    ),
                    check(
                        devtools,
                        "getComputedStyle(document.querySelector('.live-dot')).animationName",
                        "none",
                        enforce=False,
                        note="Nonessential continuous motion should stop under reduced motion.",
                    ),
                ],
            )

            devtools.call("Emulation.setEmulatedMedia", {"features": []})
            navigate(devtools, html)
            save_point = click(devtools, "#save-view")
            time.sleep(0.72)
            record_state(
                devtools,
                output_dir,
                trace,
                "toast-visible",
                [
                    {"type": "pointer-click", "selector": "#save-view", "point": save_point},
                    {"type": "wait", "milliseconds": 720},
                ],
                [
                    check(devtools, "window.__motionLab.state.toastPresent", True),
                    check(devtools, "document.querySelector('.toast button').textContent", "Undo"),
                ],
            )

            navigate(devtools, html)
            click(devtools, "#save-view")
            time.sleep(2.35)
            record_state(
                devtools,
                output_dir,
                trace,
                "toast-expired",
                [
                    {"type": "pointer-click", "selector": "#save-view"},
                    {"type": "wait", "milliseconds": 2350},
                ],
                [
                    check(
                        devtools,
                        "window.__motionLab.state.toastPresent",
                        True,
                        enforce=False,
                        note=(
                            "A message with an Undo action should remain until dismissed "
                            "or use a separately approved, user-controllable timeout."
                        ),
                    )
                ],
            )

            navigate(devtools, html)
            refresh_point = click(devtools, "#refresh-queue")
            time.sleep(0.08)
            paused = pause_animations(devtools, 260)
            record_state(
                devtools,
                output_dir,
                trace,
                "refresh-stagger-mid",
                [
                    {"type": "pointer-click", "selector": "#refresh-queue", "point": refresh_point},
                    {"type": "wait", "milliseconds": 80},
                    {"type": "pause-animations", "current_time": 260},
                ],
                [
                    check(devtools, "window.__motionLab.state.refreshCount", 1),
                    check(
                        devtools,
                        "[...document.querySelectorAll('.queue-card')].every(e=>getComputedStyle(e).animationName==='none')",
                        True,
                        enforce=False,
                        note="Routine refresh should avoid replaying staged entrance motion.",
                    ),
                ],
                extra={"paused_animation_count": paused},
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
    print(f"Trace written: {trace_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
