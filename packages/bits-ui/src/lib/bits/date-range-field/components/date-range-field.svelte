<script lang="ts">
	import { watch } from "runed";
	import { boxWith, mergeProps } from "svelte-toolbelt";
	import type { DateValue } from "@internationalized/date";
	import { DateRangeFieldRootState } from "../date-range-field.svelte.js";
	import type { DateRangeFieldRootProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import type { DateRange } from "$lib/shared/index.js";
	import { getDefaultDate } from "$lib/internal/date-time/utils.js";
	import { resolveLocaleProp } from "$lib/bits/utilities/config/prop-resolvers.js";

	const uid = $props.id();

	let {
		id = createId(uid),
		ref = $bindable(null),
		value = $bindable(),
		onValueChange = noop,
		placeholder = $bindable(),
		onPlaceholderChange = noop,
		disabled = false,
		readonly = false,
		required = false,
		hourCycle,
		granularity,
		locale,
		hideTimeZone = false,
		validate = noop,
		onInvalid = noop,
		maxValue,
		minValue,
		readonlySegments = [],
		children,
		child,
		onStartValueChange = noop,
		onEndValueChange = noop,
		errorMessageId,
		...restProps
	}: DateRangeFieldRootProps = $props();

	let startValue = $state<DateValue | undefined>(value?.start);
	let endValue = $state<DateValue | undefined>(value?.end);

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;
		const defaultPlaceholder = getDefaultDate({
			granularity,
			defaultValue: value?.start,
			minValue,
			maxValue,
		});
		placeholder = defaultPlaceholder;
	}

	// SSR
	handleDefaultPlaceholder();

	watch.pre(
		() => placeholder,
		() => {
			handleDefaultPlaceholder();
		}
	);

	function handleDefaultValue() {
		if (value !== undefined) return;
		const defaultValue = { start: undefined, end: undefined };
		value = defaultValue;
	}

	// SSR
	handleDefaultValue();

	/**
	 * Covers an edge case where when a spread props object is reassigned,
	 * the props are reset to their default values, which would make value
	 * undefined which causes errors to be thrown.
	 */
	watch.pre(
		() => value,
		() => {
			handleDefaultValue();
		}
	);

	const rootState = DateRangeFieldRootState.create({
		id: boxWith(() => id),
		ref: boxWith(
			() => ref,
			(v) => (ref = v)
		),
		disabled: boxWith(() => disabled),
		readonly: boxWith(() => readonly),
		required: boxWith(() => required),
		hourCycle: boxWith(() => hourCycle),
		granularity: boxWith(() => granularity),
		locale: resolveLocaleProp(() => locale),
		hideTimeZone: boxWith(() => hideTimeZone),
		validate: boxWith(() => validate),
		maxValue: boxWith(() => maxValue),
		minValue: boxWith(() => minValue),
		placeholder: boxWith(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		readonlySegments: boxWith(() => readonlySegments),
		value: boxWith(
			() => value as DateRange,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		startValue: boxWith(
			() => startValue,
			(v) => {
				startValue = v;
				onStartValueChange(v);
			}
		),
		endValue: boxWith(
			() => endValue,
			(v) => {
				endValue = v;
				onEndValueChange(v);
			}
		),
		onInvalid: boxWith(() => onInvalid),
		errorMessageId: boxWith(() => errorMessageId),
	});

	const mergedProps = $derived(mergeProps(restProps, rootState.props));
</script>

{#if child}
	{@render child({ props: mergedProps })}
{:else}
	<div {...mergedProps}>
		{@render children?.()}
	</div>
{/if}
