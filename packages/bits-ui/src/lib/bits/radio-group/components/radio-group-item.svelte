<script lang="ts">
	import type { ItemProps } from "../index.js";
	import { setRadioGroupItemState } from "../radio-group.svelte.js";
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

	const item = setRadioGroupItemState({
		value: readonlyBox(() => value),
		disabled: readonlyBox(() => disabled),
		id: readonlyBox(() => id),
		onclick: readonlyBox(() => onclick),
		onkeydown: readonlyBox(() => onkeydown),
	});

	const mergedProps = $derived({
		...restProps,
		...item.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: item.checked })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.({ checked: item.checked })}
	</button>
{/if}
