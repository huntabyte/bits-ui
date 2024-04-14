<script lang="ts">
	import type { AccordionTriggerProps } from "../types.js";
	import { getAccordionTriggerState } from "../accordion.svelte.js";
	import { generateId } from "$lib/internal/id.js";
	import { box } from "$lib/internal/box.svelte.js";

	let {
		disabled: disabledProp = false,
		asChild,
		el,
		id: idProp = generateId(),
		onkeydown: onkeydownProp = () => {},
		onclick: onclickProp = () => {},
		children,
		child,
		...restProps
	}: AccordionTriggerProps = $props();

	const disabled = box(() => disabledProp);
	const id = box(() => idProp);
	const onkeydown = box(() => onkeydownProp);
	const onclick = box(() => onclickProp);

	const trigger = getAccordionTriggerState({
		disabled,
		onkeydown,
		onclick,
		id,
	});

	const mergedProps = $derived({
		...restProps,
		...trigger.props,
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} type="button" {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
