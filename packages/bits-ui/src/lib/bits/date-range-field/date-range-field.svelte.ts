import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import { useId } from "$lib/internal/useId.svelte.js";
import { getAnnouncer, type Announcer } from "$lib/shared/date/announcer.js";
import { removeDescriptionElement } from "$lib/shared/date/field/helpers.js";
import { createFormatter, type Formatter } from "$lib/shared/date/formatter.js";
import type { Granularity, Matcher } from "$lib/shared/date/types.js";
import type { DateRange, SegmentPart } from "$lib/shared/index.js";
import type { DateValue } from "@internationalized/date";
import { onDestroy, untrack } from "svelte";
import { box, type WritableBox } from "svelte-toolbelt";

type DateRangeFieldRootStateProps = WritableBoxedValues<{
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
	}>;

export class DateRangeFieldRootState {
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
}
