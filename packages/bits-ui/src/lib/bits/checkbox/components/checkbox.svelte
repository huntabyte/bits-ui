<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setCheckboxRootState } from "../checkbox.svelte.js";
	import CheckboxInput from "./checkbox-input.svelte";
	import { box } from "$lib/internal/box.svelte.js";

	let {
		checked: checkedProp = $bindable(false),
		onCheckedChange,
		disabled: disabledProp = false,
		required: requiredProp = false,
		name: nameProp = undefined,
		value: valueProp = undefined,
		el = $bindable(),
		onclick: onclickProp,
		onkeydown: onkeydownProp,
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
	const disabled = box(() => disabledProp);
	const required = box(() => requiredProp);
	const name = box(() => nameProp);
	const value = box(() => valueProp);
	const onclick = box(() => onclickProp);
	const onkeydown = box(() => onkeydownProp);

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
