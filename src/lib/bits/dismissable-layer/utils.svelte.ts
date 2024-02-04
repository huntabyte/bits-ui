import { handleAndDispatchCustomEvent, type Ref } from "$lib/internal";
import { isClient } from "$lib/internal/utils/is.js";
import { tick } from "svelte";
import { CONTEXT_UPDATE, FOCUS_OUTSIDE, POINTER_DOWN_OUTSIDE } from "./constants";

type CustomWithOriginalEvent<T> = CustomEvent<{ originalEvent: T }>;

export type PointerDownOutsideEvent = CustomWithOriginalEvent<PointerEvent>;
export type FocusOutsideEvent = CustomWithOriginalEvent<FocusEvent>;

function doesLayerExist(layerElement: HTMLElement, targetElement: HTMLElement) {
	const targetLayer = targetElement.closest("[data-dismissable-layer]") as HTMLElement;
	const mainLayer = layerElement.querySelector("[data-dismissable-layer]") as HTMLElement;

	const nodeList = Array.from(
		layerElement.ownerDocument.querySelectorAll("[data-dismissable-layer]")
	);

	if (
		(targetLayer && mainLayer == targetLayer) ||
		nodeList.indexOf(mainLayer) < nodeList.indexOf(targetLayer)
	) {
		return true;
	} else {
		return false;
	}
}

export function usePointerDownOutside(
	onPointerDownOutside?: (event: PointerDownOutsideEvent) => void,
	element?: Ref<HTMLElement | null>
) {
	const ownerDocument: Document = element?.value?.ownerDocument ?? globalThis?.document;

	let isPointerInsideDOMTree = $state(false);
	let handleClick = $state(() => {});

	$effect(() => {
		if (!isClient) return;

		async function handlePointerDown(event: PointerEvent) {
			if (!element?.value) return;
			if (doesLayerExist(element.value, event.target as HTMLElement)) {
				isPointerInsideDOMTree = true;
				return;
			}
			if (event.target && !isPointerInsideDOMTree) {
				const eventDetail = { originalEvent: event };

				const handleAndDispatchPointerDownOutsideEvent = () => {
					handleAndDispatchCustomEvent(POINTER_DOWN_OUTSIDE, onPointerDownOutside, eventDetail);
				};

				/**
				 * On touch devices, we need to wait for a click event because browsers implement
				 * a ~350ms delay between the time the user stops touching the display and when the
				 * browser executes events. We need to ensure we don't reactivate pointer-events
				 * within this timeframe otherwise the browser may execute events that should
				 * have been prevented.
				 *
				 * Additionally, this also lets us deal automatically with cancellations when a
				 * click event isn't raised because the page was considered scrolled/drag-scrolled,
				 * long-pressed, etc.
				 *
				 * This is why we also continuously remove the previous listener, because we cannot
				 * be certain that it was raised, and therefore cleaned-up.
				 */
				if (event.pointerType === "touch") {
					ownerDocument.removeEventListener("click", handleClick);
					handleClick = handleAndDispatchPointerDownOutsideEvent;
					ownerDocument.addEventListener("click", handleClick, { once: true });
				} else {
					handleAndDispatchPointerDownOutsideEvent();
				}
			} else {
				// We need to remove the event listener in case the outside click has been cancelled
				ownerDocument.removeEventListener("click", handleClick);
			}
			isPointerInsideDOMTree = false;
		}

		/**
		 * If this executes in a component that mounts via a `pointerdown` event, the event
		 * would bubble up to the document and trigger a `pointerDownOutside` event. We can
		 * avoid this by delaying the event listener attachment on the document.
		 */
		const timerId = window.setTimeout(() => {
			ownerDocument.addEventListener("pointerdown", handlePointerDown);
		}, 0);

		return () => {
			window.clearTimeout(timerId);
			ownerDocument.removeEventListener("pointerdown", handlePointerDown);
			ownerDocument.removeEventListener("click", handleClick);
		};
	});

	return {
		onPointerDownCapture: () => (isPointerInsideDOMTree = true),
	};
}

/**
 * Listens for focus events that occur outside of a DOM subtree.
 * Returns props to pass to the root node of the subtree we want to check.
 */
export function useFocusOutside(
	onFocusOutside?: (event: FocusOutsideEvent) => void,
	element?: Ref<HTMLElement | null>
) {
	const ownerDocument: Document = element?.value?.ownerDocument ?? globalThis?.document;

	let isFocusInsideDOMTree = $state(false);

	$effect(() => {
		if (!isClient) return;

		async function handleFocus(event: FocusEvent) {
			if (!element?.value) return;

			await tick();
			if (doesLayerExist(element.value, event.target as HTMLElement)) return;

			if (event.target && !isFocusInsideDOMTree) {
				const eventDetail = { originalEvent: event };
				handleAndDispatchCustomEvent(FOCUS_OUTSIDE, onFocusOutside, eventDetail);
			}
		}

		ownerDocument.addEventListener("focusin", handleFocus);

		return () => {
			ownerDocument.removeEventListener("focusin", handleFocus);
		};
	});

	return {
		onFocusCapture: () => (isFocusInsideDOMTree = true),
		onBlurCapture: () => (isFocusInsideDOMTree = false),
	};
}

export function dispatchUpdate() {
	const event = new CustomEvent(CONTEXT_UPDATE);
	document.dispatchEvent(event);
}
