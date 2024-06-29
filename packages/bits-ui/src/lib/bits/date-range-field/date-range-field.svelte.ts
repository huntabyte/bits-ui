import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useId } from "$lib/internal/useId.svelte.js";
import { removeDescriptionElement } from "$lib/shared/date/field/helpers.js";
import { createFormatter, type Formatter } from "$lib/shared/date/formatter.js";
import type { Granularity, Matcher } from "$lib/shared/date/types.js";
import type { DateRange, SegmentPart } from "$lib/shared/index.js";
import type { DateValue } from "@internationalized/date";
import { onDestroy, untrack } from "svelte";
import { useDateFieldRoot, type DateFieldRootStateProps } from "../date-field/date-field.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { createContext } from "$lib/internal/createContext.js";
import { getFirstSegment } from "$lib/shared/date/field.js";
import { getDataDisabled, getDataInvalid } from "$lib/internal/attrs.js";

type DateRangeFieldRootStateProps = WithRefProps<
	WritableBoxedValues<{
		value: DateRange;
		placeholder: DateValue;
	}> &
		ReadableBoxedValues<{
			readonlySegments: SegmentPart[];
			isDateUnavailable: Matcher | undefined;
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
	descriptionId = useId();
	formatter: Formatter;
	fieldNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	validationNode = $state<HTMLElement | null>(null);
	startValue = $state<DateValue | undefined>(undefined);
	endValue = $state<DateValue | undefined>(undefined);
	startValueComplete = $derived.by(() => this.startValue !== undefined);
	endValueComplete = $derived.by(() => this.endValue !== undefined);
	rangeComplete = $derived(this.startValueComplete && this.endValueComplete);

	constructor(props: DateRangeFieldRootStateProps) {
		this.value = props.value;
		this.startValue = this.value.value.start;
		this.endValue = this.value.value.end;
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

		// TODO: Handle description element

		$effect(() => {
			const placeholder = untrack(() => this.placeholder.value);
			const startValue = untrack(() => this.startValue);

			if (this.startValueComplete && placeholder !== startValue) {
				untrack(() => {
					if (startValue) {
						this.placeholder.value = startValue;
					}
				});
			}
		});
	}

	/**
	 * These props are used to override those of the child fields.
	 */
	childFieldPropOverrides = {};

	createField(props: DateFieldRootStateProps) {
		return useDateFieldRoot(props, this);
	}

	createLabel(props: DateRangeFieldLabelStateProps) {
		return new DateFieldLabelState(props, this);
	}

	props = $derived.by(() => ({
		id: this.id.value,
		role: "group",
	}));
}

type DateRangeFieldLabelStateProps = WithRefProps;

class DateFieldLabelState {
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

const [setDateRangeFieldRootContext, getDateRangeFieldRootContext] =
	createContext<DateRangeFieldRootState>("DateRangeField.Root");

export function useDateRangeFieldRoot(props: DateRangeFieldRootStateProps) {
	return setDateRangeFieldRootContext(new DateRangeFieldRootState(props));
}

export function useDateRangeFieldLabel(props: DateRangeFieldLabelStateProps) {
	return getDateRangeFieldRootContext().createLabel(props);
}

export { getDateRangeFieldRootContext };
