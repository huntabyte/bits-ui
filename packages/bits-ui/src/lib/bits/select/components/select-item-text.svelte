<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SelectItemTextProps } from "../types.js";
	import { useSelectItemText } from "../select.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import Portal from "$lib/bits/utilities/portal/portal.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		...restProps
	}: SelectItemTextProps = $props();

	const itemTextState = useSelectItemText({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemTextState.props));
</script>

{#if itemTextState.item.isSelected && itemTextState.item.root.valueId.current && !itemTextState.item.root.valueNodeHasChildren.current && itemTextState.item.root.valueNode}
	<Portal to={`#${itemTextState.item.root.valueId.current}`}>
		{@render children?.()}
	</Portal>
{/if}

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
