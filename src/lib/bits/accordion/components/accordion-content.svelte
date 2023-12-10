<script lang="ts" context="module">
	import type { Transition } from "$lib/internal/index.js";
	type T = Transition;
	type In = Transition;
	type Out = Transition;
</script>

<script
	lang="ts"
	generics="T extends Transition, In extends Transition, Out extends Transition"
>
	import type { AccordionContentProps } from "./types.js";
	import {
		getAccordionItemContext,
		getAccordionRootContext
	} from "./state.svelte.js";

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

	const rootState = getAccordionRootContext();
	const itemState = getAccordionItemContext();

	let attrs = $derived({
		"data-state": itemState.isSelected ? "open" : "closed",
		"data-disabled": rootState.disabled || itemState.disabled ? "" : undefined,
		"data-value": itemState.value
	});
</script>

{#if asChild && itemState.isSelected && children}
	{@render children()}
{:else if transition && itemState.isSelected}
	<div transition:transition={transitionConfig} {...rest} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if inTransition && outTransition && itemState.isSelected}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...rest}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if inTransition && itemState.isSelected}
	<div in:inTransition={inTransitionConfig} {...rest} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if outTransition && itemState.isSelected}
	<div out:outTransition={outTransitionConfig} {...rest} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if itemState.isSelected}
	<div {...rest} {...attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
