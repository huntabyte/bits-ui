<script lang="ts">
	import { useScrollAreaScrollbarShared } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let { child, children, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarSharedState = useScrollAreaScrollbarShared();

	const mergedProps = $derived(mergeProps(restProps, scrollbarSharedState.props));
</script>

{#if child}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
