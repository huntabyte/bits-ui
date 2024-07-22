<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ItemProps } from "../index.js";
	import { useListboxItem } from "../listbox.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		value,
		disabled = false,
		label = "",
		...restProps
	}: ItemProps = $props();

	const itemState = useListboxItem({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => {
				value = v;
			}
		),
		disabled: box.with(() => disabled),
		label: box.with(() => label),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if child}
	{@render child?.({ props: mergedProps, selected: itemState.isSelected })}
{:else}
	<div {...mergedProps}>
		{#if children}
			{@render children?.({ selected: itemState.isSelected })}
		{:else if label}
			{label}
		{/if}
	</div>
{/if}
