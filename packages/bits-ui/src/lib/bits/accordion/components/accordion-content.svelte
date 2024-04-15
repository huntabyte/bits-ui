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
			<div
				{...mergedProps}
				style={styleToString({
					display: present.value ? undefined : "none",
					"--bits-accordion-content-height": `${content.height.value}px`,
					"--bits-accordion-content-width": `${content.width.value}px`,
				})}
				bind:this={node.value}
			>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Presence>
