<script lang="ts" context="module">
	type T = Transition;
	type In = Transition;
	type Out = Transition;
</script>

<script lang="ts" generics="T extends Transition, In extends Transition, Out extends Transition">
	import { getAccordionContentState } from "../state.svelte.js";
	import type { AccordionContentProps } from "../types.js";
	import type { Transition } from "$lib/internal/index.js";
	import WithTransition from "$lib/bits/utilities/with-transition.svelte";

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
