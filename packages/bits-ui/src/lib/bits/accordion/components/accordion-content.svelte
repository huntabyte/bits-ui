<script lang="ts">
	import { getAccordionContentState } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import Presence from "$lib/bits/utilities/presence.svelte";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		child,
		asChild,
		el: elProp = $bindable(),
		forceMount: forceMountProp = false,
		children,
		style: styleProp = {},
		...restProps
	}: AccordionContentProps & { forceMount?: boolean } = $props();

	const el = box(
		() => elProp,
		(v) => (elProp = v)
	);

	const forceMount = readonlyBox(() => forceMountProp);
	const content = getAccordionContentState({ presentEl: el, forceMount });
</script>

<Presence forceMount={true} present={content.present} bind:el={el.value}>
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
