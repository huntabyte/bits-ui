<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { GroupItemProps } from "../index.js";
	import { useToolbarGroupItem } from "../toolbar.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		value,
		disabled = false,
		type = "button",
		id = useId(),
		el = $bindable(),
		...restProps
	}: GroupItemProps = $props();

	const state = useToolbarGroupItem({
		id: box.with(() => id),
		value: box.with(() => value),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props, { type }));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
