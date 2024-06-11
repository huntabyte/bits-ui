<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ItemProps } from "../index.js";
	import { useSelectItem } from "../select.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		value,
		textValue = "",
		el = $bindable(),
		asChild,
		children,
		child,
		disabled = false,
		...restProps
	}: ItemProps = $props();

	const itemState = useSelectItem({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		value: box.with(() => value),
		textValue: box.with(() => textValue),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, selected: itemState.isSelected })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.({ selected: itemState.isSelected })}
	</div>
{/if}
