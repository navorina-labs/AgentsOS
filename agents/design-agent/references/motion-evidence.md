# Motion runtime evidence protocol

Use this protocol when reviewing animation from recordings, timeline snapshots, Web Animations API inventories, computed styles, interaction traces, or performance samples.

## Begin with purpose

Name the task consequence before judging the movement. Motion should do at least one useful job:

- preserve spatial continuity;
- explain cause and effect;
- show hierarchy or state change;
- acknowledge input;
- direct attention without competing with the task.

Decorative motion is a preference, not a requirement. Routine or high-frequency actions should not repeatedly replay ceremonial entrance sequences. Continuous animation needs a stronger purpose than one-time feedback.

## Label the evidence surface

Use the narrowest supported label:

- **Visible:** a supplied still shows one rendered state.
- **Source-confirmed:** supplied CSS or JavaScript declares the behavior.
- **Timeline-observed:** a timestamped recording or deterministic timeline capture shows the sampled state.
- **Interaction-observed:** a recorded input is bound to the resulting DOM state.
- **Computed-style observed:** the browser reports the named transition or animation values under the recorded environment.
- **Performance-sampled:** the named tool reports metrics for the recorded window and device.
- **Unverified:** the claim needs a different trace, tool, environment, or duration.

A mid-animation still proves position at one sample. It does not prove smoothness, frame pacing, velocity continuity, compositor execution, absence of jank, or user comfort. A short metrics delta does not prove FPS, Core Web Vitals, GPU cost, thermal behavior, memory safety, or long-session stability.

## Trace the complete lifecycle

For every consequential transition, map:

| Phase | Required evidence | Contract question |
| --- | --- | --- |
| Rest | stable precondition and computed state | Is the state recognizable without motion? |
| Enter | trigger, start time, affected elements | Does movement explain where content came from? |
| Active | sampled timing, properties, geometry | Does it preserve task context and input access? |
| Interrupt | input during the active phase | Is new input accepted immediately? |
| Reverse or retarget | post-input trajectory and state | Does it continue from the current visual state? |
| Exit | removal timing and retained context | Does content remain until its exit can complete? |
| Cancel or fail | replacement, navigation, error, or teardown | Are timers, listeners, and stale state cleaned up? |

One successful mid-flight reversal proves that one tested path accepted the recorded input and changed direction. It does not prove velocity continuity, every interruption point, repeated toggles, race handling, or all input modalities.

## Inspect property choice

Inventory the exact animated properties and owning elements.

- Prefer `transform` and `opacity` when they express the intended movement.
- Treat `transition: all` as a defect: it makes the animated contract implicit and may animate later property changes accidentally.
- Animation of `top`, `right`, `bottom`, `left`, width, height, margin, or similar layout-affecting properties is a performance risk, not automatic proof of poor performance. Recommend a transform-based alternative when it preserves layout and hit-testing, then profile the target implementation.
- Check that hidden or exiting overlays do not block pointer or keyboard interaction.
- Check transform origin, clipping, stacking, and visual continuity at intermediate samples.

Do not claim compositor promotion or GPU acceleration from a property name alone. Verify with a suitable browser performance trace when that claim matters.

## Verify reduced motion

Bind the result to all of:

- exact preference emulation or target OS setting;
- a matching `matchMedia('(prefers-reduced-motion: reduce)')` result;
- computed transition and animation values;
- a timeline capture or recording of the adapted behavior.

Reduced motion does not require removing all feedback. Preserve state comprehension with immediate changes, fades, or other non-spatial alternatives appropriate to the task. Stop or replace nonessential continuous motion. Do not call reduced motion supported merely because the media query matches; CSS, JavaScript, canvas, video, and scroll-linked effects must be checked separately.

## Review time-dependent UI

Trace notices, toasts, undo controls, progress, delayed removal, and auto-advancing content from appearance to disappearance.

- An actionable message must remain usable long enough under the product’s approved policy; prefer user dismissal or a user-controllable timeout for consequential recovery.
- Errors and required decisions must not disappear before resolution.
- Record timer start, exit start, DOM removal, focus, hover/focus pause behavior, and the fate of the action.
- A local timer reproduction proves only that implementation and duration. It does not prove user attention, reading completion, or production network timing.

Avoid inventing a universal duration. If policy or research is absent, label a proposed value `Proposed default—validate`.

## Review repeated and continuous motion

For refresh, filtering, pagination, polling, and repeated saves:

- keep acknowledgment proportional to frequency;
- avoid replaying staggered entrance motion on routine updates unless it communicates meaningful order;
- preserve stable items and animate only meaningful changes;
- test rapid repetition and input during the update.

For loops, marquees, canvas, WebGL, timers, or `requestAnimationFrame`:

- verify pause or teardown when hidden, offscreen, inactive, reduced, or unmounted where applicable;
- use runtime instrumentation for timers, observers, listeners, RAF loops, and memory over a representative session;
- do not infer JavaScript loop behavior from a screenshot or CSS animation inventory.

## Use performance evidence honestly

Define the capture window, browser, device, build, interaction, and tool. Report observed measurements before interpretation.

- A Web Animations API inventory can show active animations, timing, target, and keyframes exposed by the browser.
- Computed styles can confirm declared transition properties and durations.
- A browser performance trace can support main-thread, rendering, and frame-timing analysis for the recorded window.
- A representative long-session profile is required for leak or degradation claims.

Treat heap, node, listener, or task-count deltas from a short sample as diagnostic leads only. Repeat, extend, and compare controlled runs before calling a regression. Never convert a still capture or short `Performance.getMetrics` sample into an FPS, Core Web Vitals, GPU, or memory conclusion.

## Build the acceptance matrix

| Contract | Environment and action | Observed evidence | Result | Still unverified |
| --- | --- | --- | --- | --- |
| Purpose | named task and transition | visible state change | Pass, fail, or inconclusive | user outcome |
| Lifecycle | enter, interrupt, reverse, exit | timeline and DOM state | contract comparison | untested timings/modalities |
| Properties | computed inventory and source | exact animated properties | risk or pass | target-device cost |
| Reduced motion | emulation, media assertion, styles | adapted timing and effects | contract comparison | target OS/device |
| Timed UI | appearance through removal | timer and action availability | contract comparison | attention/readability |
| Repetition | repeated routine action | replay, preservation, cleanup | contract comparison | long-session behavior |
| Performance | named profiler and window | recorded metrics | bounded finding | broader devices/sessions |

End with:

- **Promote:** required contracts pass in the tested scope and no task-critical motion defect is observed.
- **Revise:** an observed purpose, interruption, reduced-motion, timed-action, repeated-motion, or cleanup defect blocks promotion.
- **Inconclusive:** evidence cannot distinguish the relevant runtime behavior.

Keep the verdict scoped to the supplied build, browser, viewport, interactions, and capture duration.
