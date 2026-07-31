# Fluid interaction and Apple-platform craft

Use this module for gesture-driven interfaces, sheets, drawers, drag/reorder, swipe actions, spring motion, translucent surfaces, or Apple-platform work. Apply the target platform’s current Human Interface Guidelines first.

This is an adapted synthesis of Emil Kowalski’s MIT-licensed [Apple Design skill](https://github.com/emilkowalski/skills/blob/main/skills/apple-design/SKILL.md), which translates ideas from Apple design and WWDC material to the web. Copyright © 2026 Emil Kowalski; see the upstream [MIT License](https://github.com/emilkowalski/skills/blob/main/LICENSE). The synthesis also includes project-specific accessibility and specification requirements.

## Behavioral model

Design motion as behavior that responds to new input, not a clip that must finish.

- Give immediate visual feedback at pointer or touch down; commit activation on valid release.
- Track direct manipulation 1:1 and preserve the offset at which the element was grabbed.
- Capture the pointer so dragging remains continuous outside the original bounds.
- Use a small movement threshold before classifying a drag; allow tap cancellation and re-entry.
- Make a moving element interruptible and redirectable at any moment.
- Start a retargeted animation from the current presented value, never from a stale logical target.
- Preserve velocity through reversal and from gesture release into the settling animation.
- Project a momentum-driven resting point before choosing a snap target.
- Use progressive resistance beyond a boundary instead of a sudden frozen edge.
- Enter and exit through spatially coherent paths; anchor menus and popovers to their trigger.

## Choosing motion

- Prefer critically damped spring behavior for touched or interruptible objects when the implementation can preserve current value and velocity.
- Add overshoot only when momentum or a physical gesture provides a reason.
- Use short ease-out transitions for simple one-way entrances that users do not directly manipulate.
- Avoid animating every state. Motion must clarify causality, continuity, hierarchy, status, or manipulation.
- Never disable input merely because a transition is playing.

Do not copy upstream numeric spring values blindly. Spring APIs use different parameterizations, device input changes perceived motion, and performance affects the result. Prototype with the actual library and test on target hardware.

## Gesture specification

For every gesture-driven component, document:

1. initiation region and hit target;
2. competing gestures and intent threshold;
3. axis lock or free two-dimensional movement;
4. pointer capture and grab offset;
5. visual feedback during manipulation;
6. constraints and boundary resistance;
7. velocity sampling and release decision;
8. snap targets and cancellation behavior;
9. interruption and reversal behavior;
10. keyboard, switch-control, and non-gesture equivalent;
11. reduced-motion behavior;
12. test cases for slow drag, fast flick, interrupted settle, resize, and dropped frames.

For two-dimensional motion, consider independent axes so different velocities do not collapse into an artificial shared path.

## Materials and depth

Use translucency as a functional depth cue, not as an aesthetic default.

- Separate floating controls from scrolling content while maintaining legibility.
- Match material weight, blur, border, and shadow to surface size and hierarchy.
- Avoid stacking translucent foregrounds where contrast becomes unpredictable.
- Use a scrim for blocking modal focus; avoid a scrim for parallel non-blocking content when separation is sufficient.
- Provide solid or higher-opacity fallbacks for reduced transparency, increased contrast, unsupported blur, and busy backgrounds.
- Verify text and control contrast over every possible underlying state.

## Typography

- Tune size, weight, line height, and tracking as a system.
- Tighten display sizes only after visual verification; keep body tracking close to the font default.
- Enable optical sizing when the selected variable font supports it.
- Prefer system UI type for native familiarity unless brand or content requirements justify another family.
- Scale layout with user text settings; stress-test long localized strings and large accessibility sizes.

## Accessible alternatives

Reduced motion means preserving information and feedback without vestibular movement.

- Replace large translations, parallax, elastic overshoot, and zoom with static state changes or brief cross-fades.
- Keep essential status, focus, selection, progress, and completion feedback.
- Respect relevant platform settings and CSS media features such as `prefers-reduced-motion`, `prefers-contrast`, and available transparency preferences.
- Never make a gesture the only way to complete an action.
- Do not depend on haptics, sound, or animation alone; align multimodal feedback with the causal event.

## Review protocol

- Record interactions on target hardware.
- Inspect slow motion or individual frames for jumps, discontinuities, latency, and layout work.
- Test interruption at the beginning, midpoint, and near completion.
- Test both low-velocity precision and high-velocity flicks.
- Verify dropped-frame behavior and input responsiveness under load.
- Run keyboard and assistive-technology checks separately from visual motion review.
- Validate subjective “feel” with users performing the real task; frame rate alone is not proof of quality.
