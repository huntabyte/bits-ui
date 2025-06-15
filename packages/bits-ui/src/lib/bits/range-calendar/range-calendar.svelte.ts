import { type DateValue, getLocalTimeZone, isSameMonth, isToday } from "@internationalized/date";
import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import { Context } from "runed";
import { CalendarRootContext } from "../calendar/calendar.svelte.js";
import type { Month } from "$lib/shared/index.js";
import type { WithRefOpts } from "$lib/internal/types.js";
import {
	getAriaDisabled,
	getAriaSelected,
	getDataDisabled,
	getDataSelected,
	getDataUnavailable,
} from "$lib/internal/attrs.js";
import { type Formatter, createFormatter } from "$lib/internal/date-time/formatter.js";
import {
	createMonths,
	getCalendarHeadingValue,
	getDefaultYears,
	getIsNextButtonDisabled,
	getIsPrevButtonDisabled,
	getWeekdays,
	handleCalendarNextPage,
	handleCalendarPrevPage,
	shiftCalendarFocus,
	useEnsureNonDisabledPlaceholder,
	useMonthViewOptionsSync,
	useMonthViewPlaceholderSync,
} from "$lib/internal/date-time/calendar-helpers.svelte.js";
import { getDateValueType, isBefore } from "$lib/internal/date-time/utils.js";
import type { WeekStartsOn } from "$lib/shared/date/types.js";
import { untrack } from "svelte";
import {
	RangeCalendarBaseCellState,
	RangeCalendarBaseRootState,
	RangeCalendarBaseUnitState,
	type RangeCalendarBaseRootStateOpts,
} from "$lib/internal/date-time/calendar-range-base.svelte.js";

const RangeCalendarCellContext = new Context<RangeCalendarCellState>("RangeCalendar.Cell");

interface RangeCalendarRootStateOpts
	extends RangeCalendarBaseRootStateOpts,
		ReadableBoxedValues<{
			weekStartsOn: WeekStartsOn | undefined;
			weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
			fixedWeeks: boolean;
			numberOfMonths: number;
			disableDaysOutsideMonth: boolean;
			monthFormat: Intl.DateTimeFormatOptions["month"] | ((month: number) => string);
			yearFormat: Intl.DateTimeFormatOptions["year"] | ((year: number) => string);
		}> {}

export class RangeCalendarRootState extends RangeCalendarBaseRootState<RangeCalendarRootStateOpts> {
	static create(opts: RangeCalendarRootStateOpts) {
		return CalendarRootContext.set(new RangeCalendarRootState(opts)) as RangeCalendarRootState;
	}

	readonly visibleMonths = $derived.by(() => this.months.map((month) => month.value));
	months: Month<DateValue>[] = $state([]);
	formatter: Formatter;

	/**
	 * This derived state holds an array of localized day names for the current
	 * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
	 * updating its content when the option changes. Using this state to render the
	 * calendar's days of the week is strongly recommended, as it guarantees that
	 * the days are correctly formatted for the current locale and calendar view.
	 */
	readonly weekdays = $derived.by(() => {
		return getWeekdays({
			months: this.months,
			formatter: this.formatter,
			weekdayFormat: this.opts.weekdayFormat.current,
		});
	});

	readonly isNextButtonDisabled = $derived.by(() => {
		return getIsNextButtonDisabled({
			maxValue: this.opts.maxValue.current,
			months: this.months,
			disabled: this.opts.disabled.current,
		});
	});

	readonly isPrevButtonDisabled = $derived.by(() => {
		return getIsPrevButtonDisabled({
			minValue: this.opts.minValue.current,
			months: this.months,
			disabled: this.opts.disabled.current,
		});
	});

	readonly headingValue = $derived.by(() => {
		this.opts.monthFormat.current;
		this.opts.yearFormat.current;
		return getCalendarHeadingValue({
			months: this.months,
			formatter: this.formatter,
			locale: this.opts.locale.current,
		});
	});

	readonly initialPlaceholderYear = $derived.by(() =>
		untrack(() => this.opts.placeholder.current.year)
	);

	readonly defaultYears = $derived.by(() => {
		return getDefaultYears({
			minValue: this.opts.minValue.current,
			maxValue: this.opts.maxValue.current,
			placeholderYear: this.initialPlaceholderYear,
		});
	});

	constructor(opts: RangeCalendarRootStateOpts) {
		super(opts, "day");

		this.formatter = createFormatter({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat,
		});

		this.months = createMonths({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current,
		});

		/**
		 * Updates the displayed months based on changes in the placeholder values,
		 * which determines the month to show in the calendar.
		 */
		useMonthViewPlaceholderSync({
			placeholder: this.opts.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.opts.weekStartsOn,
			locale: this.opts.locale,
			fixedWeeks: this.opts.fixedWeeks,
			numberOfMonths: this.opts.numberOfMonths,
			setMonths: this.setMonths,
		});

		/**
		 * Updates the displayed months based on changes in the options values,
		 * which determines the month to show in the calendar.
		 */
		useMonthViewOptionsSync({
			fixedWeeks: this.opts.fixedWeeks,
			locale: this.opts.locale,
			numberOfMonths: this.opts.numberOfMonths,
			placeholder: this.opts.placeholder,
			setMonths: this.setMonths,
			weekStartsOn: this.opts.weekStartsOn,
		});

		this.nextYear = this.nextYear.bind(this);
		this.prevYear = this.prevYear.bind(this);
		this.setYear = this.setYear.bind(this);
		this.setMonth = this.setMonth.bind(this);

		this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this);

		useEnsureNonDisabledPlaceholder({
			placeholder: opts.placeholder,
			defaultPlaceholder: opts.defaultPlaceholder,
			isUnitDisabled: opts.isUnitDisabled,
			maxValue: opts.maxValue,
			minValue: opts.minValue,
			ref: opts.ref,
			unit: "day",
		});
	}

	setMonths = (months: Month<DateValue>[]) => {
		this.months = months;
	};

	isOutsideVisibleMonths(date: DateValue) {
		return !this.visibleMonths.some((month) => isSameMonth(date, month));
	}

	isRangeValid(start: DateValue, end: DateValue): boolean {
		// ensure we always use the correct order for calculation
		const orderedStart = isBefore(end, start) ? end : start;
		const orderedEnd = isBefore(end, start) ? start : end;

		const startDate = orderedStart.toDate(getLocalTimeZone());
		const endDate = orderedEnd.toDate(getLocalTimeZone());

		const timeDifference = endDate.getTime() - startDate.getTime();
		const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
		const daysInRange = daysDifference + 1; // +1 to include both start and end days

		if (this.opts.minUnits.current && daysInRange < this.opts.minUnits.current) return false;
		if (this.opts.maxUnits.current && daysInRange > this.opts.maxUnits.current) return false;

		// check for disabled dates in range if excludeDisabled is enabled
		if (
			this.opts.excludeDisabled.current &&
			this.hasDisabledDatesInRange(orderedStart, orderedEnd)
		) {
			return false;
		}

		return true;
	}

	shiftFocus(node: HTMLElement, add: number) {
		return shiftCalendarFocus({
			node,
			add,
			placeholder: this.opts.placeholder,
			calendarNode: this.opts.ref.current,
			isPrevButtonDisabled: this.isPrevButtonDisabled,
			isNextButtonDisabled: this.isNextButtonDisabled,
			items: this.months,
			numberOfUnits: this.opts.numberOfMonths.current,
			unit: "months",
		});
	}

	/**
	 * Navigates to the next page of the calendar.
	 */
	nextPage() {
		handleCalendarNextPage({
			fixedWeeks: this.opts.fixedWeeks.current,
			locale: this.opts.locale.current,
			numberOfMonths: this.opts.numberOfMonths.current,
			pagedNavigation: this.opts.pagedNavigation.current,
			setMonths: this.setMonths,
			setPlaceholder: (date: DateValue) => (this.opts.placeholder.current = date),
			weekStartsOn: this.opts.weekStartsOn.current,
			months: this.months,
		});
	}

	/**
	 * Navigates to the previous page of the calendar.
	 */
	prevPage() {
		handleCalendarPrevPage({
			fixedWeeks: this.opts.fixedWeeks.current,
			locale: this.opts.locale.current,
			numberOfMonths: this.opts.numberOfMonths.current,
			pagedNavigation: this.opts.pagedNavigation.current,
			setMonths: this.setMonths,
			setPlaceholder: (date: DateValue) => (this.opts.placeholder.current = date),
			weekStartsOn: this.opts.weekStartsOn.current,
			months: this.months,
		});
	}

	nextYear() {
		this.opts.placeholder.current = this.opts.placeholder.current.add({ years: 1 });
	}

	prevYear() {
		this.opts.placeholder.current = this.opts.placeholder.current.subtract({ years: 1 });
	}

	setYear(year: number) {
		this.opts.placeholder.current = this.opts.placeholder.current.set({ year });
	}

	setMonth(month: number) {
		this.opts.placeholder.current = this.opts.placeholder.current.set({ month });
	}

	readonly snippetProps = $derived.by(() => ({
		months: this.months,
		weekdays: this.weekdays,
	}));
}

interface RangeCalendarCellStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			date: DateValue;
			month: DateValue;
		}> {}

export class RangeCalendarCellState extends RangeCalendarBaseCellState<
	RangeCalendarCellStateOpts,
	RangeCalendarRootState
> {
	static create(opts: RangeCalendarCellStateOpts) {
		return RangeCalendarCellContext.set(
			new RangeCalendarCellState(opts, CalendarRootContext.get() as RangeCalendarRootState)
		);
	}

	readonly isDateToday = $derived.by(() => isToday(this.opts.date.current, getLocalTimeZone()));
	readonly isOutsideMonth = $derived.by(
		() => !isSameMonth(this.opts.date.current, this.opts.month.current)
	);
	readonly isOutsideVisibleMonths = $derived.by(() =>
		this.root.isOutsideVisibleMonths(this.opts.date.current)
	);

	readonly labelText = $derived.by(() =>
		this.root.formatter.custom(this.cellDate, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})
	);

	readonly ariaDisabled = $derived.by(() => {
		return (
			this.isDisabled ||
			(this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current) ||
			this.isUnavailable
		);
	});

	readonly sharedDataAttrs = $derived.by(
		() =>
			({
				"data-unavailable": getDataUnavailable(this.isUnavailable),
				"data-today": this.isDateToday ? "" : undefined,
				"data-outside-month": this.isOutsideMonth ? "" : undefined,
				"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : undefined,
				"data-focused": this.isFocusedUnit ? "" : undefined,
				"data-selection-start": this.isSelectionStart ? "" : undefined,
				"data-selection-end": this.isSelectionEnd ? "" : undefined,
				"data-range-start": this.isRangeStart ? "" : undefined,
				"data-range-end": this.isRangeEnd ? "" : undefined,
				"data-range-middle": this.isRangeMiddle ? "" : undefined,
				"data-highlighted": this.isHighlighted ? "" : undefined,
				"data-selected": getDataSelected(this.isSelectedDate),
				"data-value": this.opts.date.current.toString(),
				"data-type": getDateValueType(this.opts.date.current),
				"data-disabled": getDataDisabled(
					this.isDisabled ||
						(this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
				),
			}) as const
	);

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "gridcell",
				"aria-selected": getAriaSelected(this.isSelectedDate),
				"aria-disabled": getAriaDisabled(this.ariaDisabled),
				...this.sharedDataAttrs,
				[this.root.getBitsAttr("cell")]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

interface RangeCalendarDayStateOpts extends WithRefOpts {}

export class RangeCalendarDayState extends RangeCalendarBaseUnitState<
	RangeCalendarDayStateOpts,
	RangeCalendarCellState
> {
	static create(opts: RangeCalendarDayStateOpts) {
		return new RangeCalendarDayState(opts, RangeCalendarCellContext.get());
	}

	readonly #tabindex = $derived.by(() =>
		(this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current) ||
		this.cell.isDisabled
			? undefined
			: this.cell.isFocusedUnit
				? 0
				: -1
	);

	readonly snippetProps = $derived.by(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnavailable,
		selected: this.cell.isSelectedDate,
		day: `${this.cell.opts.date.current.day}`,
	}));

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "button",
				"aria-label": this.cell.labelText,
				"aria-disabled": getAriaDisabled(this.cell.ariaDisabled),
				...this.cell.sharedDataAttrs,
				tabindex: this.#tabindex,
				[this.cell.root.getBitsAttr("day")]: "",
				// Shared logic for range calendar and calendar
				"data-bits-day": "",
				//
				onclick: this.onclick,
				onmouseenter: this.onmouseenter,
				onfocusin: this.onfocusin,
				...attachRef(this.opts.ref),
			}) as const
	);
}
