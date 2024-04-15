<script lang="ts">
	import { getCollapsibleContentState } from "../collapsible.svelte.js";
	import type { CollapsibleContentProps } from "../types.js";
	import Presence from "$lib/bits/utilities/presence.svelte";
	import { generateId } from "$lib/internal/id.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";

	let {
		child,
		asChild,
		el: elProp = $bindable(),
		forceMount = false,
		children,
		id: idProp = generateId(),
		...restProps
	}: CollapsibleContentProps & { forceMount?: boolean } = $props();

	const id = readonlyBox(() => idProp);
	const el = box(
		() => elProp,
		(v) => (elProp = v)
	);
	const content = getCollapsibleContentState({ id, presentEl: el });

	const mergedProps = $derived({
		...restProps,
		...content.props,
	});
</script>

<Presence present={forceMount || content.root.open.value} bind:el={el.value}>
	{#snippet presence({ node, present })}
		{#if asChild}
			{@render child?.({ props: { ...mergedProps, hidden: !present.value } })}
		{:else}
			<div {...mergedProps} hidden={!present.value} bind:this={node.value}>
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
