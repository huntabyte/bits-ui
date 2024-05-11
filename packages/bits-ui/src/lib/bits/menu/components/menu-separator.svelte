<script lang="ts">
	import type { SeparatorProps } from "../index.js";
	import { useMenuSeparator } from "../menu.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { el = $bindable(), asChild, child, children, ...restProps }: SeparatorProps = $props();

	const state = useMenuSeparator();

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
