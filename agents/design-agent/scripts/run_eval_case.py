#!/usr/bin/env python3
"""Run one frozen evaluation prompt in an isolated local Codex context."""

from __future__ import annotations

import argparse
import hashlib
import json
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

ALLOWED_SCRIPTS = {
    "check_spec.py",
    "compare_spec_implementation.py",
    "search_knowledge.py",
    "verify_transfer_repair.py",
}


def read_object(path: Path) -> dict[str, Any]:
    data = json.loads(path.read_text(encoding="utf-8"))
    if not isinstance(data, dict):
        raise ValueError(f"{path} must contain a JSON object")
    return data


def find_case(record: dict[str, Any], case_id: str) -> dict[str, Any]:
    for case in record.get("cases", []):
        if case.get("id") == case_id:
            return case
    raise ValueError(f"Unknown case ID in run: {case_id}")


def prepare_workspace(
    skill_dir: Path,
    prompt: Path,
    workspace: Path,
    run_dir: Path,
    assets: list[dict[str, Any]],
) -> list[Path]:
    isolated_skill = workspace / "design-agent"
    isolated_skill.mkdir()
    shutil.copyfile(skill_dir / "SKILL.md", isolated_skill / "SKILL.md")
    shutil.copytree(skill_dir / "references", isolated_skill / "references")
    scripts_dir = isolated_skill / "scripts"
    scripts_dir.mkdir()
    for script_name in ALLOWED_SCRIPTS:
        source = skill_dir / "scripts" / script_name
        if source.is_file():
            shutil.copyfile(source, scripts_dir / script_name)
    shutil.copyfile(prompt, workspace / "TASK.md")
    image_paths = []
    attachments = workspace / "attachments"
    attachments.mkdir()
    attachment_lines = []
    for asset in assets:
        source = run_dir / asset["snapshot"]
        target = attachments / source.name
        shutil.copyfile(source, target)
        attachment_lines.append(f"- `{target.relative_to(workspace)}` ({asset['role']})")
        if asset.get("role") == "screenshot" and target.suffix.casefold() in {
            ".png",
            ".jpg",
            ".jpeg",
            ".webp",
        }:
            image_paths.append(target)
    (workspace / "AGENTS.md").write_text(
        "# Evaluation execution\n\n"
        "Read and follow `design-agent/SKILL.md` completely. Read only the "
        "references it routes for the task in `TASK.md`. Complete that task and "
        "return the final design artifact only. Do not search for evaluation "
        "criteria, expected answers, prior outputs, or files outside this workspace. "
        "Treat this workspace path as temporary: cite supplied source evidence with "
        "durable locators such as `attachments/example.html:42`, never an absolute "
        "temporary path or a clickable link to one.\n"
        + (
            "\nTask attachments:\n" + "\n".join(attachment_lines) + "\n"
            if attachment_lines
            else ""
        ),
        encoding="utf-8",
    )
    return image_paths


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("skill_dir", type=Path)
    parser.add_argument("run_dir", type=Path)
    parser.add_argument("case_id")
    parser.add_argument("--codex", default="codex")
    parser.add_argument("--model")
    parser.add_argument("--reasoning-effort", default="medium")
    parser.add_argument("--timeout", type=int, default=1200)
    args = parser.parse_args()

    run_dir = args.run_dir.resolve()
    skill_dir = args.skill_dir.resolve()
    record_path = run_dir / "run.json"
    try:
        record = read_object(record_path)
        case = find_case(record, args.case_id)
        prompt = run_dir / case["prompt_snapshot"]
        response = run_dir / case["response"]
        log = run_dir / case.get("log", f"logs/{args.case_id}.jsonl")
        if not prompt.is_file():
            raise ValueError(f"Frozen prompt is missing: {prompt}")
        if response.exists():
            raise ValueError(f"Response already exists; refusing to overwrite: {response}")
        model = args.model or record.get("model")
        if not isinstance(model, str) or not model:
            raise ValueError("Model must be provided in the run or with --model")
    except (OSError, json.JSONDecodeError, KeyError, ValueError) as exc:
        print(f"[ERROR] {exc}")
        return 1

    try:
        version_result = subprocess.run(
            [args.codex, "--version"],
            check=True,
            capture_output=True,
            text=True,
            timeout=30,
        )
        codex_version = version_result.stdout.strip()
    except (OSError, subprocess.SubprocessError) as exc:
        print(f"[ERROR] Cannot run Codex CLI: {exc}")
        return 1

    instruction = (
        "Follow AGENTS.md. Read TASK.md and complete it using the bundled "
        "design-agent skill. Return only the finished response to the task."
    )
    captured_artifacts: list[dict[str, str]] = []
    with tempfile.TemporaryDirectory(prefix="design-agent-eval-") as temp:
        workspace = Path(temp)
        try:
            image_paths = prepare_workspace(
                skill_dir, prompt, workspace, run_dir, case.get("assets", [])
            )
            temporary_response = workspace / "response.md"
            sandbox_mode = "workspace-write" if case.get("workspace_write") else "read-only"
            command = [
                args.codex,
                "exec",
                "--ephemeral",
                "--ignore-user-config",
                "--ignore-rules",
                "--skip-git-repo-check",
                "--sandbox",
                sandbox_mode,
                "--model",
                model,
                "--config",
                f'model_reasoning_effort="{args.reasoning_effort}"',
                "--cd",
                str(workspace),
                "--json",
                "--output-last-message",
                str(temporary_response),
                instruction,
            ]
            for image_path in image_paths:
                command.extend(["--image", str(image_path)])
            result = subprocess.run(
                command,
                capture_output=True,
                text=True,
                timeout=args.timeout,
            )
            log.parent.mkdir(parents=True, exist_ok=True)
            log.write_text(
                result.stdout
                + (
                    json.dumps(
                        {
                            "type": "launcher.stderr",
                            "text": result.stderr,
                        },
                        ensure_ascii=False,
                    )
                    + "\n"
                    if result.stderr
                    else ""
                ),
                encoding="utf-8",
            )
            if result.returncode != 0:
                print(f"[ERROR] Codex exited with status {result.returncode}; see {log}")
                return result.returncode or 1
            if not temporary_response.is_file():
                print(f"[ERROR] Codex produced no final response; see {log}")
                return 1
            final_text = temporary_response.read_text(encoding="utf-8")
            if len(final_text.strip()) < 100:
                print(f"[ERROR] Final response is unexpectedly short; see {log}")
                return 1
            response.parent.mkdir(parents=True, exist_ok=True)
            response.write_text(final_text.rstrip() + "\n", encoding="utf-8")
            for artifact_value in case.get("collect_artifacts", []):
                artifact = Path(artifact_value)
                if artifact.is_absolute() or ".." in artifact.parts:
                    raise ValueError(f"Unsafe collected artifact path: {artifact_value}")
                source = (workspace / artifact).resolve()
                source.relative_to(workspace.resolve())
                if not source.is_file():
                    raise ValueError(f"Expected collected artifact is missing: {artifact_value}")
                target = run_dir / "outputs" / case["id"] / artifact
                target.parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(source, target)
                captured_artifacts.append(
                    {
                        "path": str(target.relative_to(run_dir)),
                        "sha256": hashlib.sha256(source.read_bytes()).hexdigest(),
                    }
                )
        except (OSError, subprocess.TimeoutExpired, ValueError) as exc:
            print(f"[ERROR] Evaluation execution failed: {exc}")
            return 1

    case["status"] = "response-captured"
    case["executed_at"] = datetime.now(timezone.utc).isoformat()
    case["execution"] = {
        "codex_version": codex_version,
        "model": model,
        "reasoning_effort": args.reasoning_effort,
        "sandbox": sandbox_mode,
        "ephemeral": True,
    }
    if captured_artifacts:
        case["captured_artifacts"] = captured_artifacts
    record_path.write_text(
        json.dumps(record, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )
    print(f"Captured response: {response}")
    print(f"Execution log: {log}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
