<script lang="ts">
	import { getAccordionContentState } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import Presence from "$lib/bits/utilities/presence.svelte";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";
	import { generateId } from "$lib/internal/id.js";

	let {
		child,
		asChild,
		el: elProp = $bindable(),
		id: idProp = generateId(),
		forceMount: forceMountProp = false,
		children,
		style: styleProp = {},
		...restProps
	}: AccordionContentProps = $props();

	const el = box(
		() => elProp,
		(v) => (elProp = v)
	);
	const id = readonlyBox(() => idProp);
	const forceMount = readonlyBox(() => forceMountProp);
	const content = getAccordionContentState({ presentEl: el, forceMount, id });
</script>

<Presence forceMount={true} present={content.item.isSelected} node={content.node}>
	{#snippet presence({ present })}
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
			<div {...mergedProps} bind:this={el.value} hidden={present.value ? undefined : true}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Presence>
