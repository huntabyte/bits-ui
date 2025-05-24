import { type ReadableBox, executeCallbacks } from "svelte-toolbelt";
import { Previous, watch } from "runed";
import { on } from "svelte/events";
import { useStateMachine } from "$lib/internal/use-state-machine.svelte.js";

export function usePresence(present: ReadableBox<boolean>, ref: ReadableBox<HTMLElement | null>) {
	let styles = $state({}) as CSSStyleDeclaration;
	let prevAnimationNameState = $state("none");
	const initialState = present.current ? "mounted" : "unmounted";
	const prevPresent = new Previous(() => present.current);

	const { state, dispatch } = useStateMachine(initialState, {
		mounted: {
			UNMOUNT: "unmounted",
			ANIMATION_OUT: "unmountSuspended",
		},
		unmountSuspended: {
			MOUNT: "mounted",
			ANIMATION_END: "unmounted",
		},
		unmounted: {
			MOUNT: "mounted",
		},
	});

	watch(
		() => present.current,
		() => {
			if (!ref.current) return;
			const hasPresentChanged = present.current !== prevPresent.current;
			if (!hasPresentChanged) return;

			const prevAnimationName = prevAnimationNameState;
			const currAnimationName = getAnimationName(ref.current);

			if (present.current) {
				dispatch("MOUNT");
			} else if (currAnimationName === "none" || styles.display === "none") {
				// If there is no exit animation or the element is hidden, animations won't run
				// so we unmount instantly
				dispatch("UNMOUNT");
			} else {
				/**
				 * When `present` changes to `false`, we check changes to animation-name to
				 * determine whether an animation has started. We chose this approach (reading
				 * computed styles) because there is no `animationrun` event and `animationstart`
				 * fires after `animation-delay` has expired which would be too late.
				 */
				const isAnimating = prevAnimationName !== currAnimationName;

				if (prevPresent && isAnimating) {
					dispatch("ANIMATION_OUT");
				} else {
					dispatch("UNMOUNT");
				}
			}
		}
	);

	/**
	 * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
	 * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
	 * make sure we only trigger ANIMATION_END for the currently active animation.
	 */

	function handleAnimationEnd(event: AnimationEvent) {
		if (!ref.current) return;
		const currAnimationName = getAnimationName(ref.current);
		const isCurrentAnimation =
			currAnimationName.includes(event.animationName) || currAnimationName === "none";

		if (event.target === ref.current && isCurrentAnimation) {
			dispatch("ANIMATION_END");
		}
	}

	function handleAnimationStart(event: AnimationEvent) {
		if (!ref.current) return;
		if (event.target === ref.current) {
			prevAnimationNameState = getAnimationName(ref.current);
		}
	}

	watch(
		() => state.current,
		() => {
			if (!ref.current) return;
			const currAnimationName = getAnimationName(ref.current);
			prevAnimationNameState = state.current === "mounted" ? currAnimationName : "none";
		}
	);

	watch(
		() => ref.current,
		() => {
			if (!ref.current) return;
			styles = getComputedStyle(ref.current);

			return executeCallbacks(
				on(ref.current, "animationstart", handleAnimationStart),
				on(ref.current, "animationcancel", handleAnimationEnd),
				on(ref.current, "animationend", handleAnimationEnd)
			);
		}
	);

	const isPresentDerived = $derived(["mounted", "unmountSuspended"].includes(state.current));

	return {
		get current() {
			return isPresentDerived;
		},
	};
}

function getAnimationName(node?: HTMLElement) {
	return node ? getComputedStyle(node).animationName || "none" : "none";
}
