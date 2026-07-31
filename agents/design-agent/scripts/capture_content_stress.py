#!/usr/bin/env python3
"""Capture pseudo-localization, RTL, text-resize, and narrow-reflow evidence."""

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


def navigate(devtools: DevTools, html: Path, harness: str, mode: str) -> None:
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
    evaluate(devtools, f"window.__contentStress.apply({json.dumps(mode)})")


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


LAYOUT_METRICS = """(() => {
  const visible = e => {
    const s = getComputedStyle(e);
    const r = e.getBoundingClientRect();
    return s.display !== 'none' && s.visibility !== 'hidden' && r.width > 0 && r.height > 0;
  };
  const label = e => ({
    tag: e.tagName.toLowerCase(),
    id: e.id || null,
    className: typeof e.className === 'string' ? e.className : null,
    text: (e.innerText || e.textContent || '').trim().replace(/\\s+/g, ' ').slice(0, 180)
  });
  const nonScrollableOverflow = [...document.querySelectorAll('body *')]
    .filter(visible)
    .filter(e => {
      const s = getComputedStyle(e);
      return e.scrollWidth > e.clientWidth + 1 &&
        !['auto', 'scroll'].includes(s.overflowX);
    })
    .map(e => ({
      ...label(e),
      clientWidth: e.clientWidth,
      scrollWidth: e.scrollWidth,
      overflowX: getComputedStyle(e).overflowX
    }))
    .slice(0, 40);
  const clippedText = [...document.querySelectorAll('body *')]
    .filter(visible)
    .filter(e => {
      const s = getComputedStyle(e);
      if (e.matches('.visually-hidden') || e.closest('.visually-hidden')) return false;
      const hasText = [...e.childNodes].some(n => n.nodeType === Node.TEXT_NODE && n.textContent.trim());
      return hasText &&
        (e.scrollWidth > e.clientWidth + 1 || e.scrollHeight > e.clientHeight + 1) &&
        ['hidden', 'clip'].includes(s.overflow);
    })
    .map(e => ({
      ...label(e),
      clientWidth: e.clientWidth,
      scrollWidth: e.scrollWidth,
      clientHeight: e.clientHeight,
      scrollHeight: e.scrollHeight
    }))
    .slice(0, 40);
  const offscreenInteractive = [...document.querySelectorAll(
    'a[href],button,input,select,textarea,summary,[tabindex]:not([tabindex="-1"])'
  )]
    .filter(visible)
    .map(e => ({e, r: e.getBoundingClientRect()}))
    .filter(({r}) => r.right <= 0 || r.left >= innerWidth)
    .map(({e, r}) => ({...label(e), left:r.left, right:r.right, width:r.width}))
    .slice(0, 40);
  const rect = selector => {
    const e = document.querySelector(selector);
    if (!e || !visible(e)) return null;
    const r = e.getBoundingClientRect();
    return {top:r.top,left:r.left,right:r.right,bottom:r.bottom,width:r.width,height:r.height};
  };
  const critical = document.querySelector('.incident.critical');
  const cs = critical ? getComputedStyle(critical) : null;
  return {
    viewport: {width:innerWidth,height:innerHeight,dpr:devicePixelRatio},
    document: {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflow:
        document.documentElement.scrollWidth > document.documentElement.clientWidth
    },
    language: document.documentElement.lang,
    direction: document.dir || getComputedStyle(document.documentElement).direction,
    headerRects: {
      title: rect('.site-header h1'),
      search: rect('.global-search'),
      actions: rect('.header-actions')
    },
    criticalBorder: cs ? {
      inlineStart: cs.borderInlineStartWidth,
      left: cs.borderLeftWidth,
      right: cs.borderRightWidth
    } : null,
    visibleRepresentations: {
      table: Boolean(document.querySelector('.table-wrap') && visible(document.querySelector('.table-wrap'))),
      ticketList: Boolean(document.querySelector('.ticket-list') && visible(document.querySelector('.ticket-list')))
    },
    nonScrollableOverflow,
    clippedText,
    offscreenInteractive
  };
})()"""


def record_state(
    devtools: DevTools,
    output_dir: Path,
    trace: dict[str, Any],
    mode: str,
    width: int,
    height: int,
) -> None:
    metrics = evaluate(devtools, LAYOUT_METRICS)
    filename = f"dashboard-content-{mode}-{width}x{height}.png"
    checks = [
        check(devtools, "window.__contentStress.mode", mode),
        check(devtools, "innerWidth", width),
        check(
            devtools,
            "document.documentElement.scrollWidth <= document.documentElement.clientWidth",
            True,
            enforce=False,
            note=(
                "Page-level horizontal overflow is a contract failure unless a documented "
                "two-dimensional region is responsible and independently reachable."
            ),
        ),
        check(
            devtools,
            f"({LAYOUT_METRICS}).offscreenInteractive.length",
            0,
            enforce=False,
            note="Visible interactive controls must not sit wholly outside the viewport.",
        ),
        check(
            devtools,
            f"({LAYOUT_METRICS}).clippedText.length",
            0,
            enforce=False,
            note="Clipped text requires a documented, reachable full-value path.",
        ),
    ]
    if mode == "rtl":
        checks.extend(
            [
                check(devtools, "document.documentElement.lang", "ar"),
                check(devtools, "document.dir", "rtl"),
                check(
                    devtools,
                    "getComputedStyle(document.querySelector('.incident.critical')).borderRightWidth",
                    "5px",
                    enforce=False,
                    note="The inline-start severity border should mirror to the right in RTL.",
                ),
            ]
        )
    if mode == "pseudo":
        checks.append(
            check(
                devtools,
                "document.documentElement.lang",
                "de-x-pseudo",
            )
        )
    if mode == "text-200":
        checks.extend(
            [
                check(
                    devtools,
                    "Boolean(document.querySelector('style[data-content-stress-text200]'))",
                    True,
                ),
                check(
                    devtools,
                    "getComputedStyle(document.body).fontSize",
                    "28px",
                ),
            ]
        )

    byte_count = capture(devtools, output_dir / filename)
    trace["states"].append(
        {
            "id": f"{mode}-{width}x{height}",
            "mode": mode,
            "viewport": {"width": width, "height": height, "device_scale_factor": 1},
            "method": (
                "author-stylesheet text-only enlargement simulation"
                if mode == "text-200"
                else "DOM content-stress harness"
            ),
            "checks": checks,
            "metrics": metrics,
            "screenshot": filename,
            "capture": {"bytes": byte_count},
        }
    )
    failures = sum(not item["passed"] for item in checks)
    print(f"Captured {mode} at {width}x{height}: {failures} contract failure(s)")


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
        harness = harness_path.read_text(encoding="utf-8")
        chrome = find_chrome(args.chrome)
    except (OSError, ValueError) as exc:
        print(f"[ERROR] {exc}")
        return 1

    output_dir = args.output_dir.expanduser().resolve()
    output_dir.mkdir(parents=True, exist_ok=True)
    scenarios = [
        ("pseudo", 1440, 1000),
        ("pseudo", 768, 1000),
        ("pseudo", 390, 1000),
        ("pseudo", 320, 1000),
        ("rtl", 1440, 1000),
        ("rtl", 390, 1000),
        ("text-200", 1440, 1000),
        ("text-200", 390, 1000),
    ]
    expected = [
        output_dir / f"dashboard-content-{mode}-{width}x{height}.png"
        for mode, width, height in scenarios
    ]
    trace_path = output_dir / "dashboard-content-stress-trace.json"
    existing = [path for path in [*expected, trace_path] if path.exists()]
    if existing and not args.force:
        print("[ERROR] Refusing to overwrite existing content-stress evidence:")
        for path in existing:
            print(f"- {path}")
        return 1

    trace: dict[str, Any] = {
        "schema_version": 1,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "source": {"file": html.name, "sha256": sha256(html)},
        "harness": {"file": harness_path.name, "sha256": sha256(harness_path)},
        "evidence_boundaries": {
            "pseudo_locale": (
                "Pseudo-localized strings test growth and wrapping only; they do not "
                "validate translation quality, grammar, cultural fit, or locale formatting."
            ),
            "rtl": (
                "Setting Arabic content and document direction tests this reproduced DOM "
                "and CSS render, not linguistic quality or every bidirectional edge case."
            ),
            "text_200": (
                "The author stylesheet doubles declared text sizes for deterministic "
                "text-only stress. It is not browser zoom, OS text scaling, or user settings."
            ),
            "reflow_320": (
                "A 320 CSS px viewport is direct narrow-reflow evidence. It is not proof "
                "of 400% browser zoom from a 1280 px viewport."
            ),
            "overflow": (
                "Page metrics and the first viewport capture do not prove below-fold "
                "reachability, nested scrolling, focus visibility, or every content value."
            ),
        },
        "states": [],
    }

    with tempfile.TemporaryDirectory(prefix="design-agent-content-stress-") as temp:
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
            for mode, width, height in scenarios:
                set_viewport(devtools, width, height)
                navigate(devtools, html, harness, mode)
                record_state(devtools, output_dir, trace, mode, width, height)
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
