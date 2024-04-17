<script lang="ts">
	import type { ItemProps } from "../index.js";
	import { setRadioGroupItemState } from "../radio-group.svelte.js";
	import { generateId } from "$lib/internal/id.js";
	import { readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		id: idProp = generateId(),
		asChild,
		children,
		child,
		value: valueProp,
		disabled: disabledProp = false,
		onclick: onclickProp = () => {},
		onkeydown: onkeydownProp = () => {},
		el = $bindable(),
		style = {},
		...restProps
	}: ItemProps = $props();

	const value = readonlyBox(() => valueProp);
	const disabled = readonlyBox(() => disabledProp);
	const id = readonlyBox(() => idProp);
	const onclick = readonlyBox(() => onclickProp);
	const onkeydown = readonlyBox(() => onkeydownProp);

	const item = setRadioGroupItemState({ value, disabled, id, onclick, onkeydown });

	const mergedProps = $derived({
		...restProps,
		...item.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
