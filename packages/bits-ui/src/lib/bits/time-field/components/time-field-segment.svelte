<script lang="ts">
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import { DateFieldSegmentState } from "../time-field.svelte.js";
	import type { TimeFieldSegmentProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		children,
		child,
		part,
		...restProps
	}: TimeFieldSegmentProps = $props();

	const segmentState = DateFieldSegmentState.create(part, {
		id: boxWith(() => id),
		ref: boxWith(
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
