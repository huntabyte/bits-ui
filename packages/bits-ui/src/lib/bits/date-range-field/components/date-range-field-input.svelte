<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { InputProps } from "../index.js";
	import {
		getDateRangeFieldRootContext,
		useDateRangeFieldInput,
	} from "../date-range-field.svelte.js";
	import { useId } from "$lib/internal/useId.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import DateFieldHiddenInput from "$lib/bits/date-field/components/date-field-hidden-input.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		name = "",
		child,
		children,
		type,
		...restProps
	}: InputProps = $props();

	const rootState = getDateRangeFieldRootContext();

	const fieldState = useDateRangeFieldInput({
		name: box.with(() => name),
		value: type === "start" ? rootState.startValue : rootState.endValue,
	});

	const inputState = fieldState.createInput({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
	});

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
