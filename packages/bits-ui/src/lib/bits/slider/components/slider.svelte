<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { RootProps } from "../index.js";
	import { useSliderRoot } from "../slider.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		children,
		child,
		id = useId(),
		ref = $bindable(null),
		value = $bindable([]),
		onValueChange = noop,
		onValueChangeEnd = noop,
		disabled = false,
		min = 0,
		max = 100,
		step = 1,
		dir = "ltr",
		autoSort = true,
		orientation = "horizontal",
		...restProps
	}: RootProps = $props();

	const rootState = useSliderRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		value: box.with(
			() => value,
			(v) => {
				if (value !== v) {
					value = v;
					onValueChange(v);
				}
			}
		),
		onValueChangeEnd: box.with(() => onValueChangeEnd),
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
