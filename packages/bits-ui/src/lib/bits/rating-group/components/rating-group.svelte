<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { RatingGroupRootProps } from "../types.js";
	import { RatingGroupRootState } from "../rating-group.svelte.js";
	import RatingGroupInput from "./rating-group-input.svelte";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";

	const uid = $props.id();

	let {
		disabled = false,
		children,
		child,
		value = $bindable(0),
		ref = $bindable(null),
		orientation = "horizontal",
		name = undefined,
		required = false,
		min = 0,
		max = 5,
		allowHalf = false,
		readonly = false,
		id = createId(uid),
		onValueChange = noop,
		"aria-label": ariaLabel,
		"aria-valuetext": ariaValuetextProp,
		hoverPreview = true,
		...restProps
	}: RatingGroupRootProps = $props();

	if (value < min || value > max) {
		value = Math.max(min, Math.min(max, value));
	}

	const ariaValuetext: NonNullable<RatingGroupRootProps["aria-valuetext"]> = $derived.by(() => {
		if (ariaValuetextProp) return ariaValuetextProp;
		return (value: number, max: number) => `${value} out of ${max}`;
	});

	const rootState = RatingGroupRootState.create({
		orientation: box.with(() => orientation),
		disabled: box.with(() => disabled),
		name: box.with(() => name),
		required: box.with(() => required),
		min: box.with(() => min),
		max: box.with(() => max),
		allowHalf: box.with(() => allowHalf),
		readonly: box.with(() => readonly),
		id: box.with(() => id),
		value: box.with(
			() => value,
			(v) => {
				if (v === value) return;
				value = v;
				onValueChange?.(v);
			}
		),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		ariaValuetext: box.with(() => ariaValuetext),
		hoverPreview: box.with(() => hoverPreview),
	});

	const mergedProps = $derived(
		mergeProps(restProps, rootState.props, { "aria-label": ariaLabel })
	);
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</div>
{/if}

<RatingGroupInput />
