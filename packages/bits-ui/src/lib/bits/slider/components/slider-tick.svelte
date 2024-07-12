<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { TickProps } from "../index.js";
	import { useSliderTick } from "../slider.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		index,
		...restProps
	}: TickProps = $props();

	const tickState = useSliderTick({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		index: box.with(() => index),
	});

	const mergedProps = $derived(mergeProps(restProps, tickState.props));
</script>

{#if child}
	{@render child?.({ props: mergedProps })}
{:else}
	<span {...mergedProps}>{@render children?.()}</span>
{/if}
