<script lang="ts">
	import type { ItemProps } from "../index.js";
	import { useRadioGroupItem } from "../radio-group.svelte.js";
	import { readonlyBox, styleToString, useId } from "$lib/internal/index.js";

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
		value: readonlyBox(() => value),
		disabled: readonlyBox(() => disabled),
		id: readonlyBox(() => id),
		onclick: readonlyBox(() => onclick),
		onkeydown: readonlyBox(() => onkeydown),
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
