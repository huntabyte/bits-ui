<script lang="ts">
	import type { ListProps } from "../index.js";
	import { useTabsList } from "../tabs.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { asChild, child, children, el = $bindable(), ...restProps }: ListProps = $props();

	const state = useTabsList();

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
