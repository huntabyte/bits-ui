<script lang="ts">
	import type { AccordionItemProps } from "../types.js";
	import { setAccordionItemState } from "../accordion.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";
	let {
		asChild,
		disabled = false,
		value,
		children,
		child,
		el = $bindable(),
		style,
		...restProps
	}: AccordionItemProps = $props();

	const item = setAccordionItemState({
		value: readonlyBox(() => value),
		disabled: readonlyBox(() => disabled),
	});

	const mergedProps = $derived({
		...restProps,
		...item.props,
		"data-state": item.isSelected ? "open" : "closed",
		"data-disabled": item.isDisabled ? "" : undefined,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
