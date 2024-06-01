<script lang="ts">
	import type { CloseProps } from "../index.js";
	import { usePopoverClose } from "../popover.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, child, children, el = $bindable(), ...restProps }: CloseProps = $props();

	const state = usePopoverClose();
	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps} bind:this={el}>
		{@render children?.()}
	</button>
{/if}
