<script lang="ts">
	import { getAccordionContentState } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import { PresenceLayer } from "$lib/bits/utilities/presence-layer/index.js";
	import { mergeProps, readonlyBox, useId } from "$lib/internal/index.js";

	let {
		child,
		asChild,
		el = $bindable(),
		id = useId(),
		forceMount = false,
		children,
		...restProps
	}: AccordionContentProps = $props();

	const content = getAccordionContentState({
		forceMount: readonlyBox(() => forceMount),
		id: readonlyBox(() => id),
	});
</script>

<PresenceLayer forceMount={true} present={content.present} {id}>
	{#snippet presence({ present })}
		{@const mergedProps = mergeProps(restProps, content.props, {
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
