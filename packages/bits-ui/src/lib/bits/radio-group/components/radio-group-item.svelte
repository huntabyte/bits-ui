<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ItemProps } from "../index.js";
	import { useRadioGroupItem } from "../radio-group.svelte.js";
	import { styleToString, useId } from "$lib/internal/index.js";

	let {
		id = useId(),
		asChild,
		children,
		child,
		value,
		disabled = false,
		ref = $bindable(null),
		style = {},
		...restProps
	}: ItemProps = $props();

	const itemState = useRadioGroupItem({
		value: box.with(() => value),
		disabled: box.with(() => disabled),
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived({
		...restProps,
		...itemState.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: itemState.checked })}
{:else}
	<button {...mergedProps}>
		{@render children?.({ checked: itemState.checked })}
	</button>
{/if}
