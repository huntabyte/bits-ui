<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { SelectItemProps } from "../types.js";
	import { useSelectItem } from "../select.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { mergeProps } from "$lib/internal/merge-props.js";

	let {
		id = useId(),
		value,
		textValue = "",
		ref = $bindable(null),
		children,
		child,
		disabled = false,
		...restProps
	}: SelectItemProps = $props();

	const itemState = useSelectItem({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		value: box.with(() => value),
		textValue: box.with(() => textValue),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, selected: itemState.isSelected })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ selected: itemState.isSelected })}
	</div>
{/if}
