<script lang="ts" context="module">
	import type { Transition } from "$lib/internal/index.js";
	import { getAccordionContentState } from "./state.svelte.js";
	type T = Transition;
	type In = Transition;
	type Out = Transition;
</script>

<script
	lang="ts"
	generics="T extends Transition, In extends Transition, Out extends Transition"
>
	import type { AccordionContentProps } from "./types.js";

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

	const content = getAccordionContentState();
</script>

{#if asChild && content.item.isSelected && children}
	{@render children()}
{:else if transition && content.item.isSelected}
	<div transition:transition={transitionConfig} {...props} {...content.attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if inTransition && outTransition && content.item.isSelected}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...props}
		{...content.attrs}
	>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if inTransition && content.item.isSelected}
	<div in:inTransition={inTransitionConfig} {...props} {...content.attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if outTransition && content.item.isSelected}
	<div out:outTransition={outTransitionConfig} {...props} {...content.attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if content.item.isSelected}
	<div {...props} {...content.attrs}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
