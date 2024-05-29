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
		onclick = () => {},
		onkeydown = () => {},
		el = $bindable(),
		style = {},
		...restProps
	}: ItemProps = $props();

	const state = useRadioGroupItem({
		value: box.with(() => value),
		disabled: box.with(() => disabled),
		id: box.with(() => id),
		onclick: box.with(() => onclick),
		onkeydown: box.with(() => onkeydown),
	});

	const mergedProps = $derived({
		...restProps,
		...state.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: state.checked })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.({ checked: state.checked })}
	</button>
{/if}
