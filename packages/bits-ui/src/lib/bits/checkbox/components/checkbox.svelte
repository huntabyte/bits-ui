<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setCheckboxRootState } from "../checkbox.svelte.js";
	import CheckboxInput from "./checkbox-input.svelte";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";

	let {
		checked: checkedProp = $bindable(false),
		onCheckedChange,
		disabled: disabledProp = false,
		required: requiredProp = false,
		name: nameProp,
		value: valueProp,
		el = $bindable(),
		onclick: onclickProp = () => {},
		onkeydown: onkeydownProp = () => {},
		asChild,
		child,
		indicator,
		...restProps
	}: RootProps = $props();

	const checked = box(
		() => checkedProp,
		(v) => {
			checkedProp = v;
			onCheckedChange?.(v);
		}
	);
	const disabled = readonlyBox(() => disabledProp);
	const required = readonlyBox(() => requiredProp);
	const name = readonlyBox(() => nameProp);
	const value = readonlyBox(() => valueProp);
	const onclick = readonlyBox(() => onclickProp);
	const onkeydown = readonlyBox(() => onkeydownProp);

	const checkboxState = setCheckboxRootState({
		checked,
		disabled,
		required,
		name,
		value,
		onclick,
		onkeydown,
	});

	const mergedProps = $derived({
		...checkboxState.props,
		...restProps,
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: checkboxState.checked.value })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render indicator?.({ checked: checkboxState.checked.value })}
	</button>
{/if}

<CheckboxInput />
