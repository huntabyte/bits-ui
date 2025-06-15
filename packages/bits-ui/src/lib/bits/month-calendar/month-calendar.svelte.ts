import { type DateValue, getLocalTimeZone, isSameMonth, today } from "@internationalized/date";
import { DEV } from "esm-env";
import { untrack } from "svelte";
import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import { Context } from "runed";
import {
	getAriaDisabled,
	getAriaSelected,
	getDataDisabled,
	getDataSelected,
	getDataUnavailable,
} from "$lib/internal/attrs.js";
import { type Formatter, createFormatter } from "$lib/internal/date-time/formatter.js";
import {
	createYears,
	getDefaultYears,
	getIsNextMonthCalendarButtonDisabled,
	getIsPrevMonthCalendarButtonDisabled,
	getMonthCalendarHeadingValue,
	handleMonthCalendarNextPage,
	handleMonthCalendarPrevPage,
	shiftCalendarFocus,
	useEnsureNonDisabledPlaceholder,
	useYearViewOptionsSync,
	useYearViewPlaceholderSync,
} from "$lib/internal/date-time/calendar-helpers.svelte.js";
import { getDateValueType } from "$lib/internal/date-time/utils.js";
import type { Year } from "$lib/shared/date/types.js";
import {
	CalendarBaseCellState,
	CalendarBaseRootState,
	CalendarBaseUnitState,
	type CalendarBaseCellStateOpts,
	type CalendarBaseRootStateOpts,
	type CalendarBaseUnitStateOpts,
} from "../calendar-base/calendar-base.svelte.js";
import { CalendarRootContext } from "../calendar/calendar.svelte.js";

interface MonthCalendarRootStateOpts
	extends CalendarBaseRootStateOpts,
		ReadableBoxedValues<{
			fixedWeeks: boolean;
			numberOfYears: number;
			maxMonths: number | undefined;
			monthFormat: Intl.DateTimeFormatOptions["month"] | ((month: number) => string);
			yearFormat: Intl.DateTimeFormatOptions["year"] | ((year: number) => string);
		}> {}

export class MonthCalendarRootState extends CalendarBaseRootState<MonthCalendarRootStateOpts> {
	static create(opts: MonthCalendarRootStateOpts) {
		return CalendarRootContext.set(new MonthCalendarRootState(opts));
	}

	readonly visibleYears = $derived.by(() => this.years.map((year) => year.value));
	readonly formatter: Formatter;
	years: Year<DateValue>[] = $state([]);

	constructor(opts: MonthCalendarRootStateOpts) {
		super(opts);
		this.formatter = createFormatter({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat,
		});

		this.setYears = this.setYears.bind(this);
		this.prevYear = this.prevYear.bind(this);
		this.nextYear = this.nextYear.bind(this);
		this.setYear = this.setYear.bind(this);

		this.years = createYears({
			dateObj: this.opts.placeholder.current,
			monthFormat: this.opts.monthFormat.current,
			locale: this.opts.locale.current,
			numberOfYears: this.opts.numberOfYears.current,
		});

		/**
		 * Updates the displayed months based on changes in the placeholder value.
		 */
		useYearViewPlaceholderSync({
			placeholder: this.opts.placeholder,
			getVisibleYears: () => this.visibleYears,
			locale: this.opts.locale,
			monthFormat: this.opts.monthFormat,
			numberOfYears: this.opts.numberOfYears,
			setYears: (years) => (this.years = years),
		});

		/**
		 * Updates the displayed months based on changes in the options values,
		 * which determines the month to show in the calendar.
		 */
		useYearViewOptionsSync({
			locale: this.opts.locale,
			numberOfYears: this.opts.numberOfYears,
			placeholder: this.opts.placeholder,
			monthFormat: this.opts.monthFormat,
			setYears: this.setYears,
		});

		useEnsureNonDisabledPlaceholder({
			placeholder: opts.placeholder,
			defaultPlaceholder: opts.defaultPlaceholder,
			isUnitDisabled: opts.isUnitDisabled,
			maxValue: opts.maxValue,
			minValue: opts.minValue,
			ref: opts.ref,
			unit: "month",
		});
	}

	setYears(years: Year<DateValue>[]) {
		this.years = years;
	}

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

	/**
	 * Navigates to the next page of the calendar.
	 */
	nextPage() {
		handleMonthCalendarNextPage({
			locale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat.current,
			numberOfYears: this.opts.numberOfYears.current,
			pagedNavigation: this.opts.pagedNavigation.current,
			setYears: this.setYears,
			setPlaceholder: (date: DateValue) => (this.opts.placeholder.current = date),
			years: this.years,
		});
	}

	/**
	 * Navigates to the previous page of the calendar.
	 */
	prevPage() {
		handleMonthCalendarPrevPage({
			locale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat.current,
			numberOfYears: this.opts.numberOfYears.current,
			pagedNavigation: this.opts.pagedNavigation.current,
			setYears: this.setYears,
			setPlaceholder: (date: DateValue) => (this.opts.placeholder.current = date),
			years: this.years,
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

	isNextButtonDisabled = $derived.by(() => {
		return getIsNextMonthCalendarButtonDisabled({
			maxValue: this.opts.maxValue.current,
			years: this.years,
			disabled: this.opts.disabled.current,
		});
	});

	isPrevButtonDisabled = $derived.by(() => {
		return getIsPrevMonthCalendarButtonDisabled({
			minValue: this.opts.minValue.current,
			years: this.years,
			disabled: this.opts.disabled.current,
		});
	});

	readonly headingValue = $derived.by(() => {
		this.opts.monthFormat.current;
		this.opts.yearFormat.current;
		return getMonthCalendarHeadingValue({
			years: this.years,
			formatter: this.formatter,
			locale: this.opts.locale.current,
		});
	});

	isUnitSelected(date: DateValue) {
		const value = this.opts.value.current;
		if (Array.isArray(value)) {
			return value.some((d) => isSameMonth(d, date));
		} else if (!value) {
			return false;
		}
		return isSameMonth(value, date);
	}

	shiftFocus(node: HTMLElement, add: number) {
		return shiftCalendarFocus({
			node,
			add,
			placeholder: this.opts.placeholder,
			calendarNode: this.opts.ref.current,
			isPrevButtonDisabled: this.isPrevButtonDisabled,
			isNextButtonDisabled: this.isNextButtonDisabled,
			items: this.years,
			numberOfUnits: this.opts.numberOfYears.current,
			unit: "years",
		});
	}

	#isMultipleSelectionValid(selectedDates: DateValue[]): boolean {
		// only validate for multiple type and when maxDays is set
		if (this.opts.type.current !== "multiple") return true;
		if (!this.opts.maxMonths.current) return true;
		const selectedCount = selectedDates.length;
		if (this.opts.maxMonths.current && selectedCount > this.opts.maxMonths.current)
			return false;
		return true;
	}

	handleMultipleUpdate(prev: DateValue[] | undefined, date: DateValue) {
		if (!prev) {
			const newSelection = [date];
			return this.#isMultipleSelectionValid(newSelection) ? newSelection : [date];
		}
		if (!Array.isArray(prev)) {
			if (DEV) throw new Error("Invalid value for multiple prop.");
			return;
		}
		const index = prev.findIndex((d) => isSameMonth(d, date));
		const preventDeselect = this.opts.preventDeselect.current;
		if (index === -1) {
			// adding a new date - check if it would be valid
			const newSelection = [...prev, date];
			if (this.#isMultipleSelectionValid(newSelection)) {
				return newSelection;
			} else {
				// reset to just the newly selected date when constraints are violated
				return [date];
			}
		} else if (preventDeselect) {
			return prev;
		} else {
			const next = prev.filter((d) => !isSameMonth(d, date));
			if (!next.length) {
				this.opts.placeholder.current = date;
				return undefined;
			}
			return next;
		}
	}

	handleSingleUpdate(prev: DateValue | undefined, date: DateValue) {
		if (Array.isArray(prev)) {
			if (DEV) throw new Error("Invalid value for single prop.");
		}
		if (!prev) return date;
		const preventDeselect = this.opts.preventDeselect.current;
		if (!preventDeselect && isSameMonth(prev, date)) {
			this.opts.placeholder.current = date;
			return undefined;
		}
		return date;
	}

	readonly snippetProps = $derived.by(() => ({
		years: this.years,
	}));
}

const MonthCalendarCellContext = new Context<MonthCalendarCellState>(
	"MonthCalendar.Cell | RangeMonthCalendar.Cell"
);

interface CalendarCellStateOpts
	extends CalendarBaseCellStateOpts,
		ReadableBoxedValues<{
			month: DateValue;
		}> {}

export class MonthCalendarCellState extends CalendarBaseCellState<
	CalendarCellStateOpts,
	MonthCalendarRootState
> {
	static create(opts: CalendarCellStateOpts) {
		return MonthCalendarCellContext.set(
			new MonthCalendarCellState(opts, CalendarRootContext.get() as MonthCalendarRootState)
		);
	}

	readonly isThisMonth = $derived.by(() =>
		isSameMonth(today(getLocalTimeZone()), this.opts.date.current)
	);
	readonly isFocusedMonth = $derived.by(() =>
		isSameMonth(this.opts.date.current, this.root.opts.placeholder.current)
	);
	readonly labelText = $derived.by(() =>
		this.root.formatter.custom(this.cellDate, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})
	);

	constructor(opts: CalendarCellStateOpts, root: MonthCalendarRootState) {
		super(opts, root);
	}

	readonly ariaDisabled = $derived.by(() => {
		return this.isDisabled || this.isUnavailable;
	});

	readonly sharedDataAttrs = $derived.by(
		() =>
			({
				"data-unavailable": getDataUnavailable(this.isUnavailable),
				"data-this-month": this.isThisMonth ? "" : undefined,
				"data-focused": this.isFocusedMonth ? "" : undefined,
				"data-selected": getDataSelected(this.isSelectedDate),
				"data-value": this.opts.date.current.toString(),
				"data-type": getDateValueType(this.opts.date.current),
				"data-disabled": getDataDisabled(this.isDisabled),
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

interface CalendarMonthStateOpts extends CalendarBaseUnitStateOpts {}

export class MonthCalendarMonthState extends CalendarBaseUnitState<
	CalendarMonthStateOpts,
	MonthCalendarCellState
> {
	static create(opts: CalendarMonthStateOpts) {
		return new MonthCalendarMonthState(opts, MonthCalendarCellContext.get());
	}

	constructor(opts: CalendarMonthStateOpts, cell: MonthCalendarCellState) {
		super(opts, cell);
	}

	readonly #tabindex = $derived.by(() =>
		this.cell.isDisabled ? undefined : this.cell.isFocusedMonth ? 0 : -1
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
				[this.cell.root.getBitsAttr("month")]: "",
				// Shared logic for range month calendar and month calendar
				"data-bits-month": "",
				//
				onclick: this.onclick,
				...attachRef(this.opts.ref),
			}) as const
	);
}
