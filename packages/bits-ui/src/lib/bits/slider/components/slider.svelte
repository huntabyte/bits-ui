<script lang="ts">
	import { box, mergeProps, type WritableBox } from "svelte-toolbelt";
	import type { SliderRootProps } from "../types.js";
	import { useSliderRoot } from "../slider.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";
	import { watch } from "runed";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		value = $bindable(),
		type,
		onValueChange = noop,
		onValueCommit = noop,
		disabled = false,
		min = 0,
		max = 100,
		step = 1,
		dir = "ltr",
		autoSort = true,
		orientation = "horizontal",
		thumbPositioning = "contain",
		...restProps
	}: SliderRootProps = $props();

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = type === "single" ? 0 : [];
	}

	// SSR
	handleDefaultValue();

	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = useSliderRoot({
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
