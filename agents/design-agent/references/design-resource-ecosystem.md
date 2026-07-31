# Design resource ecosystem

Use this catalog for design research, pattern comparison, agent workflow improvement, component discovery, Figma automation, AI-product UX, fintech UI, or tool selection. It is a curated subset of the Useful Links collection in `alexyoung33rd/public/content/blog_posts.py`, reviewed on 2026-07-28.

Do not load or cite the full collection by default. Open the current primary source for each selected resource before relying on features, APIs, licenses, prices, availability, or quantitative claims.

## Contents

- [Research workflow](#research-workflow)
- [Agent methods and reusable skills](#agent-methods-and-reusable-skills)
- [Pattern and component evidence](#pattern-and-component-evidence)
- [Agent-readable design systems](#agent-readable-design-systems)
- [Production design systems](#production-design-systems)
- [Figma and design operations](#figma-and-design-operations)
- [AI-product and fintech references](#ai-product-and-fintech-references)
- [Selection rules](#selection-rules)

## Research workflow

1. Frame the exact decision: user flow, component, content, domain convention, visual direction, implementation method, or tool.
2. Choose no more than three source classes:
   - standards/platform documentation;
   - production design systems;
   - real product screens and flows;
   - implementation/component references;
   - expert methods or agent skills;
   - visual inspiration.
3. Inspect multiple examples when claiming a pattern. One screenshot is an anecdote.
4. Record source, exact page or flow, platform, date, and what was observed.
5. Separate:
   - fact: directly supported by the source;
   - pattern: repeated across evidence;
   - inference: interpretation from the evidence;
   - recommendation: proposed for the current constraints.
6. Synthesize principles and relationships. Do not copy another brand’s visual identity, proprietary assets, or distinctive composition.
7. Validate the recommendation against the product’s users, content, design system, accessibility target, and technical constraints.

## Agent methods and reusable skills

- [MengTo/Skills](https://github.com/MengTo/Skills) — workflows for turning videos, HTML, screenshots, and inspiration into reusable prompts and verified implementation procedures. Prefer its principle that prompts are versioned assets, specs beat vague direction, and visual references need captured evidence.
- [Jakub Krehel’s interface skills](https://github.com/jakubkrehel/skills) — focused modules for UI craft, layout, typography, color, accessibility, and interface writing. When these companion skills are installed, use the narrowest applicable module rather than merging every rule into the main skill.
- [Emil Kowalski’s design-engineering skills](https://github.com/emilkowalski/skills) — motion and interface-craft guidance; see this skill’s dedicated fluid-interaction module.
- [LottieFiles motion-design-skill](https://github.com/LottieFiles/motion-design-skill) — timing, easing, choreography, and animation principles adapted to interface motion. Use for conceptual motion direction; verify implementation details against the actual runtime.
- [ux-audit-skill](https://github.com/EliaAlberti/ux-audit-skill) — screenshot-based heuristic audit structure and severity framing. Use as a comparison rubric, not proof of user impact.
- [Impeccable](https://github.com/pbakaus/impeccable) and [Taste Skill](https://github.com/Leonxlnx/taste-skill) — anti-slop rules and UI critique commands. Mine recurring failure modes, but label aesthetic opinions and avoid importing a house style as universal truth.
- [Modern Web Guidance](https://developer.chrome.com/docs/modern-web-guidance) — official Chrome guidance designed for both developers and coding agents. Prefer it over community snippets for modern platform capability and compatibility decisions.

Keep external skills conditional and independently attributable. Do not concatenate several skills into an unreviewed mega-prompt.

## Pattern and component evidence

- [Mobbin](https://mobbin.com/) — searchable real mobile and web screens and flows. Use for cross-product flow comparison, not isolated pixel inspiration.
- [aiverse](https://www.aiverse.design/browse) — catalog of AI-product UX patterns and observed interface behaviors. Verify examples in the original products because AI interfaces evolve quickly.
- [The Component Gallery](https://component.gallery/components/) — compare how public design systems specify the same component across systems.
- [Interfaces](https://interfaces.dev/) — interface and interaction examples for design engineers.
- [UI Patterns](https://ui-patterns.com/) — established interaction-pattern catalog; validate age and platform relevance.
- [Screen Gallery](https://scrn.gallery/apps) and [UX Snaps](https://www.uxsnaps.com/) — additional product-screen evidence when Mobbin coverage is insufficient.
- [Transitions.dev](https://transitions.dev/) — implementation-oriented transition references. Apply the project’s motion principles and reduced-motion behavior rather than copying effects wholesale.

For pattern studies, capture the complete task flow, states, content, platform, and input method. A visual resemblance without behavioral context is weak evidence.

## Agent-readable design systems

- [Google design.md](https://github.com/google-labs-code/design.md) — structured visual-identity specification and token export for coding agents.
- [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) — discovery catalog of agent-readable design descriptions derived from recognizable brands. Treat files as references requiring provenance and review, not turnkey permission to imitate a brand.
- [designmd.supply](https://github.com/context-dot-dev/designmd-supply) — tooling that generates DESIGN.md-style descriptions from public sites. Audit generated tokens, semantics, component claims, and originality before use.
- [Figma Simple Design System](https://github.com/figma/sds) — reference connection between Figma variables/components and React implementation.
- [Open Design](https://github.com/nexu-io/open-design) — local-first agent design environment and an example of code-backed canvas workflows.

Prefer a project-authored design specification over an automatically extracted one. Generated design files are hypotheses until checked against source artifacts and implementation.

## Production design systems

- [Workday Canvas](https://canvas.workday.com/) — enterprise foundations, components, accessibility, and governance for dense B2B workflows.
- [Visa Product Design System](https://design.visa.com/) — cross-framework fintech components, tokens, accessibility, and data visualization.
- [Nordhealth](https://nordhealth.design/) — healthcare tokens, web components, Figma resources, and contribution levels.
- [Wise Design](https://wise.design/direction) — public product language spanning color, typography, motion, illustration, and tone for cross-border money products.
- [eBay Playbook](https://playbook.ebay.com/) — brand and product-system guidance at marketplace scale.
- [ServiceNow](https://www.figma.com/@servicenow), [Oracle](https://www.figma.com/@oracle), and [Goldman Sachs](https://www.figma.com/@gs) Figma profiles — enterprise UI kits and domain component examples.
- [AG Grid Design System](https://www.figma.com/community/file/1360600846643230092) — data-grid anatomy, states, themes, filters, and tool panels.
- [OpenBridge](https://www.openbridge.no/design) — domain-specific industrial and maritime interface patterns.

Use production systems to compare component anatomy, state coverage, domain language, and governance. Do not mix components from unrelated systems into an incoherent UI.

## Figma and design operations

- [Talk to Figma MCP](https://github.com/grab/cursor-talk-to-figma-mcp) — agent-to-Figma workflow for reading and modifying designs. Check current security, transport, and plugin setup before use.
- [figma-cli](https://github.com/silships/figma-cli) — terminal and CI automation for Figma operations.
- [Organising Design Systems](https://www.figma.com/community/file/1042406919054488163) — documentation and governance template.
- [SAP Designing for Performance](https://www.figma.com/community/file/1458735589919606632) — annotations for loading and perceived-performance behavior.
- [Free Breakpoints](https://www.figma.com/community/plugin/1363571066131304729/free-breakpoints) — responsive-state exploration inside a resizable design frame.
- [GlobalLink Strings](https://www.figma.com/community/plugin/835161939850128207) — localization workflow and string stress testing.

Figma plugins are implementation tools, not design evidence. Confirm permissions, maintenance, data handling, and export semantics before recommending them.

## AI-product and fintech references

- [aiverse](https://www.aiverse.design/browse) — observed AI-product behaviors, suitable for comparing disclosure, streaming, tool use, corrections, and agent status.
- [Intuit Content Design](https://contentdesign.intuit.com/) — product voice, accessibility, terminology, UI patterns, and AI-writing guidance for financial and SaaS products.
- [Wise Design](https://wise.design/direction) — global money-product language and cross-border context.
- [Visa Product Design System](https://design.visa.com/) — payment and fintech component vocabulary.
- [Workday Canvas](https://canvas.workday.com/) — dense permissions, data, and enterprise workflow patterns.
- [AG Grid Design System](https://www.figma.com/community/file/1360600846643230092) — high-density table and filtering reference.

For AI interfaces, cover uncertainty, provenance, progress, tool actions, user control, interruption, retry, editing, privacy, safety, and recovery. For financial interfaces, cover currency and locale, precision, fees, settlement status, reversibility, permissions, fraud/risk states, and regulatory content.

## Selection rules

- Standards and official platform docs establish requirements.
- Product research and analytics establish user behavior.
- Production design systems provide tested examples within their domain.
- Screen libraries support pattern discovery, not validation.
- Component galleries support comparison, not automatic library choice.
- Agent skills provide workflows and critique lenses, not unquestionable design laws.
- Visual inspiration provides direction only after task, content, accessibility, and system constraints are known.
- Prefer one coherent source system over a collage of fashionable components.
- Recheck every external source when the recommendation can cause implementation cost, licensing risk, or a major design decision.
