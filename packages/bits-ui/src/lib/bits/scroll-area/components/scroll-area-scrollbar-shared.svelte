<script lang="ts">
	import { mergeProps } from "svelte-toolbelt";
	import { ScrollAreaScrollbarSharedState } from "../scroll-area.svelte.js";
	import type { _ScrollbarStubProps } from "../types.js";

	let { child, children, style, ...restProps }: _ScrollbarStubProps = $props();

	const scrollbarSharedState = ScrollAreaScrollbarSharedState.create();

	const mergedProps = $derived(mergeProps(restProps, scrollbarSharedState.props, { style }));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
