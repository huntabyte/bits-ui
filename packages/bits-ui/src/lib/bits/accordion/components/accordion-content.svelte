<script lang="ts" context="module">
	import type { Transition } from "$lib/internal/index.js";
	import { getAccordionContentState } from "../state.svelte.js";
</script>

<script lang="ts" generics="T extends Transition, In extends Transition, Out extends Transition">
	import WithTransition from "$lib/bits/utilities/with-transition.svelte";
	import type { AccordionContentProps } from "../types.js";

	let { child, asChild, ...props }: AccordionContentProps<T, In, Out> = $props();

	const content = getAccordionContentState();

	const mergedProps = $derived({
		...props,
		...content.props,
	});
</script>

{#if asChild && content.item.isSelected}
	{#if child}
		{@render child(mergedProps)}
	{/if}
{:else}
	<WithTransition {...mergedProps} condition={content.item.isSelected} />
{/if}
