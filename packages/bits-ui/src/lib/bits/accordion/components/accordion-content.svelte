<script lang="ts">
	import { getAccordionContentState } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import Presence from "$lib/bits/utilities/presence.svelte";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { generateId } from "$lib/internal/id.js";

	let {
		child,
		asChild,
		el = $bindable(),
		id: idProp = generateId(),
		forceMount: forceMountProp = false,
		children,
		style: styleProp = {},
		...restProps
	}: AccordionContentProps = $props();

	const id = readonlyBox(() => idProp);
	const style = readonlyBox(() => styleProp);
	const forceMount = readonlyBox(() => forceMountProp);
	const content = getAccordionContentState({ forceMount, id, style });
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
