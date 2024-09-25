<script lang="ts">
	import { box } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { useDateFieldRoot } from "../date-field.svelte.js";
	import type { RootProps } from "../index.js";
	import { noop } from "$lib/internal/callbacks.js";
	import { getDefaultDate } from "$lib/shared/date/utils.js";

	let {
		isDateUnavailable,
		disabled = false,
		granularity,
		hideTimeZone = false,
		hourCycle,
		locale = "en",
		maxValue,
		minValue,
		onPlaceholderChange = noop,
		onValueChange = noop,
		placeholder = $bindable(),
		value = $bindable(),
		readonly = false,
		readonlySegments = [],
		required = false,
		controlledPlaceholder = false,
		controlledValue = false,
		children,
	}: RootProps = $props();

	if (placeholder === undefined) {
		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultPlaceholder: undefined,
			defaultValue: value,
		});

		if (controlledPlaceholder) {
			onPlaceholderChange(defaultPlaceholder);
		} else {
			placeholder = defaultPlaceholder;
		}
	}

	useDateFieldRoot({
		value: box.with(
			() => value,
			(v) => {
				if (controlledValue) {
					onValueChange(v);
				} else {
					value = v;
					onValueChange(v);
				}
			}
		),
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
		disabled: box.with(() => disabled),
		granularity: box.with(() => granularity),
		hideTimeZone: box.with(() => hideTimeZone),
		hourCycle: box.with(() => hourCycle),
		locale: box.with(() => locale),
		maxValue: box.with(() => maxValue),
		minValue: box.with(() => minValue),
		isDateUnavailable: box.with(() => isDateUnavailable),
		readonly: box.with(() => readonly),
		readonlySegments: box.with(() => readonlySegments),
		required: box.with(() => required),
	});
</script>

{@render children?.()}
