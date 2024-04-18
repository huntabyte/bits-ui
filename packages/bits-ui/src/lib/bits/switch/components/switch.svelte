<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setSwitchRootState } from "../switch.svelte.js";
	import SwitchInput from "./switch-input.svelte";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		child,
		asChild,
		children,
		el = $bindable(),
		disabled = false,
		required = false,
		checked = false,
		value = "",
		name = undefined,
		onclick = () => {},
		onkeydown = () => {},
		onCheckedChange,
		style = {},
		...restProps
	}: RootProps = $props();

	const rootState = setSwitchRootState({
		checked: box(
			() => checked,
			(v) => {
				checked = v;
				onCheckedChange?.(v);
			}
		),
		disabled: readonlyBox(() => disabled),
		required: readonlyBox(() => required),
		value: readonlyBox(() => value),
		name: readonlyBox(() => name),
		onclick: readonlyBox(() => onclick),
		onkeydown: readonlyBox(() => onkeydown),
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

<SwitchInput />
