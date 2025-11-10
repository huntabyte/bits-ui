<script lang="ts">
	import { watch } from "runed";
	import { boxWith } from "svelte-toolbelt";
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
			minValue,
			maxValue,
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
		value: boxWith(
			() => value,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		placeholder: boxWith(
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
