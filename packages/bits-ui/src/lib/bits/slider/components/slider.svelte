<script lang="ts">
	import { box, mergeProps, type WritableBox } from "svelte-toolbelt";
	import type { SliderRootProps } from "../types.js";
	import { SliderRootState } from "../slider.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import { watch } from "runed";

	const uid = $props.id();

	let {
		children,
		child,
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		type,
		onValueChange = noop,
		onValueCommit = noop,
		disabled = false,
		min: minProp,
		max: maxProp,
		step = 1,
		dir = "ltr",
		autoSort = true,
		orientation = "horizontal",
		thumbPositioning = "contain",
		trackPadding,
		...restProps
	}: SliderRootProps = $props();

	const min = $derived.by(() => {
		if (minProp !== undefined) return minProp;
		if (Array.isArray(step)) return Math.min(...step);
		return 0;
	});

	const max = $derived.by(() => {
		if (maxProp !== undefined) return maxProp;
		if (Array.isArray(step)) return Math.max(...step);
		return 100;
	});

	function handleDefaultValue() {
		if (value !== undefined) return;
		if (type === "single") {
			return min;
		}
		return [];
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = SliderRootState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => {
				value = v;
				// @ts-expect-error - we know
				onValueChange(v);
			}
		) as WritableBox<number> | WritableBox<number[]>,
		// @ts-expect-error - we know
		onValueCommit: box.with(() => onValueCommit),
		disabled: box.with(() => disabled),
		min: box.with(() => min),
		max: box.with(() => max),
		step: box.with(() => step),
		dir: box.with(() => dir),
		autoSort: box.with(() => autoSort),
		orientation: box.with(() => orientation),
		thumbPositioning: box.with(() => thumbPositioning),
		type,
		trackPadding: box.with(() => trackPadding),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, ...rootState.snippetProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.(rootState.snippetProps)}
	</span>
{/if}
