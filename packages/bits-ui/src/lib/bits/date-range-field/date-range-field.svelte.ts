import type { DateValue } from "@internationalized/date";
import { box, onDestroyEffect, useRefById } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { DateFieldRootState } from "../date-field/date-field.svelte.js";
import { DateFieldInputState, useDateFieldRoot } from "../date-field/date-field.svelte.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useId } from "$lib/internal/use-id.js";
import type {
	DateOnInvalid,
	DateRange,
	DateRangeValidator,
	SegmentPart,
} from "$lib/shared/index.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { getDataDisabled, getDataInvalid } from "$lib/internal/attrs.js";
import type { Granularity } from "$lib/shared/date/types.js";
import { type Formatter, createFormatter } from "$lib/internal/date-time/formatter.js";
import { removeDescriptionElement } from "$lib/internal/date-time/field/helpers.js";
import { isBefore } from "$lib/internal/date-time/utils.js";
import { getFirstSegment } from "$lib/internal/date-time/field/segments.js";

export const DATE_RANGE_FIELD_ROOT_ATTR = "data-date-range-field-root";
const DATE_RANGE_FIELD_LABEL_ATTR = "data-date-range-field-label";

type DateRangeFieldRootStateProps = WithRefProps<
	WritableBoxedValues<{
		value: DateRange;
		placeholder: DateValue;
		startValue: DateValue | undefined;
		endValue: DateValue | undefined;
	}> &
		ReadableBoxedValues<{
			readonlySegments: SegmentPart[];
			validate: DateRangeValidator | undefined;
			onInvalid: DateOnInvalid | undefined;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			disabled: boolean;
			readonly: boolean;
			granularity: Granularity | undefined;
			hourCycle: 12 | 24 | undefined;
			locale: string;
			hideTimeZone: boolean;
			required: boolean;
			errorMessageId: string | undefined;
		}>
>;

export class DateRangeFieldRootState {
	startFieldState: DateFieldRootState | undefined = undefined;
	endFieldState: DateFieldRootState | undefined = undefined;
	descriptionId = useId();
	formatter: Formatter;
	fieldNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	startValueComplete = $derived.by(() => this.opts.startValue.current !== undefined);
	endValueComplete = $derived.by(() => this.opts.endValue.current !== undefined);
	rangeComplete = $derived(this.startValueComplete && this.endValueComplete);

	constructor(readonly opts: DateRangeFieldRootStateProps) {
		this.formatter = createFormatter(this.opts.locale.current);

		useRefById({
			...opts,
			onRefChange: (node) => {
				this.fieldNode = node;
			},
		});

		onDestroyEffect(() => {
			removeDescriptionElement(this.descriptionId);
		});

		$effect(() => {
			if (this.formatter.getLocale() === this.opts.locale.current) return;
			this.formatter.setLocale(this.opts.locale.current);
		});

		/**
		 * Synchronize the start and end values with the `value` in case
		 * it is updated externally.
		 */
		watch(
			() => this.opts.value.current,
			(value) => {
				if (value.start && value.end) {
					this.opts.startValue.current = value.start;
					this.opts.endValue.current = value.end;
				} else if (value.start) {
					this.opts.startValue.current = value.start;
					this.opts.endValue.current = undefined;
				} else if (value.start === undefined && value.end === undefined) {
					this.opts.startValue.current = undefined;
					this.opts.endValue.current = undefined;
				}
			}
		);

		/**
		 * Synchronize the placeholder value with the current start value
		 */
		watch(
			() => this.opts.value.current,
			(value) => {
				const startValue = value.start;
				if (startValue && this.opts.placeholder.current !== startValue) {
					this.opts.placeholder.current = startValue;
				}
			}
		);

		watch(
			[() => this.opts.startValue.current, () => this.opts.endValue.current],
			([startValue, endValue]) => {
				if (
					this.opts.value.current &&
					this.opts.value.current.start === startValue &&
					this.opts.value.current.end === endValue
				) {
					return;
				}

				if (startValue && endValue) {
					this.#updateValue((prev) => {
						if (prev.start === startValue && prev.end === endValue) {
							return prev;
						}
						if (isBefore(endValue, startValue)) {
							const start = startValue;
							const end = endValue;
							this.#setStartValue(end);
							this.#setEndValue(start);
							return { start: endValue, end: startValue };
						} else {
							return {
								start: startValue,
								end: endValue,
							};
						}
					});
				} else if (
					this.opts.value.current &&
					this.opts.value.current.start &&
					this.opts.value.current.end
				) {
					this.opts.value.current.start = undefined;
					this.opts.value.current.end = undefined;
				}
			}
		);
	}

	validationStatus = $derived.by(() => {
		const value = this.opts.value.current;
		if (value === undefined) return false as const;
		if (value.start === undefined || value.end === undefined) return false as const;

		const msg = this.opts.validate.current?.({
			start: value.start,
			end: value.end,
		});

		if (msg) {
			return {
				reason: "custom",
				message: msg,
			} as const;
		}

		const minValue = this.opts.minValue.current;
		if (minValue && value.start && isBefore(value.start, minValue)) {
			return {
				reason: "min",
			} as const;
		}

		const maxValue = this.opts.maxValue.current;

		if (
			(maxValue && value.end && isBefore(maxValue, value.end)) ||
			(maxValue && value.start && isBefore(maxValue, value.start))
		) {
			return {
				reason: "max",
			} as const;
		}

		return false as const;
	});

	isInvalid = $derived.by(() => {
		if (this.validationStatus === false) return false;
		return true;
	});

	#updateValue(cb: (value: DateRange) => DateRange) {
		const value = this.opts.value.current;
		const newValue = cb(value);
		this.opts.value.current = newValue;
	}

	#setStartValue(value: DateValue | undefined) {
		this.opts.startValue.current = value;
	}

	#setEndValue(value: DateValue | undefined) {
		this.opts.endValue.current = value;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				[DATE_RANGE_FIELD_ROOT_ATTR]: "",
				"data-invalid": getDataInvalid(this.isInvalid),
			}) as const
	);
}

type DateRangeFieldLabelStateProps = WithRefProps;

class DateRangeFieldLabelState {
	constructor(
		readonly opts: DateRangeFieldLabelStateProps,
		readonly root: DateRangeFieldRootState
	) {
		useRefById({
			...opts,
			onRefChange: (node) => {
				root.labelNode = node;
			},
		});
	}

	#onclick = () => {
		if (this.root.opts.disabled.current) return;
		const firstSegment = getFirstSegment(this.root.fieldNode);
		if (!firstSegment) return;
		firstSegment.focus();
	};

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				// TODO: invalid state for field
				"data-invalid": getDataInvalid(this.root.isInvalid),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				[DATE_RANGE_FIELD_LABEL_ATTR]: "",
				onclick: this.#onclick,
			}) as const
	);
}

type DateRangeFieldInputStateProps = WritableBoxedValues<{
	value: DateValue | undefined;
}> &
	ReadableBoxedValues<{
		name: string;
	}> &
	WithRefProps;

export const DateRangeFieldRootContext = new Context<DateRangeFieldRootState>(
	"DateRangeField.Root"
);

export function useDateRangeFieldRoot(props: DateRangeFieldRootStateProps) {
	return DateRangeFieldRootContext.set(new DateRangeFieldRootState(props));
}

export function useDateRangeFieldLabel(props: DateRangeFieldLabelStateProps) {
	return new DateRangeFieldLabelState(props, DateRangeFieldRootContext.get());
}

export function useDateRangeFieldInput(
	props: Omit<DateRangeFieldInputStateProps, "value">,
	type: "start" | "end"
) {
	const root = DateRangeFieldRootContext.get();
	const fieldState = useDateFieldRoot(
		{
			value: type === "start" ? root.opts.startValue : root.opts.endValue,
			disabled: root.opts.disabled,
			readonly: root.opts.readonly,
			readonlySegments: root.opts.readonlySegments,
			validate: box.with(() => undefined),
			minValue: root.opts.minValue,
			maxValue: root.opts.maxValue,
			hourCycle: root.opts.hourCycle,
			locale: root.opts.locale,
			hideTimeZone: root.opts.hideTimeZone,
			required: root.opts.required,
			granularity: root.opts.granularity,
			placeholder: root.opts.placeholder,
			onInvalid: root.opts.onInvalid,
			errorMessageId: root.opts.errorMessageId,
			isInvalidProp: box.with(() => root.isInvalid),
		},
		root
	);

	return new DateFieldInputState({ name: props.name, id: props.id, ref: props.ref }, fieldState);
}
