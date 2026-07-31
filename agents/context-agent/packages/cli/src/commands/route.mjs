/** Route a question to cores — keyword or semantic router */
import { routeQuestionSemantic } from "@context-os/eval";
import { parseGlobalFlags, loadManifest } from "../lib/paths.mjs";
import { loadRoutingMap, routeQuestion } from "../lib/router.mjs";

function parseRouteArgs(rest) {
  let router = "keyword";
  let json = false;
  const questionParts = [];
  for (let i = 0; i < rest.length; i++) {
    const a = rest[i];
    if (a === "--router" && rest[i + 1]) {
      router = rest[++i];
    } else if (a === "--json") {
      json = true;
    } else {
      questionParts.push(a);
    }
  }
  return { router, json, question: questionParts.join(" ").trim() };
}

export async function cmdRoute(argv) {
  const { opts, rest } = parseGlobalFlags(argv);
  const { router, json, question } = parseRouteArgs(rest);

  if (!question) {
    throw new Error('Usage: context-os route "<question>" [--router keyword|semantic] [--root DIR]');
  }

  const map = loadRoutingMap(opts.root);
  const manifest = loadManifest(opts.root);

  let cores;
  if (router === "semantic") {
    cores = await routeQuestionSemantic(question, {
      projectRoot: opts.root,
      routingMap: map,
      keywordRoute: routeQuestion,
    });
  } else if (router === "keyword") {
    cores = routeQuestion(question, map);
  } else {
    throw new Error(`Unknown --router: ${router}. Use keyword or semantic`);
  }

  const out = {
    ok: true,
    question,
    cores,
    router,
    routing_map: map.version ?? "1.0.0",
  };

  if (!json && process.stdout.isTTY) {
    console.log(`Cores: ${cores.join(", ")} (${router})`);
    for (const core of cores) {
      const rel =
        manifest.cores?.[core] ??
        manifest.subcores?.[core] ??
        `context-os/cores/${core}.md`;
      console.log(`  → ${rel}`);
    }
  } else {
    console.log(JSON.stringify(out, null, 2));
  }
}
