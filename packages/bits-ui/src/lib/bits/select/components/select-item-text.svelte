<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ItemTextProps } from "../index.js";
	import { useSelectItemText } from "../select.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";

	let {
		id = useId(),
		el = $bindable(),
		asChild,
		children,
		child,
		...restProps
	}: ItemTextProps = $props();

	const itemTextState = useSelectItemText({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, itemTextState.props));
</script>

{#if itemTextState.item.isSelected && itemTextState.item.root.valueId.value && !itemTextState.item.root.valueNodeHasChildren.value}
	<Portal to={`#${itemTextState.item.root.valueId.value}`}>
		{@render children?.()}
	</Portal>
{/if}

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<span {...mergedProps} bind:this={el}>
		{@render children?.()}
	</span>
{/if}
