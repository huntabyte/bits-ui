<script lang="ts">
	import { mergeProps } from "$lib/internal/merge-props.js";
	import { ScrollAreaScrollbarSharedState } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";

	let { child, children, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarSharedState = ScrollAreaScrollbarSharedState.create();

	const mergedProps = $derived(mergeProps(restProps, scrollbarSharedState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
