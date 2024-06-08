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

	const state = useSelectItemText({
		id: box.with(() => id),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if state.item.isSelected && state.item.root.valueId.value && !state.item.root.valueNodeHasChildren.value}
	<Portal to={`#${state.item.root.valueId.value}`}>
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
