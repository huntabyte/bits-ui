<script lang="ts">
	import type { AccordionTriggerProps } from "../types.js";
	import { getAccordionTriggerState } from "../state.svelte.js";

	let {
		disabled = false,
		asChild,
		el,
		onkeydown = undefined,
		onclick = undefined,
		children,
		child,
		...restProps
	}: AccordionTriggerProps = $props();

	const trigger = getAccordionTriggerState({
		disabled,
		onkeydown,
		onclick,
	});

	$effect.pre(() => {
		trigger.disabled = disabled;
	});
	$effect.pre(() => {
		trigger.el = el;
	});
	$effect.pre(() => {
		trigger.handlers.click = onclick;
	});
	$effect.pre(() => {
		trigger.handlers.keydown = onkeydown;
	});

	const mergedProps = $derived({
		...restProps,
		...trigger.props,
	});
</script>

{#if asChild}
	{@render child?.(mergedProps)}
{:else}
	<button bind:this={el} type="button" {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
