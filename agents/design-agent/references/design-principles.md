# Design review rubric

Use this rubric to generate and review work. Apply platform-specific guidance where it conflicts with generic guidance.

## 1. Purpose and task

- Name the primary user, context, job, and successful outcome.
- Make the screen’s primary purpose understandable without relying on decoration.
- Keep frequent and high-value actions direct; add friction to consequential or irreversible actions.
- Preserve user work, location, and system status.

## 2. Information architecture

- Group by user mental model and task sequence, not backend ownership.
- Use clear, specific labels in the user’s language.
- Keep navigation position, naming, and behavior consistent.
- Support recognition over recall. Expose necessary context at the decision point.

## 3. Hierarchy

- Establish a clear reading order and a dominant focal point.
- Use no more visual emphasis than the importance warrants.
- Make primary, secondary, and tertiary actions visually distinguishable.
- Reduce competing accents; color is not a substitute for hierarchy.

## 4. Composition

- Align related edges and repeat meaningful spatial relationships.
- Use proximity for grouping before adding borders, backgrounds, or shadows.
- Choose a spacing base and a limited scale; allow optical adjustment where geometry looks wrong.
- Match density to task frequency, content volume, and device constraints.
- Keep line lengths readable and prevent controls from crowding content.
- Use asymmetry only when it reinforces priority or movement.

## 5. Typography and content

- Use a small, purposeful type scale with defined roles.
- Maintain readable size, line height, contrast, and measure.
- Write labels that predict outcomes. Prefer verbs for actions.
- Put recovery instructions next to the problem.
- Design with realistic long, short, empty, localized, and user-generated content.

## 6. Color, imagery, and motion

- Define semantic roles such as surface, text, border, accent, success, warning, and danger.
- Never rely on color alone to communicate state.
- Use imagery to communicate content, context, or brand—not to fill space.
- Use motion to explain continuity, hierarchy, causality, or status.
- Make gesture-driven motion continuous, interruptible, and reversible from its current visible state.
- Preserve spatial origin and direction: connect overlays to their trigger and return dismissing elements along a coherent path.
- Carry input velocity into settling motion when momentum is part of the interaction; avoid decorative bounce without a physical cause.
- Respect reduced-motion preferences and avoid blocking task completion with animation.

## 7. Interaction and state

- Make affordances and hit targets clear.
- Provide timely feedback for every action.
- Respond visually at press start while committing the action at successful release; support cancellation when the pointer or touch moves away.
- During drag, preserve the grab offset and track the pointer continuously after a small intent threshold.
- Specify default, hover, focus-visible, pressed, selected, disabled, loading, success, and error states where applicable.
- Keep focus order logical and keyboard interaction complete.
- Prefer native semantics and controls; use established ARIA patterns for custom widgets.
- Make destructive actions recognizable, confirm when recovery is difficult, and offer undo when practical.

## 8. Responsive and adaptive behavior

- Start from content constraints and define when layout relationships fail.
- Preserve priority and task continuity across widths, text scaling, orientation, input method, and platform.
- Reflow before truncating. Avoid hiding essential actions solely because space shrinks.
- Account for safe areas, virtual keyboards, zoom, and dynamic type.

## 9. Accessibility baseline

- Target WCAG 2.2 AA for web unless the project requires another standard.
- Verify text and non-text contrast with a tool; do not judge by eye.
- Support keyboard-only use, visible focus, semantic structure, accessible names, error identification, and status announcements.
- Provide alternatives for visual, auditory, motion, and time-dependent information.
- Test zoom/reflow, text resizing, high contrast or forced colors, reduced motion, and representative assistive technology.
- Treat automated checks as partial coverage, not proof of conformance.

## 10. System quality

- Reuse semantic tokens and documented components.
- Make component variants solve real recurring needs.
- Separate component API from one screen’s content.
- Document anatomy, behavior, states, content limits, accessibility, and examples.
- Reject “consistency” when it preserves a known usability defect; fix the system instead.

## Evidence levels

Use the strongest available evidence:

1. observed user behavior and product analytics;
2. current normative or platform requirements;
3. tested project patterns and design-system constraints;
4. established usability principles;
5. analogous products and curated inspiration;
6. personal taste.

Never present levels 5–6 as if they were levels 1–2.
