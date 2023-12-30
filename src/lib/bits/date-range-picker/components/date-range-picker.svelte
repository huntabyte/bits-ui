<script lang="ts">
	import { derived } from "svelte/store";
	import { setCtx } from "../ctx.js";
	import type { Props } from "../types.js";

	type $$Props = Props;

	export let value: $$Props["value"] = undefined;
	export let onValueChange: $$Props["onValueChange"] = undefined;
	export let placeholder: $$Props["placeholder"] = undefined;
	export let onPlaceholderChange: $$Props["onPlaceholderChange"] = undefined;
	export let disabled: $$Props["disabled"] = undefined;
	export let isDateUnavailable: $$Props["isDateUnavailable"] = undefined;
	export let granularity: $$Props["granularity"] = undefined;
	export let hideTimeZone: $$Props["hideTimeZone"] = undefined;
	export let hourCycle: $$Props["hourCycle"] = undefined;
	export let locale: $$Props["locale"] = undefined;
	export let maxValue: $$Props["maxValue"] = undefined;
	export let minValue: $$Props["minValue"] = undefined;
	export let readonly: $$Props["readonly"] = undefined;
	export let validationId: $$Props["validationId"] = undefined;
	export let descriptionId: $$Props["descriptionId"] = undefined;
	export let preventDeselect: $$Props["preventDeselect"] = undefined;
	export let pagedNavigation: $$Props["pagedNavigation"] = undefined;
	export let weekStartsOn: $$Props["weekStartsOn"] = undefined;
	export let isDateDisabled: $$Props["isDateDisabled"] = undefined;
	export let fixedWeeks: $$Props["fixedWeeks"] = undefined;
	export let calendarLabel: $$Props["calendarLabel"] = undefined;
	export let weekdayFormat: $$Props["weekdayFormat"] = undefined;
	export let startValue: $$Props["startValue"] = undefined;
	export let numberOfMonths: $$Props["numberOfMonths"] = undefined;
	export let onOutsideClick: $$Props["onOutsideClick"] = undefined;

	const {
		states: {
			value: localValue,
			placeholder: localPlaceholder,
			isInvalid: localIsInvalid,
			startValue: localStartValue,
			endValue
		},
		updateOption,
		ids
	} = setCtx({
		defaultValue: value,
		defaultPlaceholder: placeholder,
		preventDeselect,
		pagedNavigation,
		weekStartsOn,
		isDateDisabled,
		fixedWeeks,
		calendarLabel,
		disabled,
		granularity,
		hideTimeZone,
		hourCycle,
		locale,
		maxValue,
		minValue,
		readonly,
		weekdayFormat,
		numberOfMonths,
		isDateUnavailable,
		onOutsideClick,
		onValueChange: ({ next }) => {
			if (value !== next) {
				onValueChange?.(next);
				value = next;
			}
			return next;
		},
		onPlaceholderChange: ({ next }) => {
			if (placeholder !== next) {
				onPlaceholderChange?.(next);
				placeholder = next;
			}
			return next;
		}
	});

	const startFieldIds = derived(
		[
			ids.rangeField.start.day,
			ids.rangeField.start.dayPeriod,
			ids.rangeField.start.field,
			ids.rangeField.start.hour,
			ids.rangeField.start.minute,
			ids.rangeField.start.month,
			ids.rangeField.start.second,
			ids.rangeField.start.year,
			ids.rangeField.start.timeZoneName
		],
		([
			$dayId,
			$dayPeriodId,
			$hourId,
			$minuteId,
			$monthId,
			$secondId,
			$yearId,
			$timeZoneNameId
		]) => ({
			day: $dayId,
			dayPeriod: $dayPeriodId,
			hour: $hourId,
			minute: $minuteId,
			month: $monthId,
			second: $secondId,
			year: $yearId,
			timeZoneName: $timeZoneNameId
		})
	);

	const endFieldIds = derived(
		[
			ids.rangeField.end.day,
			ids.rangeField.end.dayPeriod,
			ids.rangeField.end.field,
			ids.rangeField.end.hour,
			ids.rangeField.end.minute,
			ids.rangeField.end.month,
			ids.rangeField.end.second,
			ids.rangeField.end.year,
			ids.rangeField.end.timeZoneName
		],
		([
			$dayId,
			$dayPeriodId,
			$hourId,
			$minuteId,
			$monthId,
			$secondId,
			$yearId,
			$timeZoneNameId
		]) => ({
			day: $dayId,
			dayPeriod: $dayPeriodId,
			hour: $hourId,
			minute: $minuteId,
			month: $monthId,
			second: $secondId,
			year: $yearId,
			timeZoneName: $timeZoneNameId
		})
	);

	const idValues = derived(
		[
			ids.rangeField.field.field,
			ids.rangeField.field.description,
			ids.rangeField.field.label,
			ids.rangeField.field.validation,
			ids.calendar.calendar,
			ids.popover.content,
			ids.popover.trigger,
			startFieldIds,
			endFieldIds
		],
		([
			$fieldId,
			$descriptionId,
			$labelId,
			$validationId,
			$calendarId,
			$contentId,
			$triggerId,
			$startFieldIds,
			$endFieldIds
		]) => ({
			field: $fieldId,
			description: $descriptionId,
			label: $labelId,
			validation: $validationId,
			calendar: $calendarId,
			content: $contentId,
			trigger: $triggerId,
			startField: $startFieldIds,
			endField: $endFieldIds
		})
	);

	$: if (validationId) {
		ids.rangeField.field.validation.set(validationId);
	}

	$: if (descriptionId) {
		ids.rangeField.field.description.set(descriptionId);
	}

	$: startValue = $localStartValue;
	$: value !== undefined && localValue.set(value);
	$: placeholder !== undefined && localPlaceholder.set(placeholder);

	$: updateOption("disabled", disabled);
	$: updateOption("isDateUnavailable", isDateUnavailable);
	$: updateOption("granularity", granularity);
	$: updateOption("hideTimeZone", hideTimeZone);
	$: updateOption("hourCycle", hourCycle);
	$: updateOption("locale", locale);
	$: updateOption("maxValue", maxValue);
	$: updateOption("minValue", minValue);
	$: updateOption("readonly", readonly);
	$: updateOption("fixedWeeks", fixedWeeks);
	$: updateOption("preventDeselect", preventDeselect);
	$: updateOption("pagedNavigation", pagedNavigation);
	$: updateOption("weekStartsOn", weekStartsOn);
	$: updateOption("isDateDisabled", isDateDisabled);
	$: updateOption("calendarLabel", calendarLabel);
	$: updateOption("weekdayFormat", weekdayFormat);
	$: updateOption("numberOfMonths", numberOfMonths);
	$: updateOption("onOutsideClick", onOutsideClick);
</script>

<slot
	ids={$idValues}
	isInvalid={$localIsInvalid}
	startValue={$localStartValue}
	endValue={$endValue}
/>
