#!/usr/bin/env node
/** Context OS CLI entry */
import { runCli } from "../src/cli.mjs";

runCli(process.argv).catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  if (process.argv.includes("--json")) {
    process.stdout.write(
      `${JSON.stringify(
        {
          ok: false,
          error: {
            code: err?.code ?? "COMMAND_ERROR",
            message,
          },
        },
        null,
        2
      )}\n`
    );
  } else {
    console.error(message);
  }
  process.exitCode = 2;
});
