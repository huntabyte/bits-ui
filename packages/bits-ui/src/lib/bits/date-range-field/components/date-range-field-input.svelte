<script lang="ts">
	import { noop } from "$lib/internal/callbacks.js";
	import { box } from "svelte-toolbelt";
	import type { InputProps } from "../index.js";
	import type { DateValue } from "@internationalized/date";
	import {
		getDateRangeFieldRootContext,
		useDateRangeFieldInput,
	} from "../date-range-field.svelte.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";
	import DateFieldHiddenInput from "$lib/bits/date-field/components/date-field-hidden-input.svelte";

	let {
		id = useId(),
		ref = $bindable(null),
		name = "",
		onValueChange = noop,
		asChild,
		child,
		children,
		type,
		...restProps
	}: InputProps = $props();

	const rootState = getDateRangeFieldRootContext();

	let value = $state<DateValue | undefined>(
		type === "start" ? rootState.startValue : rootState.endValue
	);

	const fieldState = useDateRangeFieldInput({
		name: box.with(() => name),
		value: box.with(
			() => (type === "start" ? rootState.startValue : rootState.endValue),
			(v) => {
				type === "start" ? (rootState.startValue = v) : (rootState.endValue = v);
				onValueChange(v);
			}
		),
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

{#if asChild}
	{@render child?.({ props: mergedProps, segments: inputState.root.segmentContents })}
{:else}
	<div {...mergedProps}>
		{@render children?.({ segments: inputState.root.segmentContents })}
	</div>
{/if}

<DateFieldHiddenInput />
