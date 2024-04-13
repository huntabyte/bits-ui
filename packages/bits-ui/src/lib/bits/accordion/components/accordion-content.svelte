<script lang="ts" context="module">
	// eslint-disable-next-line unused-imports/no-unused-imports, ts/no-unused-vars
	import type { Transition } from "$lib/internal/index.js";
</script>

<script lang="ts" generics="T extends Transition, In extends Transition, Out extends Transition">
	import { getAccordionContentState } from "../accordion.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import WithTransition from "$lib/bits/utilities/with-transition.svelte";

	let {
		child,
		asChild,
		el = $bindable(),
		...restProps
	}: AccordionContentProps<T, In, Out> = $props();

	const content = getAccordionContentState();

	const mergedProps = $derived({
		...restProps,
		...content.props,
	});
</script>

{#if asChild && content.item.isSelected}
	{@render child?.(mergedProps)}
{:else}
	<WithTransition {...mergedProps} condition={content.item.isSelected} bind:el />
{/if}
