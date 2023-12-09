<script lang="ts">
	import { getContext } from "svelte";
	import type {
		AccordionRootContext,
		AccordionTriggerProps,
		AccordionItemContext
	} from "./types.js";
	import { kbd } from "$lib/internal/index.js";

	let {
		disabled = false,
		asChild = false,
		onclick: onClick,
		onkeydown: onKeydown,
		el = null,
		...rest
	} = $props<AccordionTriggerProps>();

	const root = getContext<AccordionRootContext>("ACCORDION");

	const item = getContext<AccordionItemContext>("ACCORDION_ITEM");

	let isDisabled = $derived(disabled || root.disabled || item.disabled);

	let isSelected = $derived(getIsSelected());

	function getIsSelected() {
		if (root.value.isMulti) {
			return root.value.value.includes(item.value);
		} else {
			return root.value.value === item.value;
		}
	}

	let attrs = $derived({
		disabled: isDisabled,
		"aria-expanded": isSelected ? true : false,
		"aria-disabled": disabled ? true : false,
		"data-disabled": isDisabled ? "" : undefined,
		"data-value": item.value,
		"data-state": isSelected ? "open" : "closed",
		"data-accordion-trigger": ""
	});

	function updateValue() {
		if (root.value.isMulti) {
			if (root.value.value.includes(item.value)) {
				root.value.value = root.value.value.filter((v) => v !== item.value);
			} else {
				root.value.value.push(item.value);
			}
		} else {
			if (root.value.value === item.value) {
				root.value.value = "";
			} else {
				root.value.value = item.value;
			}
		}
	}

	function onclick(e: MouseEvent) {
		onClick?.(e);
		if (e.defaultPrevented || isDisabled) return;
		updateValue();
	}

	const KEYS = [kbd.ARROW_DOWN, kbd.ARROW_UP, kbd.HOME, kbd.END];

	function onkeydown(e: KeyboardEvent) {
		onKeydown?.(e);
		if (e.defaultPrevented || isDisabled) return;
		if (!KEYS.includes(e.key)) return;

		e.preventDefault();

		if (e.key === "Space" || e.key === "Enter") {
			if (disabled) return;
			updateValue();
			return;
		}

		if (!root.el || !el) return;

		const items = Array.from(
			root.el.querySelectorAll<HTMLElement>("[data-accordion-trigger]")
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
