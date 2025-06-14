<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { SliderRangeProps } from "../types.js";
	import { SliderRangeState } from "../slider.svelte.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		children,
		child,
		ref = $bindable(null),
		id = createId(uid),
		...restProps
	}: SliderRangeProps = $props();

	const rangeState = SliderRangeState.create({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});
	const mergedProps = $derived(mergeProps(restProps, rangeState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
