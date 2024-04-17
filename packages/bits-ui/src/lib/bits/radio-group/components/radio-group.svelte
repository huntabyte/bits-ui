<script lang="ts">
	import type { RootProps } from "../index.js";
	import { setRadioGroupRootState } from "../radio-group.svelte.js";
	import { generateId } from "$lib/internal/id.js";
	import { box, readonlyBox } from "$lib/internal/box.svelte.js";
	import { styleToString } from "$lib/internal/style.js";

	let {
		disabled: disabledProp = false,
		asChild,
		children,
		child,
		style,
		value: valueProp = $bindable(""),
		el = $bindable(),
		orientation: orientationProp = "vertical",
		loop: loopProp = true,
		name: nameProp = undefined,
		required: requiredProp = false,
		id: idProp = generateId(),
		onValueChange,
		...restProps
	}: RootProps = $props();

	const disabled = readonlyBox(() => disabledProp);
	const value = box(
		() => valueProp,
		(v) => {
			valueProp = v;
			onValueChange?.(v);
		}
	);
	const orientation = readonlyBox(() => orientationProp);
	const loop = readonlyBox(() => loopProp);
	const name = readonlyBox(() => nameProp);
	const required = readonlyBox(() => requiredProp);
	const id = readonlyBox(() => idProp);

	const root = setRadioGroupRootState({ orientation, disabled, loop, name, required, id, value });

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
