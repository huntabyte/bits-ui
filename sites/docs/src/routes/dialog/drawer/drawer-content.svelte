<script lang="ts">
	import type { Snippet } from "svelte";
	import { slide } from "svelte/transition";
	import { Dialog, type WithoutChildrenOrChild } from "bits-ui";

	let {
		ref = $bindable(null),
		duration = 200,
		children,
		...restProps
	}: WithoutChildrenOrChild<Dialog.ContentProps> & {
		duration?: number;
		children?: Snippet;
	} = $props();
</script>

<Dialog.Content bind:ref forceMount {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:slide={{ duration, axis: "x" }}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Dialog.Content>

<style>
	:global([data-dialog-content]) {
		position: fixed;
		inset: 0;
		left: initial;
		z-index: 200;

		display: flex;
		flex-direction: column;

		width: min(560px, 100vw);
		background-color: white;
	}

	div {
		padding: 1rem;
	}
</style>
