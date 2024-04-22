<script lang="ts">
	import type { AccordionItemProps } from "../types.js";
	import { setAccordionItemState } from "../accordion.svelte.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { mergeProps } from "$lib/internal/merge-props.js";
	let {
		asChild,
		disabled = false,
		value,
		children,
		child,
		el = $bindable(),
		...restProps
	}: AccordionItemProps = $props();

	const item = setAccordionItemState({
		value: readonlyBox(() => value),
		disabled: readonlyBox(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, item.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
