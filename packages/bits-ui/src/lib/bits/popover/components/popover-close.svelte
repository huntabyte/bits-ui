<script lang="ts">
	import type { CloseProps } from "../index.js";
	import { usePopoverClose } from "../popover.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, child, children, ref = $bindable(), ...restProps }: CloseProps = $props();

	const closeState = usePopoverClose();
	const mergedProps = $derived(mergeProps(restProps, closeState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</button>
{/if}
