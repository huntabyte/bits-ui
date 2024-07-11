<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { useDateRangeFieldRoot } from "../date-range-field.svelte.js";
	import type { RootProps } from "../index.js";
	import { useId } from "$lib/internal/useId.svelte.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { getDefaultDate } from "$lib/shared/date/utils.js";
	import type { DateRange } from "$lib/shared/index.js";
	import { mergeProps } from "$lib/internal/mergeProps.js";

	let {
		id = useId(),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		disabled = false,
		readonly = false,
		required = false,
		hourCycle,
		granularity,
		locale = "en-US",
		hideTimeZone = false,
		isDateUnavailable,
		maxValue,
		minValue,
		readonlySegments = [],
		children,
		child,
		...restProps
	}: RootProps = $props();

	if (placeholder === undefined) {
		placeholder = getDefaultDate({
			granularity,
			defaultPlaceholder: undefined,
			defaultValue: value?.start,
		});
	}

	if (value === undefined) {
		value = { start: undefined, end: undefined };
	}

	const rootState = useDateRangeFieldRoot({
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => disabled),
		readonly: box.with(() => readonly),
		required: box.with(() => required),
		hourCycle: box.with(() => hourCycle),
		granularity: box.with(() => granularity),
		locale: box.with(() => locale),
		hideTimeZone: box.with(() => hideTimeZone),
		isDateUnavailable: box.with(() => isDateUnavailable),
		maxValue: box.with(() => maxValue),
		minValue: box.with(() => minValue),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				if (v !== placeholder) {
					placeholder = v;
					onPlaceholderChange(v);
				}
			}
		),
		readonlySegments: box.with(() => readonlySegments),
		value: box.with(
			() => value as DateRange,
			(v) => {
				if (v !== value) {
					value = v;
					onValueChange(v);
				}
			}
		),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
