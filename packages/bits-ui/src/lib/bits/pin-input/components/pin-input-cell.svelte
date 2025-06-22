<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { PinInputCellProps } from "../types.js";
	import { PinInputCellState } from "../pin-input.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		cell,
		child,
		children,
		...restProps
	}: PinInputCellProps = $props();

	const cellState = PinInputCellState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		cell: box.with(() => cell),
	});

	const mergedProps = $derived(mergeProps(restProps, cellState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
