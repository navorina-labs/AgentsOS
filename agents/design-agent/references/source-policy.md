# Knowledge and source policy

## Allowed inputs

- User-authored material.
- Public-domain or permissively licensed material within its license.
- Books, PDFs, articles, and course material the user owns or is authorized to process.
- Short user-provided excerpts used for analysis where legally permitted.
- Public standards and official platform documentation subject to their terms.

Do not download or bundle unauthorized copies of copyrighted books. Do not commit private source text or generated chunks to a public repository. Keep title, author, edition, date, license/permission, source location, and ingestion date with every source.

## Retrieval over mythology

“Learning” means the agent can retrieve attributed passages, apply them to a task, and be evaluated. It does not mean every sentence becomes a universal design law.

- Separate normative standards, project requirements, research findings, heuristics, and inspiration.
- Prefer current primary sources for standards and platform behavior.
- Record edition and publication date because UI guidance ages.
- Preserve disagreements. Resolve them using platform, audience, task, and evidence.
- Quote minimally; synthesize and cite locators.

## Evaluation loop

Maintain a versioned set of representative tasks:

- new product specification;
- redesign under an existing design system;
- visual hierarchy/composition critique;
- dense data UI;
- mobile task flow;
- accessibility and keyboard audit;
- responsive and localization stress test.

Score each output on task clarity, hierarchy, composition, state completeness, accessibility, system coherence, feasibility, evidence quality, and unsupported claims. Keep a held-out set that is not used to edit prompts or examples.

## Fine-tuning gate

Use fine-tuning only when:

- the target behavior cannot be reliably achieved with instructions and retrieval;
- there is a sufficiently large, licensed, consistently reviewed example set;
- the desired output format and quality bar are stable;
- privacy and retention requirements are satisfied;
- baseline and held-out evaluations exist.

Fine-tuning does not replace fresh standards, project context, retrieval, or human critique.
