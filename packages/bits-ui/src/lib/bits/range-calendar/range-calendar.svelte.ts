import type { DateRange, Month } from "$lib/shared/index.js";
import {
	watch,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import {
	getLocalTimeZone,
	isSameDay,
	isSameMonth,
	isToday,
	type DateValue,
} from "@internationalized/date";
import { getAnnouncer, type Announcer } from "$lib/shared/date/announcer.js";
import { createFormatter, type Formatter } from "$lib/shared/date/formatter.js";
import { useId } from "$lib/internal/useId.svelte.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import {
	areAllDaysBetweenValid,
	isAfter,
	isBefore,
	isBetweenInclusive,
	toDate,
	type CalendarParts,
} from "$lib/shared/date/index.js";
import {
	createMonths,
	useMonthViewOptionsSync,
	useMonthViewPlaceholderSync,
	getCalendarHeadingValue,
	getIsNextButtonDisabled,
	getIsPrevButtonDisabled,
	getCalendarElementProps,
	getCalendarBitsAttr,
	getWeekdays,
	handleCalendarKeydown,
	handleCalendarNextPage,
	handleCalendarPrevPage,
	shiftCalendarFocus,
} from "$lib/shared/date/calendar-helpers.svelte.js";
import { untrack } from "svelte";
import {
	CalendarGridBodyState,
	CalendarGridHeadState,
	CalendarGridRowState,
	CalendarGridState,
	CalendarHeadCellState,
	CalendarHeaderState,
	CalendarHeadingState,
	CalendarNextButtonState,
	CalendarPrevButtonState,
	type CalendarGridBodyStateProps,
	type CalendarGridHeadStateProps,
	type CalendarGridRowStateProps,
	type CalendarGridStateProps,
	type CalendarHeadCellStateProps,
	type CalendarHeaderStateProps,
	type CalendarHeadingStateProps,
	type CalendarNextButtonStateProps,
	type CalendarPrevButtonStateProps,
} from "../calendar/calendar.svelte.js";
import {
	getAriaDisabled,
	getAriaSelected,
	getDataDisabled,
	getDataSelected,
	getDataUnavailable,
} from "$lib/internal/attrs.js";
import { createContext } from "$lib/internal/createContext.js";

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

export class RangeCalendarRootState {
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

		$effect(() => {
			if (this.formatter.getLocale() === this.locale.value) return;
			this.formatter.setLocale(this.locale.value);
		});

		/**
		 * Updates the displayed months based on changes in the placeholder values,
		 * which determines the month to show in the calendar.
		 */
		useMonthViewPlaceholderSync({
			placeholder: this.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.weekStartsOn,
			locale: this.locale,
			fixedWeeks: this.fixedWeeks,
			numberOfMonths: this.numberOfMonths,
			setMonths: this.#setMonths,
		});

		/**
		 * Updates the displayed months based on changes in the options values,
		 * which determines the month to show in the calendar.
		 */
		useMonthViewOptionsSync({
			fixedWeeks: this.fixedWeeks,
			locale: this.locale,
			numberOfMonths: this.numberOfMonths,
			placeholder: this.placeholder,
			setMonths: this.#setMonths,
			weekStartsOn: this.weekStartsOn,
		});

		/**
		 * Update the accessible heading's text content when the `fullCalendarLabel`
		 * changes.
		 */
		$effect(() => {
			const node = document.getElementById(this.accessibleHeadingId);
			if (!node) return;
			node.textContent = this.fullCalendarLabel;
		});

		/**
		 * Synchronize the placeholder value with the current value.
		 */
		// watch(this.value, () => {
		// 	const endValue = this.value.value.end;
		// 	if (endValue && this.placeholder.value !== endValue) {
		// 		this.placeholder.value = endValue;
		// 	}
		// });

		$effect(() => {
			const startValue = this.startValue;
			const endValue = this.endValue;

			untrack(() => {
				const value = this.value.value;
				if (value && value.start === startValue && value.end === endValue) {
					return;
				}

				if (startValue && endValue) {
					this.#updateValue((prev) => {
						if (prev.start === startValue && prev.end === endValue) return prev;
						if (isBefore(endValue, startValue)) {
							const start = startValue;
							const end = endValue;
							this.startValue = end;
							this.endValue = start;
							return { start: endValue, end: startValue };
						} else {
							return {
								start: startValue,
								end: endValue,
							};
						}
					});
				} else if (value && value.start && value.end) {
					this.value.value = {
						start: undefined,
						end: undefined,
					};
				}
			});
		});
	}

	#updateValue = (cb: (value: DateRange) => DateRange) => {
		const value = this.value.value;
		const newValue = cb(value);
		this.value.value = newValue;
	};

	#setMonths = (months: Month<DateValue>[]) => (this.months = months);

	/**
	 * This derived state holds an array of localized day names for the current
	 * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
	 * updating its content when the option changes. Using this state to render the
	 * calendar's days of the week is strongly recommended, as it guarantees that
	 * the days are correctly formatted for the current locale and calendar view.
	 */
	weekdays = $derived.by(() => {
		return getWeekdays({
			months: this.months,
			formatter: this.formatter,
			weekdayFormat: this.weekdayFormat.value,
		});
	});

	isOutsideVisibleMonths = (date: DateValue) => {
		return !this.visibleMonths.some((month) => isSameMonth(date, month));
	};

	isDateDisabled = (date: DateValue) => {
		if (this.isDateDisabledProp.value(date) || this.disabled.value) return true;
		const minValue = this.minValue.value;
		const maxValue = this.maxValue.value;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isAfter(date, maxValue)) return true;
		return false;
	};

	isDateUnavailable = (date: DateValue) => {
		if (this.isDateUnavailableProp.value(date)) return true;
		return false;
	};

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
		return getIsNextButtonDisabled({
			maxValue: this.maxValue.value,
			months: this.months,
			disabled: this.disabled.value,
		});
	});

	isPrevButtonDisabled = $derived.by(() => {
		return getIsPrevButtonDisabled({
			minValue: this.minValue.value,
			months: this.months,
			disabled: this.disabled.value,
		});
	});

	headingValue = $derived.by(() => {
		return getCalendarHeadingValue({
			months: this.months,
			formatter: this.formatter,
			locale: this.locale.value,
		});
	});

	fullCalendarLabel = $derived.by(() => `${this.calendarLabel.value} ${this.headingValue}`);

	isSelectionStart = (date: DateValue) => {
		if (!this.startValue) return false;
		return isSameDay(date, this.startValue);
	};

	isSelectionEnd = (date: DateValue) => {
		if (!this.endValue) return false;
		return isSameDay(date, this.endValue);
	};

	isSelected = (date: DateValue) => {
		if (this.startValue && isSameDay(this.startValue, date)) return true;
		if (this.endValue && isSameDay(this.endValue, date)) return true;
		if (this.startValue && this.endValue) {
			return isBetweenInclusive(date, this.startValue, this.endValue);
		}
		return false;
	};

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

	#shiftFocus = (node: HTMLElement, add: number) => {
		return shiftCalendarFocus({
			node,
			add,
			placeholder: this.placeholder,
			calendarNode: this.ref.value,
			isPrevButtonDisabled: this.isPrevButtonDisabled,
			isNextButtonDisabled: this.isNextButtonDisabled,
			months: this.months,
			numberOfMonths: this.numberOfMonths.value,
		});
	};

	#announceEmpty = () => {
		this.announcer.announce("Selected date is now empty.", "polite");
	};

	#announceSelectedDate = (date: DateValue) => {
		this.announcer.announce(
			`Selected Date: ${this.formatter.selectedDate(date, false)}`,
			"polite"
		);
	};

	#announceSelectedRange = (start: DateValue, end: DateValue) => {
		this.announcer.announce(
			`Selected Dates: ${this.formatter.selectedDate(start, false)} to ${this.formatter.selectedDate(end, false)}`,
			"polite"
		);
	};

	handleCellClick = (e: Event, date: DateValue) => {
		if (this.isDateDisabled(date) || this.isDateUnavailable(date)) return;
		const prevLastPressedDate = this.lastPressedDateValue;
		this.lastPressedDateValue = date;

		if (this.startValue && this.highlightedRange === null) {
			if (isSameDay(this.startValue, date) && !this.preventDeselect.value && !this.endValue) {
				this.startValue = undefined;
				this.placeholder.value = date;
				this.#announceEmpty();
				return;
			} else if (!this.endValue) {
				e.preventDefault();
				if (prevLastPressedDate && isSameDay(prevLastPressedDate, date)) {
					this.startValue = date;
					this.#announceSelectedDate(date);
				}
			}
		}

		if (
			this.startValue &&
			this.endValue &&
			isSameDay(this.endValue, date) &&
			!this.preventDeselect.value
		) {
			this.startValue = undefined;
			this.endValue = undefined;
			this.placeholder.value = date;
			this.#announceEmpty();
			return;
		}

		if (!this.startValue) {
			this.#announceSelectedDate(date);
			this.startValue = date;
		} else if (!this.endValue) {
			this.#announceSelectedRange(this.startValue, date);
			this.endValue = date;
		} else if (this.endValue && this.startValue) {
			this.endValue = undefined;
			this.#announceSelectedDate(date);
			this.startValue = date;
		}
	};

	#onkeydown = (event: KeyboardEvent) => {
		return handleCalendarKeydown({
			event,
			handleCellClick: this.handleCellClick,
			placeholderValue: this.placeholder.value,
			shiftFocus: this.#shiftFocus,
		});
	};

	/**
	 * Navigates to the next page of the calendar.
	 */
	nextPage = () => {
		handleCalendarNextPage({
			fixedWeeks: this.fixedWeeks.value,
			locale: this.locale.value,
			numberOfMonths: this.numberOfMonths.value,
			pagedNavigation: this.pagedNavigation.value,
			setMonths: this.#setMonths,
			setPlaceholder: (date: DateValue) => (this.placeholder.value = date),
			weekStartsOn: this.weekStartsOn.value,
			months: this.months,
		});
	};

	/**
	 * Navigates to the previous page of the calendar.
	 */
	prevPage = () => {
		handleCalendarPrevPage({
			fixedWeeks: this.fixedWeeks.value,
			locale: this.locale.value,
			numberOfMonths: this.numberOfMonths.value,
			pagedNavigation: this.pagedNavigation.value,
			setMonths: this.#setMonths,
			setPlaceholder: (date: DateValue) => (this.placeholder.value = date),
			weekStartsOn: this.weekStartsOn.value,
			months: this.months,
		});
	};

	nextYear = () => {
		this.placeholder.value = this.placeholder.value.add({ years: 1 });
	};

	prevYear = () => {
		this.placeholder.value = this.placeholder.value.subtract({ years: 1 });
	};

	setYear = (year: number) => {
		this.placeholder.value = this.placeholder.value.set({ year });
	};

	setMonth = (month: number) => {
		this.placeholder.value = this.placeholder.value.set({ month });
	};

	getBitsAttr = (part: CalendarParts) => {
		return getCalendarBitsAttr(this, part);
	};

	snippetProps = $derived.by(() => ({
		months: this.months,
		weekdays: this.weekdays,
	}));

	props = $derived.by(
		() =>
			({
				...getCalendarElementProps({
					fullCalendarLabel: this.fullCalendarLabel,
					id: this.id.value,
					isInvalid: this.isInvalid,
					disabled: this.disabled.value,
					readonly: this.readonly.value,
				}),
				[this.getBitsAttr("root")]: "",
				//
				onkeydown: this.#onkeydown,
			}) as const
	);

	createHeading = (props: CalendarHeadingStateProps) => {
		return new CalendarHeadingState(props, this);
	};

	createGrid = (props: CalendarGridStateProps) => {
		return new CalendarGridState(props, this);
	};

	createCell = (props: RangeCalendarCellStateProps) => {
		return new RangeCalendarCellState(props, this);
	};

	createNextButton = (props: CalendarNextButtonStateProps) => {
		return new CalendarNextButtonState(props, this);
	};

	createPrevButton = (props: CalendarPrevButtonStateProps) => {
		return new CalendarPrevButtonState(props, this);
	};

	createGridBody = (props: CalendarGridBodyStateProps) => {
		return new CalendarGridBodyState(props, this);
	};

	createGridHead = (props: CalendarGridHeadStateProps) => {
		return new CalendarGridHeadState(props, this);
	};

	createGridRow = (props: CalendarGridRowStateProps) => {
		return new CalendarGridRowState(props, this);
	};

	createHeadCell = (props: CalendarHeadCellStateProps) => {
		return new CalendarHeadCellState(props, this);
	};

	createHeader = (props: CalendarHeaderStateProps) => {
		return new CalendarHeaderState(props, this);
	};
}

type RangeCalendarCellStateProps = WithRefProps<
	ReadableBoxedValues<{
		date: DateValue;
		month: DateValue;
	}>
>;

export class RangeCalendarCellState {
	id: RangeCalendarCellStateProps["id"];
	ref: RangeCalendarCellStateProps["ref"];
	date: RangeCalendarCellStateProps["date"];
	month: RangeCalendarCellStateProps["month"];
	cellDate = $derived.by(() => toDate(this.date.value));
	isDisabled = $derived.by(() => this.root.isDateDisabled(this.date.value));
	isUnvailable = $derived.by(() => this.root.isDateUnavailableProp.value(this.date.value));
	isDateToday = $derived.by(() => isToday(this.date.value, getLocalTimeZone()));
	isOutsideMonth = $derived.by(() => !isSameMonth(this.date.value, this.month.value));
	isOutsideVisibleMonths = $derived.by(() => this.root.isOutsideVisibleMonths(this.date.value));
	isFocusedDate = $derived.by(() => isSameDay(this.date.value, this.root.placeholder.value));
	isSelectedDate = $derived.by(() => this.root.isSelected(this.date.value));
	isSelectionStart = $derived.by(() => this.root.isSelectionStart(this.date.value));
	isSelectionEnd = $derived.by(() => this.root.isSelectionEnd(this.date.value));
	isHighlighted = $derived.by(() =>
		this.root.highlightedRange
			? isBetweenInclusive(
					this.date.value,
					this.root.highlightedRange.start,
					this.root.highlightedRange.end
				)
			: false
	);

	labelText = $derived.by(() =>
		this.root.formatter.custom(this.cellDate, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})
	);

	constructor(
		props: RangeCalendarCellStateProps,
		readonly root: RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;
		this.date = props.date;
		this.month = props.month;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	snippetProps = $derived.by(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnvailable,
		selected: this.isSelectedDate,
	}));

	ariaDisabled = $derived.by(() => {
		return (
			this.isDisabled ||
			(this.isOutsideMonth && this.root.disableDaysOutsideMonth.value) ||
			this.isUnvailable
		);
	});

	sharedDataAttrs = $derived.by(
		() =>
			({
				"data-unavailable": getDataUnavailable(this.isUnvailable),
				"data-today": this.isDateToday ? "" : undefined,
				"data-outside-month": this.isOutsideMonth ? "" : undefined,
				"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : undefined,
				"data-focused": this.isFocusedDate ? "" : undefined,
				"data-selection-start": this.isSelectionStart ? "" : undefined,
				"data-selection-end": this.isSelectionEnd ? "" : undefined,
				"data-highlighted": this.isHighlighted ? "" : undefined,
				"data-selected": getDataSelected(this.isSelectedDate),
				"data-value": this.date.value.toString(),
				"data-disabled": getDataDisabled(
					this.isDisabled ||
						(this.isOutsideMonth && this.root.disableDaysOutsideMonth.value)
				),
			}) as const
	);

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				role: "gridcell",
				"aria-selected": getAriaSelected(this.isSelectedDate),
				"aria-disabled": getAriaDisabled(this.ariaDisabled),
				...this.sharedDataAttrs,
				[this.root.getBitsAttr("cell")]: "",
			}) as const
	);

	createDay(props: RangeCalendarDayStateProps) {
		return new RangeCalendarDayState(props, this);
	}
}

type RangeCalendarDayStateProps = WithRefProps;

class RangeCalendarDayState {
	id: RangeCalendarDayStateProps["id"];
	ref: RangeCalendarDayStateProps["ref"];

	constructor(
		props: RangeCalendarDayStateProps,
		readonly cell: RangeCalendarCellState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	#tabindex = $derived.by(() =>
		this.cell.isFocusedDate
			? 0
			: (this.cell.isOutsideMonth && this.cell.root.disableDaysOutsideMonth.value) ||
				  this.cell.isDisabled
				? undefined
				: -1
	);

	#onclick = (e: MouseEvent) => {
		if (this.cell.isDisabled) return;
		this.cell.root.handleCellClick(e, this.cell.date.value);
	};

	#onmouseenter = () => {
		if (this.cell.isDisabled) return;
		this.cell.root.focusedValue = this.cell.date.value;
	};

	#onfocusin = () => {
		if (this.cell.isDisabled) return;
		this.cell.root.focusedValue = this.cell.date.value;
	};

	snippetProps = $derived.by(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnvailable,
		selected: this.cell.isSelectedDate,
		day: `${this.cell.date.value.day}`,
	}));

	props = $derived.by(
		() =>
			({
				id: this.id.value,
				role: "button",
				"aria-label": this.cell.labelText,
				"aria-disabled": getAriaDisabled(this.cell.ariaDisabled),
				...this.cell.sharedDataAttrs,
				tabindex: this.#tabindex,
				[this.cell.root.getBitsAttr("day")]: "",
				// Shared logic for range calendar and calendar
				"data-bits-day": "",
				//
				onclick: this.#onclick,
				onmouseenter: this.#onmouseenter,
				onfocusin: this.#onfocusin,
			}) as const
	);
}
const [setRangeCalendarRootContext, getRangeCalendarRootContext] =
	createContext<RangeCalendarRootState>(
		["Calendar.Root", "RangeCalendar.Root"],
		"Calendar.Root",
		false
	);

const [setRangeCalendarCellContext, getRangeCalendarCellContext] =
	createContext<RangeCalendarCellState>("RangeCalendar.Cell");

export function useRangeCalendarRoot(props: RangeCalendarRootStateProps) {
	return setRangeCalendarRootContext(new RangeCalendarRootState(props));
}

export function useRangeCalendarCell(props: RangeCalendarCellStateProps) {
	return setRangeCalendarCellContext(getRangeCalendarRootContext().createCell(props));
}

export function useRangeCalendarDay(props: RangeCalendarDayStateProps) {
	return getRangeCalendarCellContext().createDay(props);
}
