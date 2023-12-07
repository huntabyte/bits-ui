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
		disabled,
		granularity,
		hideTimeZone,
		hourCycle,
		locale,
		maxValue,
		minValue,
		readonly,
		isDateUnavailable,
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

	const startIdValues = derived(
		[
			ids.start.day,
			ids.start.description,
			ids.start.dayPeriod,
			ids.start.hour,
			ids.start.minute,
			ids.start.month,
			ids.start.second,
			ids.start.year,
			ids.start.validation,
			ids.start.label,
			ids.start.timeZoneName
		],
		([
			$dayId,
			$descriptionId,
			$dayPeriodId,
			$hourId,
			$minuteId,
			$monthId,
			$secondId,
			$yearId,
			$validationId,
			$labelId,
			$timeZoneNameId
		]) => ({
			day: $dayId,
			description: $descriptionId,
			dayPeriod: $dayPeriodId,
			hour: $hourId,
			minute: $minuteId,
			month: $monthId,
			second: $secondId,
			year: $yearId,
			validation: $validationId,
			label: $labelId,
			timeZoneName: $timeZoneNameId
		})
	);

	const endIdValues = derived(
		[
			ids.end.day,
			ids.end.description,
			ids.end.dayPeriod,
			ids.end.hour,
			ids.end.minute,
			ids.end.month,
			ids.end.second,
			ids.end.year,
			ids.end.validation,
			ids.end.label,
			ids.end.timeZoneName
		],
		([
			$dayId,
			$descriptionId,
			$dayPeriodId,
			$hourId,
			$minuteId,
			$monthId,
			$secondId,
			$yearId,
			$validationId,
			$labelId,
			$timeZoneNameId
		]) => ({
			day: $dayId,
			description: $descriptionId,
			dayPeriod: $dayPeriodId,
			hour: $hourId,
			minute: $minuteId,
			month: $monthId,
			second: $secondId,
			year: $yearId,
			validation: $validationId,
			label: $labelId,
			timeZoneName: $timeZoneNameId
		})
	);

	const fieldIdValues = derived(
		[
			ids.field.description,
			ids.field.field,
			ids.field.label,
			ids.field.validation
		],
		([$descriptionId, $fieldId, $labelId, $validationId]) => ({
			description: $descriptionId,
			field: $fieldId,
			label: $labelId,
			validation: $validationId
		})
	);

	$: if (descriptionId) {
		ids.field.description.set(descriptionId);
	}

	$: if (validationId) {
		ids.field.validation.set(validationId);
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

	$: idSlotProp = {
		start: $startIdValues,
		end: $endIdValues,
		field: $fieldIdValues
	};
</script>

<slot isInvalid={$localIsInvalid} ids={idSlotProp} />
