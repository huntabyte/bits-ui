<script lang="ts">
	import { useDialogClose } from "../dialog.svelte.js";
	import type { CloseProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, ref = $bindable(), ...restProps }: CloseProps = $props();

	const closeState = useDialogClose();

	const mergedProps = $derived(mergeProps(restProps, closeState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</button>
{/if}
