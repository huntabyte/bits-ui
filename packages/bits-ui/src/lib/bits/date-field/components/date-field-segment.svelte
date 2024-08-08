<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDateFieldSegment } from "../date-field.svelte.js";
	import type { SegmentProps } from "../index.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		children,
		child,
		part,
		...restProps
	}: SegmentProps = $props();

	const segmentState = useDateFieldSegment(part, {
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

	const mergedProps = $derived(
		mergeProps(restProps, segmentState.props as Record<string, unknown>)
	);
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<span {...mergedProps}>
		{@render children?.()}
	</span>
{/if}
