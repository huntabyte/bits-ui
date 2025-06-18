import type { Time } from "@internationalized/date";
import {
	box,
	onDestroyEffect,
	attachRef,
	DOMContext,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import { TimeFieldRootState } from "../time-field/time-field.svelte.js";
import { TimeFieldInputState } from "../time-field/time-field.svelte.js";
import { useId } from "$lib/internal/use-id.js";
import type { TimeSegmentPart } from "$lib/shared/index.js";
import type { RefAttachment, WithRefOpts } from "$lib/internal/types.js";
import { createBitsAttrs, getDataDisabled, getDataInvalid } from "$lib/internal/attrs.js";
import type {
	TimeGranularity,
	TimeOnInvalid,
	TimeRange,
	TimeRangeValidator,
	TimeValue,
} from "$lib/shared/date/types.js";
import { type TimeFormatter, createTimeFormatter } from "$lib/internal/date-time/formatter.js";
import { removeDescriptionElement } from "$lib/internal/date-time/field/helpers.js";
import { getFirstSegment } from "$lib/internal/date-time/field/segments.js";
import {
	convertTimeValueToTime,
	isTimeBefore,
} from "$lib/internal/date-time/field/time-helpers.js";

export const timeRangeFieldAttrs = createBitsAttrs({
	component: "time-range-field",
	parts: ["root", "label"],
});

export const TimeRangeFieldRootContext = new Context<TimeRangeFieldRootState>(
	"TimeRangeField.Root"
);

interface TimeRangeFieldRootStateOpts<T extends TimeValue = Time>
	extends WithRefOpts,
		WritableBoxedValues<{
			value: TimeRange<T>;
			placeholder: TimeValue;
			startValue: T | undefined;
			endValue: T | undefined;
		}>,
		ReadableBoxedValues<{
			readonlySegments: TimeSegmentPart[];
			validate: TimeRangeValidator<T> | undefined;
			onInvalid: TimeOnInvalid | undefined;
			minValue: TimeValue | undefined;
			maxValue: TimeValue | undefined;
			disabled: boolean;
			readonly: boolean;
			granularity: TimeGranularity | undefined;
			hourCycle: 12 | 24 | undefined;
			locale: string;
			hideTimeZone: boolean;
			required: boolean;
			errorMessageId: string | undefined;
		}> {}

export class TimeRangeFieldRootState<T extends TimeValue = Time> {
	static create<T extends TimeValue = Time>(opts: TimeRangeFieldRootStateOpts<T>) {
		return TimeRangeFieldRootContext.set(
			new TimeRangeFieldRootState(opts) as unknown as TimeRangeFieldRootState
		);
	}
	readonly opts: TimeRangeFieldRootStateOpts<T>;
	readonly attachment: RefAttachment;
	startFieldState: TimeFieldRootState | undefined = undefined;
	endFieldState: TimeFieldRootState | undefined = undefined;
	descriptionId = useId();
	formatter: TimeFormatter;
	fieldNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	readonly startValueComplete = $derived.by(() => this.opts.startValue.current !== undefined);
	readonly endValueComplete = $derived.by(() => this.opts.endValue.current !== undefined);
	readonly rangeComplete = $derived(this.startValueComplete && this.endValueComplete);

	readonly startValueTime = $derived.by(() => {
		if (!this.opts.startValue.current) return undefined;
		return convertTimeValueToTime(this.opts.startValue.current);
	});

	readonly endValueTime = $derived.by(() => {
		if (!this.opts.endValue.current) return undefined;
		return convertTimeValueToTime(this.opts.endValue.current);
	});

	readonly minValueTime = $derived.by(() => {
		if (!this.opts.minValue.current) return undefined;
		return convertTimeValueToTime(this.opts.minValue.current);
	});

	readonly maxValueTime = $derived.by(() => {
		if (!this.opts.maxValue.current) return undefined;
		return convertTimeValueToTime(this.opts.maxValue.current);
	});
	domContext: DOMContext;

	constructor(opts: TimeRangeFieldRootStateOpts<T>) {
		this.opts = opts;
		this.formatter = createTimeFormatter(this.opts.locale.current);
		this.domContext = new DOMContext(this.opts.ref);
		this.attachment = attachRef(this.opts.ref, (v) => (this.fieldNode = v));
		onDestroyEffect(() => {
			removeDescriptionElement(this.descriptionId, this.domContext.getDocument());
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
						return {
							start: startValue,
							end: endValue,
						};
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

	readonly validationStatus = $derived.by(() => {
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

		if (
			this.minValueTime &&
			this.startValueTime &&
			isTimeBefore(this.startValueTime, this.minValueTime)
		) {
			return {
				reason: "min",
			} as const;
		}

		if (
			this.maxValueTime &&
			this.endValueTime &&
			isTimeBefore(this.maxValueTime, this.endValueTime)
		) {
			return {
				reason: "max",
			} as const;
		}

		return false as const;
	});

	readonly isInvalid = $derived.by(() => {
		if (this.validationStatus === false) return false;
		return true;
	});

	#updateValue(cb: (value: TimeRange<T>) => TimeRange<T>) {
		const value = this.opts.value.current;
		const newValue = cb(value);
		this.opts.value.current = newValue;
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "group",
				[timeRangeFieldAttrs.root]: "",
				"data-invalid": getDataInvalid(this.isInvalid),
				...this.attachment,
			}) as const
	);
}

interface TimeRangeFieldLabelStateOpts extends WithRefOpts {}

export class TimeRangeFieldLabelState {
	static create(opts: TimeRangeFieldLabelStateOpts) {
		return new TimeRangeFieldLabelState(opts, TimeRangeFieldRootContext.get());
	}
	readonly opts: TimeRangeFieldLabelStateOpts;
	readonly root: TimeRangeFieldRootState;
	readonly attachment: RefAttachment;

	constructor(opts: TimeRangeFieldLabelStateOpts, root: TimeRangeFieldRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref, (v) => (this.root.labelNode = v));
	}

	#onclick = () => {
		if (this.root.opts.disabled.current) return;
		const firstSegment = getFirstSegment(this.root.fieldNode);
		if (!firstSegment) return;
		firstSegment.focus();
	};

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-invalid": getDataInvalid(this.root.isInvalid),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				[timeRangeFieldAttrs.label]: "",
				onclick: this.#onclick,
				...this.attachment,
			}) as const
	);
}

interface TimeRangeFieldInputStateOpts<T extends TimeValue = Time>
	extends WritableBoxedValues<{
			value: T | undefined;
		}>,
		ReadableBoxedValues<{
			name: string;
		}>,
		WithRefOpts {}

export class TimeRangeFieldInputState {
	static create(opts: Omit<TimeRangeFieldInputStateOpts, "value">, type: "start" | "end") {
		const root = TimeRangeFieldRootContext.get();
		const fieldState = TimeFieldRootState.create(
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

		return new TimeFieldInputState({ name: opts.name, id: opts.id, ref: opts.ref }, fieldState);
	}
}
