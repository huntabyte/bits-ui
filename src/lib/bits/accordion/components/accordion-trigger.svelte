<script lang="ts">
	import type { AccordionTriggerProps } from "../types.js";
	import { getAccordionTriggerState } from "../state.svelte.js";

	let {
		disabled = false,
		asChild = false,
		el,
		onkeydown = undefined,
		onclick = undefined,
		children,
		child,
		...props
	} = $props<AccordionTriggerProps>();

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
		...props,
		...trigger.props,
	});
</script>

{#if asChild && child}
	{@render child(mergedProps)}
{:else}
	<button bind:this={el} type="button" {...mergedProps}>
		{#if children}
			{@render children()}
		{/if}
	</button>
{/if}
