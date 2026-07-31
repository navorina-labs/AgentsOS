import assert from "node:assert/strict";
import { verifyContractEvolution } from "../src/commands/contracts.mjs";

const manifest = (ids) => ({
  cores: Object.fromEntries(ids.map((id) => [id, `context-os/cores/${id}.md`])),
});
const routing = (ids) => ({
  fallback_core: ids[0],
  routes: ids.map((id) => ({ patterns: [id.replace("-core", "")], cores: [id] })),
});
const questions = (ids) =>
  ids.map((id) => ({ id: `Q-${id}`, question: id, expected_cores: [id] }));

const previous = {
  manifest: manifest(["technical-core"]),
  routing: routing(["technical-core"]),
  questions: questions(["technical-core"]),
};

const valid = verifyContractEvolution(previous, {
  manifest: manifest(["technical-core", "product-core"]),
  routing: routing(["technical-core", "product-core"]),
  questions: questions(["technical-core", "product-core"]),
});
assert.equal(valid.ok, true);
assert.deepEqual(valid.added_cores, ["product-core"]);

const staleQuestions = verifyContractEvolution(previous, {
  manifest: manifest(["technical-core"]),
  routing: { ...routing(["technical-core"]), routes: [{ patterns: ["api"], cores: ["technical-core"] }] },
  questions: previous.questions,
});
assert.equal(staleQuestions.ok, false);
assert.match(staleQuestions.errors.join("\n"), /routing changed without updating/);

const removedButReferenced = verifyContractEvolution(previous, {
  manifest: manifest([]),
  routing: previous.routing,
  questions: previous.questions,
});
assert.match(removedButReferenced.errors.join("\n"), /removed core remains/);

const bootstrap = verifyContractEvolution(
  { manifest: null, routing: null, questions: null },
  previous
);
assert.equal(bootstrap.ok, true);
assert.equal(bootstrap.bootstrap, true);

console.log("contract evolution rules ok");
