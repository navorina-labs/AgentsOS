# Presentation composition

Use this module for slide decks, paged narratives, pitches, reports, launch stories, and responsive web presentations.

The workflow is adapted from the MIT-licensed [StackBlitz Bolt Slides](https://github.com/stackblitz/bolt-slides) project and its bundled authoring skill. Copyright © 2026 StackBlitz; see the upstream [MIT License](https://github.com/stackblitz/bolt-slides/blob/main/LICENSE). This module extracts transferable composition principles rather than Bolt-specific implementation rules.

## Contents

- [Separate system from story](#separate-system-from-story)
- [Ground the narrative](#ground-the-narrative)
- [One beat at a time](#one-beat-at-a-time)
- [Choose layout from content](#choose-layout-from-content)
- [Balance and rhythm](#balance-and-rhythm)
- [Responsive presentations](#responsive-presentations)
- [Data and visuals](#data-and-visuals)
- [Motion and interaction](#motion-and-interaction)
- [Presentation acceptance checks](#presentation-acceptance-checks)

## Separate system from story

- Preserve stable presentation infrastructure, navigation, accessibility, and reusable components.
- Author the narrative, copy, evidence, visuals, and theme from the actual request.
- Do not reskin a demonstration deck or inherit its sequence merely because components already exist.
- Change established tokens before introducing one-off colors, radii, shadows, or typography.
- Extend the component system only when the content requires a pattern the system cannot express.

## Ground the narrative

1. Identify the audience, setting, decision, speaking time, and desired next action.
2. Select an arc appropriate to the material: pitch, launch, teaching, report, proposal, or review.
3. Outline claims and evidence before selecting layouts.
4. Open with context and a clear promise; close with the requested decision or action.
5. Use real names, facts, quotes, and numbers. Mark unknowns; never fabricate proof.
6. Put source attribution on or near data, quotes, and externally derived claims.

## One beat at a time

- Give each slide one dominant idea or decision.
- Use short, declarative headlines that express the point rather than label the topic.
- Keep body copy concise enough to support the speaker instead of becoming a document.
- Reveal content progressively only when order, suspense, comparison, or explanation benefits.
- Add speaker notes for context that should be said but not placed on the visual surface.
- Make every intermediate reveal state coherent; allow backward navigation through builds.

## Choose layout from content

Every specialized layout needs an entry condition:

| Content relationship | Suitable composition |
|---|---|
| Claim plus supporting visual | Split or asymmetrical text/media |
| One defensible figure | Big-number focal slide |
| Genuine change | Before/after or contrast |
| Ordered method | Steps or timeline |
| Comparable options | Comparison matrix or table |
| Related heterogeneous evidence | Bento or editorial grid |
| Geographic evidence | Map or globe with real locations |
| Product interaction | Browser/device frame or working prototype |
| Chapter transition | Section divider in a sufficiently long deck |

Do not add pricing, team, chat, maps, charts, or timelines merely to showcase the template. If the layout’s value cannot be explained in one sentence, use a simpler composition.

## Balance and rhythm

- Center a standalone text statement or single structured block.
- Use left alignment or asymmetry when a side visual, data region, or opposing mass balances it.
- Avoid leaving a small left-anchored block floating in a large empty canvas.
- Alternate scale, density, alignment, and visual form to create rhythm without making adjacent slides unrelated.
- Prefer full-bleed imagery, splits, editorial grids, and layered compositions over repeated rows of identical cards.
- Use one accent intentionally; multiple competing accents destroy hierarchy.
- Include deliberate quiet slides so every slide does not compete for maximum drama.

## Responsive presentations

Treat each slide as a bounded responsive viewport, not a scaled fixed canvas.

- Use fluid type and spacing with `clamp()`, relative units, and sensible maximum widths.
- Use wrapping or auto-fit grids rather than fixed column counts.
- Reflow split layouts, steps, pricing, and comparisons at narrow widths.
- Avoid fixed content heights. Reserve aspect-ratio boxes for controlled media.
- Do not rely on scrolling inside a paged slide; overflow generally means lost content.
- Test long headlines, localized copy, wide tables, narrow phones, projectors, and browser zoom.
- Keep thumbnails or overview representations faithful to the full slide state.

## Data and visuals

- Choose the visual that makes the relationship easiest to perceive.
- Use charts only for real quantitative relationships; use tabular numerals for values.
- Keep tables small enough to scan from presentation distance; split dense evidence across slides.
- Build product visuals from the actual product or plausible task data, not a generic dashboard.
- Keep generated imagery stylistically consistent and free of baked-in text.
- Check contrast under scrims and across every possible responsive crop.

## Motion and interaction

- Limit each slide to one or two meaningful motion ideas.
- Use entrances to establish reading order, not to animate everything.
- Use click-builds for intentional narrative beats and automatic reveals for lightweight orientation.
- Make interactive examples operable with keyboard and pointer.
- Respect reduced motion and preserve information when transitions are removed.
- Prefer live product behavior when it materially improves understanding; do not use interactivity as decoration.

## Presentation acceptance checks

- The narrative serves the audience and ends in a clear action.
- Every slide advances one claim, question, proof point, or transition.
- Every specialized layout satisfies an explicit content condition.
- Claims, numbers, and quotes are real and attributed.
- Text remains readable at presentation distance.
- Wide and narrow views have no clipping, accidental scrolling, or orphaned elements.
- Alignment is visually balanced, including slides with no side visual.
- Keyboard navigation, focus, overlays, and escape behavior work.
- Reveal order works forward and backward.
- Motion remains restrained and reduced-motion alternatives preserve meaning.
- The deck contains no starter copy, placeholder brands, lorem ipsum, or irrelevant demo components.
