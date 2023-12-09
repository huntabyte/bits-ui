<script lang="ts" context="module">
	import type { Transition } from "$lib/internal/index.js";
	import { isMulti } from "./helpers.js";
	type T = unknown;
	type In = unknown;
	type Out = unknown;
</script>

<script
	lang="ts"
	generics="T extends Transition, In extends Transition, Out extends Transition"
>
	import type {
		AccordionContentProps,
		AccordionRootContext,
		AccordionItemContext
	} from "./types.js";
	import { getContext } from "svelte";

	let {
		transition,
		transitionConfig,
		inTransition,
		inTransitionConfig,
		outTransition,
		outTransitionConfig,
		asChild = false,
		children,
		...rest
	} = $props<AccordionContentProps<T, In, Out>>();

	const root = getContext<AccordionRootContext>("ACCORDION");
	const item = getContext<AccordionItemContext>("ACCORDION_ITEM");

	let isSelected = $derived(getIsSelected());

	function getIsSelected() {
		if (isMulti(root.value.isMulti)) {
			return root.value.value.includes(item.value);
		} else {
			return root.value.value === item.value;
		}
	}

	let attrs = $derived({
		"data-state": isSelected ? "open" : "closed",
		"data-disabled": root.disabled || item.disabled ? "" : undefined,
		"data-value": item.value
	});
</script>

{#if asChild && isSelected && children}
	{@render children()}
{:else if transition && isSelected}
	<div transition:transition={transitionConfig} {...rest} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if inTransition && outTransition && isSelected}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...rest}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if inTransition && isSelected}
	<div in:inTransition={inTransitionConfig} {...rest} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if outTransition && isSelected}
	<div out:outTransition={outTransitionConfig} {...rest} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if isSelected}
	<div {...rest} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
