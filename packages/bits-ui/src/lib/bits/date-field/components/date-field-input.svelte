<script lang="ts">
	import { box } from "svelte-toolbelt";
	import { useDateFieldInput } from "../date-field.svelte.js";
	import type { DateFieldInputProps } from "../types.js";
	import DateFieldHiddenInput from "./date-field-hidden-input.svelte";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import { useId } from "$lib/internal/useId.js";

	let {
		id = useId(),
		ref = $bindable(null),
		name = "",
		children,
		child,
		...restProps
	}: DateFieldInputProps = $props();

	const inputState = useDateFieldInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		name: box.with(() => name),
	});

	const mergedProps = $derived(mergeProps(restProps, inputState.props));
</script>

{#if child}
	{@render child({ props: mergedProps, segments: inputState.root.segmentContents })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ segments: inputState.root.segmentContents })}
	</div>
{/if}

<DateFieldHiddenInput />
