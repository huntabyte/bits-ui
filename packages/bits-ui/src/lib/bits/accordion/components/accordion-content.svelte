<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useAccordionContent } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { mergeProps, useId } from "$lib/internal/index.js";

	let {
		child,
		asChild,
		el = $bindable(),
		id = useId(),
		forceMount = false,
		children,
		...restProps
	}: AccordionContentProps = $props();

	const state = useAccordionContent({
		forceMount: box.with(() => forceMount),
		id: box.with(() => id),
	});
</script>

<PresenceLayer forceMount={true} present={state.present} {id}>
	{#snippet presence({ present })}
		{@const mergedProps = mergeProps(restProps, state.props, {
			hidden: !present.value,
		})}
		{#if asChild}
			{@render child?.({
				props: mergedProps,
			})}
		{:else}
			<div {...mergedProps} bind:this={el}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</PresenceLayer>
