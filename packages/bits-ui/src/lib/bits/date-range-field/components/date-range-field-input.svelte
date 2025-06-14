<script lang="ts">
	import { box, mergeProps } from "svelte-toolbelt";
	import type { DateRangeFieldInputProps } from "../types.js";
	import { DateRangeFieldInputState } from "../date-range-field.svelte.js";
	import { createId } from "$lib/internal/create-id.js";
	import DateFieldHiddenInput from "$lib/bits/date-field/components/date-field-hidden-input.svelte";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		name = "",
		child,
		children,
		type,
		...restProps
	}: DateRangeFieldInputProps = $props();

	const inputState = DateRangeFieldInputState.create(
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

<DateFieldHiddenInput />
