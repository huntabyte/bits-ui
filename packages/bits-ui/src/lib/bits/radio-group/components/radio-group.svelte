<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setRadioGroupRootState } from "../radio-group.svelte.js";
	import RadioGroupInput from "./radio-group-input.svelte";
	import { box, readonlyBox, styleToString, useId } from "$lib/internal/index.js";

	let {
		disabled = false,
		asChild,
		children,
		child,
		style,
		value = $bindable(""),
		el = $bindable(),
		orientation = "vertical",
		loop = true,
		name = undefined,
		required = false,
		id = useId(),
		onValueChange,
		...restProps
	}: RootProps = $props();

	const root = setRadioGroupRootState({
		orientation: readonlyBox(() => orientation),
		disabled: readonlyBox(() => disabled),
		loop: readonlyBox(() => loop),
		name: readonlyBox(() => name),
		required: readonlyBox(() => required),
		id: readonlyBox(() => id),
		value: box(
			() => value,
			(v) => {
				value = v;
				onValueChange?.(v);
			}
		),
	});

	const mergedProps = $derived({
		...restProps,
		...root.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={el} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

<RadioGroupInput />
