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
	export let numberOfMonths: $$Props["numberOfMonths"] = undefined;
	export let onOutsideClick: $$Props["onOutsideClick"] = undefined;

	const {
		states: {
			value: localValue,
			placeholder: localPlaceholder,
			isInvalid: localIsInvalid
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

	const idValues = derived(
		[
			ids.dateField.day,
			ids.dateField.description,
			ids.dateField.dayPeriod,
			ids.dateField.field,
			ids.dateField.hour,
			ids.dateField.minute,
			ids.dateField.month,
			ids.dateField.second,
			ids.dateField.year,
			ids.dateField.validation,
			ids.dateField.label,
			ids.dateField.timeZoneName,
			ids.calendar.calendar,
			ids.popover.content,
			ids.popover.trigger
		],
		([
			$dayId,
			$descriptionId,
			$dayPeriodId,
			$fieldId,
			$hourId,
			$minuteId,
			$monthId,
			$secondId,
			$yearId,
			$validationId,
			$labelId,
			$timeZoneNameId,
			$calendarId,
			$contentId
		]) => ({
			day: $dayId,
			description: $descriptionId,
			dayPeriod: $dayPeriodId,
			field: $fieldId,
			hour: $hourId,
			minute: $minuteId,
			month: $monthId,
			second: $secondId,
			year: $yearId,
			validation: $validationId,
			label: $labelId,
			timeZoneName: $timeZoneNameId,
			calendar: $calendarId,
			content: $contentId
		})
	);

	$: if (validationId) {
		ids.dateField.validation.set(validationId);
	}

	$: if (descriptionId) {
		ids.dateField.description.set(descriptionId);
	}

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

<slot ids={$idValues} isInvalid={$localIsInvalid} />
