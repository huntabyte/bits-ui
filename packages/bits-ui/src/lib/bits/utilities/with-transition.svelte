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
		el?: HTMLElement;
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
		ref = $bindable(),
		...restProps
	}: Props = $props();
</script>

{#if transition && condition}
	<div transition:transition={transitionConfig} {...restProps} bind:this={ref}>
		{@render children?.()}
	</div>
{:else if inTransition && outTransition && condition}
	<div
		in:inTransition={inTransitionConfig}
		out:outTransition={outTransitionConfig}
		bind:this={ref}
		{...restProps}
	>
		{@render children?.()}
	</div>
{:else if inTransition && condition}
	<div in:inTransition={inTransitionConfig} {...restProps} bind:this={ref}>
		{@render children?.()}
	</div>
{:else if outTransition && condition}
	<div out:outTransition={outTransitionConfig} {...restProps} bind:this={ref}>
		{@render children?.()}
	</div>
{:else if condition}
	<div {...restProps} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
