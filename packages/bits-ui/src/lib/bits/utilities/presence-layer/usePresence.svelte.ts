import { type ReadableBox, type WritableBox, box } from "svelte-toolbelt";
import { afterTick, useStateMachine, watch } from "$lib/internal/index.js";

export function usePresence(present: ReadableBox<boolean>, id: ReadableBox<string>) {
	const styles = box({}) as unknown as WritableBox<CSSStyleDeclaration>;
	const prevAnimationNameState = box("none");
	const initialState = present.value ? "mounted" : "unmounted";
	let node = $state<HTMLElement | null>(null);

	$effect.pre(() => {
		if (!id.value) return;
		if (!present.value) return;

		afterTick(() => {
			node = document.getElementById(id.value);
		});
	});

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

	watch(present, (currPresent, prevPresent) => {
		if (!node) {
			node = document.getElementById(id.value);
		}
		if (!node) return;
		const hasPresentChanged = currPresent !== prevPresent;
		if (!hasPresentChanged) return;

		const prevAnimationName = prevAnimationNameState.value;
		const currAnimationName = getAnimationName(node);

		if (currPresent) {
			dispatch("MOUNT");
		} else if (currAnimationName === "none" || styles.value.display === "none") {
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
	});

	/**
	 * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
	 * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
	 * make sure we only trigger ANIMATION_END for the currently active animation.
	 */

	function handleAnimationEnd(event: AnimationEvent) {
		if (!node) {
			node = document.getElementById(id.value);
		}
		if (!node) return;
		const currAnimationName = getAnimationName(node);
		const isCurrentAnimation =
			currAnimationName.includes(event.animationName) || currAnimationName === "none";

		if (event.target === node && isCurrentAnimation) {
			dispatch("ANIMATION_END");
		}
	}

	function handleAnimationStart(event: AnimationEvent) {
		if (!node) {
			node = document.getElementById(id.value);
		}
		if (!node) return;
		if (event.target === node) {
			prevAnimationNameState.value = getAnimationName(node);
		}
	}

	watch(state, () => {
		if (!node) {
			node = document.getElementById(id.value);
		}
		if (!node) return;
		const currAnimationName = getAnimationName(node);
		prevAnimationNameState.value = state.value === "mounted" ? currAnimationName : "none";
	});

	$effect(() => {
		if (!node) return;

		styles.value = getComputedStyle(node);
		node.addEventListener("animationstart", handleAnimationStart);
		node.addEventListener("animationcancel", handleAnimationEnd);
		node.addEventListener("animationend", handleAnimationEnd);

		return () => {
			if (!node) return;
			node.removeEventListener("animationstart", handleAnimationStart);
			node.removeEventListener("animationcancel", handleAnimationEnd);
			node.removeEventListener("animationend", handleAnimationEnd);
		};
	});

	const isPresentDerived = $derived(["mounted", "unmountSuspended"].includes(state.value));

	return {
		get value() {
			return isPresentDerived;
		},
	};
}

function getAnimationName(node?: HTMLElement) {
	return node ? getComputedStyle(node).animationName || "none" : "none";
}
