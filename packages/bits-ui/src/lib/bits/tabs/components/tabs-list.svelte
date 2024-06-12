<script lang="ts">
	import type { ListProps } from "../index.js";
	import { useTabsList } from "../tabs.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, child, children, ref = $bindable(), ...restProps }: ListProps = $props();

	const listState = useTabsList();

	const mergedProps = $derived(mergeProps(restProps, listState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
