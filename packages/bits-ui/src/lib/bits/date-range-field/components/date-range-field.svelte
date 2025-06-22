<script lang="ts">
	import { watch } from "runed";
	import { box, mergeProps } from "svelte-toolbelt";
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
		const defaultPlaceholder = getDefaultDate({ granularity, defaultValue: value?.start });
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
		id: box.with(() => id),
		ref: box.with(
			() => ref,
			(v) => (ref = v)
		),
		disabled: box.with(() => disabled),
		readonly: box.with(() => readonly),
		required: box.with(() => required),
		hourCycle: box.with(() => hourCycle),
		granularity: box.with(() => granularity),
		locale: resolveLocaleProp(() => locale),
		hideTimeZone: box.with(() => hideTimeZone),
		validate: box.with(() => validate),
		maxValue: box.with(() => maxValue),
		minValue: box.with(() => minValue),
		placeholder: box.with(
			() => placeholder as DateValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		readonlySegments: box.with(() => readonlySegments),
		value: box.with(
			() => value as DateRange,
			(v) => {
				value = v;
				onValueChange(v);
			}
		),
		startValue: box.with(
			() => startValue,
			(v) => {
				startValue = v;
				onStartValueChange(v);
			}
		),
		endValue: box.with(
			() => endValue,
			(v) => {
				endValue = v;
				onEndValueChange(v);
			}
		),
		onInvalid: box.with(() => onInvalid),
		errorMessageId: box.with(() => errorMessageId),
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
