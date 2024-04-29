<script lang="ts">
	import { box } from "runed";
	import type { ItemProps } from "../index.js";
	import { useMenuItem } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		el = $bindable(),
		id = useId(),
		disabled = false,
		onSelect = noop,
		...restProps
	}: ItemProps = $props();

	const state = useMenuItem({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		onSelect: box.with(() => onSelect),
	});

	const mergedProps = $derived(mergeProps(restProps, state.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={el}>
		{@render children?.()}
	</div>
{/if}
