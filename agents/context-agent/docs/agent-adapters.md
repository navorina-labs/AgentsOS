# Agent Adapters

Context OS is independent of a specific coding agent. Adapters expose the same
routing protocol through instruction files recognized by different tools.

| Adapter | Instruction file | Installation |
|---------|------------------|--------------|
| `agents` | `AGENTS.md` | `context-os adapters install agents` |
| `claude` | `CLAUDE.md` | `context-os adapters install claude` |
| `copilot` | `.github/copilot-instructions.md` | `context-os adapters install copilot` |

Install every adapter:

```bash
context-os adapters install --all
context-os adapters status
```

All adapters use a marked managed block. Existing
instructions outside that block are preserved, and repeated installation only
updates the Context OS block.

Use `--dry-run` to inspect planned file actions.

## Shared Protocol

Every adapter instructs the agent to:

1. read the manifest and router;
2. route before broad repository exploration;
3. load no more than one primary and two secondary cores;
4. respect core invariants and exclusions;
5. open sources on demand;
6. maintain affected cores and run the framework check.

The protocol is deliberately short because instruction files are loaded into
agent context. Domain knowledge belongs in cores, not in adapter files.

The file locations follow the current
[Claude Code memory contract](https://code.claude.com/docs/en/memory) and
[GitHub Copilot repository instructions contract](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/add-custom-instructions/add-repository-instructions).
