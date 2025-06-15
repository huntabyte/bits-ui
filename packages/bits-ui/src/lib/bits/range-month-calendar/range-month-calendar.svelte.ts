import { type DateValue, getLocalTimeZone, isSameMonth, today } from "@internationalized/date";
import { attachRef, type ReadableBoxedValues } from "svelte-toolbelt";
import { Context } from "runed";
import { CalendarRootContext } from "../calendar/calendar.svelte.js";
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
import { getDateValueType, isBefore } from "$lib/internal/date-time/utils.js";
import type { Year } from "$lib/shared/date/types.js";
import { untrack } from "svelte";
import {
	RangeCalendarBaseCellState,
	RangeCalendarBaseRootState,
	RangeCalendarBaseUnitState,
	type RangeCalendarBaseRootStateOpts,
} from "$lib/internal/date-time/calendar-range-base.svelte.js";

const RangeMonthCalendarCellContext = new Context<RangeMonthCalendarCellState>(
	"RangeMonthCalendar.Cell"
);

interface RangeMonthCalendarRootStateOpts
	extends RangeCalendarBaseRootStateOpts,
		ReadableBoxedValues<{
			numberOfYears: number;
			monthFormat: Intl.DateTimeFormatOptions["month"] | ((month: number) => string);
			yearFormat: Intl.DateTimeFormatOptions["year"] | ((year: number) => string);
		}> {}

export class RangeMonthCalendarRootState extends RangeCalendarBaseRootState<RangeMonthCalendarRootStateOpts> {
	static create(opts: RangeMonthCalendarRootStateOpts) {
		return CalendarRootContext.set(
			new RangeMonthCalendarRootState(opts)
		) as RangeMonthCalendarRootState;
	}

	readonly visibleYears = $derived.by(() => this.years.map((month) => month.value));
	years: Year<DateValue>[] = $state([]);
	formatter: Formatter;

	readonly isNextButtonDisabled = $derived.by(() => {
		return getIsNextMonthCalendarButtonDisabled({
			maxValue: this.opts.maxValue.current,
			years: this.years,
			disabled: this.opts.disabled.current,
		});
	});

	readonly isPrevButtonDisabled = $derived.by(() => {
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

	constructor(opts: RangeMonthCalendarRootStateOpts) {
		super(opts, "day");

		this.formatter = createFormatter({
			initialLocale: this.opts.locale.current,
			monthFormat: this.opts.monthFormat,
			yearFormat: this.opts.yearFormat,
		});

		this.years = createYears({
			dateObj: this.opts.placeholder.current,
			monthFormat: this.opts.monthFormat.current,
			locale: this.opts.locale.current,
			numberOfYears: this.opts.numberOfYears.current,
		});

		/**
		 * Updates the displayed years based on changes in the placeholder values,
		 * which determines the year to show in the calendar.
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
		 * Updates the displayed years based on changes in the options values,
		 * which determines the year to show in the calendar.
		 */
		useYearViewOptionsSync({
			locale: this.opts.locale,
			numberOfYears: this.opts.numberOfYears,
			placeholder: this.opts.placeholder,
			monthFormat: this.opts.monthFormat,
			setYears: this.setYears,
		});

		this.nextYear = this.nextYear.bind(this);
		this.prevYear = this.prevYear.bind(this);
		this.setYear = this.setYear.bind(this);

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

	setYears = (years: Year<DateValue>[]) => {
		this.years = years;
	};

	// TODO
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
			items: this.years,
			numberOfUnits: this.opts.numberOfYears.current,
			unit: "years",
		});
	}

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

	readonly snippetProps = $derived.by(() => ({
		years: this.years,
	}));
}

interface RangeMonthCalendarCellStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			date: DateValue;
			year: DateValue;
		}> {}

export class RangeMonthCalendarCellState extends RangeCalendarBaseCellState<
	RangeMonthCalendarCellStateOpts,
	RangeMonthCalendarRootState
> {
	static create(opts: RangeMonthCalendarCellStateOpts) {
		return RangeMonthCalendarCellContext.set(
			new RangeMonthCalendarCellState(
				opts,
				CalendarRootContext.get() as RangeMonthCalendarRootState
			)
		);
	}

	readonly isThisMonth = $derived.by(() =>
		isSameMonth(today(getLocalTimeZone()), this.opts.date.current)
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
		return this.isDisabled || this.isUnavailable;
	});

	readonly sharedDataAttrs = $derived.by(
		() =>
			({
				"data-unavailable": getDataUnavailable(this.isUnavailable),
				"data-this-month": this.isThisMonth ? "" : undefined,
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

interface RangeMonthCalendarMonthStateOpts extends WithRefOpts {}

export class RangeMonthCalendarMonthState extends RangeCalendarBaseUnitState<
	RangeMonthCalendarMonthStateOpts,
	RangeMonthCalendarCellState
> {
	static create(opts: RangeMonthCalendarMonthStateOpts) {
		return new RangeMonthCalendarMonthState(opts, RangeMonthCalendarCellContext.get());
	}

	readonly #tabindex = $derived.by(() =>
		this.cell.isDisabled ? undefined : this.cell.isFocusedUnit ? 0 : -1
	);

	readonly snippetProps = $derived.by(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnavailable,
		selected: this.cell.isSelectedDate,
		month: `${this.cell.opts.date.current.day}`,
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
				// Shared logic for range calendar and calendar
				"data-bits-month": "",
				//
				onclick: this.onclick,
				onmouseenter: this.onmouseenter,
				onfocusin: this.onfocusin,
				...attachRef(this.opts.ref),
			}) as const
	);
}
