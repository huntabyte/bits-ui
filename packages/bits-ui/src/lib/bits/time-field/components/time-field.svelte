<script lang="ts" module>
	import type { TimeValue } from "$lib/shared/date/types.js";
	import type { Time } from "@internationalized/date";
	type T = unknown;
</script>

<script lang="ts" generics="T extends TimeValue = Time">
	import { watch } from "runed";
	import { boxWith } from "svelte-toolbelt";
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
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: boxWith(
			() => placeholder as TimeValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		disabled: boxWith(() => disabled),
		granularity: boxWith(() => granularity),
		hideTimeZone: boxWith(() => hideTimeZone),
		hourCycle: boxWith(() => hourCycle),
		locale: resolveLocaleProp(() => locale),
		maxValue: boxWith(() => maxValue),
		minValue: boxWith(() => minValue),
		validate: boxWith(() => validate),
		readonly: boxWith(() => readonly),
		readonlySegments: boxWith(() => readonlySegments),
		required: boxWith(() => required),
		onInvalid: boxWith(() => onInvalid),
		errorMessageId: boxWith(() => errorMessageId),
		isInvalidProp: boxWith(() => undefined),
	});
</script>

{@render children?.()}
