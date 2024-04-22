<script lang="ts">
	import type { ListProps } from "../index.js";
	import { setTabsListState } from "../tabs.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

	let { asChild, child, children, el = $bindable(), ...restProps }: ListProps = $props();

	const state = setTabsListState();

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
