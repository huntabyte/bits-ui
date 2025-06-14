<script lang="ts" module>
	import type { TimeRange, TimeValue } from "$lib/shared/date/types.js";
	import type { Time } from "@internationalized/date";

	type T = unknown;
</script>

<script lang="ts" generics="T extends TimeValue = Time">
	import { watch } from "runed";
	import { box, mergeProps } from "svelte-toolbelt";
	import { TimeRangeFieldRootState } from "../time-range-field.svelte.js";
	import type { TimeRangeFieldRootProps } from "../types.js";
	import { createId } from "$lib/internal/create-id.js";
	import { noop } from "$lib/internal/noop.js";
	import { getDefaultTime } from "$lib/internal/date-time/utils.js";
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
	}: TimeRangeFieldRootProps<T> = $props();

	let startValue = $state<T | undefined>(value?.start);
	let endValue = $state<T | undefined>(value?.end);

	function handleDefaultPlaceholder() {
		if (placeholder !== undefined) return;
		const defaultPlaceholder = getDefaultTime({ granularity, defaultValue: value?.start });
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

	const rootState = TimeRangeFieldRootState.create({
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
			() => placeholder as TimeValue,
			(v) => {
				placeholder = v;
				onPlaceholderChange(v);
			}
		),
		readonlySegments: box.with(() => readonlySegments),
		value: box.with(
			() => value as TimeRange<T>,
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
