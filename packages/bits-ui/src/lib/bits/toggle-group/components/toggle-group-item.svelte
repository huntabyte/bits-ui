<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ItemProps } from "../index.js";
	import { useToggleGroupItem } from "../toggle-group.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		children,
		child,
		el = $bindable(),
		value,
		disabled = false,
		id = useId(),
		type = "button",
		...restProps
	}: ItemProps = $props();

	const itemState = useToggleGroupItem({
		id: box.with(() => id),
		value: box.with(() => value),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
