import { onDestroy, tick } from "svelte";
import { type Box, box, boxedState, watch } from "./box.svelte.js";
import { useStateMachine } from "$lib/internal/index.js";

export function usePresence(present: Box<boolean>, node: Box<HTMLElement | undefined>) {
	const styles = boxedState({}) as unknown as Box<CSSStyleDeclaration>;
	const prevAnimationNameState = boxedState("none");
	const initialState = present.value ? "mounted" : "unmounted";

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
		present,
		async (currPresent, prevPresent) => {
			const hasPresentChanged = currPresent !== prevPresent;
			if (!hasPresentChanged) return;

			const prevAnimationName = prevAnimationNameState.value;
			const currAnimationName = getAnimationName(node.value);

			if (currPresent) {
				dispatch("MOUNT");
			} else if (currAnimationName === "none" || styles.value?.display === "none") {
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
		},
		{ immediate: false }
	);

	/**
	 * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
	 * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
	 * make sure we only trigger ANIMATION_END for the currently active animation.
	 */

	function handleAnimationEnd(event: AnimationEvent) {
		const currAnimationName = getAnimationName(node.value);
		const isCurrentAnimation =
			currAnimationName.includes(event.animationName) || currAnimationName === "none";

		if (event.target === node.value && isCurrentAnimation) {
			dispatch("ANIMATION_END");
		}
	}

	function handleAnimationStart(event: AnimationEvent) {
		if (event.target === node.value) {
			prevAnimationNameState.value = getAnimationName(node.value);
		}
	}

	const watcher = watch(
		node,
		(currNode, prevNode) => {
			if (currNode) {
				styles.value = getComputedStyle(currNode);
				currNode.addEventListener("animationstart", handleAnimationStart);
				currNode.addEventListener("animationcancel", handleAnimationEnd);
				currNode.addEventListener("animationend", handleAnimationEnd);
			} else {
				dispatch("ANIMATION_END");
				prevNode?.removeEventListener("animationstart", handleAnimationStart);
				prevNode?.removeEventListener("animationcancel", handleAnimationEnd);
				prevNode?.removeEventListener("animationend", handleAnimationEnd);
			}
		},
		{ immediate: true }
	);

	const stateWatcher = watch(state, () => {
		const currAnimationName = getAnimationName(node.value);
		prevAnimationNameState.value = state.value === "mounted" ? currAnimationName : "none";
	});

	onDestroy(() => {
		watcher();
		stateWatcher();
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
