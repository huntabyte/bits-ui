<script lang="ts">
	import { getAccordionContentState } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import Presence from "$lib/bits/utilities/presence.svelte";
	import { box } from "$lib/internal/box.svelte.js";

	let {
		child,
		asChild,
		el: elProp = $bindable(),
		forceMount = false,
		children,
		...restProps
	}: AccordionContentProps & { forceMount?: boolean } = $props();

	const el = box(
		() => elProp,
		(v) => (elProp = v)
	);

	const content = getAccordionContentState({ presentEl: el });

	const mergedProps = $derived({
		...restProps,
		...content.props,
	});
</script>

<Presence forceMount={true} present={forceMount || content.item.isSelected} bind:el={el.value}>
	{#snippet presence({ node, present })}
		{#if asChild}
			{@render child?.({ props: { ...mergedProps, hidden: !present.value } })}
		{:else}
			<div hidden={!present.value} {...mergedProps} bind:this={node.value}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Presence>

<style>
	[hidden="false"] {
		display: block !important;
	}
</style>
