<script lang="ts">
	import type { AccordionTriggerProps } from "../types.js";
	import { getAccordionTriggerState } from "../accordion.svelte.js";
	import { mergeProps, readonlyBox, useId } from "$lib/internal/index.js";

	let {
		disabled = false,
		asChild,
		el = $bindable(),
		id = useId(),
		children,
		child,
		...restProps
	}: AccordionTriggerProps = $props();

	const trigger = getAccordionTriggerState({
		disabled: readonlyBox(() => disabled),
		id: readonlyBox(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, trigger.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} type="button" {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
