<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SliderThumbProps } from "../types.js";
	import { useSliderThumb } from "../slider.svelte.js";
	import { useId } from "$lib/internal/use-id.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		index,
		disabled = false,
		...restProps
	}: SliderThumbProps = $props();

	const thumbState = useSliderThumb({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		index: box.with(() => index),
		disabled: box.with(() => disabled),
	});

	const mergedProps = $derived(mergeProps(restProps, thumbState.props));
</script>

{#if child}
	{@render child({
		active: thumbState.root.isThumbActive(thumbState.opts.index.current),
		props: mergedProps,
	})}
{:else}
	<span {...mergedProps}>
		{@render children?.({
			active: thumbState.root.isThumbActive(thumbState.opts.index.current),
		})}
	</span>
{/if}
