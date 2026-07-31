# Visual inspection protocol

Use this protocol for screenshots, rendered HTML, recordings, or before/after interface comparisons.

## Establish evidence boundaries

Label every claim by its evidence surface:

- **Visible:** directly observable in the supplied render.
- **Source-confirmed:** verified in supplied HTML, CSS, or component code.
- **Interaction-observed:** visible in a recording or reproduced in a live build.
- **Unverified:** requires another viewport, state, assistive technology, measurement, or product evidence.

A screenshot can show hierarchy, density, grouping, alignment, clipping, and visible state. It cannot prove DOM order, keyboard behavior, semantics, contrast ratios, responsive behavior, animation quality, or user outcomes.

## Inspect interaction evidence

Treat a state as **Interaction-observed** only when a trace binds all of the following:

- exact source and harness hashes;
- browser and viewport metrics;
- the input action, including modality;
- post-action DOM assertions;
- the corresponding screenshot or recording.

Source code that declares a handler is **Source-confirmed**, not proof that the interaction executed. A screenshot with no action/assertion trace is only **Visible**.

Keep modality claims narrow:

- a pointer click proves that one pointer path reproduced;
- one `Tab` press proves only the resulting focus target and visible state;
- neither proves the complete keyboard order, touch behavior, screen-reader output, menu dismissal, focus restoration, or alternative input support.

Audit state transitions as a timeline:

| Transition | Trigger evidence | Visual change | DOM assertion | Preserved context | Still unverified |
| --- | --- | --- | --- | --- | --- |
| Default → next state | exact trace action | exact region | observed value | data, selection, focus, scroll, action availability | untested modalities and states |

For loading, error, success, selection, and disclosure states, check:

- a stable and recognizable action label;
- disabled or busy semantics and visually distinct availability;
- progress, error, and success feedback adjacent to the affected task;
- retry, cancellation, and duplicate-submission protection;
- focus location and recovery;
- selected data and dependent action state;
- synchronization of the same entity across summaries, rows, badges, and alternate responsive representations;
- preservation of unrelated context through the transition.

A passed DOM assertion proves only the asserted property. For example, an updated incident owner does not prove that the corresponding ticket row, activity feed, backend record, or assistive-technology announcement also updated.

Static state captures do not prove transition timing, animation quality, interruption, race handling, long-session behavior, or network recovery. Require a recording, performance trace, or targeted reproduction for those claims.

## Inspect accessibility and modality evidence

Bind keyboard claims to a complete recorded journey, not isolated focus screenshots. Record every `Tab`, `Shift+Tab`, activation, and dismissal key needed for the primary task; capture the active element before, during, and after asynchronous state changes. A sequence proves only the reproduced browser, DOM, state, and direction. It does not prove alternate paths, switch control, voice control, touch, or assistive-technology output.

Check focus as task context:

- compare DOM focus order with the visual reading order at each responsive layout;
- when correcting a DOM/visual-order mismatch, test the proposed invariant order at every supported layout; do not fix one viewport by reversing the mismatch at another;
- confirm the primary task completes without pointer input;
- record what happens when the focused control becomes natively `disabled`;
- after loading, error, retry, success, or dismissal, require focus to remain in or return to the affected task;
- for overlays, menus, and disclosures, record opening, internal traversal, `Escape`, and return to the trigger;
- distinguish a visible focus ring from logical focus placement.

Treat a browser accessibility-tree snapshot as **Semantics-observed**. It can support claims about the browser-exposed role, name, state, relationships, ignored nodes, and focus at that moment. It is not a VoiceOver, NVDA, JAWS, TalkBack, or spoken-output transcript. Dynamic announcements, reading order in a particular screen reader, verbosity, braille output, and platform combinations remain **Unverified** until tested with named assistive technology.

For forced colors and reduced motion, bind the media emulation, a matching `matchMedia` assertion, the exact viewport, and the resulting capture or computed-style inventory. Forced-colors emulation proves that emulated render only; inspect lost boundaries, indistinguishable availability, preserved focus indicators, and meaning that depended on authored color. A reduced-motion match proves that the preference was active, not that every CSS, JavaScript, canvas, video, or scroll-linked effect adapted safely.

Label zoom evidence precisely:

- **Actual browser zoom:** browser zoom level was changed and read back under the named browser.
- **Text enlargement:** only text size or root font size changed.
- **Reflow equivalent:** CSS viewport width was reduced to model the effective width at a scale factor.

Never call a reflow equivalent actual browser zoom. Record viewport width, height, device scale factor, document and internal overflow, visible clipping, and action reachability. Page-level `scrollWidth <= clientWidth` does not prove that every internal table, map, chart, code region, or nested scroller is reachable or compliant.

Build an accessibility evidence matrix:

| Contract | Reproduced input or environment | Observed state | Failure or pass | Still unverified |
| --- | --- | --- | --- | --- |
| Primary keyboard journey | exact key sequence | active element and task state | contract comparison | alternate paths and assistive technology |
| Semantics | browser AX snapshot | role, name, state, relationships | contract comparison | named screen-reader output |
| Dismissal and recovery | open, traverse, `Escape` | open state and focus target | contract comparison | other overlays and platforms |
| User preferences | exact media emulation | assertion and render/style inventory | contract comparison | target OS and hardware |
| Zoom or reflow | named method and metrics | overflow, clipping, reachability | contract comparison | any untested scale or nested region |

## Inspect in passes

1. View the whole artifact at thumbnail scale. Identify the first three attention targets and compare them with the primary task.
2. Map major regions, shared edges, grouping gaps, competing accents, and unused or overloaded space.
3. Inspect task-critical controls and content at full size for legibility, affordance, state distinction, and obstruction.
4. Compare repeated components for anatomy, spacing, action hierarchy, and semantic consistency.
5. Inspect the source only after the visual pass. Use it to confirm causes; do not let class names replace visual evidence.
6. Request or render missing widths and states before claiming adaptive or interaction quality.

## Rank findings

For each finding include:

- exact visible region or source locator;
- evidence label;
- impact on the primary task;
- violated hierarchy, layout, component, or state principle;
- concrete correction;
- confidence and required verification.

Prioritize task hierarchy, missing or obscured content, misleading actions, and repeated system defects before polish.

## Propose direction

Describe a revised composition through:

- region order and dominant task;
- alignment and grid relationships;
- grouping and progressive disclosure;
- action hierarchy;
- density and content priority;
- component or foundation corrections.

Do not prescribe arbitrary styling values when the product system is unknown. Mark visual values as proposed defaults requiring rendered comparison.

## Verify

At minimum, request or render:

- narrow, intermediate, and wide layouts;
- long and localized content;
- loading, empty, error, focus, selected, and overflow states where relevant;
- 200% zoom or text enlargement;
- reduced motion and keyboard behavior when interaction is available.

For before/after work, compare the same content, viewport, state, browser, and capture conditions. Do not claim improvement from mismatched renders.

## Compare before and after

Do not assume that the newer artifact is better. First confirm:

- matching viewport width and height, browser, zoom, device scale, state, and capture timing;
- equivalent task data, permissions, and loading conditions;
- disclosed changes to content, functionality, or information order.

When content or functionality intentionally changes, compare task coverage rather than raw element counts. Do not credit an after state for appearing simpler when it merely removes required information or actions.

Create an explicit file-to-condition map before inspecting a large pair set. Re-check the filename, width, and before/after identity before transferring any observation into the matrix; never reuse an observation from another width or an earlier capture.

Use a paired matrix:

| Width / task | Before evidence | After evidence | Outcome | Confidence |
| --- | --- | --- | --- | --- |
| Exact region and task | visible condition | visible condition | Improved, Regressed, Unchanged, or Unverified | High, medium, or low |

Require all four outcome classes to be considered. Omit a class only after explicitly checking for it.

For every claimed improvement:

- name the exact before failure;
- show the corresponding after condition at the same width;
- identify the task consequence without inventing user results;
- confirm that required content and actions remain available;
- state what source inspection confirms and what interaction testing still must verify.

For a clipping or completeness claim, count fully bounded repeated items and name the viewport edge or internal container boundary that cuts the item. Crowded wrapping is not clipping; an item can be complete yet unusably compressed.

Do not combine regions in one clipping or overflow statement unless every named region has the same observed boundary outcome. When metrics overflow but incident cards merely compress, record them as separate observations and pair each with its own after condition.

Rank regressions and remaining defects before polish. A redesigned artifact is not ready to promote when a task-critical regression appears at any supported viewport, even if the aggregate composition improves.

End with a verdict:

- **Promote:** no observed task-critical regression, claimed improvements are paired and supported, and remaining unknowns have verification steps.
- **Revise:** the direction improves but an observed regression or material remaining defect blocks promotion.
- **Inconclusive:** capture conditions or task data are not sufficiently matched.

## Compare matched viewports

Before comparing widths, confirm that content, application state, browser, viewport height, zoom, device scale, and capture timing are held constant. If any condition differs, label the comparison as directional rather than controlled.

Build a compact viewport matrix:

| Region or task | Wide | Intermediate | Narrow | Evidence |
| --- | --- | --- | --- | --- |
| What persists, reflows, clips, disappears, or changes order | observation | observation | observation | Visible, Source-confirmed, or Unverified |

Inspect both viewport edges before calling a region complete. A region is complete only when its full visible bounds and task-critical content are inside the capture; a partially cropped chart, panel, control group, or row is already a transition failure even when its leading edge remains visible.

Separate three classes of finding:

1. **Persistent:** the same hierarchy or composition problem appears at every supplied width.
2. **Transition:** a specific width range introduces wrapping, overlap, clipping, loss of context, or an order change.
3. **Unverified:** behavior between supplied widths, scrolling reachability, DOM order, focus order, zoom, localization, or dynamic states still requires reproduction.

Infer a breakpoint only as an observed interval: the layout works at the larger supplied width and fails at the next smaller supplied width. Do not claim the exact pixel where it breaks without narrowing and reproducing that interval.

Before finalizing, cross-check the matrix, ranked findings, and breakpoint intervals. The same width cannot be described as complete in one section and cropped, missing, or unresolved in another unless the statements refer to explicitly different regions.

For each high-impact transition, state:

- last supplied width where the region remains usable;
- first supplied width where the failure is visible;
- content or control affected;
- whether the source confirms the likely cause;
- the smallest responsive contract that would prevent recurrence;
- the additional render or interaction check needed to locate and verify the correction.

Do not equate horizontal overflow with inaccessible content unless reachability was tested. Do not call a layout responsive merely because nothing visibly overlaps.
