<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { AccordionTriggerProps } from "../types.js";
	import { useAccordionTrigger } from "../accordion.svelte.js";
	import { mergeProps, useId } from "$lib/internal/index.js";

	let {
		disabled = false,
		asChild,
		el = $bindable(),
		id = useId(),
		children,
		child,
		...restProps
	}: AccordionTriggerProps = $props();

	const triggerState = useAccordionTrigger({
		disabled: box.with(() => disabled),
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, triggerState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} type="button" {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
