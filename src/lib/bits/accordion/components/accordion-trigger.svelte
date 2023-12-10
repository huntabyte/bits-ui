<script lang="ts">
	import type { AccordionTriggerProps } from "./types.js";
	import { kbd } from "$lib/internal/index.js";
	import {
		getAccordionItemContext,
		getAccordionRootContext
	} from "./state.svelte.js";

	let {
		disabled = false,
		asChild = false,
		onclick: onClick,
		onkeydown: onKeydown,
		el = null,
		...rest
	} = $props<AccordionTriggerProps>();

	const rootState = getAccordionRootContext();
	const itemState = getAccordionItemContext();

	let isDisabled = $derived(
		disabled || rootState.disabled || itemState.disabled
	);

	let attrs = $derived({
		disabled: isDisabled,
		"aria-expanded": itemState.isSelected ? true : false,
		"aria-disabled": disabled ? true : false,
		"data-disabled": isDisabled ? "" : undefined,
		"data-value": itemState.value,
		"data-state": itemState.isSelected ? "open" : "closed",
		"data-accordion-trigger": ""
	});

	function onclick(e: MouseEvent) {
		onClick?.(e);
		if (e.defaultPrevented || isDisabled) return;
		itemState.updateValue();
	}

	const KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END];

	function onkeydown(e: KeyboardEvent) {
		onKeydown?.(e);
		if (e.defaultPrevented || isDisabled) return;
		if (!KEYS.includes(e.key)) return;

		e.preventDefault();

		if (e.key === "Space" || e.key === "Enter") {
			if (disabled) return;
			itemState.updateValue();
			return;
		}

		if (!rootState.el || !el) return;

		const items = Array.from(
			rootState.el.querySelectorAll<HTMLElement>("[data-accordion-trigger]")
		);
		const candidateItems = items.filter(
			(item): item is HTMLElement => !item.dataset.disabled
		);

		if (!candidateItems.length) return;
		const currentIdx = candidateItems.indexOf(el);

		switch (e.key) {
			case kbd.ARROW_DOWN:
				candidateItems[(currentIdx + 1) % candidateItems.length].focus();
				return;
			case kbd.ARROW_UP:
				candidateItems[
					(currentIdx - 1 + candidateItems.length) % candidateItems.length
				].focus();
				return;
			case kbd.HOME:
				candidateItems[0].focus();
				return;
			case kbd.END:
				candidateItems[candidateItems.length - 1].focus();
				return;
		}
	}
</script>

{#if asChild}
	<slot />
{:else}
	<button
		bind:this={el}
		type="button"
		{...attrs}
		{...rest}
		{onkeydown}
		{onclick}
	>
		<slot />
	</button>
{/if}
