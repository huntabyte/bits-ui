<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ItemProps } from "../index.js";
	import { useMenuItem } from "../menu.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		asChild,
		child,
		children,
		ref = $bindable(null),
		id = useId(),
		disabled = false,
		onSelect = noop,
		...restProps
	}: ItemProps = $props();

	const itemState = useMenuItem({
		id: box.with(() => id),
		disabled: box.with(() => disabled),
		onSelect: box.with(() => onSelect),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, itemState.props));
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div {...mergedProps} bind:this={ref}>
		{@render children?.()}
	</div>
{/if}
