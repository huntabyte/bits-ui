<script lang="ts">
	import { watch } from "runed";
	import { box } from "svelte-toolbelt";
	import { DateFieldRootState } from "../date-field.svelte.js";
	import type { DateFieldRootProps } from "../types.js";
	import { noop } from "$lib/internal/noop.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
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
	}: DateFieldRootProps = $props();

	function handleDefaultPlaceholder(setPlaceholder = true) {
		if (placeholder !== undefined) return placeholder;

		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultValue: value,
		});

		if (setPlaceholder) {
			placeholder = defaultPlaceholder;
		}

		return defaultPlaceholder;
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

	DateFieldRootState.create({
		value: box.with(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: box.with(
			() => {
				if (placeholder === undefined) return handleDefaultPlaceholder(false);
				return placeholder;
			},
			(v) => {
				if (v === undefined) return;
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
