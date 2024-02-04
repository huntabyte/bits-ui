<script lang="ts">
	import type { Snippet } from "svelte";
	import type { Transition } from "$lib/internal/index.js";
	import type { TransitionConfig } from "svelte/transition";

	type Props = {
		transition?: Transition;
		transitionConfig?: TransitionConfig;
		inTransition?: Transition;
		inTransitionConfig?: TransitionConfig;
		outTransition?: Transition;
		outTransitionConfig?: TransitionConfig;
		condition?: boolean;
		children?: Snippet;
	};

	let {
		transition,
		transitionConfig,
		inTransition,
		inTransitionConfig,
		outTransition,
		outTransitionConfig,
		children,
		condition,
		...props
	} = $props<Props>();
</script>

{#if transition && condition}
	<div transition:transition={transitionConfig} {...props}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if inTransition && outTransition && condition}
	<div in:inTransition={inTransitionConfig} out:outTransition={outTransitionConfig} {...props}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if inTransition && condition}
	<div in:inTransition={inTransitionConfig} {...props}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if outTransition && condition}
	<div out:outTransition={outTransitionConfig} {...props}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{:else if condition}
	<div {...props}>
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
