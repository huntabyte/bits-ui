<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { useDateRangeFieldRoot } from "../date-range-field.svelte.js";
	import type { RootProps } from "../index.js";
	import { useId } from "$lib/internal/useId.js";
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
		validate = noop,
		onInvalid = noop,
		maxValue,
		minValue,
		readonlySegments = [],
		children,
		child,
		onStartValueChange = noop,
		onEndValueChange = noop,
		controlledPlaceholder = false,
		controlledValue = false,
		...restProps
	}: RootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	if (placeholder === undefined) {
		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultPlaceholder: undefined,
			defaultValue: value?.start,
		});

		if (controlledPlaceholder) {
			onPlaceholderChange(defaultPlaceholder);
		} else {
			placeholder = defaultPlaceholder;
		}
	}

	if (value === undefined) {
		const defaultValue = { start: undefined, end: undefined };
		if (controlledValue) {
			onValueChange(defaultValue);
		} else {
			value = defaultValue;
		}
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
		validate: box.with(() => validate),
		maxValue: box.with(() => maxValue),
		minValue: box.with(() => minValue),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				if (controlledPlaceholder) {
					onPlaceholderChange(v);
				} else {
					placeholder = v;
					onPlaceholderChange(v);
				}
			}
		),
		readonlySegments: box.with(() => readonlySegments),
		value: box.with(
			() => value as DateRange,
			(v) => {
				if (controlledValue) {
					onValueChange(v);
				} else {
					value = v;
					onValueChange(v);
				}
			}
		),
		startValue: box.with(
			() => startValue,
			(v) => {
				startValue = v;
				onStartValueChange(v);
			}
		),
		endValue: box.with(
			() => endValue,
			(v) => {
				endValue = v;
				onEndValueChange(v);
			}
		),
		onInvalid: box.with(() => onInvalid),
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
