<script lang="ts">
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

	const {
		states: {
			value: localValue,
			placeholder: localPlaceholder,
			isInvalid: localIsInvalid
		},
		updateOption
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
</script>

<slot isInvalid={$localIsInvalid} />
