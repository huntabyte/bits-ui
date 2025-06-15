import {
	type DateValue,
	getLocalTimeZone,
	isSameDay,
	isSameMonth,
	isToday,
} from "@internationalized/date";
import { DEV } from "esm-env";
import { untrack } from "svelte";
import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import { Context } from "runed";
import type { RangeCalendarRootState } from "../range-calendar/range-calendar.svelte.js";
import {
	getAriaDisabled,
	getAriaSelected,
	getDataDisabled,
	getDataSelected,
	getDataUnavailable,
} from "$lib/internal/attrs.js";
import type { WithRefOpts } from "$lib/internal/types.js";
import type { Month } from "$lib/shared/index.js";
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
import { getDateValueType, toDate } from "$lib/internal/date-time/utils.js";
import type { WeekStartsOn } from "$lib/shared/date/types.js";
import {
	CalendarBaseCellState,
	CalendarBaseGridBodyState,
	CalendarBaseGridHeadState,
	CalendarBaseGridRowState,
	CalendarBaseGridState,
	CalendarBaseHeadCellState,
	CalendarBaseHeaderState,
	CalendarBaseHeadingState,
	CalendarBaseNextButtonState,
	CalendarBasePrevButtonState,
	CalendarBaseRootState,
	CalendarBaseUnitState,
	type CalendarBaseCellStateOpts,
	type CalendarBaseGridBodyStateOpts,
	type CalendarBaseGridHeadStateOpts,
	type CalendarBaseGridRowStateOpts,
	type CalendarBaseGridStateOpts,
	type CalendarBaseHeadCellStateOpts,
	type CalendarBaseHeaderStateOpts,
	type CalendarBaseHeadingStateOpts,
	type CalendarBaseNextButtonStateOpts,
	type CalendarBasePrevButtonStateOpts,
	type CalendarBaseRootStateOpts,
	type CalendarBaseUnitStateOpts,
} from "../../internal/date-time/calendar-base.svelte.js";
import type { MonthCalendarRootState } from "../month-calendar/month-calendar.svelte.js";
import { RangeMonthCalendarRootState } from "../range-month-calendar/range-month-calendar.svelte.js";

// TODO: RangeMonthCalendarRootState
type RootState =
	| CalendarRootState
	| RangeCalendarRootState
	| MonthCalendarRootState
	| RangeMonthCalendarRootState;

interface CalendarRootStateOpts
	extends CalendarBaseRootStateOpts,
		ReadableBoxedValues<{
			weekStartsOn: WeekStartsOn | undefined;
			weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
			fixedWeeks: boolean;
			numberOfMonths: number;
			disableDaysOutsideMonth: boolean;
			maxDays: number | undefined;
			monthFormat: Intl.DateTimeFormatOptions["month"] | ((month: number) => string);
			yearFormat: Intl.DateTimeFormatOptions["year"] | ((year: number) => string);
		}> {}

export const CalendarRootContext = new Context<RootState>(
	"Calendar.Root | RangeCalendar.Root | MonthCalendar.Root | RangeMonthCalendar.Root"
);

export class CalendarRootState extends CalendarBaseRootState<CalendarRootStateOpts> {
	static create(opts: CalendarRootStateOpts) {
		return CalendarRootContext.set(new CalendarRootState(opts)) as CalendarRootState;
	}

	readonly visibleMonths = $derived.by(() => this.months.map((month) => month.value));
	readonly formatter: Formatter;
	months: Month<DateValue>[] = $state([]);

	constructor(opts: CalendarRootStateOpts) {
		super(opts);

		this.formatter = createFormatter({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat,
		});

		this.setMonths = this.setMonths.bind(this);
		this.prevYear = this.prevYear.bind(this);
		this.nextYear = this.nextYear.bind(this);
		this.setYear = this.setYear.bind(this);
		this.setMonth = this.setMonth.bind(this);
		this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this);

		this.months = createMonths({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current,
		});

		/**
		 * Updates the displayed months based on changes in the placeholder value.
		 */
		useMonthViewPlaceholderSync({
			placeholder: this.opts.placeholder,
			getVisibleMonths: () => this.visibleMonths,
			weekStartsOn: this.opts.weekStartsOn,
			locale: this.opts.locale,
			fixedWeeks: this.opts.fixedWeeks,
			numberOfMonths: this.opts.numberOfMonths,
			setMonths: (months: Month<DateValue>[]) => (this.months = months),
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

	setMonths(months: Month<DateValue>[]) {
		this.months = months;
	}

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

	isNextButtonDisabled = $derived.by(() => {
		return getIsNextButtonDisabled({
			maxValue: this.opts.maxValue.current,
			months: this.months,
			disabled: this.opts.disabled.current,
		});
	});

	isPrevButtonDisabled = $derived.by(() => {
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

	isOutsideVisibleMonths(date: DateValue) {
		return !this.visibleMonths.some((month) => isSameMonth(date, month));
	}

	isUnitSelected(date: DateValue) {
		const value = this.opts.value.current;
		if (Array.isArray(value)) {
			return value.some((d) => isSameDay(d, date));
		} else if (!value) {
			return false;
		}
		return isSameDay(value, date);
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

	#isMultipleSelectionValid(selectedDates: DateValue[]): boolean {
		// only validate for multiple type and when maxDays is set
		if (this.opts.type.current !== "multiple") return true;
		if (!this.opts.maxDays.current) return true;
		const selectedCount = selectedDates.length;
		if (this.opts.maxDays.current && selectedCount > this.opts.maxDays.current) return false;
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
		const index = prev.findIndex((d) => isSameDay(d, date));
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
			const next = prev.filter((d) => !isSameDay(d, date));
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
		if (!preventDeselect && isSameDay(prev, date)) {
			this.opts.placeholder.current = date;
			return undefined;
		}
		return date;
	}

	readonly snippetProps = $derived.by(() => ({
		months: this.months,
		weekdays: this.weekdays,
	}));
}

interface CalendarHeadingStateOpts extends CalendarBaseHeadingStateOpts {}

export class CalendarHeadingState extends CalendarBaseHeadingState {
	static create(opts: CalendarHeadingStateOpts) {
		return new CalendarHeadingState(opts, CalendarRootContext.get());
	}
}

const CalendarCellContext = new Context<CalendarCellState>(
	"Calendar.Cell | RangeCalendar.Cell | MonthCalendar.Cell | RangeMonthCalendar.Cell"
);

interface CalendarCellStateOpts
	extends CalendarBaseCellStateOpts,
		ReadableBoxedValues<{
			month: DateValue;
		}> {}

export class CalendarCellState extends CalendarBaseCellState<
	CalendarCellStateOpts,
	CalendarRootState
> {
	static create(opts: CalendarCellStateOpts) {
		return CalendarCellContext.set(
			new CalendarCellState(opts, CalendarRootContext.get() as CalendarRootState)
		);
	}

	readonly isDateToday = $derived.by(() => isToday(this.opts.date.current, getLocalTimeZone()));
	readonly isOutsideMonth = $derived.by(
		() => !isSameMonth(this.opts.date.current, this.opts.month.current)
	);
	readonly isOutsideVisibleMonths = $derived.by(() =>
		this.root.isOutsideVisibleMonths(this.opts.date.current)
	);
	readonly isFocusedDate = $derived.by(() =>
		isSameDay(this.opts.date.current, this.root.opts.placeholder.current)
	);
	readonly labelText = $derived.by(() =>
		this.root.formatter.custom(this.cellDate, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})
	);

	constructor(opts: CalendarCellStateOpts, root: CalendarRootState) {
		super(opts, root);
	}

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
				"data-focused": this.isFocusedDate ? "" : undefined,
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

interface CalendarDayStateOpts extends CalendarBaseUnitStateOpts {}

export class CalendarDayState extends CalendarBaseUnitState<
	CalendarDayStateOpts,
	CalendarCellState
> {
	static create(opts: CalendarDayStateOpts) {
		return new CalendarDayState(opts, CalendarCellContext.get());
	}

	constructor(opts: CalendarDayStateOpts, cell: CalendarCellState) {
		super(opts, cell);
	}

	readonly #tabindex = $derived.by(() =>
		(this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current) ||
		this.cell.isDisabled
			? undefined
			: this.cell.isFocusedDate
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
				...attachRef(this.opts.ref),
			}) as const
	);
}

interface CalendarNextButtonStateOpts extends CalendarBaseNextButtonStateOpts {}

export class CalendarNextButtonState extends CalendarBaseNextButtonState {
	static create(opts: CalendarNextButtonStateOpts) {
		return new CalendarNextButtonState(opts, CalendarRootContext.get());
	}
}

interface CalendarPrevButtonStateOpts extends CalendarBasePrevButtonStateOpts {}

export class CalendarPrevButtonState extends CalendarBasePrevButtonState {
	static create(opts: CalendarPrevButtonStateOpts) {
		return new CalendarPrevButtonState(opts, CalendarRootContext.get());
	}
}

interface CalendarGridStateOpts extends CalendarBaseGridStateOpts {}

export class CalendarGridState extends CalendarBaseGridState {
	static create(opts: CalendarGridStateOpts) {
		return new CalendarGridState(opts, CalendarRootContext.get());
	}
}

interface CalendarGridBodyStateOpts extends CalendarBaseGridBodyStateOpts {}

export class CalendarGridBodyState extends CalendarBaseGridBodyState {
	static create(opts: CalendarGridBodyStateOpts) {
		return new CalendarGridBodyState(opts, CalendarRootContext.get());
	}
}

interface CalendarGridHeadStateOpts extends CalendarBaseGridHeadStateOpts {}

export class CalendarGridHeadState extends CalendarBaseGridHeadState {
	static create(opts: CalendarGridHeadStateOpts) {
		return new CalendarGridHeadState(opts, CalendarRootContext.get());
	}
}

interface CalendarGridRowStateOpts extends CalendarBaseGridRowStateOpts {}

export class CalendarGridRowState extends CalendarBaseGridRowState {
	static create(opts: CalendarGridRowStateOpts) {
		return new CalendarGridRowState(opts, CalendarRootContext.get());
	}
}

interface CalendarHeadCellStateOpts extends CalendarBaseHeadCellStateOpts {}

export class CalendarHeadCellState extends CalendarBaseHeadCellState {
	static create(opts: CalendarHeadCellStateOpts) {
		return new CalendarHeadCellState(opts, CalendarRootContext.get());
	}
}

interface CalendarHeaderStateOpts extends CalendarBaseHeaderStateOpts {}

export class CalendarHeaderState extends CalendarBaseHeaderState {
	static create(opts: CalendarHeaderStateOpts) {
		return new CalendarHeaderState(opts, CalendarRootContext.get());
	}
}

interface CalendarMonthSelectStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			months: number[];
			monthFormat: Intl.DateTimeFormatOptions["month"] | ((month: number) => string);
			disabled: boolean;
		}> {}

export class CalendarMonthSelectState {
	static create(opts: CalendarMonthSelectStateOpts) {
		return new CalendarMonthSelectState(opts, CalendarRootContext.get());
	}

	readonly opts: CalendarMonthSelectStateOpts;
	readonly root: RootState;

	constructor(opts: CalendarMonthSelectStateOpts, root: RootState) {
		this.opts = opts;
		this.root = root;
		this.onchange = this.onchange.bind(this);
	}

	readonly monthItems = $derived.by(() => {
		this.root.opts.locale.current;
		const monthNumbers = this.opts.months.current;
		const monthFormat = this.opts.monthFormat.current;
		const months = [];

		for (const month of monthNumbers) {
			// create a date with the current year and the month to get localized name
			const date = this.root.opts.placeholder.current.set({ month });
			let label: string;
			if (typeof monthFormat === "function") {
				label = monthFormat(month);
			} else {
				label = this.root.formatter.custom(toDate(date), { month: monthFormat });
			}
			months.push({
				value: month,
				label,
			});
		}

		return months;
	});

	readonly currentMonth = $derived.by(() => this.root.opts.placeholder.current.month);

	readonly isDisabled = $derived.by(
		() => this.root.opts.disabled.current || this.opts.disabled.current
	);

	readonly snippetProps = $derived.by(() => {
		return {
			monthItems: this.monthItems,
			selectedMonthItem: this.monthItems.find(
				(month) => month.value === this.currentMonth
			) as {
				value: number;
				label: string;
			},
		};
	});

	onchange(event: Event) {
		if (this.isDisabled) return;
		const target = event.target as HTMLSelectElement;
		const month = parseInt(target.value, 10);
		if (!isNaN(month)) {
			this.root.opts.placeholder.current = this.root.opts.placeholder.current.set({ month });
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				value: this.currentMonth,
				disabled: this.isDisabled,
				"data-disabled": getDataDisabled(this.isDisabled),
				[this.root.getBitsAttr("month-select")]: "",
				//
				onchange: this.onchange,
				...attachRef(this.opts.ref),
			}) as const
	);
}

interface CalendarYearSelectStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			years: number[] | undefined;
			yearFormat: Intl.DateTimeFormatOptions["year"] | ((year: number) => string);
			disabled: boolean;
		}> {}

export class CalendarYearSelectState {
	static create(opts: CalendarYearSelectStateOpts) {
		return new CalendarYearSelectState(opts, CalendarRootContext.get());
	}

	readonly opts: CalendarYearSelectStateOpts;
	readonly root: RootState;

	constructor(opts: CalendarYearSelectStateOpts, root: RootState) {
		this.opts = opts;
		this.root = root;
		this.onchange = this.onchange.bind(this);
	}

	readonly years = $derived.by(() => {
		if (this.opts.years.current && this.opts.years.current.length)
			return this.opts.years.current;
		return this.root.defaultYears;
	});

	readonly yearItems = $derived.by(() => {
		this.root.opts.locale.current;
		const yearFormat = this.opts.yearFormat.current;
		const localYears = [];
		for (const year of this.years) {
			// create a date with the year to get localized formatting
			const date = this.root.opts.placeholder.current.set({ year });
			let label: string;
			if (typeof yearFormat === "function") {
				label = yearFormat(year);
			} else {
				label = this.root.formatter.custom(toDate(date), { year: yearFormat });
			}
			localYears.push({
				value: year,
				label,
			});
		}

		return localYears;
	});

	readonly currentYear = $derived.by(() => this.root.opts.placeholder.current.year);

	readonly isDisabled = $derived.by(
		() => this.root.opts.disabled.current || this.opts.disabled.current
	);

	readonly snippetProps = $derived.by(() => {
		return {
			yearItems: this.yearItems,
			selectedYearItem: this.yearItems.find((year) => year.value === this.currentYear) as {
				value: number;
				label: string;
			},
		};
	});

	onchange(event: Event) {
		if (this.isDisabled) return;
		const target = event.target as HTMLSelectElement;
		const year = parseInt(target.value, 10);
		if (!isNaN(year)) {
			this.root.opts.placeholder.current = this.root.opts.placeholder.current.set({ year });
		}
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				value: this.currentYear,
				disabled: this.isDisabled,
				"data-disabled": getDataDisabled(this.isDisabled),
				[this.root.getBitsAttr("year-select")]: "",
				//
				onchange: this.onchange,
				...attachRef(this.opts.ref),
			}) as const
	);
}
