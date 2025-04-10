import { afterSleep, afterTick, box, executeCallbacks, useRefById } from "svelte-toolbelt";
import { Context, watch } from "runed";
import { on } from "svelte/events";
import {
	createFocusScopeAPI,
	createFocusScopeStack,
	removeLinks,
} from "./focus-scope-stack.svelte.js";
import { focus, focusFirst, getTabbableCandidates, getTabbableEdges } from "$lib/internal/focus.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
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
}>;

export type FocusScopeContainerProps = {
	id: string;
	tabindex: number;
	onkeydown: EventCallback<KeyboardEvent>;
};

export function useFocusScope({
	id,
	loop,
	enabled,
	onOpenAutoFocus,
	onCloseAutoFocus,
	forceMount,
}: UseFocusScopeProps) {
	const focusScopeStack = createFocusScopeStack();
	const focusScope = createFocusScopeAPI();
	const ref = box<HTMLElement | null>(null);
	const ctx = FocusScopeContext.getOr({ ignoreCloseAutoFocus: false });
	let lastFocusedElement: HTMLElement | null = null;

	useRefById({
		id,
		ref,
		deps: () => enabled.current,
	});

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

	// When the focused element gets removed from the DOM, browsers move focus
	// back to the document.body. In this case, we move focus to the container
	// to keep focus trapped correctly.
	// instead of leaning on document.activeElement, we use lastFocusedElement to check
	// if the element still exists inside the container,
	// if not then we focus to the container
	function handleMutations(_: MutationRecord[]) {
		const lastFocusedElementExists = ref.current?.contains(lastFocusedElement);
		if (!lastFocusedElementExists && ref.current) {
			focus(ref.current);
		}
	}

	watch([() => ref.current, () => enabled.current], ([container, enabled]) => {
		if (!container || !enabled) return;

		const removeEvents = executeCallbacks(
			on(document, "focusin", manageFocus),
			on(document, "focusout", manageFocus)
		);
		const mutationObserver = new MutationObserver(handleMutations);
		mutationObserver.observe(container, { childList: true, subtree: true });
		return () => {
			removeEvents();
			mutationObserver.disconnect();
		};
	});

	watch([() => forceMount.current, () => ref.current], ([forceMount, container]) => {
		if (forceMount) return;
		const prevFocusedElement = document.activeElement as HTMLElement | null;
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
			const prevFocusedElement = document.activeElement as HTMLElement | null;
			handleOpen(container, prevFocusedElement);

			return () => {
				if (!container) return;
				handleClose(prevFocusedElement);
			};
		}
	);

	function handleOpen(container: HTMLElement | null, prevFocusedElement: HTMLElement | null) {
		if (!container) container = document.getElementById(id.current);
		if (!container || !enabled.current) return;
		focusScopeStack.add(focusScope);
		const hasFocusedCandidate = container.contains(prevFocusedElement);

		if (!hasFocusedCandidate) {
			const mountEvent = AutoFocusOnMountEvent.createEvent();
			onOpenAutoFocus.current(mountEvent);

			if (!mountEvent.defaultPrevented) {
				afterTick(() => {
					if (!container) return;
					focusFirst(removeLinks(getTabbableCandidates(container)), { select: true });

					if (document.activeElement === prevFocusedElement) {
						focus(container);
					}
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
				focus(isTabbable(prevFocusedElement) ? prevFocusedElement : document.body, {
					select: true,
				});
			}
			focusScopeStack.remove(focusScope);
		});
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!enabled.current) return;
		if (!loop.current && !enabled.current) return;
		if (focusScope.paused) return;

		const isTabKey = e.key === kbd.TAB && !e.ctrlKey && !e.altKey && !e.metaKey;
		const focusedElement = document.activeElement as HTMLElement | null;

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
