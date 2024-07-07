import type { CalendarRootProps } from "$lib/types.js";
import type { DateRange, Month } from "$lib/shared/index.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { isSameDay, isSameMonth, type DateValue } from "@internationalized/date";
import { getAnnouncer, type Announcer } from "$lib/shared/date/announcer.js";
import { createFormatter, type Formatter } from "$lib/shared/date/formatter.js";
import { useId } from "$lib/internal/useId.svelte.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import {
	areAllDaysBetweenValid,
	createMonths,
	isAfter,
	isBefore,
	isBetweenInclusive,
	toDate,
} from "$lib/shared/date/index.js";

type RangeCalendarRootStateProps = WithRefProps<
	WritableBoxedValues<{
		value: DateRange;
		placeholder: DateValue;
	}> &
		ReadableBoxedValues<{
			preventDeselect: boolean;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			disabled: boolean;
			pagedNavigation: boolean;
			weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
			weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
			isDateDisabled: (date: DateValue) => boolean;
			isDateUnavailable: (date: DateValue) => boolean;
			fixedWeeks: boolean;
			numberOfMonths: number;
			locale: string;
			calendarLabel: string;
			readonly: boolean;
			disableDaysOutsideMonth: boolean;
		}>
>;

class RangeCalendarRootState {
	id: RangeCalendarRootStateProps["id"];
	ref: RangeCalendarRootStateProps["ref"];
	value: RangeCalendarRootStateProps["value"];
	placeholder: RangeCalendarRootStateProps["placeholder"];
	preventDeselect: RangeCalendarRootStateProps["preventDeselect"];
	minValue: RangeCalendarRootStateProps["minValue"];
	maxValue: RangeCalendarRootStateProps["maxValue"];
	disabled: RangeCalendarRootStateProps["disabled"];
	pagedNavigation: RangeCalendarRootStateProps["pagedNavigation"];
	weekStartsOn: RangeCalendarRootStateProps["weekStartsOn"];
	weekdayFormat: RangeCalendarRootStateProps["weekdayFormat"];
	isDateDisabledProp: RangeCalendarRootStateProps["isDateDisabled"];
	isDateUnavailableProp: RangeCalendarRootStateProps["isDateUnavailable"];
	fixedWeeks: RangeCalendarRootStateProps["fixedWeeks"];
	numberOfMonths: RangeCalendarRootStateProps["numberOfMonths"];
	locale: RangeCalendarRootStateProps["locale"];
	calendarLabel: RangeCalendarRootStateProps["calendarLabel"];
	readonly: RangeCalendarRootStateProps["readonly"];
	disableDaysOutsideMonth: RangeCalendarRootStateProps["disableDaysOutsideMonth"];
	months: Month<DateValue>[] = $state([]);
	visibleMonths = $derived.by(() => this.months.map((month) => month.value));
	announcer: Announcer;
	formatter: Formatter;
	accessibleHeadingId = useId();
	startValue = $state<DateValue | undefined>(undefined);
	endValue = $state<DateValue | undefined>(undefined);
	focusedValue = $state<DateValue | undefined>(undefined);
	lastPressedDateValue = $state<DateValue | undefined>(undefined);

	constructor(props: RangeCalendarRootStateProps) {
		this.value = props.value;
		this.placeholder = props.placeholder;
		this.preventDeselect = props.preventDeselect;
		this.minValue = props.minValue;
		this.maxValue = props.maxValue;
		this.disabled = props.disabled;
		this.pagedNavigation = props.pagedNavigation;
		this.weekStartsOn = props.weekStartsOn;
		this.weekdayFormat = props.weekdayFormat;
		this.isDateDisabledProp = props.isDateDisabled;
		this.isDateUnavailableProp = props.isDateUnavailable;
		this.fixedWeeks = props.fixedWeeks;
		this.numberOfMonths = props.numberOfMonths;
		this.locale = props.locale;
		this.calendarLabel = props.calendarLabel;
		this.readonly = props.readonly;
		this.disableDaysOutsideMonth = props.disableDaysOutsideMonth;
		this.id = props.id;
		this.ref = props.ref;

		this.announcer = getAnnouncer();
		this.formatter = createFormatter(this.locale.value);

		useRefById({
			id: this.id,
			ref: this.ref,
		});

		this.months = createMonths({
			dateObj: this.placeholder.value,
			weekStartsOn: this.weekStartsOn.value,
			locale: this.locale.value,
			fixedWeeks: this.fixedWeeks.value,
			numberOfMonths: this.numberOfMonths.value,
		});

		this.startValue = this.value.value.start;
		this.endValue = this.value.value.end;
	}

	isOutsideVisibleMonths(date: DateValue) {
		return !this.visibleMonths.some((month) => isSameMonth(date, month));
	}

	isDateDisabled(date: DateValue) {
		if (this.isDateDisabledProp.value(date) || this.disabled.value) return true;
		const minValue = this.minValue.value;
		const maxValue = this.maxValue.value;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isAfter(date, maxValue)) return true;
		return false;
	}

	isDateUnavailable(date: DateValue) {
		if (this.isDateUnavailableProp.value(date)) return true;
		return false;
	}

	isStartInvalid = $derived.by(() => {
		if (!this.startValue) return false;
		return this.isDateUnavailable(this.startValue) || this.isDateDisabled(this.startValue);
	});

	isEndInvalid = $derived.by(() => {
		if (!this.endValue) return false;
		return this.isDateUnavailable(this.endValue) || this.isDateDisabled(this.endValue);
	});

	isInvalid = $derived.by(() => {
		if (this.isStartInvalid || this.isEndInvalid) return true;

		if (this.endValue && this.startValue && isBefore(this.endValue, this.startValue))
			return true;

		return false;
	});

	isNextButtonDisabled = $derived.by(() => {
		const maxValue = this.maxValue.value;
		if (!maxValue || !this.months.length) return false;
		if (this.disabled.value) return true;
		const lastMonthInView = this.months[this.months.length - 1]?.value;
		if (!lastMonthInView) return false;
		const firstMonthOfNextPage = lastMonthInView
			.add({
				months: 1,
			})
			.set({ day: 1 });
		return isAfter(firstMonthOfNextPage, maxValue);
	});

	isPrevButtonDisabled = $derived.by(() => {
		const minValue = this.minValue.value;
		if (!minValue || !this.months.length) return false;
		if (this.disabled.value) return true;
		const firstMonthInView = this.months[0]?.value;
		if (!firstMonthInView) return false;
		const lastMonthOfPrevPage = firstMonthInView
			.subtract({
				months: 1,
			})
			.set({ day: 35 });
		return isBefore(lastMonthOfPrevPage, minValue);
	});

	headingValue = $derived.by(() => {
		if (!this.months.length) return "";
		if (this.locale.value !== this.formatter.getLocale()) {
			this.formatter.setLocale(this.locale.value);
		}
		if (this.months.length === 1) {
			const month = toDate(this.months[0]!.value);
			return `${this.formatter.fullMonthAndYear(month)}`;
		}

		const startMonth = toDate(this.months[0]!.value);
		const endMonth = toDate(this.months[this.months.length - 1]!.value);

		const startMonthName = this.formatter.fullMonth(startMonth);
		const endMonthName = this.formatter.fullMonth(endMonth);

		const startMonthYear = this.formatter.fullYear(startMonth);
		const endMonthYear = this.formatter.fullYear(endMonth);

		const content =
			startMonthYear === endMonthYear
				? `${startMonthName} - ${endMonthName} ${endMonthYear}`
				: `${startMonthName} ${startMonthYear} - ${endMonthName} ${endMonthYear}`;

		return content;
	});

	fullCalendarLabel = $derived.by(() => `${this.calendarLabel.value} ${this.headingValue}`);

	isSelectionStart(date: DateValue) {
		if (!this.startValue) return false;
		return isSameDay(date, this.startValue);
	}

	isSelectionEnd(date: DateValue) {
		if (!this.endValue) return false;
		return isSameDay(date, this.endValue);
	}

	isSelected(date: DateValue) {
		if (this.startValue && isSameDay(this.startValue, date)) return true;
		if (this.endValue && isSameDay(this.endValue, date)) return true;
		if (this.startValue && this.endValue) {
			return isBetweenInclusive(date, this.startValue, this.endValue);
		}
		return false;
	}

	highlightedRange = $derived.by(() => {
		if (this.startValue && this.endValue) return null;
		if (!this.startValue || !this.focusedValue) return null;

		const isStartBeforeFocused = isBefore(this.startValue, this.focusedValue);
		const start = isStartBeforeFocused ? this.startValue : this.focusedValue;

		const end = isStartBeforeFocused ? this.focusedValue : this.startValue;

		if (isSameDay(start.add({ days: 1 }), end)) {
			return {
				start,
				end,
			};
		}

		const isValid = areAllDaysBetweenValid(
			start,
			end,
			this.isDateUnavailable,
			this.isDateDisabled
		);
		if (isValid) {
			return {
				start,
				end,
			};
		}
		return null;
	});
}
