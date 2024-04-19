<script lang="ts">
	import { getAccordionContentState } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import Presence from "$lib/bits/utilities/presence-layer/presence-layer.svelte";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";

	let {
		child,
		asChild,
		el = $bindable(),
		id = generateId(),
		forceMount = false,
		children,
		style = {},
		...restProps
	}: AccordionContentProps = $props();

	const content = getAccordionContentState({
		forceMount: readonlyBox(() => forceMount),
		id: readonlyBox(() => id),
		style: readonlyBox(() => style),
	});
</script>

<Presence forceMount={true} present={content.present} {id}>
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
