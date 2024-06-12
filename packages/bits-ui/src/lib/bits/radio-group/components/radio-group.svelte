<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useRadioGroupRoot } from "../radio-group.svelte.js";
	import RadioGroupInput from "./radio-group-input.svelte";
	import { styleToString, useId } from "$lib/internal/index.js";

	let {
		disabled = false,
		asChild,
		children,
		child,
		style,
		value = $bindable(""),
		ref = $bindable(),
		orientation = "vertical",
		loop = true,
		name = undefined,
		required = false,
		id = useId(),
		onValueChange,
		...restProps
	}: RootProps = $props();

	const rootState = useRadioGroupRoot({
		orientation: box.with(() => orientation),
		disabled: box.with(() => disabled),
		loop: box.with(() => loop),
		name: box.with(() => name),
		required: box.with(() => required),
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				value = v;
				onValueChange?.(v);
			}
		),
	});

	const mergedProps = $derived({
		...restProps,
		...rootState.props,
		style: styleToString(style),
	});
</script>

{#if asChild}
	{@render child?.({ props: mergedProps })}
{:else}
	<div bind:this={ref} {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

<RadioGroupInput />
