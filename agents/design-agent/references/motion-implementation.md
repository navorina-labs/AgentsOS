# Motion implementation

Use this module when implementing or reviewing web animation with [Motion](https://motion.dev/). Confirm the project runtime, installed package version, framework, rendering model, browser targets, and existing animation conventions before writing code. The official documentation changes frequently; do not infer current APIs from older Framer Motion examples.

## Contents

- [Choose the smallest suitable tool](#choose-the-smallest-suitable-tool)
- [Map behavior to Motion APIs](#map-behavior-to-motion-apis)
- [Choose a transition model](#choose-a-transition-model)
- [Implement gestures](#implement-gestures)
- [Implement layout and presence](#implement-layout-and-presence)
- [Use Motion Values](#use-motion-values)
- [Accessibility](#accessibility)
- [Performance and bundle size](#performance-and-bundle-size)
- [Review checklist](#review-checklist)

## Choose the smallest suitable tool

1. Use no animation when motion does not clarify feedback, continuity, causality, hierarchy, status, or direct manipulation.
2. Use CSS transitions for simple, self-contained effects such as color, opacity, or a small hover response.
3. Use Motion when animation must follow application state, coordinate multiple elements, support enter/exit, remain interruptible, track gestures, animate layout, derive values continuously, or link to scroll.
4. Use the runtime-specific API:
   - React: import from `motion/react`.
   - JavaScript: use the core `motion` package and `animate`.
   - Vue: use the current Vue documentation rather than translating React APIs mechanically.
5. Avoid adding Motion solely for one trivial transition. Measure the dependency and maintenance cost.

## Map behavior to Motion APIs

| Need | Preferred starting point |
|---|---|
| React state-driven animation | `motion` component with `animate` |
| Hover, press, focus | gesture props such as `whileHover`, `whileTap`, `whileFocus` |
| Drag/direct manipulation | `drag`, constraints, drag events, Motion Values |
| Element entering or leaving | `initial`, `animate`, `AnimatePresence`, `exit` |
| Reflowing size or position | `layout` |
| Shared element continuity | stable `layoutId`, namespaced with `LayoutGroup` when repeated |
| Sequenced imperative animation | `useAnimate` or JavaScript `animate` sequence |
| Continuous derived visual state | `useMotionValue`, `useTransform`, `useSpring`, `useVelocity` |
| Scroll-triggered reveal | `whileInView` or `useInView` |
| Scroll-linked motion | `useScroll` plus Motion Values |
| Site-wide defaults and reduced motion | `MotionConfig` |

Start declarative in React. Reach for imperative timelines when the sequence cannot be expressed clearly as component state and variants.

## Choose a transition model

- Use a tween when duration and easing are the intended behavior: fades, color changes, non-interactive entrances, or precisely timed sequences.
- Use a physics spring when continuity and incoming velocity matter: drag release, interruption, retargeting, or direct manipulation.
- Use a duration/bounce spring when designers need predictable visual timing and gesture velocity is irrelevant.
- Use inertia for deceleration from an existing velocity, such as momentum after drag.
- Do not combine `bounce`/duration tuning with `stiffness`, `damping`, or `mass` and assume both sets apply; physics options override time options.
- Use `visualDuration` when a spring must visually coordinate with time-based transitions.
- Tune on target hardware and input methods. Treat copied spring values as hypotheses.
- Reserve overshoot for motion with a physical cause; default UI state changes should usually settle without conspicuous bounce.

## Implement gestures

- Preserve semantic controls and keyboard activation; Motion gesture props do not replace HTML semantics.
- Restrict drag to the intended axis and bounds.
- Decide deliberately whether release momentum is appropriate; disable `dragMomentum` for precise placement.
- Use `dragElastic` only when boundary resistance communicates constraints.
- Provide visual drag feedback without changing layout in a way that moves the pointer target.
- Use direction locking when diagonal ambiguity would harm the task.
- Read `onDragStart`, `onDrag`, and `onDragEnd` data for offsets and velocity instead of maintaining redundant pointer state.
- Provide a non-drag alternative for reorder, dismissal, sliders, and carousels.
- Test touch scrolling conflicts and set `touch-action` according to the intended axis.

## Implement layout and presence

- Add `layout` when a React render changes an element’s size or position.
- Change layout through state, `className`, or `style`; let `layout` perform the transition.
- Use `layout="position"` when scaling would visibly distort text or media.
- Add `layout` to affected children when counter-scaling is required.
- Set `borderRadius` and `boxShadow` through styles Motion can read when scale correction matters.
- Use stable, unique `layoutId` values. Namespace reusable groups with `LayoutGroup id`.
- Use `AnimatePresence` around direct children that leave the React tree and give repeated children stable keys.
- Select presence sequencing intentionally:
  - `sync`: enter and exit together;
  - `wait`: one child exits before its replacement enters;
  - `popLayout`: remove the exiting element from flow so siblings can reflow.
- Check focus when overlays exit. Visual presence must not trap focus or leave hidden interactive content active.
- Prefer interruptible actual-element layout animation for interactive UI; evaluate View Transitions separately for page-level cases.

## Use Motion Values

- Use Motion Values for rapidly changing visual state that should update the DOM without React re-rendering every frame.
- Derive secondary values with `useTransform` instead of duplicating event state.
- Smooth noisy or abrupt input with `useSpring` only when lag does not weaken direct manipulation.
- Read velocity from numeric Motion Values when release behavior depends on movement.
- Subscribe with `useMotionValueEvent`; clean up manual subscriptions.
- Keep business state in React or the application store. Motion Values are for visual and interaction state, not the canonical product model.

## Accessibility

- Wrap the application or animated region with `MotionConfig reducedMotion="user"` unless project policy provides an equivalent.
- Use `useReducedMotion` for bespoke substitutions beyond Motion props.
- Replace large translation, scale, parallax, and layout movement with opacity, color, or immediate state changes.
- Preserve educational transitions and feedback when they can be delivered without vestibular motion.
- Disable or pause autoplaying background video and nonessential continuous motion for reduced-motion users.
- Ensure content order, meaning, focus, and task completion do not depend on an animation playing.
- Test the `"always"` reduced-motion mode as an explicit QA state.

## Performance and bundle size

- Prioritize animating `transform` and `opacity`; test `filter`, `clip-path`, colors, SVG, and layout-affecting properties across target browsers and lower-powered devices.
- Remember that independent transforms may be implemented with CSS variables and are not guaranteed to be compositor-accelerated. Use a complete `transform` string when acceleration is critical and verify it in browser tooling.
- Avoid reading layout and writing styles repeatedly inside animation-frame callbacks.
- Use Motion Values for per-frame updates rather than React state.
- Prefer the mini `animate` API when native Web Animations API capabilities are enough.
- For React, evaluate `m` plus `LazyMotion`: load `domAnimation` for animation/presence/basic gestures, and `domMax` only when drag or layout animation is needed.
- Use `LazyMotion strict` to catch accidental full `motion` imports when bundle reduction is a requirement.
- Measure the production bundle and real interaction traces; do not rely only on library marketing sizes or desktop frame rate.
- Treat hardware acceleration as progressive enhancement. Correct behavior and accessible fallbacks must remain without it.

## Review checklist

- The motion has a stated user-facing purpose.
- CSS was considered before adding a library-driven animation.
- The chosen API matches the project runtime and installed Motion version.
- Enter, active, interrupt, reverse, exit, and cancellation states behave coherently.
- Spring type matches whether incoming velocity matters.
- Drag has axis, constraints, momentum, touch-scroll, and non-gesture behavior defined.
- Layout/shared-element IDs are stable and correctly scoped.
- Exit animation does not break focus, semantics, or interaction availability.
- Reduced-motion behavior is implemented and tested.
- Per-frame updates avoid React renders.
- Animated properties and bundle impact are measured on target devices.
- Automated performance results are paired with visual, input-latency, and accessibility review.
