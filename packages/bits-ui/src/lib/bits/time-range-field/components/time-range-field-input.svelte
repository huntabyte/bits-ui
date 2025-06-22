<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { TimeRangeFieldInputProps } from "../types.js";
	import { TimeRangeFieldInputState } from "../time-range-field.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import TimeFieldHiddenInput from "$lib/bits/time-field/components/time-field-hidden-input.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		name = "",
		child,
		children,
		type,
		...restProps
	}: TimeRangeFieldInputProps = $props();

	const inputState = TimeRangeFieldInputState.create(
		{
			id: box.with(() => id),
			ref: box.with(
				() => ref,
				(v) => (ref = v)
			),
			name: box.with(() => name),
		},
		type
	);

	const mergedProps = $derived(mergeProps(restProps, inputState.props, { role: "presentation" }));
</script>

{#if child}
	{@render child({ props: mergedProps, segments: inputState.root.segmentContents })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ segments: inputState.root.segmentContents })}
	</div>
{/if}

<TimeFieldHiddenInput />
