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
	import { getAccordionItemContext } from "./state.svelte.js";

	let {
		transition,
		transitionConfig,
		inTransition,
		inTransitionConfig,
		outTransition,
		outTransitionConfig,
		asChild = false,
		children,
		...props
	} = $props<AccordionContentProps<T, In, Out>>();

	const itemState = getAccordionItemContext();
	const contentState = itemState.createContent();
</script>

{#if asChild && itemState.isSelected && children}
	{@render children()}
{:else if transition && itemState.isSelected}
	<div
		transition:transition={transitionConfig}
		{...props}
		{...contentState.attrs}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if inTransition && outTransition && itemState.isSelected}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...props}
		{...contentState.attrs}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if inTransition && itemState.isSelected}
	<div in:inTransition={inTransitionConfig} {...props} {...contentState.attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if outTransition && itemState.isSelected}
	<div
		out:outTransition={outTransitionConfig}
		{...props}
		{...contentState.attrs}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if itemState.isSelected}
	<div {...props} {...contentState.attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
