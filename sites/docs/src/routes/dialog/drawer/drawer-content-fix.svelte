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

	let bodyStyles = $state(document.body.getAttribute("style") || "");
</script>

<Dialog.Content bind:ref forceMount {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div
				{...props}
				transition:slide={{ duration, axis: "x" }}
				onintrostart={() => {
					bodyStyles = document.body.getAttribute("style") || "";
				}}
				onoutroend={() => {
					/**
					 * `useBodyLockStackCount()` in bit-ui's use-body-scroll-lock.svelte.ts
					 *  hook is not cleaning up after itself properly: after dialog is closed,
					 *  body still has styles i assume were used to handle overflow, e.g:
					 *  style="pointer-events: auto; overflow: visible; padding-right: 32px; margin-right: 160px;"
					 */
					document.body.setAttribute("style", bodyStyles);
				}}
			>
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
