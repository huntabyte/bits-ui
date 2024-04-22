<script lang="ts">
	import { getCollapsibleContentState } from "../collapsible.svelte.js";
	import type { CollapsibleContentProps } from "../types.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { mergeProps, readonlyBox, useId } from "$lib/internal/index.js";

	let {
		child,
		asChild,
		el = $bindable(),
		forceMount = false,
		children,
		id = useId(),
		...restProps
	}: CollapsibleContentProps & { forceMount?: boolean } = $props();

	const state = getCollapsibleContentState({
		id: readonlyBox(() => id),
		forceMount: readonlyBox(() => forceMount),
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
