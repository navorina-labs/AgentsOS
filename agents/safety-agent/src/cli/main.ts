#!/usr/bin/env node
/**
 * CLI SafetyOS: validate, analyze, scan, init, draft, run.
 */
import { writeFile, mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { existsSync } from "node:fs";
import { Command } from "commander";
import { analyzeThreatModel } from "../engine/risk-scorer.js";
import {
  buildInitThreatModel,
  serializeThreatModel,
} from "../generator/init-threat-model.js";
import { enrichModelFromScan } from "../generator/enrich-from-scan.js";
import { serializeDraftFromScan } from "../generator/draft-from-scan.js";
import {
  loadThreatModelFromFile,
  ThreatModelValidationError,
} from "../parser/load-threat-model.js";
import { scanDirectory } from "../scanner/scan-directory.js";
import { runFullAssessment } from "../engine/assess.js";
import {
  generateOpaAiGovernance,
  opaAiGovernanceOutPath,
} from "../export/opa-ai-governance.js";
import { generateOpaFromThreatModel } from "../export/opa.js";
import { applyProfileToModel } from "../profiles/apply-profile.js";
import { listProfiles, loadProfileById } from "../profiles/load-profile.js";
import { formatAnalyzeReport, formatScanReport } from "./format-report.js";
import { inventoryTlsDirectory } from "../inventory/tls-inventory.js";
import { reconcileTlsWithModel } from "../inventory/reconcile.js";
import { mergeTlsInventoryIntoModel } from "../inventory/merge-tls.js";
import {
  applyTlsFlowSync,
  suggestTlsFlowSync,
} from "../inventory/suggest-tls-sync.js";
import { formatFullAssessment } from "./format-assess.js";
import { formatTlsInventory, formatTlsReconcile } from "./format-inventory.js";
import { renderDefensePlaybook } from "../export/playbook.js";
import { renderAnalyzeHtml } from "./html-report.js";
import { renderAssessHtml } from "./assess-html-report.js";
import { evaluateAssessGate } from "../engine/assess-gate.js";
import { diffAssessments } from "../engine/assess-diff.js";
import { formatAssessDiff } from "./format-diff.js";
import { formatCycleSummary, runDefenseCycle } from "./run-cycle.js";
import { runOpaPolicyTest } from "./run-opa-test.js";
import { startDefenseWatch } from "./watch-defense.js";

const program = new Command();

const DEFAULT_MODEL_PATHS = [
  "safetyos/threat-model.yaml",
  "sec/threat-model.yaml",
  "threat-model.yaml",
];

program
  .name("safetyos")
  .description("SafetyOS — Mosca-Aware Crypto Lifecycle")
  .version("0.6.0");

program
  .command("init")
  .description("Создать шаблон threat-model.yaml")
  .option("-n, --name <name>", "Имя организации", "My Organization")
  .option("-o, --out <file>", "Путь вывода", "safetyos/threat-model.yaml")
  .option("--migration-years <n>", "y — годы миграции", "3")
  .option("--horizon-years <n>", "z — горизонт CRQC", "10")
  .option(
    "-p, --profile <id>",
    "Отраслевой профиль (fintech, healthcare, government, startup-saas, web3, messaging)",
  )
  .option(
    "--merge-flows",
    "Добавить starter_flows профиля (не перезаписывая существующие id)",
  )
  .action(async (opts) => {
    try {
      const out = path.resolve(opts.out);
      if (existsSync(out)) {
        console.error(`Файл уже существует: ${out}`);
        process.exit(1);
      }
      await mkdir(path.dirname(out), { recursive: true });
      let model = buildInitThreatModel({
        organizationName: opts.name,
        migrationYears: Number(opts.migrationYears),
        quantumHorizonYears: Number(opts.horizonYears),
      });
      if (opts.profile) {
        const profile = await loadProfileById(opts.profile);
        model = applyProfileToModel(model, profile, {
          mergeStarterFlows: Boolean(opts.mergeFlows),
        });
      }
      await writeFile(out, serializeThreatModel(model), "utf8");
      console.log(`Создан: ${out}`);
      console.log("Далее: safetyos analyze", out);
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("draft")
  .description("Черновик threat model из результатов scan")
  .argument("<path>", "Директория для scan")
  .option("-n, --name <name>", "Имя организации", "My Organization")
  .option("-o, --out <file>", "Путь вывода", "safetyos/threat-model.draft.yaml")
  .option("--merge <file>", "Добавить потоки к существующему threat model")
  .action(async (scanPath: string, opts) => {
    try {
      const report = await scanDirectory(scanPath);
      let yaml: string;

      if (opts.merge) {
        const base = await loadThreatModelFromFile(opts.merge);
        const enriched = enrichModelFromScan(base, report);
        yaml = serializeThreatModel(enriched.model);
        console.error(
          `Merge: обогащено ${enriched.enriched_flow_ids.length} потоков, новых ${enriched.new_flow_ids.length}`,
        );
      } else {
        yaml = serializeDraftFromScan(report, opts.name);
      }

      const out = path.resolve(opts.out);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, yaml, "utf8");
      console.log(`Черновик: ${out} (${report.findings.length} находок scan)`);
      console.log("Проверка: safetyos validate", out);
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("validate")
  .description("Проверить YAML threat model")
  .argument("<file>", "Путь к threat-model.yaml")
  .action(async (file: string) => {
    try {
      const model = await loadThreatModelFromFile(file);
      console.log(`OK: ${model.organization.name} (${model.data_flows.length} flows)`);
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("analyze")
  .description("Анализ рисков по threat model")
  .argument("[file]", "Путь к threat-model.yaml")
  .option("--json", "Вывод в JSON")
  .option("--html <file>", "Сохранить HTML-отчёт")
  .option(
    "--fail-on <tier>",
    "Exit code 1 если есть поток с tier >= (critical|high|medium)",
  )
  .action(async (file: string | undefined, opts) => {
    try {
      const modelPath = file ?? resolveDefaultModel();
      const model = await loadThreatModelFromFile(modelPath);
      const report = analyzeThreatModel(model);

      if (opts.html) {
        const html = renderAnalyzeHtml(report);
        const out = path.resolve(opts.html);
        await mkdir(path.dirname(out), { recursive: true });
        await writeFile(out, html, "utf8");
        console.log(`HTML: ${out}`);
      }

      if (opts.json) {
        console.log(JSON.stringify(report, null, 2));
      } else if (!opts.html) {
        console.log(formatAnalyzeReport(report));
      } else {
        console.log(
          `Mosca at_risk=${report.mosca.at_risk} · critical flows=${report.summary.critical}`,
        );
      }

      if (opts.failOn) {
        const threshold = tierRank(opts.failOn);
        const worst = Math.max(...report.flows.map((f) => tierRank(f.tier)));
        if (worst >= threshold) {
          process.exit(1);
        }
      }

      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("scan")
  .description("Сканировать директорию на слабую криптографию")
  .argument("<path>", "Корневая директория")
  .option("--json", "Вывод в JSON")
  .option("--no-fail", "Всегда exit 0 (для CI aggregate)")
  .action(async (dir: string, opts: { json?: boolean; noFail?: boolean }) => {
    try {
      const report = await scanDirectory(dir);
      if (opts.json) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(formatScanReport(report));
      }
      const critical = report.findings.filter((f) => f.severity === "critical");
      if (opts.noFail) {
        process.exit(0);
      }
      process.exit(critical.length > 0 ? 1 : 0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("run")
  .description("Полный цикл: scan код + analyze threat model + отчёты")
  .option("-m, --model <file>", "Threat model", resolveDefaultModelOptional())
  .option("-s, --scan <dir>", "Директория scan", ".")
  .option("--reports-dir <dir>", "Каталог отчётов", "reports")
  .option("--fail-on <tier>", "Провал при tier", "critical")
  .action(async (opts) => {
    try {
      const modelPath = opts.model ?? resolveDefaultModel();
      const reportsDir = path.resolve(opts.reportsDir);
      await mkdir(reportsDir, { recursive: true });

      const scanReport = await scanDirectory(opts.scan);
      const scanJson = path.join(reportsDir, "scan-latest.json");
      await writeFile(scanJson, JSON.stringify(scanReport, null, 2));

      const model = await loadThreatModelFromFile(modelPath);
      const analysis = analyzeThreatModel(model);
      const analyzeJson = path.join(reportsDir, "analyze-latest.json");
      const analyzeHtml = path.join(reportsDir, "analyze-latest.html");
      await writeFile(analyzeJson, JSON.stringify(analysis, null, 2));
      await writeFile(analyzeHtml, renderAnalyzeHtml(analysis), "utf8");

      console.log(formatAnalyzeReport(analysis));
      console.log(`\nScan: ${scanReport.findings.length} находок → ${scanJson}`);
      console.log(`Analyze JSON → ${analyzeJson}`);
      console.log(`Analyze HTML → ${analyzeHtml}`);

      const scanCritical = scanReport.findings.filter(
        (f) => f.severity === "critical",
      ).length;
      const threshold = tierRank(opts.failOn);
      const worst = Math.max(...analysis.flows.map((f) => tierRank(f.tier)));

      if (worst >= threshold) {
        console.error(`\n⛔ analyze: worst tier >= ${opts.failOn}`);
        process.exit(1);
      }
      if (scanCritical > 0) {
        console.error(`\n⚠ scan: ${scanCritical} critical (см. ${scanJson})`);
      }
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

const inventoryCmd = program
  .command("inventory")
  .description("Инвентаризация криптографии в деплое");

inventoryCmd
  .command("tls")
  .description("Парсинг TLS/ssl из nginx, .env, docker-compose")
  .argument("<path>", "Файл или каталог конфигов")
  .option("--json", "JSON")
  .option("-o, --out <file>", "Сохранить JSON", "reports/tls-inventory.json")
  .option("--merge <model>", "Добавить потоки в threat model → новый файл")
  .option("--merge-out <file>", "Выход merge", "safetyos/threat-model.with-tls.yaml")
  .action(async (configPath: string, opts) => {
    try {
      const report = await inventoryTlsDirectory(configPath);
      const out = path.resolve(opts.out);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, JSON.stringify(report, null, 2), "utf8");

      if (opts.merge) {
        const model = await loadThreatModelFromFile(opts.merge);
        const merged = mergeTlsInventoryIntoModel(model, report);
        const mergeOut = path.resolve(opts.mergeOut);
        await mkdir(path.dirname(mergeOut), { recursive: true });
        await writeFile(mergeOut, serializeThreatModel(merged), "utf8");
        console.log(`Merged threat model → ${mergeOut}`);
      }

      if (opts.json) {
        console.log(JSON.stringify(report, null, 2));
      } else {
        console.log(formatTlsInventory(report));
        console.log(`JSON → ${out}`);
      }

      const crit = report.records.flatMap((r) =>
        r.findings.filter((f) => f.severity === "critical"),
      );
      process.exit(crit.length > 0 ? 1 : 0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

inventoryCmd
  .command("suggest")
  .description("Предложения синхронизации TLS-потоков с inventory")
  .requiredOption("-m, --model <file>", "Threat model")
  .option("--config <path>", "Каталог TLS конфигов")
  .option("-i, --inventory <file>", "tls-inventory.json")
  .option("--json", "JSON")
  .option("--apply", "Записать crypto в threat model")
  .option("-o, --out <file>", "Выход при --apply (по умолчанию -m)")
  .action(async (opts) => {
    try {
      const model = await loadThreatModelFromFile(opts.model);
      let inventory;
      if (opts.inventory) {
        inventory = JSON.parse(
          await readFile(path.resolve(opts.inventory), "utf8"),
        );
      } else if (opts.config) {
        inventory = await inventoryTlsDirectory(opts.config);
      } else {
        throw new Error("Укажите --config или -i");
      }
      const suggestions = suggestTlsFlowSync(model, inventory);
      if (opts.apply) {
        const applied = applyTlsFlowSync(model, suggestions);
        const out = path.resolve(opts.out ?? opts.model);
        await mkdir(path.dirname(out), { recursive: true });
        await writeFile(out, serializeThreatModel(applied), "utf8");
        console.log(
          `Применено ${suggestions.length} патч(ей) → ${out}`,
        );
        for (const s of suggestions) {
          console.log(`  · ${s.flow_id}`);
        }
        process.exit(0);
      }
      if (opts.json) {
        console.log(JSON.stringify(suggestions, null, 2));
      } else {
        for (const s of suggestions) {
          console.log(`\n${s.flow_id}: ${s.reason}`);
          if (s.crypto_patch) {
            console.log(`  crypto.key_exchange: ${s.crypto_patch.key_exchange.join(", ") || "—"}`);
            console.log(`  crypto.symmetric: ${s.crypto_patch.symmetric.join(", ") || "—"}`);
          }
        }
        if (suggestions.length === 0) {
          console.log("Нет сопоставлений — добавьте теги tls/edge к потокам или safetyos inventory merge");
        }
      }
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

inventoryCmd
  .command("reconcile")
  .description("Сверка threat model с TLS inventory")
  .requiredOption("-m, --model <file>", "Threat model")
  .option("--config <path>", "Каталог/файл TLS конфигов")
  .option("-i, --inventory <file>", "Готовый tls-inventory.json")
  .option("--json", "JSON")
  .action(async (opts) => {
    try {
      const model = await loadThreatModelFromFile(opts.model);
      let inventory;
      if (opts.inventory) {
        const raw = await readFile(path.resolve(opts.inventory), "utf8");
        inventory = JSON.parse(raw);
      } else if (opts.config) {
        inventory = await inventoryTlsDirectory(opts.config);
      } else {
        throw new Error("Укажите --config <path> или -i tls-inventory.json");
      }
      const reconcile = reconcileTlsWithModel(model, inventory);
      if (opts.json) {
        console.log(JSON.stringify(reconcile, null, 2));
      } else {
        console.log(formatTlsReconcile(reconcile));
      }
      const crit = reconcile.drifts.filter((d) => d.severity === "critical");
      process.exit(crit.length > 0 ? 1 : 0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

const profileCmd = program
  .command("profile")
  .description("Отраслевые профили угроз и политик");

profileCmd
  .command("list")
  .description("Список профилей")
  .action(async () => {
    try {
      const profiles = await listProfiles();
      for (const p of profiles) {
        console.log(`${p.id}\t${p.name}`);
        if (p.description) console.log(`\t${p.description}`);
      }
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

profileCmd
  .command("apply")
  .description("Применить профиль к threat model")
  .argument("<profileId>", "fintech | healthcare | government | startup-saas | web3 | messaging")
  .requiredOption("-m, --model <file>", "Исходный threat model")
  .option("-o, --out <file>", "Выход (по умолчанию перезапись -m)")
  .option("--merge-flows", "Добавить starter_flows профиля")
  .action(async (profileId: string, opts) => {
    try {
      const model = await loadThreatModelFromFile(opts.model);
      const profile = await loadProfileById(profileId);
      const applied = applyProfileToModel(model, profile, {
        mergeStarterFlows: Boolean(opts.mergeFlows),
      });
      const out = path.resolve(opts.out ?? opts.model);
      await writeFile(out, serializeThreatModel(applied), "utf8");
      console.log(`Профиль "${profileId}" применён → ${out}`);
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

const exportCmd = program
  .command("export")
  .description("Экспорт CBOM / OPA");

exportCmd
  .command("cbom")
  .description("CycloneDX 1.6 Cryptographic BOM")
  .option("-m, --model <file>", "Threat model")
  .option("--inventory-tls <path>", "TLS inventory → компоненты tls-config/*")
  .option("-o, --out <file>", "JSON выход", "reports/cbom.json")
  .action(async (opts) => {
    try {
      const modelPath = opts.model ?? resolveDefaultModel();
      const model = await loadThreatModelFromFile(modelPath);
      const tlsInventory = opts.inventoryTls
        ? await inventoryTlsDirectory(opts.inventoryTls)
        : undefined;
      const full = runFullAssessment(model, { tlsInventory });
      const bom = full.cbom;
      const out = path.resolve(opts.out);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, JSON.stringify(bom, null, 2), "utf8");
      console.log(`CBOM: ${out} (${bom.components.length} components)`);
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

exportCmd
  .command("opa")
  .description("Rego policies для OPA")
  .option("-m, --model <file>", "Threat model")
  .option("-o, --out <file>", "Выход", "reports/policy.rego")
  .action(async (opts) => {
    try {
      const modelPath = opts.model ?? resolveDefaultModel();
      const model = await loadThreatModelFromFile(modelPath);
      const rego = generateOpaFromThreatModel(model);
      const out = path.resolve(opts.out);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, rego, "utf8");
      console.log(`OPA: ${out}`);
      const aiRego = generateOpaAiGovernance(model);
      if (aiRego) {
        const aiOut = opaAiGovernanceOutPath(out);
        await writeFile(aiOut, aiRego, "utf8");
        console.log(`OPA AI: ${aiOut}`);
      }
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

const policyCmd = program
  .command("policy")
  .description("Локальная проверка OPA (opa test)");

policyCmd
  .command("test")
  .description("Сгенерировать bundle и запустить opa test")
  .option("-m, --model <file>", "Threat model")
  .option("-o, --out <dir>", "Каталог bundle", "reports/opa-test")
  .action(async (opts) => {
    try {
      const modelPath = opts.model ?? resolveDefaultModel();
      const result = await runOpaPolicyTest(modelPath, opts.out);
      if (!result.ran) {
        console.log(`Пропуск: ${result.skipped_reason}`);
        console.log(`Bundle для ручного теста: ${result.bundle_dir}`);
        process.exit(0);
      }
      if (result.stdout) console.log(result.stdout);
      if (result.stderr) console.error(result.stderr);
      console.log(result.ok ? "OPA test OK" : "OPA test FAILED");
      process.exit(result.ok ? 0 : 1);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("playbook")
  .description("Playbook защиты от квантовых и ИИ-угроз (markdown)")
  .option("-m, --model <file>", "Threat model")
  .option("--scan <dir>", "Каталог code scan")
  .option("--inventory-tls <path>", "TLS конфиги")
  .option("-o, --out <file>", "Выход", "reports/defense-playbook.md")
  .action(async (opts) => {
    try {
      const modelPath = opts.model ?? resolveDefaultModel();
      const model = await loadThreatModelFromFile(modelPath);
      const scan = opts.scan ? await scanDirectory(opts.scan) : undefined;
      const tlsInventory = opts.inventoryTls
        ? await inventoryTlsDirectory(opts.inventoryTls)
        : undefined;
      const full = runFullAssessment(model, { scan, tlsInventory });
      const md = renderDefensePlaybook(full);
      const out = path.resolve(opts.out);
      await mkdir(path.dirname(out), { recursive: true });
      await writeFile(out, md, "utf8");
      console.log(`Playbook: ${out}`);
      console.log(formatFullAssessment(full));
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("assess")
  .description("Полная оценка: quantum + AI assurance + risk + CBOM")
  .argument("[file]", "Threat model")
  .option("--scan <dir>", "Опционально: каталог для assurance scan")
  .option("--inventory-tls <path>", "TLS inventory конфигов (nginx, .env)")
  .option("--json", "JSON")
  .option("--html <file>", "Сохранить HTML dashboard")
  .option("-o, --out <dir>", "Каталог отчётов", "reports")
  .option("--save-baseline", "Сохранить снимок как baseline-assessment.json")
  .option("--diff-baseline", "Сравнить с baseline после оценки")
  .action(async (file: string | undefined, opts) => {
    try {
      const modelPath = file ?? resolveDefaultModel();
      const model = await loadThreatModelFromFile(modelPath);
      const scan = opts.scan ? await scanDirectory(opts.scan) : undefined;
      const tlsInventory = opts.inventoryTls
        ? await inventoryTlsDirectory(opts.inventoryTls)
        : undefined;
      const full = runFullAssessment(model, { scan, tlsInventory });

      const outDir = path.resolve(opts.out);
      await mkdir(outDir, { recursive: true });
      await writeFile(
        path.join(outDir, "assessment.json"),
        JSON.stringify(full, null, 2),
        "utf8",
      );
      await writeFile(
        path.join(outDir, "cbom.json"),
        JSON.stringify(full.cbom, null, 2),
        "utf8",
      );
      if (full.tls) {
        await writeFile(
          path.join(outDir, "tls-inventory.json"),
          JSON.stringify(full.tls.inventory, null, 2),
          "utf8",
        );
        await writeFile(
          path.join(outDir, "tls-reconcile.json"),
          JSON.stringify(full.tls.reconcile, null, 2),
          "utf8",
        );
      }
      await writeFile(
        path.join(outDir, "quantum-posture.json"),
        JSON.stringify(full.quantum, null, 2),
        "utf8",
      );

      const htmlPath = opts.html
        ? path.resolve(opts.html)
        : path.join(outDir, "assessment-latest.html");
      await writeFile(htmlPath, renderAssessHtml(full), "utf8");

      const baselinePath = path.join(outDir, "baseline-assessment.json");
      if (opts.saveBaseline) {
        await writeFile(baselinePath, JSON.stringify(full, null, 2), "utf8");
        console.log(`Baseline: ${baselinePath}`);
      }

      if (opts.diffBaseline && existsSync(baselinePath) && !opts.saveBaseline) {
        const raw = await readFile(baselinePath, "utf8");
        const baseline = JSON.parse(raw) as typeof full;
        const diff = diffAssessments(baseline, full);
        await writeFile(
          path.join(outDir, "assess-diff.txt"),
          formatAssessDiff(diff),
          "utf8",
        );
        if (!opts.json) {
          console.log(formatAssessDiff(diff));
        }
      }

      if (opts.json) {
        console.log(JSON.stringify(full, null, 2));
      } else {
        console.log(formatFullAssessment(full));
        console.log(
          `Отчёты: ${outDir}/assessment.json, ${outDir}/cbom.json, ${htmlPath}`,
        );
      }
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("diff")
  .description("Сравнить два JSON-отчёта assess (регрессия posture)")
  .argument("<before>", "Базовый assessment.json")
  .argument("<after>", "Текущий assessment.json")
  .option("--json", "JSON diff")
  .action(async (beforePath: string, afterPath: string, opts) => {
    try {
      const before = JSON.parse(
        await readFile(path.resolve(beforePath), "utf8"),
      );
      const after = JSON.parse(await readFile(path.resolve(afterPath), "utf8"));
      const diff = diffAssessments(before, after, {
        before: path.basename(beforePath),
        after: path.basename(afterPath),
      });
      if (opts.json) {
        console.log(JSON.stringify(diff, null, 2));
      } else {
        console.log(formatAssessDiff(diff));
      }
      process.exit(diff.improved ? 0 : 1);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("cycle")
  .description(
    "Локальный цикл защиты: scan → enrich → assess → diff baseline",
  )
  .argument("[file]", "Threat model")
  .option("--scan <dir>", "Каталог code scan (обогащение модели)")
  .option("--inventory-tls <path>", "TLS inventory")
  .option(
    "--sync-tls",
    "Подтянуть crypto TLS-потоков из inventory перед assess",
  )
  .option("-o, --out <dir>", "Каталог отчётов", "reports")
  .option(
    "--write-model <file>",
    "Сохранить обогащённую модель (не перезаписывает исходник)",
  )
  .option("--baseline <file>", "Путь baseline JSON")
  .option("--save-baseline", "Обновить baseline текущим assess")
  .action(async (file: string | undefined, opts) => {
    try {
      const modelPath = file ?? resolveDefaultModel();
      const result = await runDefenseCycle({
        modelPath,
        scanDir: opts.scan,
        tlsPath: opts.inventoryTls,
        syncTls: Boolean(opts.syncTls),
        outDir: opts.out,
        writeEnrichedModel: opts.writeModel,
        baselinePath: opts.baseline,
        saveBaseline: Boolean(opts.saveBaseline),
      });
      console.log(formatCycleSummary(result));
      process.exit(result.diff?.improved === false ? 1 : 0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("watch")
  .description("Watch threat model → пересчёт cycle при сохранении")
  .argument("[file]", "Threat model")
  .option("--scan <dir>", "Каталог code scan")
  .option("--inventory-tls <path>", "TLS inventory")
  .option("--sync-tls", "Подтянуть crypto TLS-потоков из inventory")
  .option("-o, --out <dir>", "Каталог отчётов", "reports")
  .action((file: string | undefined, opts) => {
    try {
      const modelPath = file ?? resolveDefaultModel();
      startDefenseWatch({
        modelPath,
        scanDir: opts.scan,
        tlsPath: opts.inventoryTls,
        syncTls: Boolean(opts.syncTls),
        outDir: opts.out,
      });
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

program
  .command("gate")
  .description("CI gate: assess + exit 1 при assurance/IFF/critical risk")
  .argument("[file]", "Threat model")
  .option("--scan <dir>", "Каталог code scan")
  .option("--inventory-tls <path>", "TLS inventory")
  .option(
    "--max-assurance-failures <n>",
    "Допустимо failed в assurance",
    "0",
  )
  .option("--max-critical <n>", "Макс. critical flows", "0")
  .option(
    "--max-tls-critical-drifts <n>",
    "Макс. critical TLS drift (нужен --inventory-tls)",
  )
  .option("--no-governance-check", "Не проверять ai_governance")
  .action(async (file: string | undefined, opts) => {
    try {
      const modelPath = file ?? resolveDefaultModel();
      const model = await loadThreatModelFromFile(modelPath);
      const scan = opts.scan ? await scanDirectory(opts.scan) : undefined;
      const tlsInventory = opts.inventoryTls
        ? await inventoryTlsDirectory(opts.inventoryTls)
        : undefined;
      const full = runFullAssessment(model, { scan, tlsInventory });
      const gate = evaluateAssessGate(full, {
        maxAssuranceFailures: Number(opts.maxAssuranceFailures),
        maxCriticalFlows: Number(opts.maxCritical),
        maxTlsCriticalDrifts:
          opts.maxTlsCriticalDrifts !== undefined
            ? Number(opts.maxTlsCriticalDrifts)
            : undefined,
        failOnGovernance: !opts.noGovernanceCheck,
      });

      if (!gate.pass) {
        console.error("SafetyOS gate FAILED:");
        for (const f of gate.failures) {
          console.error(`  ✗ ${f}`);
        }
        process.exit(1);
      }
      console.log("SafetyOS gate OK");
      console.log(
        `assurance ${full.assurance.passed} pass / ${full.assurance.failed} fail / ${full.assurance.review} review`,
      );
      process.exit(0);
    } catch (e) {
      printError(e);
      process.exit(1);
    }
  });

function resolveDefaultModelOptional(): string | undefined {
  for (const p of DEFAULT_MODEL_PATHS) {
    if (existsSync(path.resolve(p))) return p;
  }
  return undefined;
}

function resolveDefaultModel(): string {
  const found = resolveDefaultModelOptional();
  if (found) return found;
  throw new Error(
    `Threat model не найден. Создайте: safetyos init  или укажите путь: safetyos analyze ./safetyos/threat-model.yaml`,
  );
}

function tierRank(tier: string): number {
  switch (tier.toLowerCase()) {
    case "critical":
      return 4;
    case "high":
      return 3;
    case "medium":
      return 2;
    case "low":
      return 1;
    default:
      throw new Error(`Unknown tier: ${tier}`);
  }
}

function printError(e: unknown): void {
  if (e instanceof ThreatModelValidationError) {
    console.error(e.message);
    for (const issue of e.issues) {
      console.error(`  - ${issue}`);
    }
    return;
  }
  console.error(e instanceof Error ? e.message : String(e));
}

program.parse();
