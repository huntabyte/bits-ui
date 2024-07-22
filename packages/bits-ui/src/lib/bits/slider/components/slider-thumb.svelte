<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { ThumbProps } from "../index.js";
	import { useSliderThumb } from "../slider.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		children,
		child,
		ref = $bindable(null),
		id = useId(),
		index,
		disabled = false,
		...restProps
	}: ThumbProps = $props();

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
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
