<script lang="ts">
	import { getAccordionContentState } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import Presence from "$lib/bits/utilities/presence.svelte";
	import { box } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		child,
		asChild,
		el: elProp = $bindable(),
		forceMount = false,
		children,
		style: styleProp = {},
		...restProps
	}: AccordionContentProps & { forceMount?: boolean } = $props();

	const el = box(
		() => elProp,
		(v) => (elProp = v)
	);

	const content = getAccordionContentState({ presentEl: el });
</script>

<Presence forceMount={true} present={forceMount || content.item.isSelected} bind:el={el.value}>
	{#snippet presence({ node, present })}
		{@const mergedProps = {
			...restProps,
			...content.props,
			style: styleToString({
				...styleProp,
				...content.style,
			}),
		}}
		{#if asChild}
			{@render child?.({ props: mergedProps })}
		{:else}
			<div {...mergedProps} bind:this={node.value} hidden={present.value ? undefined : true}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Presence>
