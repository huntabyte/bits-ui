import {
	afterSleep,
	afterTick,
	DOMContext,
	executeCallbacks,
	type ReadableBoxedValues,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import { on } from "svelte/events";
import {
	createFocusScopeAPI,
	createFocusScopeStack,
	removeLinks,
} from "./focus-scope-stack.svelte.js";
import { focus, focusFirst, getTabbableCandidates, getTabbableEdges } from "$lib/internal/focus.js";
import { CustomEventDispatcher, type EventCallback } from "$lib/internal/events.js";
import { isHTMLElement } from "$lib/internal/is.js";
import { kbd } from "$lib/internal/kbd.js";
import { isTabbable } from "tabbable";

const AutoFocusOnMountEvent = new CustomEventDispatcher("focusScope.autoFocusOnMount", {
	bubbles: false,
	cancelable: true,
});
const AutoFocusOnDestroyEvent = new CustomEventDispatcher("focusScope.autoFocusOnDestroy", {
	bubbles: false,
	cancelable: true,
});

export type FocusScopeContextValue = {
	ignoreCloseAutoFocus: boolean;
};

export const FocusScopeContext = new Context<FocusScopeContextValue>("FocusScope");

type UseFocusScopeProps = ReadableBoxedValues<{
	/**
	 * ID of the focus scope container node.
	 */
	id: string;
	/**
	 * When `true` will loop through the tabbable elements in the focus scope.
	 *
	 * @defaultValue false
	 */
	loop: boolean;

	/**
	 * Whether focus is trapped within the focus scope.
	 *
	 * @defaultValue false
	 */
	enabled: boolean;

	/**
	 * Event handler called when auto-focusing onMount.
	 * Can be prevented.
	 */
	onOpenAutoFocus: EventCallback;

	/**
	 * Event handler called when auto-focusing onDestroy.
	 * Can be prevented.
	 */
	onCloseAutoFocus: EventCallback;

	/**
	 * Whether force mount is enabled or not
	 */
	forceMount: boolean;

	ref: HTMLElement | null;
}>;

export type FocusScopeContainerProps = {
	tabindex: number;
};

export function useFocusScope({
	id,
	loop,
	enabled,
	onOpenAutoFocus,
	onCloseAutoFocus,
	forceMount,
	ref,
}: UseFocusScopeProps) {
	const focusScopeStack = createFocusScopeStack();
	const focusScope = createFocusScopeAPI();
	const ctx = FocusScopeContext.getOr({ ignoreCloseAutoFocus: false });
	let lastFocusedElement: HTMLElement | null = null;
	const domContext = new DOMContext(ref);

	function manageFocus(event: FocusEvent) {
		if (focusScope.paused || !ref.current || focusScope.isHandlingFocus) return;
		focusScope.isHandlingFocus = true;

		try {
			const target = event.target;
			if (!isHTMLElement(target)) return;

			const isWithinActiveScope = ref.current.contains(target);

			if (event.type === "focusin") {
				if (isWithinActiveScope) {
					lastFocusedElement = target;
				} else {
					if (ctx.ignoreCloseAutoFocus) return;
					focus(lastFocusedElement, { select: true });
				}
			} else if (event.type === "focusout") {
				if (!isWithinActiveScope && !ctx.ignoreCloseAutoFocus) {
					focus(lastFocusedElement, { select: true });
				}
			}
		} finally {
			focusScope.isHandlingFocus = false;
		}
	}

	/**
	 * Handles DOM mutations within the container. Specifically checks if the
	 * last known focused element inside the container has been removed. If so,
	 * and focus has escaped the container (likely moved to document.body),
	 * it refocuses the container itself to maintain the trap.
	 */
	function handleMutations(mutations: MutationRecord[]) {
		// if there's no record of a last focused el, or container isn't mounted, bail
		if (!lastFocusedElement || !ref.current) return;

		// track if the last focused element was removed
		let elementWasRemoved = false;

		for (const mutation of mutations) {
			// we only care about mutations where nodes were removed
			if (mutation.type === "childList" && mutation.removedNodes.length > 0) {
				// check if any removed nodes are the last focused element or contain it
				for (const removedNode of mutation.removedNodes) {
					if (removedNode === lastFocusedElement) {
						elementWasRemoved = true;
						// found it directly
						break;
					}
					// contains() only works on elements, so we need to check nodeType
					if (
						removedNode.nodeType === Node.ELEMENT_NODE &&
						(removedNode as Element).contains(lastFocusedElement)
					) {
						elementWasRemoved = true;
						// descendant found,
						break;
					}
				}
			}

			// if we've confirmed removal in any mutation, bail
			if (elementWasRemoved) break;
		}

		/**
		 * If the element was removed and focus is now outside the container,
		 * (e.g., browser moved it to body), refocus the container.
		 */
		if (
			elementWasRemoved &&
			ref.current &&
			!ref.current.contains(domContext.getActiveElement())
		) {
			focus(ref.current);
		}
	}

	watch([() => ref.current, () => enabled.current], ([container, enabled]) => {
		if (!container || !enabled) return;

		const removeEvents = executeCallbacks(
			on(domContext.getDocument(), "focusin", manageFocus),
			on(domContext.getDocument(), "focusout", manageFocus)
		);
		const mutationObserver = new MutationObserver(handleMutations);
		mutationObserver.observe(container, {
			childList: true,
			subtree: true,
			attributes: false,
		});
		return () => {
			removeEvents();
			mutationObserver.disconnect();
		};
	});

	watch([() => forceMount.current, () => ref.current], ([forceMount, container]) => {
		if (forceMount) return;
		const prevFocusedElement = domContext.getActiveElement() as HTMLElement | null;
		handleOpen(container, prevFocusedElement);

		return () => {
			if (!container) return;
			handleClose(prevFocusedElement);
		};
	});

	watch(
		[() => forceMount.current, () => ref.current, () => enabled.current],
		([forceMount, container]) => {
			if (!forceMount) return;
			const prevFocusedElement = domContext.getActiveElement() as HTMLElement | null;
			handleOpen(container, prevFocusedElement);

			return () => {
				if (!container) return;
				handleClose(prevFocusedElement);
			};
		}
	);

	function handleOpen(container: HTMLElement | null, prevFocusedElement: HTMLElement | null) {
		if (!container) container = domContext.getElementById(id.current);
		if (!container || !enabled.current) return;
		focusScopeStack.add(focusScope);
		const hasFocusedCandidate = container.contains(prevFocusedElement);

		if (!hasFocusedCandidate) {
			const mountEvent = AutoFocusOnMountEvent.createEvent();
			onOpenAutoFocus.current(mountEvent);

			if (!mountEvent.defaultPrevented) {
				afterTick(() => {
					if (!container) return;
					const result = focusFirst(
						removeLinks(getTabbableCandidates(container)),
						{
							select: true,
						},
						() => domContext.getActiveElement()
					);

					if (!result) focus(container);
				});
			}
		}
	}

	function handleClose(prevFocusedElement: HTMLElement | null) {
		const destroyEvent = AutoFocusOnDestroyEvent.createEvent();
		onCloseAutoFocus.current?.(destroyEvent);

		const shouldIgnore = ctx.ignoreCloseAutoFocus;
		afterSleep(0, () => {
			if (!destroyEvent.defaultPrevented && prevFocusedElement && !shouldIgnore) {
				focus(
					isTabbable(prevFocusedElement)
						? prevFocusedElement
						: domContext.getDocument().body,
					{
						select: true,
					}
				);
			}
			focusScopeStack.remove(focusScope);
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!enabled.current) return;
		if (!loop.current && !enabled.current) return;
		if (focusScope.paused) return;

		const isTabKey = e.key === kbd.TAB && !e.ctrlKey && !e.altKey && !e.metaKey;
		const focusedElement = domContext.getActiveElement() as HTMLElement | null;

		if (!(isTabKey && focusedElement)) return;
		const container = ref.current;
		if (!container) return;

		const [first, last] = getTabbableEdges(container);
		const hasTabbableElementsInside = first && last;

		if (!hasTabbableElementsInside) {
			if (focusedElement === container) {
				e.preventDefault();
			}
		} else {
			if (!e.shiftKey && focusedElement === last) {
				e.preventDefault();
				if (loop.current) focus(first, { select: true });
			} else if (e.shiftKey && focusedElement === first) {
				e.preventDefault();
				if (loop.current) focus(last, { select: true });
			}
		}
	}

	const props: FocusScopeContainerProps = $derived.by(
		() =>
			({
				id: id.current,
				tabindex: -1,
				onkeydown: handleKeydown,
			}) as const
	);

	return {
		get props() {
			return props;
		},
	};
}
