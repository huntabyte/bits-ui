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
		name = "",
		onPlaceholderChange = noop,
		onValueChange = noop,
		placeholder = $bindable(),
		value = $bindable(),
		readonly = false,
		readonlySegments = [],
		required = false,
		children,
	}: RootProps = $props();

	if (placeholder === undefined) {
		placeholder = getDefaultDate({
			granularity,
			defaultPlaceholder: undefined,
			defaultValue: value,
		});
	}

	useDateFieldRoot({
		value: box.with(
			() => value,
			(v) => {
				if (value !== v) {
					value = v;
					onValueChange(v);
				}
			}
		),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				if (placeholder !== v) {
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
		name: box.with(() => name),
	});
</script>

{@render children?.()}
