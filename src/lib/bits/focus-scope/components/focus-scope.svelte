<script lang="ts">
	import { isClient } from "$lib/internal/utils/is.js";
	import { executeCallbacks } from "@melt-ui/svelte/internal/helpers";
	import type { FocusScopeProps } from "../types.js";
	import { focus, focusFirst, getTabbableCandidates, getTabbableEdges } from "../utils.js";
	import { addEventListener, type ElementRef } from "$lib/internal/index.js";
	import { untrack } from "svelte";
	import { createFocusScopeStack, removeLinks } from "../stack.svelte";
	import { AUTOFOCUS_ON_DESTROY, AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS } from "../constants.js";

	let { loop = false, trapped = false, FocusScope, ...props } = $props<FocusScopeProps>();

	const currentElement = $state<ElementRef>({});
	const lastFocusedElement = $state<ElementRef>({ value: null });
	const focusScopesStack = createFocusScopeStack();

	const focusScope = $state({
		paused: false,
		pause() {
			this.paused = true;
		},
		resume() {
			this.paused = false;
		},
	});

	$effect(() => {
		if (!isClient || !trapped) return;
		const container = currentElement.value;

		function handleFocusIn(event: FocusEvent) {
			if (focusScope.paused || !container) return;
			const target = event.target as HTMLElement | null;
			if (container.contains(target)) lastFocusedElement.value = target;
			else focus(lastFocusedElement.value, { select: true });
		}

		function handleFocusOut(event: FocusEvent) {
			if (focusScope.paused || !container) return;

			const relatedTarget = event.relatedTarget as HTMLElement | null;

			// A `focusout` event with a `null` `relatedTarget` will happen in at least two cases:
			//
			// 1. When the user switches app/tabs/windows/the browser itself loses focus.
			// 2. In Google Chrome, when the focused element is removed from the DOM.
			//
			// We let the browser do its thing here because:
			//
			// 1. The browser already keeps a memory of what's focused for when the page gets refocused.
			// 2. In Google Chrome, if we try to focus the deleted focused element (as per below), it
			//    throws the CPU to 100%, so we avoid doing anything for this reason here too.
			if (relatedTarget === null) return;

			// If the focus has moved to an actual legitimate element (`relatedTarget !== null`)
			// that is outside the container, we move focus to the last valid focused element inside.
			if (!container.contains(relatedTarget)) {
				focus(lastFocusedElement.value, { select: true });
			}
		}

		function handleMutations(_: MutationRecord[]) {
			if (!lastFocusedElement.value || !container) return;
			const lastFocusedElementExist = container.contains(lastFocusedElement.value);
			if (!lastFocusedElementExist) {
				focus(container);
			}
		}

		const removeDocumentListeners = executeCallbacks(
			addEventListener(document, "focusin", handleFocusIn),
			addEventListener(document, "focusout", handleFocusOut)
		);

		const mutationObserver = new MutationObserver(handleMutations);
		if (container) {
			mutationObserver.observe(container, { childList: true, subtree: true });
		}

		return () => {
			removeDocumentListeners();
			mutationObserver.disconnect();
		};
	});

	$effect(() => {
		const container = currentElement.value;
		if (!container) return;

		untrack(() => {
			focusScopesStack.add(focusScope);
		});

		const prevFocusedElement = document.activeElement as HTMLElement | null;
		const hasFocusedCandidate = container.contains(prevFocusedElement);

		const onMountHandler = (event: Event) => {
			untrack(() => props.onMountAutoFocus?.(event));
		};

		if (!hasFocusedCandidate) {
			const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS);

			container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountHandler);
			container.dispatchEvent(mountEvent);

			if (!mountEvent.defaultPrevented) {
				focusFirst(removeLinks(getTabbableCandidates(container)), {
					select: true,
				});
				if (document.activeElement === prevFocusedElement) {
					focus(container);
				}
			}
		}

		return () => {
			container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountHandler);

			const onDestroyEvent = new CustomEvent(AUTOFOCUS_ON_DESTROY, EVENT_OPTIONS);
			const onDestroyHandler = (event: Event) => {
				props.onDestroyAutoFocus?.(event);
			};

			container.addEventListener(AUTOFOCUS_ON_DESTROY, onDestroyHandler);
			container.dispatchEvent(onDestroyEvent);

			setTimeout(() => {
				if (!onDestroyEvent.defaultPrevented) {
					focus(prevFocusedElement ?? document.body, { select: true });

					// remove listener after dispatching event
					container.removeEventListener(AUTOFOCUS_ON_DESTROY, onDestroyHandler);

					untrack(() => focusScopesStack.remove(focusScope));
				}
			}, 0);
		};
	});

	function handleKeyDown(event: KeyboardEvent) {
		if (!loop && !trapped) return;
		if (focusScope.paused) return;

		const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
		const focusedElement = document.activeElement as HTMLElement | null;

		if (!(isTabKey && focusedElement)) return;

		const container = event.currentTarget as HTMLElement;
		const [first, last] = getTabbableEdges(container);
		const hasTabbableElementsInside = first && last;

		// we can only wrap focus if we have edges
		if (!hasTabbableElementsInside) {
			if (focusedElement === container) event.preventDefault();
		} else {
			if (!event.shiftKey && focusedElement === last) {
				event.preventDefault();
				if (loop) {
					focus(first, { select: true });
				}
			} else if (event.shiftKey && focusedElement === first) {
				event.preventDefault();
				if (loop) {
					focus(last, { select: true });
				}
			}
		}
	}
</script>

{#if FocusScope}
	{@render FocusScope({ onkeydown: handleKeyDown, tabindex: -1, el: currentElement })}
{/if}
