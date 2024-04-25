<script lang="ts">
	import { useDialogClose } from "../dialog.svelte.js";
	import type { CloseProps } from "../index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, children, child, el = $bindable(), ...restProps }: CloseProps = $props();

	const state = useDialogClose();

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button {...mergedProps} bind:this={el}>
		{@render children?.()}
	</button>
{/if}
