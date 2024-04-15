<script lang="ts">
	import type { AccordionItemProps } from "../types.js";
	import { setAccordionItemState } from "../accordion.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	let {
		asChild,
		disabled: disabledProp = false,
		value: valueProp,
		children,
		child,
		el = $bindable(),
		...restProps
	}: AccordionItemProps = $props();

	const disabled = readonlyBox(() => disabledProp);
	const value = readonlyBox(() => valueProp);

	const item = setAccordionItemState({ value, disabled });

	const mergedProps = $derived({
		...restProps,
		...item.props,
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
