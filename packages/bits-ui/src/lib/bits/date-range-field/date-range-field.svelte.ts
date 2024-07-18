import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useId } from "$lib/internal/useId.svelte.js";
import { removeDescriptionElement } from "$lib/shared/date/field/helpers.js";
import { createFormatter, type Formatter } from "$lib/shared/date/formatter.js";
import type { Granularity, DateMatcher } from "$lib/shared/date/types.js";
import type { DateRange, SegmentPart } from "$lib/shared/index.js";
import type { DateValue } from "@internationalized/date";
import { onDestroy, untrack } from "svelte";
import { useDateFieldRoot } from "../date-field/date-field.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import { getFirstSegment } from "$lib/shared/date/field.js";
import { getDataDisabled } from "$lib/internal/attrs.js";
import type { ReadableBox, WritableBox } from "svelte-toolbelt";

export const DATE_RANGE_FIELD_ROOT_ATTR = "data-date-range-field-root";

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
	descriptionId = useId();
	formatter: Formatter;
	fieldNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	validationNode = $state<HTMLElement | null>(null);
	startValueComplete = $derived.by(() => this.startValue.value !== undefined);
	endValueComplete = $derived.by(() => this.endValue.value !== undefined);
	rangeComplete = $derived(this.startValueComplete && this.endValueComplete);
	mergedValues = $derived.by(() => {
		if (this.startValue.value === undefined || this.endValue.value === undefined) {
			return {
				start: undefined,
				end: undefined,
			};
		} else {
			return {
				start: this.startValue.value,
				end: this.endValue.value,
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
		this.formatter = createFormatter(this.locale.value);
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
			onRefChange: (node) => {
				this.fieldNode = node;
			},
		});

		onDestroy(() => {
			removeDescriptionElement(this.descriptionId);
		});

		$effect(() => {
			if (this.formatter.getLocale() === this.locale.value) return;
			this.formatter.setLocale(this.locale.value);
		});

		$effect(() => {
			const startValue = this.value.value.start;
			untrack(() => {
				if (startValue) this.placeholder.value = startValue;
			});
		});

		$effect(() => {
			const endValue = this.value.value.end;
			untrack(() => {
				if (endValue) this.placeholder.value = endValue;
			});
		});

		/**
		 * Sync values set programatically with the `startValue` and `endValue`
		 */
		$effect(() => {
			const value = this.value.value;

			untrack(() => {
				if (value.start !== undefined && value.start !== this.startValue.value) {
					this.setStartValue(value.start);
				}
				if (value.end !== undefined && value.end !== this.endValue.value) {
					this.setEndValue(value.end);
				}
			});
		});

		// TODO: Handle description element

		$effect(() => {
			const placeholder = untrack(() => this.placeholder.value);
			const startValue = untrack(() => this.startValue.value);

			if (this.startValueComplete && placeholder !== startValue) {
				untrack(() => {
					if (startValue) {
						this.placeholder.value = startValue;
					}
				});
			}
		});

		$effect(() => {
			this.value.value = this.mergedValues;
		});
	}

	setStartValue(value: DateValue | undefined) {
		this.startValue.value = value;
	}

	setEndValue(value: DateValue | undefined) {
		this.endValue.value = value;
	}

	/**
	 * These props are used to override those of the child fields.
	 * TODO:
	 */
	childFieldPropOverrides = {};

	createField(props: DateRangeFieldInputStateProps) {
		return useDateFieldRoot(
			{
				value: props.value,
				name: props.name,
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
	}

	createLabel(props: DateRangeFieldLabelStateProps) {
		return new DateRangeFieldLabelState(props, this);
	}

	props = $derived.by(() => ({
		id: this.id.value,
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
		if (this.#root.disabled.value) return;
		const firstSegment = getFirstSegment(this.#root.fieldNode);
		if (!firstSegment) return;
		firstSegment.focus();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				// "data-invalid": getDataInvalid(this.#root.isInvalid),
				"data-disabled": getDataDisabled(this.#root.disabled.value),
				onclick: this.#onclick,
			}) as const
	);
}

type DateRangeFieldInputStateProps = {
	value: WritableBox<DateValue | undefined>;
	name: ReadableBox<string>;
};

const [setDateRangeFieldRootContext, getDateRangeFieldRootContext] =
	createContext<DateRangeFieldRootState>("DateRangeField.Root");

export function useDateRangeFieldRoot(props: DateRangeFieldRootStateProps) {
	return setDateRangeFieldRootContext(new DateRangeFieldRootState(props));
}

export function useDateRangeFieldLabel(props: DateRangeFieldLabelStateProps) {
	return getDateRangeFieldRootContext().createLabel(props);
}

export function useDateRangeFieldInput(props: DateRangeFieldInputStateProps) {
	return getDateRangeFieldRootContext().createField(props);
}

export { getDateRangeFieldRootContext };
