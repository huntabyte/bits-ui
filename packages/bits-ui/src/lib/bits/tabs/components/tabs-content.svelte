<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ContentProps } from "../index.js";
	import { useTabsContent } from "../tabs.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		value,
		...restProps
	}: ContentProps = $props();

	const contentState = useTabsContent({
		value: box.with(() => value),
	});

	const mergedProps = $derived(mergeProps(restProps, contentState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
