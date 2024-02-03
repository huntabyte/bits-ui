<script lang="ts" context="module">
	import type { Transition } from "$lib/internal/index.js";
	import { getAccordionContentState } from "../state.svelte.js";
	type T = Transition;
	type In = Transition;
	type Out = Transition;
</script>

<script lang="ts" generics="T extends Transition, In extends Transition, Out extends Transition">
	import WithTransition from "$lib/bits/utilities/with-transition.svelte";
	import type { AccordionContentProps } from "../types.js";

	let { child, asChild = false, ...props } = $props<AccordionContentProps<T, In, Out>>();

	const content = getAccordionContentState();
</script>

{#if asChild && content.item.isSelected}
	{#if child}
		{@render child({ ...props, ...content.attrs })}
	{/if}
{:else}
	<WithTransition {...props} {...content.attrs} condition={content.item.isSelected} />
{/if}
