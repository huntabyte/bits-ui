<script lang="ts" module>
	import type { TimeValue } from "$lib/shared/date/types.js";
	import type { Time } from "@internationalized/date";
	type T = unknown;
</script>

<script lang="ts" generics="T extends TimeValue = Time">
	import { watch } from "runed";
	import { box } from "svelte-toolbelt";
	import { TimeFieldRootState } from "../time-field.svelte.js";
	import type { TimeFieldRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { getDefaultTime } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/bits/utilities/config/prop-resolvers.js";

	let {
		disabled = false,
		granularity,
		hideTimeZone = false,
		hourCycle,
		locale,
		maxValue,
		minValue,
		onPlaceholderChange = noop,
		onValueChange = noop,
		validate = noop,
		onInvalid = noop,
		placeholder = $bindable(),
		value = $bindable(),
		readonly = false,
		readonlySegments = [],
		required = false,
		errorMessageId,
		children,
	}: TimeFieldRootProps<T> = $props();

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;

		const defaultPlaceholder = getDefaultTime({
			granularity,
			defaultValue: value,
		});

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

	TimeFieldRootState.create({
		value: box.with(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: box.with(
			() => placeholder as TimeValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		disabled: box.with(() => disabled),
		granularity: box.with(() => granularity),
		hideTimeZone: box.with(() => hideTimeZone),
		hourCycle: box.with(() => hourCycle),
		locale: resolveLocaleProp(() => locale),
		maxValue: box.with(() => maxValue),
		minValue: box.with(() => minValue),
		validate: box.with(() => validate),
		readonly: box.with(() => readonly),
		readonlySegments: box.with(() => readonlySegments),
		required: box.with(() => required),
		onInvalid: box.with(() => onInvalid),
		errorMessageId: box.with(() => errorMessageId),
		isInvalidProp: box.with(() => undefined),
	});
</script>

{@render children?.()}
