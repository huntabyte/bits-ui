<script lang="ts">
	import type { Snippet } from "svelte";
	import type { TransitionConfig } from "svelte/transition";
	import type { Transition } from "$lib/internal/index.js";

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
		...restProps
	}: Props = $props();
</script>

{#if transition && condition}
	<div transition:transition={transitionConfig} {...restProps}>
		{@render children?.()}
	</div>
{:else if inTransition && outTransition && condition}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		{...restProps}
	>
		{@render children?.()}
	</div>
{:else if inTransition && condition}
	<div in:inTransition={inTransitionConfig} {...restProps}>
		{@render children?.()}
	</div>
{:else if outTransition && condition}
	<div out:outTransition={outTransitionConfig} {...restProps}>
		{@render children?.()}
	</div>
{:else if condition}
	<div {...restProps}>
		{@render children?.()}
	</div>
{/if}
