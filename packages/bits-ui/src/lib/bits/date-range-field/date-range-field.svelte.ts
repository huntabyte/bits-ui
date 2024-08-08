import type { DateValue } from "@internationalized/date";
import { untrack } from "svelte";
import type { ReadableBox, WritableBox } from "svelte-toolbelt";
import type { DateFieldRootState } from "../date-field/date-field.svelte.js";
import { useDateFieldRoot } from "../date-field/date-field.svelte.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useId } from "$lib/internal/useId.js";
import { removeDescriptionElement } from "$lib/shared/date/field/helpers.js";
import { type Formatter, createFormatter } from "$lib/shared/date/formatter.js";
import type { DateMatcher, Granularity } from "$lib/shared/date/types.js";
import type { DateRange, SegmentPart } from "$lib/shared/index.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import { getFirstSegment } from "$lib/shared/date/field.js";
import { getDataDisabled } from "$lib/internal/attrs.js";
import { onDestroyEffect } from "$lib/internal/onDestroyEffect.svelte.js";

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
			isDateUnavailable: DateMatcher | undefined;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			disabled: boolean;
			readonly: boolean;
			granularity: Granularity | undefined;
			hourCycle: 12 | 24 | undefined;
			locale: string;
			hideTimeZone: boolean;
			required: boolean;
		}>
>;

export class DateRangeFieldRootState {
	ref: DateRangeFieldRootStateProps["ref"];
	id: DateRangeFieldRootStateProps["id"];
	value: DateRangeFieldRootStateProps["value"];
	placeholder: DateRangeFieldRootStateProps["placeholder"];
	readonlySegments: DateRangeFieldRootStateProps["readonlySegments"];
	isDateUnavailable: DateRangeFieldRootStateProps["isDateUnavailable"];
	minValue: DateRangeFieldRootStateProps["minValue"];
	maxValue: DateRangeFieldRootStateProps["maxValue"];
	disabled: DateRangeFieldRootStateProps["disabled"];
	readonly: DateRangeFieldRootStateProps["readonly"];
	granularity: DateRangeFieldRootStateProps["granularity"];
	hourCycle: DateRangeFieldRootStateProps["hourCycle"];
	locale: DateRangeFieldRootStateProps["locale"];
	hideTimeZone: DateRangeFieldRootStateProps["hideTimeZone"];
	required: DateRangeFieldRootStateProps["required"];
	startValue: DateRangeFieldRootStateProps["startValue"];
	endValue: DateRangeFieldRootStateProps["endValue"];
	startFieldState: DateFieldRootState | undefined = undefined;
	endFieldState: DateFieldRootState | undefined = undefined;
	descriptionId = useId();
	formatter: Formatter;
	fieldNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	validationNode = $state<HTMLElement | null>(null);
	startValueComplete = $derived.by(() => this.startValue.current !== undefined);
	endValueComplete = $derived.by(() => this.endValue.current !== undefined);
	rangeComplete = $derived(this.startValueComplete && this.endValueComplete);
	mergedValues = $derived.by(() => {
		if (this.startValue.current === undefined || this.endValue.current === undefined) {
			return {
				start: undefined,
				end: undefined,
			};
		} else {
			return {
				start: this.startValue.current,
				end: this.endValue.current,
			};
		}
	});

	constructor(props: DateRangeFieldRootStateProps) {
		this.value = props.value;
		this.startValue = props.startValue;
		this.endValue = props.endValue;
		this.placeholder = props.placeholder;
		this.isDateUnavailable = props.isDateUnavailable;
		this.minValue = props.minValue;
		this.maxValue = props.maxValue;
		this.disabled = props.disabled;
		this.readonly = props.readonly;
		this.granularity = props.granularity;
		this.readonlySegments = props.readonlySegments;
		this.hourCycle = props.hourCycle;
		this.locale = props.locale;
		this.hideTimeZone = props.hideTimeZone;
		this.required = props.required;
		this.formatter = createFormatter(this.locale.current);
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.fieldNode = node;
			},
		});

		onDestroyEffect(() => {
			removeDescriptionElement(this.descriptionId);
		});

		$effect(() => {
			if (this.formatter.getLocale() === this.locale.current) return;
			this.formatter.setLocale(this.locale.current);
		});

		$effect(() => {
			const startValue = this.value.current.start;
			untrack(() => {
				if (startValue) this.placeholder.current = startValue;
			});
		});

		$effect(() => {
			const endValue = this.value.current.end;
			untrack(() => {
				if (endValue) this.placeholder.current = endValue;
			});
		});

		/**
		 * Sync values set programatically with the `startValue` and `endValue`
		 */
		$effect(() => {
			const value = this.value.current;

			untrack(() => {
				if (value.start !== undefined && value.start !== this.startValue.current) {
					this.setStartValue(value.start);
				}
				if (value.end !== undefined && value.end !== this.endValue.current) {
					this.setEndValue(value.end);
				}
			});
		});

		// TODO: Handle description element

		$effect(() => {
			const placeholder = untrack(() => this.placeholder.current);
			const startValue = untrack(() => this.startValue.current);

			if (this.startValueComplete && placeholder !== startValue) {
				untrack(() => {
					if (startValue) {
						this.placeholder.current = startValue;
					}
				});
			}
		});

		$effect(() => {
			this.value.current = this.mergedValues;
		});
	}

	setStartValue(value: DateValue | undefined) {
		this.startValue.current = value;
	}

	setEndValue(value: DateValue | undefined) {
		this.endValue.current = value;
	}

	/**
	 * These props are used to override those of the child fields.
	 * TODO:
	 */
	childFieldPropOverrides = {};

	createField(
		props: {
			value: WritableBox<DateValue | undefined>;
		},
		type: "start" | "end"
	) {
		const fieldState = useDateFieldRoot(
			{
				value: props.value,
				disabled: this.disabled,
				readonly: this.readonly,
				readonlySegments: this.readonlySegments,
				isDateUnavailable: this.isDateUnavailable,
				minValue: this.minValue,
				maxValue: this.maxValue,
				hourCycle: this.hourCycle,
				locale: this.locale,
				hideTimeZone: this.hideTimeZone,
				required: this.required,
				granularity: this.granularity,
				placeholder: this.placeholder,
			},
			this
		);

		if (type === "start") {
			this.startFieldState = fieldState;
		} else {
			this.endFieldState = fieldState;
		}
		return fieldState;
	}

	createLabel(props: DateRangeFieldLabelStateProps) {
		return new DateRangeFieldLabelState(props, this);
	}

	props = $derived.by(() => ({
		id: this.id.current,
		role: "group",
		[DATE_RANGE_FIELD_ROOT_ATTR]: "",
	}));
}

type DateRangeFieldLabelStateProps = WithRefProps;

class DateRangeFieldLabelState {
	#id: DateRangeFieldLabelStateProps["id"];
	#ref: DateRangeFieldLabelStateProps["ref"];
	#root: DateRangeFieldRootState;

	constructor(props: DateRangeFieldLabelStateProps, root: DateRangeFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.labelNode = node;
			},
		});
	}

	#onclick = () => {
		if (this.#root.disabled.current) return;
		const firstSegment = getFirstSegment(this.#root.fieldNode);
		if (!firstSegment) return;
		firstSegment.focus();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.current,
				// TODO: invalid state for field
				// "data-invalid": getDataInvalid(this.#root.isInvalid),
				"data-disabled": getDataDisabled(this.#root.disabled.current),
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

const [setDateRangeFieldRootContext, getDateRangeFieldRootContext] =
	createContext<DateRangeFieldRootState>("DateRangeField.Root");

export function useDateRangeFieldRoot(props: DateRangeFieldRootStateProps) {
	return setDateRangeFieldRootContext(new DateRangeFieldRootState(props));
}

export function useDateRangeFieldLabel(props: DateRangeFieldLabelStateProps) {
	return getDateRangeFieldRootContext().createLabel(props);
}

export function useDateRangeFieldInput(
	props: Omit<DateRangeFieldInputStateProps, "value">,
	type: "start" | "end"
) {
	const rootState = getDateRangeFieldRootContext();
	const fieldState = rootState.createField(
		{
			value: type === "start" ? rootState.startValue : rootState.endValue,
		},
		type
	);
	const inputState = fieldState.createInput({
		name: props.name,
		id: props.id,
		ref: props.ref,
	});
	return inputState;
}

export { getDateRangeFieldRootContext };
