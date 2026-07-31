/** CLI dispatcher: init, route, validate, eval */
import { printHelp } from "./lib/help.mjs";
import { cmdInit } from "./commands/init.mjs";
import { cmdRoute } from "./commands/route.mjs";
import { cmdValidate } from "./commands/validate.mjs";
import { cmdEval } from "./commands/eval.mjs";
import { cmdStats } from "./commands/stats.mjs";
import { cmdGraph } from "./commands/graph.mjs";
import { cmdRouter } from "./commands/router.mjs";
import { cmdDrift } from "./commands/drift.mjs";
import { cmdDoctor } from "./commands/doctor.mjs";
import { cmdProfiles } from "./commands/profiles.mjs";
import { cmdScore } from "./commands/score.mjs";
import { cmdCheck } from "./commands/check.mjs";
import { cmdCi } from "./commands/ci.mjs";
import { cmdAudit } from "./commands/audit.mjs";
import { cmdMaturity } from "./commands/maturity.mjs";
import { cmdAdapters } from "./commands/adapters.mjs";
import { cmdRouting } from "./commands/routing.mjs";
import { cmdCores } from "./commands/cores.mjs";
import { cmdContracts } from "./commands/contracts.mjs";

export async function runCli(argv) {
  const args = argv.slice(2);
  const cmd = args[0];

  if (!cmd || cmd === "--help" || cmd === "-h") {
    printHelp();
    return;
  }

  switch (cmd) {
    case "init":
      await cmdInit(args.slice(1));
      break;
    case "route":
      await cmdRoute(args.slice(1));
      break;
    case "validate":
      await cmdValidate(args.slice(1));
      break;
    case "eval":
      await cmdEval(args.slice(1));
      break;
    case "stats":
      await cmdStats(args.slice(1));
      break;
    case "graph":
      await cmdGraph(args.slice(1));
      break;
    case "router":
      await cmdRouter(args.slice(1));
      break;
    case "drift":
      await cmdDrift(args.slice(1));
      break;
    case "doctor":
      await cmdDoctor(args.slice(1));
      break;
    case "profiles":
      await cmdProfiles(args.slice(1));
      break;
    case "score":
      await cmdScore(args.slice(1));
      break;
    case "check":
      await cmdCheck(args.slice(1));
      break;
    case "ci":
      await cmdCi(args.slice(1));
      break;
    case "audit":
      await cmdAudit(args.slice(1));
      break;
    case "maturity":
      await cmdMaturity(args.slice(1));
      break;
    case "adapters":
      await cmdAdapters(args.slice(1));
      break;
    case "routing":
      await cmdRouting(args.slice(1));
      break;
    case "cores":
      await cmdCores(args.slice(1));
      break;
    case "contracts":
      await cmdContracts(args.slice(1));
      break;
    case "version":
    case "--version":
    case "-V":
      console.log("context-os 0.1.0");
      break;
    default:
      throw new Error(`Unknown command: ${cmd}. Run: context-os --help`);
  }
}
