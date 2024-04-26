<script lang="ts">
	import { box } from "runed";
	import { useCollapsibleContent } from "../collapsible.svelte.js";
	import type { CollapsibleContentProps } from "../types.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { mergeProps, useId } from "$lib/internal/index.js";

	let {
		child,
		asChild,
		el = $bindable(),
		forceMount = false,
		children,
		id = useId(),
		...restProps
	}: CollapsibleContentProps & { forceMount?: boolean } = $props();

	const state = useCollapsibleContent({
		id: box.with(() => id),
		forceMount: box.with(() => forceMount),
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
