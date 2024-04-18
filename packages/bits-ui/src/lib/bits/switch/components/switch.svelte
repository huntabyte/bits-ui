<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setSwitchRootState } from "../switch.svelte.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		child,
		asChild,
		children,
		el = $bindable(),
		disabled: disabledProp = false,
		required: requiredProp = false,
		checked: checkedProp = false,
		value: valueProp = "",
		name: nameProp = undefined,
		onclick: onclickProp = () => {},
		onkeydown: onkeydownProp = () => {},
		onCheckedChange,
		style = {},
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
	const value = readonlyBox(() => valueProp);
	const name = readonlyBox(() => nameProp);
	const onclick = readonlyBox(() => onclickProp);
	const onkeydown = readonlyBox(() => onkeydownProp);

	const rootState = setSwitchRootState({
		checked,
		disabled,
		required,
		value,
		name,
		onclick,
		onkeydown,
	});

	const mergedProps = $derived({
		...restProps,
		...rootState.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps, checked: rootState.checked.value })}
{:else}
	<button bind:this={el} {...mergedProps}>
		{@render children?.()}
	</button>
{/if}
