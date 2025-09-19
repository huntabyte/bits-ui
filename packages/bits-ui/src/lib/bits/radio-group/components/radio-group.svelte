<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { RadioGroupRootProps } from "../types.js";
	import { RadioGroupRootState } from "../radio-group.svelte.js";
	import RadioGroupInput from "./radio-group-input.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		disabled = false,
		children,
		child,
		value = $bindable(""),
		ref = $bindable(null),
		orientation = "vertical",
		loop = true,
		name = undefined,
		required = false,
		readonly = false,
		id = createId(uid),
		onValueChange = noop,
		...restProps
	}: RadioGroupRootProps = $props();

	const rootState = RadioGroupRootState.create({
		orientation: boxWith(() => orientation),
		disabled: boxWith(() => disabled),
		loop: boxWith(() => loop),
		name: boxWith(() => name),
		required: boxWith(() => required),
		readonly: boxWith(() => readonly),
		id: boxWith(() => id),
		value: boxWith(
			() => value,
			(v) => {
				if (v === value) return;
				value = v;
				onValueChange?.(v);
			}
		),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}

<RadioGroupInput />
