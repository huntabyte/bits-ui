<script lang="ts" context="module">
	import type { Transition } from "$lib/internal/index.js";
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

	const ctx = getContext<AccordionRootContext>("ACCORDION");
	const itemCtx = getContext<AccordionItemContext>("ACCORDION_ITEM");
	let isSelected = $derived(ctx.value.value === itemCtx.value);

	let attrs = $derived({
		"data-state": isSelected ? "open" : "closed",
		"data-disabled": ctx.disabled || itemCtx.disabled ? "" : undefined,
		"data-value": itemCtx.value
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
