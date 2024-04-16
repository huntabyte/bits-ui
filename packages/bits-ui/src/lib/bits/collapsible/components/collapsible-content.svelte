<script lang="ts">
	import { getCollapsibleContentState } from "../collapsible.svelte.js";
	import type { CollapsibleContentProps } from "../types.js";
	import Presence from "$lib/bits/utilities/presence.svelte";
	import { generateId } from "$lib/internal/id.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";

	let {
		child,
		asChild,
		el = $bindable(),
		forceMount: forceMountProp = false,
		children,
		id: idProp = generateId(),
		style: styleProp = {},
		...restProps
	}: CollapsibleContentProps & { forceMount?: boolean } = $props();

	const id = readonlyBox(() => idProp);
	const forceMount = readonlyBox(() => forceMountProp);

	const style = readonlyBox(() => styleProp);
	const content = getCollapsibleContentState({ id, style, forceMount });
</script>

<Presence forceMount={true} present={content.present} node={content.node}>
	{#snippet presence({ present })}
		{@const mergedProps = {
			...restProps,
			...content.props,
			hidden: present.value ? undefined : true,
		}}
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
</Presence>
