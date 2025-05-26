<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SliderTickLabelProps } from "../types.js";
	import { useSliderTickLabel } from "../slider.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		index,
		position = "top",
		...restProps
	}: SliderTickLabelProps = $props();

	const tickLabelState = useSliderTickLabel({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		index: box.with(() => index),
		position: box.with(() => position),
	});

	const mergedProps = $derived(mergeProps(restProps, tickLabelState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>{@render children?.()}</span>
{/if}
