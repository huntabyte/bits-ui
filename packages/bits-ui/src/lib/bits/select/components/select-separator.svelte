<script lang="ts">
	import type { SeparatorProps } from "../index.js";
	import { useSelectSeparator } from "../select.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, child, children, el = $bindable(), ...restProps }: SeparatorProps = $props();

	const separatorState = useSelectSeparator();

	const mergedProps = $derived(mergeProps(restProps, separatorState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
