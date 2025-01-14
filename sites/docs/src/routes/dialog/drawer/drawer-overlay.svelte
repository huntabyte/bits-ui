<script lang="ts">
	import type { Snippet } from "svelte";
	import { fade } from "svelte/transition";
	import { Dialog, type WithoutChildrenOrChild } from "bits-ui";

	let {
		ref = $bindable(null),
		duration = 200,
		children,
		...restProps
	}: WithoutChildrenOrChild<Dialog.OverlayProps> & {
		duration?: number;
		children?: Snippet;
	} = $props();
</script>

<Dialog.Overlay forceMount bind:ref {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:fade={{ duration }}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Dialog.Overlay>

<style>
	:global([data-dialog-overlay]) {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.25);
		z-index: 100;
	}
</style>
