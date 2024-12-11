<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SliderRootProps } from "../types.js";
	import { useSliderRoot } from "../slider.svelte.js";
	import { useId } from "$lib/internal/use-id.js";
	import { noop } from "$lib/internal/noop.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		value = $bindable([]),
		onValueChange = noop,
		onValueCommit = noop,
		disabled = false,
		min = 0,
		max = 100,
		step = 1,
		dir = "ltr",
		autoSort = true,
		orientation = "horizontal",
		controlledValue = false,
		...restProps
	}: SliderRootProps = $props();

	const rootState = useSliderRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => {
				if (controlledValue) {
					onValueChange(v);
				} else {
					value = v;
					onValueChange(v);
				}
			}
		),
		onValueCommit: box.with(() => onValueCommit),
		disabled: box.with(() => disabled),
		min: box.with(() => min),
		max: box.with(() => max),
		step: box.with(() => step),
		dir: box.with(() => dir),
		autoSort: box.with(() => autoSort),
		orientation: box.with(() => orientation),
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
