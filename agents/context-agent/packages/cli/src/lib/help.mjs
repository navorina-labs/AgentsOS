/** Usage and examples for agent-friendly CLI */
export function printHelp() {
  console.log(`context-os — domain-oriented context cores for AI agents

Usage:
  context-os init [options]          Scaffold context-os/ in a project
  context-os route <question>        Route question (--router keyword|semantic)
  context-os doctor [options]        Diagnose framework readiness
  context-os profiles                List/validate scaffold profiles
  context-os score [options]         Score core quality rubric
  context-os check [options]         Run framework gates for CI/local use
  context-os ci init [options]       Generate GitHub Actions check workflow
  context-os audit init [options]    Generate methodology audit documents
  context-os audit report [options]  Generate framework audit snapshot
  context-os audit record [options]  Append compact metrics to audit history
  context-os audit compare [options] Compare recorded snapshots for regressions
  context-os maturity [options]      Assess adoption level and next action
  context-os adapters [command]      Install agent-tool instruction adapters
  context-os routing lint [options]  Detect routing conflicts and coverage gaps
  context-os cores verify [options]  Enforce core version lifecycle against git
  context-os contracts verify        Verify manifest/router/eval evolution
  context-os router embed            Build semantic router embeddings
  context-os drift check [options]   Core freshness vs git diff (--strict)
  context-os validate [options]      Check manifest + core files (--schema)
  context-os stats <question>        Estimate routed core size (chars/tokens)
  context-os graph build             Build graph-index.json for Condition C
  context-os eval route [options]    Routing F1 on questions JSON (no LLM)
  context-os eval dry-run [options]  Condition B context sizes (no API key)
  context-os eval run [options]      A/B/C eval with LLM + judge
  context-os eval aggregate <dir>    results.json → paired + summary
  context-os eval bootstrap <csv>    Bootstrap 95% CI on paired.csv

Init options:
  --name <project>     Project name (default: directory basename)
  --target <dir>       Where to create context-os/ (default: cwd)
  --profile minimal|saas|agent-tool|oss-library
                       Template profile (default: minimal)
  --force              Overwrite existing context-os/
  --dry-run            Print planned files only

Global options:
  --root <dir>         Project root containing context-os/ (default: cwd)

Check options:
  --min-score <n>          Minimum score for every core (default: 75)
  --max-route-tokens <n>   Maximum estimated tokens per route (default: 2000)

Examples:
  npx context-os init --name myapp --profile saas
  context-os route "Why did MRR drop?" --root .
  context-os validate
  context-os eval route --questions context-os/eval/questions.json
  context-os eval dry-run --root examples/scaffold-saas
  context-os validate --schema
  context-os doctor --root .
  context-os score --root examples/scaffold-saas --min 50
  context-os check --root examples/scaffold-saas --min-score 50
  context-os ci init --min-score 75
  context-os audit init
  context-os maturity --min routable
  context-os adapters install --all
  context-os routing lint --strict
  context-os cores verify --base origin/main
  context-os contracts verify --base origin/main

Docs: https://github.com/navorina-labs/AI-Context-OS
`);
}
