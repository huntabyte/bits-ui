<script lang="ts">
	import type { AccordionTriggerProps } from "../types.js";
	import { getAccordionTriggerState } from "../accordion.svelte.js";
	import { generateId } from "$lib/internal/id.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		disabled = false,
		asChild,
		el,
		id = generateId(),
		onkeydown = () => {},
		onclick = () => {},
		children,
		child,
		style,
		...restProps
	}: AccordionTriggerProps = $props();

	const trigger = getAccordionTriggerState({
		disabled: readonlyBox(() => disabled),
		onkeydown: readonlyBox(() => onkeydown),
		onclick: readonlyBox(() => onclick),
		id: readonlyBox(() => id),
	});

	const mergedProps = $derived({
		...restProps,
		...trigger.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} type="button" {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
