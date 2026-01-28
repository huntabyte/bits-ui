<script lang="ts">
	import { watch } from "runed";
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { DateRangePickerRootState } from "../date-range-picker.svelte.js";
	import type { DateRangePickerRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { PopoverRootState } from "$lib/bits/popover/popover.svelte.js";
	import { DateRangeFieldRootState } from "$lib/bits/date-range-field/date-range-field.svelte.js";
	import FloatingLayer from "$lib/bits/utilities/floating-layer/components/floating-layer.svelte";
	import { useId } from "$lib/internal/use-id.js";
	import type { DateRange } from "$lib/shared/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/bits/utilities/config/prop-resolvers.js";

	let {
		open = $bindable(false),
		onOpenChange = noop,
		onOpenChangeComplete = noop,
		value = $bindable(),
		id = useId(),
		ref = $bindable(null),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		isDateUnavailable = () => false,
		onInvalid = noop,
		minValue,
		maxValue,
		disabled = false,
		readonly = false,
		granularity,
		readonlySegments = [],
		hourCycle,
		locale,
		hideTimeZone = false,
		required = false,
		calendarLabel = "Event",
		disableDaysOutsideMonth = true,
		preventDeselect = false,
		pagedNavigation = false,
		weekStartsOn,
		weekdayFormat = "narrow",
		isDateDisabled = () => false,
		fixedWeeks = false,
		numberOfMonths = 1,
		closeOnRangeSelect = true,
		onStartValueChange = noop,
		onEndValueChange = noop,
		validate = noop,
		errorMessageId,
		minDays,
		maxDays,
		excludeDisabled = false,
		child,
		children,
		monthFormat = "long",
		yearFormat = "numeric",
		...restProps
	}: DateRangePickerRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	function handleDefaultValue() {
		if (value !== undefined) return;
		value = { start: undefined, end: undefined };
	}

	// SSR
	handleDefaultValue();

	/**
	 * Covers an edge case where when a spread props object is reassigned,
	 * the props are reset to their default values, which would make value
	 * undefined which causes errors to be thrown.
	 */
	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const defaultPlaceholder = getDefaultDate({
		granularity,
		defaultValue: value?.start,
		minValue,
		maxValue,
	});

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;
		placeholder = defaultPlaceholder;
	}

	// SSR
	handleDefaultPlaceholder();

	/**
	 * Covers an edge case where when a spread props object is reassigned,
	 * the props are reset to their default values, which would make placeholder
	 * undefined which causes errors to be thrown.
	 */
	watch.pre(
		() => placeholder,
		() => {
			handleDefaultPlaceholder();
		}
	);

	function onRangeSelect() {
		if (closeOnRangeSelect) {
			open = false;
		}
	}

	const pickerRootState = DateRangePickerRootState.create({
		open: boxWith(
			() => open,
			(v) => {
				open = v;
				onOpenChange(v);
			}
		),
		value: boxWith(
			() => value as DateRange,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: boxWith(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v as DateValue);
			}
		),
		isDateUnavailable: boxWith(() => isDateUnavailable),
		minValue: boxWith(() => minValue),
		maxValue: boxWith(() => maxValue),
		minDays: boxWith(() => minDays),
		maxDays: boxWith(() => maxDays),
		disabled: boxWith(() => disabled),
		readonly: boxWith(() => readonly),
		granularity: boxWith(() => granularity),
		readonlySegments: boxWith(() => readonlySegments),
		hourCycle: boxWith(() => hourCycle),
		locale: resolveLocaleProp(() => locale),
		hideTimeZone: boxWith(() => hideTimeZone),
		required: boxWith(() => required),
		calendarLabel: boxWith(() => calendarLabel),
		disableDaysOutsideMonth: boxWith(() => disableDaysOutsideMonth),
		preventDeselect: boxWith(() => preventDeselect),
		pagedNavigation: boxWith(() => pagedNavigation),
		weekStartsOn: boxWith(() => weekStartsOn),
		weekdayFormat: boxWith(() => weekdayFormat),
		isDateDisabled: boxWith(() => isDateDisabled),
		fixedWeeks: boxWith(() => fixedWeeks),
		numberOfMonths: boxWith(() => numberOfMonths),
		excludeDisabled: boxWith(() => excludeDisabled),
		onRangeSelect: boxWith(() => onRangeSelect),
		startValue: boxWith(
			() => startValue,
			(v) => {
				startValue = v;
				onStartValueChange(v);
			}
		),
		endValue: boxWith(
			() => endValue,
			(v) => {
				endValue = v;
				onEndValueChange(v);
			}
		),
		monthFormat: boxWith(() => monthFormat),
		yearFormat: boxWith(() => yearFormat),
		defaultPlaceholder,
	});

	PopoverRootState.create({
		open: pickerRootState.opts.open,
		onOpenChangeComplete: boxWith(() => onOpenChangeComplete),
	});

	const fieldRootState = DateRangeFieldRootState.create({
		value: pickerRootState.opts.value,
		disabled: pickerRootState.opts.disabled,
		readonly: pickerRootState.opts.readonly,
		readonlySegments: pickerRootState.opts.readonlySegments,
		validate: boxWith(() => validate),
		minValue: pickerRootState.opts.minValue,
		maxValue: pickerRootState.opts.maxValue,
		granularity: pickerRootState.opts.granularity,
		hideTimeZone: pickerRootState.opts.hideTimeZone,
		hourCycle: pickerRootState.opts.hourCycle,
		locale: pickerRootState.opts.locale,
		required: pickerRootState.opts.required,
		placeholder: pickerRootState.opts.placeholder,
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		startValue: pickerRootState.opts.startValue,
		endValue: pickerRootState.opts.endValue,
		onInvalid: boxWith(() => onInvalid),
		errorMessageId: boxWith(() => errorMessageId),
	});

	const mergedProps = $derived(mergeProps(restProps, fieldRootState.props));
</script>

<FloatingLayer>
	{#if child}
		{@render child({ props: mergedProps })}
	{:else}
		<div {...mergedProps}>
			{@render children?.()}
		</div>
	{/if}
</FloatingLayer>
