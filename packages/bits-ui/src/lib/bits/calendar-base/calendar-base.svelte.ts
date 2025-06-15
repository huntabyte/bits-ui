import { type DateValue } from "@internationalized/date";
import { onMount, untrack } from "svelte";
import {
	attachRef,
	DOMContext,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { watch } from "runed";
import type { RangeCalendarRootState } from "../range-calendar/range-calendar.svelte.js";
import {
	getAriaDisabled,
	getAriaHidden,
	getAriaReadonly,
	getDataDisabled,
	getDataReadonly,
} from "$lib/internal/attrs.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefOpts } from "$lib/internal/types.js";
import { useId } from "$lib/internal/use-id.js";
import type { DateMatcher } from "$lib/shared/index.js";
import { type Announcer, getAnnouncer } from "$lib/internal/date-time/announcer.js";
import { type Formatter } from "$lib/internal/date-time/formatter.js";
import {
	calendarAttrs,
	createAccessibleHeading,
	getCalendarElementProps,
	getDateWithPreviousTime,
	handleCalendarKeydown,
} from "$lib/internal/date-time/calendar-helpers.svelte.js";
import { isBefore, toDate } from "$lib/internal/date-time/utils.js";

export interface CalendarBaseRootStateOpts
	extends WithRefOpts,
		WritableBoxedValues<{
			value: DateValue | undefined | DateValue[];
			placeholder: DateValue;
		}>,
		ReadableBoxedValues<{
			preventDeselect: boolean;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			disabled: boolean;
			pagedNavigation: boolean;
			// weekStartsOn: WeekStartsOn | undefined;
			// weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
			isUnitDisabled: DateMatcher;
			isUnitUnavailable: DateMatcher;
			// fixedWeeks: boolean;
			// numberOfMonths: number;
			locale: string;
			calendarLabel: string;
			type: "single" | "multiple";
			readonly: boolean;
			// disableDaysOutsideMonth: boolean;
			initialFocus: boolean;
			// maxSelection: number | undefined;
			/**
			 * This is strictly used by the `DatePicker` component to close the popover when a date
			 * is selected. It is not intended to be used by the user.
			 */
			onDateSelect?: () => void;
			// monthFormat: Intl.DateTimeFormatOptions["month"] | ((month: number) => string);
			// yearFormat: Intl.DateTimeFormatOptions["year"] | ((year: number) => string);
		}> {
	defaultPlaceholder: DateValue;
}

// export const CalendarRootContext = new Context<CalendarBaseRootState | RangeCalendarRootState>(
// 	"Calendar.Root | RangeCalendar.Root"
// );

export abstract class CalendarBaseRootState<
	T extends CalendarBaseRootStateOpts = CalendarBaseRootStateOpts,
> {
	// static create(opts: BaseCalendarRootStateOpts) {
	// 	return CalendarRootContext.set(new CalendarRootState(opts));
	// }

	readonly opts: T;
	// readonly visibleMonths = $derived.by(() => this.months.map((month) => month.value));
	abstract readonly formatter: Formatter;
	readonly accessibleHeadingId = useId();
	readonly domContext: DOMContext;
	// months: Month<DateValue>[] = $state([]);
	announcer: Announcer;

	constructor(opts: T) {
		this.opts = opts;
		this.domContext = new DOMContext(opts.ref);
		this.announcer = getAnnouncer(null);
		// this.formatter = createFormatter({
		// 	initialLocale: this.opts.locale.current,
		// 	monthFormat: this.opts.monthFormat,
		// 	yearFormat: this.opts.yearFormat,
		// });

		// this.setMonths = this.setMonths.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.prevPage = this.prevPage.bind(this);
		// this.prevYear = this.prevYear.bind(this);
		// this.nextYear = this.nextYear.bind(this);
		// this.setYear = this.setYear.bind(this);
		// this.setMonth = this.setMonth.bind(this);
		// this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this);
		this.isUnitDisabled = this.isUnitDisabled.bind(this);
		this.isUnitSelected = this.isUnitSelected.bind(this);
		this.shiftFocus = this.shiftFocus.bind(this);
		this.handleCellClick = this.handleCellClick.bind(this);
		this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this);
		this.handleSingleUpdate = this.handleSingleUpdate.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.getBitsAttr = this.getBitsAttr.bind(this);

		onMount(() => {
			this.announcer = getAnnouncer(this.domContext.getDocument());
		});

		// this.months = createMonths({
		// 	dateObj: this.opts.placeholder.current,
		// 	weekStartsOn: this.opts.weekStartsOn.current,
		// 	locale: this.opts.locale.current,
		// 	fixedWeeks: this.opts.fixedWeeks.current,
		// 	numberOfMonths: this.opts.numberOfMonths.current,
		// });

		this.#setupInitialFocusEffect();
		this.#setupAccessibleHeadingEffect();
		this.#setupFormatterEffect();

		/**
		 * Updates the displayed months based on changes in the placeholder value.
		 */
		// useMonthViewPlaceholderSync({
		// 	placeholder: this.opts.placeholder,
		// 	getVisibleMonths: () => this.visibleMonths,
		// 	weekStartsOn: this.opts.weekStartsOn,
		// 	locale: this.opts.locale,
		// 	fixedWeeks: this.opts.fixedWeeks,
		// 	numberOfMonths: this.opts.numberOfMonths,
		// 	setMonths: (months: Month<DateValue>[]) => (this.months = months),
		// });

		/**
		 * Updates the displayed months based on changes in the options values,
		 * which determines the month to show in the calendar.
		 */
		// useMonthViewOptionsSync({
		// 	fixedWeeks: this.opts.fixedWeeks,
		// 	locale: this.opts.locale,
		// 	numberOfMonths: this.opts.numberOfMonths,
		// 	placeholder: this.opts.placeholder,
		// 	setMonths: this.setMonths,
		// 	weekStartsOn: this.opts.weekStartsOn,
		// });

		/**
		 * Update the accessible heading's text content when the `fullCalendarLabel`
		 * changes.
		 */
		watch(
			() => this.fullCalendarLabel,
			(label) => {
				const node = this.domContext.getElementById(this.accessibleHeadingId);
				if (!node) return;
				node.textContent = label;
			}
		);

		/**
		 * Synchronize the placeholder value with the current value.
		 */
		watch(
			() => this.opts.value.current,
			() => {
				const value = this.opts.value.current;
				if (Array.isArray(value) && value.length) {
					const lastValue = value[value.length - 1];
					if (lastValue && this.opts.placeholder.current !== lastValue) {
						this.opts.placeholder.current = lastValue;
					}
				} else if (
					!Array.isArray(value) &&
					value &&
					this.opts.placeholder.current !== value
				) {
					this.opts.placeholder.current = value;
				}
			}
		);

		// useEnsureNonDisabledPlaceholder({
		// 	placeholder: opts.placeholder,
		// 	defaultPlaceholder: opts.defaultPlaceholder,
		// 	isUnitDisabled: opts.isUnitDisabled,
		// 	maxValue: opts.maxValue,
		// 	minValue: opts.minValue,
		// 	ref: opts.ref,
		// });
	}

	// setMonths(months: Month<DateValue>[]) {
	// 	this.months = months;
	// }

	/**
	 * This derived state holds an array of localized day names for the current
	 * locale and calendar view. It dynamically syncs with the 'weekStartsOn' option,
	 * updating its content when the option changes. Using this state to render the
	 * calendar's days of the week is strongly recommended, as it guarantees that
	 * the days are correctly formatted for the current locale and calendar view.
	 */
	// readonly weekdays = $derived.by(() => {
	// 	return getWeekdays({
	// 		months: this.months,
	// 		formatter: this.formatter,
	// 		weekdayFormat: this.opts.weekdayFormat.current,
	// 	});
	// });

	// readonly initialPlaceholderYear = $derived.by(() =>
	// 	untrack(() => this.opts.placeholder.current.year)
	// );

	// readonly defaultYears = $derived.by(() => {
	// 	return getDefaultYears({
	// 		minValue: this.opts.minValue.current,
	// 		maxValue: this.opts.maxValue.current,
	// 		placeholderYear: this.initialPlaceholderYear,
	// 	});
	// });

	#setupInitialFocusEffect() {
		$effect(() => {
			const initialFocus = untrack(() => this.opts.initialFocus.current);
			if (initialFocus) {
				// focus the first `data-focused` day node
				const firstFocusedDay =
					this.opts.ref.current?.querySelector<HTMLElement>(`[data-focused]`);
				if (firstFocusedDay) {
					firstFocusedDay.focus();
				}
			}
		});
	}

	#setupAccessibleHeadingEffect() {
		$effect(() => {
			if (!this.opts.ref.current) return;
			const removeHeading = createAccessibleHeading({
				calendarNode: this.opts.ref.current,
				label: this.fullCalendarLabel,
				accessibleHeadingId: this.accessibleHeadingId,
			});
			return removeHeading;
		});
	}

	#setupFormatterEffect() {
		$effect(() => {
			if (this.formatter.getLocale() === this.opts.locale.current) return;
			this.formatter.setLocale(this.opts.locale.current);
		});
	}

	/**
	 * Navigates to the next page of the calendar.
	 */
	abstract nextPage(): void;
	// {
	// 	handleCalendarNextPage({
	// 		fixedWeeks: this.opts.fixedWeeks.current,
	// 		locale: this.opts.locale.current,
	// 		numberOfMonths: this.opts.numberOfMonths.current,
	// 		pagedNavigation: this.opts.pagedNavigation.current,
	// 		setMonths: this.setMonths,
	// 		setPlaceholder: (date: DateValue) => (this.opts.placeholder.current = date),
	// 		weekStartsOn: this.opts.weekStartsOn.current,
	// 		months: this.months,
	// 	});
	// }

	/**
	 * Navigates to the previous page of the calendar.
	 */
	abstract prevPage(): void;
	// {
	// 	handleCalendarPrevPage({
	// 		fixedWeeks: this.opts.fixedWeeks.current,
	// 		locale: this.opts.locale.current,
	// 		numberOfMonths: this.opts.numberOfMonths.current,
	// 		pagedNavigation: this.opts.pagedNavigation.current,
	// 		setMonths: this.setMonths,
	// 		setPlaceholder: (date: DateValue) => (this.opts.placeholder.current = date),
	// 		weekStartsOn: this.opts.weekStartsOn.current,
	// 		months: this.months,
	// 	});
	// }

	// nextYear() {
	// 	this.opts.placeholder.current = this.opts.placeholder.current.add({ years: 1 });
	// }

	// prevYear() {
	// 	this.opts.placeholder.current = this.opts.placeholder.current.subtract({ years: 1 });
	// }

	// setYear(year: number) {
	// 	this.opts.placeholder.current = this.opts.placeholder.current.set({ year });
	// }

	// setMonth(month: number) {
	// 	this.opts.placeholder.current = this.opts.placeholder.current.set({ month });
	// }

	abstract isNextButtonDisabled: boolean;
	//  = $derived.by(() => {
	// 	return getIsNextButtonDisabled({
	// 		maxValue: this.opts.maxValue.current,
	// 		units: this.months,
	// 		disabled: this.opts.disabled.current,
	// 	});
	// });

	abstract isPrevButtonDisabled: boolean;
	// isPrevButtonDisabled = $derived.by(() => {
	// 	return getIsPrevButtonDisabled({
	// 		minValue: this.opts.minValue.current,
	// 		months: this.months,
	// 		disabled: this.opts.disabled.current,
	// 	});
	// });

	isInvalid = $derived.by(() => {
		const value = this.opts.value.current;
		const isUnitDisabled = this.opts.isUnitDisabled.current;
		const isUnitUnavailable = this.opts.isUnitUnavailable.current;
		if (Array.isArray(value)) {
			if (!value.length) return false;
			for (const date of value) {
				if (isUnitDisabled(date)) return true;
				if (isUnitUnavailable(date)) return true;
			}
		} else {
			if (!value) return false;
			if (isUnitDisabled(value)) return true;
			if (isUnitUnavailable(value)) return true;
		}
		return false;
	});

	abstract readonly headingValue: string;
	// readonly headingValue = $derived.by(() => {
	// 	this.opts.monthFormat.current;
	// 	this.opts.yearFormat.current;
	// 	return getCalendarHeadingValue({
	// 		months: this.months,
	// 		formatter: this.formatter,
	// 		locale: this.opts.locale.current,
	// 	});
	// });

	readonly fullCalendarLabel = $derived.by(() => {
		return `${this.opts.calendarLabel.current} ${this.headingValue}`;
	});

	// isOutsideVisibleMonths(date: DateValue) {
	// 	return !this.visibleMonths.some((month) => isSameMonth(date, month));
	// }

	isUnitDisabled(date: DateValue) {
		if (this.opts.isUnitDisabled.current(date) || this.opts.disabled.current) return true;
		const minValue = this.opts.minValue.current;
		const maxValue = this.opts.maxValue.current;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isBefore(maxValue, date)) return true;
		return false;
	}

	abstract isUnitSelected(date: DateValue): boolean;
	// isUnitSelected(date: DateValue) {
	// 	const value = this.opts.value.current;
	// 	if (Array.isArray(value)) {
	// 		return value.some((d) => isSameDay(d, date));
	// 	} else if (!value) {
	// 		return false;
	// 	}
	// 	return isSameDay(value, date);
	// }

	abstract shiftFocus(node: HTMLElement, add: number): void;

	// {
	// 	return shiftCalendarFocus({
	// 		node,
	// 		add,
	// 		placeholder: this.opts.placeholder,
	// 		calendarNode: this.opts.ref.current,
	// 		isPrevButtonDisabled: this.isPrevButtonDisabled,
	// 		isNextButtonDisabled: this.isNextButtonDisabled,
	// 		months: this.months,
	// 		numberOfMonths: this.opts.numberOfMonths.current,
	// 	});
	// }

	// #isMultipleSelectionValid(selectedDates: DateValue[]): boolean {
	// 	// only validate for multiple type and when maxSelection is set
	// 	if (this.opts.type.current !== "multiple") return true;
	// 	if (!this.opts.maxSelection.current) return true;
	// 	const selectedCount = selectedDates.length;
	// 	if (this.opts.maxSelection.current && selectedCount > this.opts.maxSelection.current)
	// 		return false;
	// 	return true;
	// }

	handleCellClick(_: Event, date: DateValue) {
		if (
			this.opts.readonly.current ||
			this.opts.isUnitDisabled.current?.(date) ||
			this.opts.isUnitUnavailable.current?.(date)
		) {
			return;
		}

		const prev = this.opts.value.current;
		const multiple = this.opts.type.current === "multiple";
		if (multiple) {
			if (Array.isArray(prev) || prev === undefined) {
				this.opts.value.current = this.handleMultipleUpdate(prev, date);
			}
		} else if (!Array.isArray(prev)) {
			const next = this.handleSingleUpdate(prev, date);
			if (!next) {
				this.announcer.announce("Selected date is now empty.", "polite", 5000);
			} else {
				this.announcer.announce(
					`Selected Date: ${this.formatter.selectedDate(next, false)}`,
					"polite"
				);
			}
			this.opts.value.current = getDateWithPreviousTime(next, prev);
			if (next !== undefined) {
				this.opts.onDateSelect?.current?.();
			}
		}
	}

	abstract handleMultipleUpdate(
		prev: DateValue[] | undefined,
		date: DateValue
	): DateValue[] | undefined;
	// handleMultipleUpdate(prev: DateValue[] | undefined, date: DateValue) {
	// 	if (!prev) {
	// 		const newSelection = [date];
	// 		return this.#isMultipleSelectionValid(newSelection) ? newSelection : [date];
	// 	}
	// 	if (!Array.isArray(prev)) {
	// 		if (DEV) throw new Error("Invalid value for multiple prop.");
	// 		return;
	// 	}
	// 	const index = prev.findIndex((d) => isSameDay(d, date));
	// 	const preventDeselect = this.opts.preventDeselect.current;
	// 	if (index === -1) {
	// 		// adding a new date - check if it would be valid
	// 		const newSelection = [...prev, date];
	// 		if (this.#isMultipleSelectionValid(newSelection)) {
	// 			return newSelection;
	// 		} else {
	// 			// reset to just the newly selected date when constraints are violated
	// 			return [date];
	// 		}
	// 	} else if (preventDeselect) {
	// 		return prev;
	// 	} else {
	// 		const next = prev.filter((d) => !isSameDay(d, date));
	// 		if (!next.length) {
	// 			this.opts.placeholder.current = date;
	// 			return undefined;
	// 		}
	// 		return next;
	// 	}
	// }

	abstract handleSingleUpdate(
		prev: DateValue | undefined,
		date: DateValue
	): DateValue | undefined;
	// handleSingleUpdate(prev: DateValue | undefined, date: DateValue) {
	// 	if (Array.isArray(prev)) {
	// 		if (DEV) throw new Error("Invalid value for single prop.");
	// 	}
	// 	if (!prev) return date;
	// 	const preventDeselect = this.opts.preventDeselect.current;
	// 	if (!preventDeselect && isSameDay(prev, date)) {
	// 		this.opts.placeholder.current = date;
	// 		return undefined;
	// 	}
	// 	return date;
	// }

	onkeydown(event: BitsKeyboardEvent) {
		handleCalendarKeydown({
			event,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.opts.placeholder.current,
		});
	}

	// readonly snippetProps = $derived.by(() => ({
	// 	months: this.months,
	// 	weekdays: this.weekdays,
	// }));

	// abstract getBitsAttr: (typeof calendarAttrs)["getAttr"];
	getBitsAttr: (typeof calendarAttrs)["getAttr"] = (part) => {
		return calendarAttrs.getAttr(part);
	};

	readonly props = $derived.by(
		() =>
			({
				...getCalendarElementProps({
					fullCalendarLabel: this.fullCalendarLabel,
					id: this.opts.id.current,
					isInvalid: this.isInvalid,
					disabled: this.opts.disabled.current,
					readonly: this.opts.readonly.current,
				}),
				[this.getBitsAttr("root")]: "",
				//
				onkeydown: this.onkeydown,
				...attachRef(this.opts.ref),
			}) as const
	);
}

export interface CalendarBaseHeadingStateOpts extends WithRefOpts {}

export abstract class CalendarBaseHeadingState<
	T extends CalendarBaseHeadingStateOpts = CalendarBaseHeadingStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	// static create(opts: CalendarBaseHeadingStateOpts) {
	// 	return new CalendarBaseHeadingState(opts, CalendarRootContext.get());
	// }

	readonly opts: T;
	readonly root: U | RangeCalendarRootState;

	constructor(opts: T, root: U | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"aria-hidden": getAriaHidden(true),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("heading")]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

// const CalendarBaseCellContext = new Context<CalendarBaseCellState>("CalendarBase.Cell | RangeCalendar.Cell");

// interface CalendarCellStateOpts
// 	extends WithRefOpts,
// 		ReadableBoxedValues<{
// 			date: DateValue;
// 			month: DateValue;
// 		}> {}

export interface CalendarBaseCellStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			date: DateValue;
		}> {}

export abstract class CalendarBaseCellState<
	T extends CalendarBaseCellStateOpts = CalendarBaseCellStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	// static create(opts: CalendarCellStateOpts) {
	// 	return CalendarBaseCellContext.set(
	// 		new CalendarBaseCellState(opts, CalendarRootContext.get() as CalendarBaseRootState)
	// 	);
	// }

	readonly opts: T;
	readonly root: U;
	readonly cellDate = $derived.by(() => toDate(this.opts.date.current));
	readonly isDisabled = $derived.by(() => this.root.isUnitDisabled(this.opts.date.current));
	readonly isUnavailable = $derived.by(() =>
		this.root.opts.isUnitUnavailable.current(this.opts.date.current)
	);
	// readonly isDateToday = $derived.by(() => isToday(this.opts.date.current, getLocalTimeZone()));
	// readonly isOutsideMonth = $derived.by(
	// 	() => !isSameMonth(this.opts.date.current, this.opts.month.current)
	// );
	// readonly isOutsideVisibleMonths = $derived.by(() =>
	// 	this.root.isOutsideVisibleMonths(this.opts.date.current)
	// );
	abstract readonly isFocusedDate: boolean;
	// readonly isFocusedDate = $derived.by(() =>
	// 	isSameDay(this.opts.date.current, this.root.opts.placeholder.current)
	// );
	readonly isSelectedDate = $derived.by(() => this.root.isUnitSelected(this.opts.date.current));
	abstract readonly labelText: string;
	// readonly labelText = $derived.by(() =>
	// 	this.root.formatter.custom(this.cellDate, {
	// 		weekday: "long",
	// 		month: "long",
	// 		day: "numeric",
	// 		year: "numeric",
	// 	})
	// );

	constructor(opts: T, root: U) {
		this.opts = opts;
		this.root = root;
	}

	readonly snippetProps = $derived.by(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
	}));

	abstract readonly ariaDisabled: boolean;
	//  = $derived.by(() => {
	// 	return (
	// 		this.isDisabled ||
	// 		(this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current) ||
	// 		this.isUnavailable
	// 	);
	// });

	// readonly sharedDataAttrs = $derived.by(
	// 	() =>
	// 		({
	// 			"data-unavailable": getDataUnavailable(this.isUnavailable),
	// 			"data-today": this.isDateToday ? "" : undefined,
	// 			"data-outside-month": this.isOutsideMonth ? "" : undefined,
	// 			"data-outside-visible-months": this.isOutsideVisibleMonths ? "" : undefined,
	// 			"data-focused": this.isFocusedDate ? "" : undefined,
	// 			"data-selected": getDataSelected(this.isSelectedDate),
	// 			"data-value": this.opts.date.current.toString(),
	// 			"data-type": getDateValueType(this.opts.date.current),
	// 			"data-disabled": getDataDisabled(
	// 				this.isDisabled ||
	// 					(this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
	// 			),
	// 		}) as const
	// );

	// readonly props = $derived.by(
	// 	() =>
	// 		({
	// 			id: this.opts.id.current,
	// 			role: "gridcell",
	// 			"aria-selected": getAriaSelected(this.isSelectedDate),
	// 			"aria-disabled": getAriaDisabled(this.ariaDisabled),
	// 			...this.sharedDataAttrs,
	// 			[this.root.getBitsAttr("cell")]: "",
	// 			...attachRef(this.opts.ref),
	// 		}) as const
	// );
}

export interface CalendarBaseUnitStateOpts extends WithRefOpts {}

export class CalendarBaseUnitState<
	T extends CalendarBaseUnitStateOpts = CalendarBaseUnitStateOpts,
	U extends CalendarBaseCellState = CalendarBaseCellState,
> {
	// static create(opts: CalendarDayStateOpts) {
	// 	return new CalendarDayState(opts, CalendarCellContext.get());
	// }

	readonly opts: T;
	readonly cell: U;

	constructor(opts: T, cell: U) {
		this.opts = opts;
		this.cell = cell;
		this.onclick = this.onclick.bind(this);
	}

	// readonly #tabindex = $derived.by(() =>
	// 	(this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current) ||
	// 	this.cell.isDisabled
	// 		? undefined
	// 		: this.cell.isFocusedDate
	// 			? 0
	// 			: -1
	// );

	onclick(e: BitsMouseEvent) {
		if (this.cell.isDisabled) return;
		this.cell.root.handleCellClick(e, this.cell.opts.date.current);
	}

	// readonly snippetProps = $derived.by(() => ({
	// 	disabled: this.cell.isDisabled,
	// 	unavailable: this.cell.isUnavailable,
	// 	selected: this.cell.isSelectedDate,
	// 	day: `${this.cell.opts.date.current.day}`,
	// }));

	// readonly props = $derived.by(
	// 	() =>
	// 		({
	// 			id: this.opts.id.current,
	// 			role: "button",
	// 			"aria-label": this.cell.labelText,
	// 			"aria-disabled": getAriaDisabled(this.cell.ariaDisabled),
	// 			...this.cell.sharedDataAttrs,
	// 			tabindex: this.#tabindex,
	// 			[this.cell.root.getBitsAttr("day")]: "",
	// 			// Shared logic for range calendar and calendar
	// 			"data-bits-day": "",
	// 			//
	// 			onclick: this.onclick,
	// 			...attachRef(this.opts.ref),
	// 		}) as const
	// );
}

export interface CalendarBaseNextButtonStateOpts extends WithRefOpts {}

export class CalendarBaseNextButtonState<
	T extends CalendarBaseNextButtonStateOpts = CalendarBaseNextButtonStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	// static create(opts: CalendarBaseNextButtonStateOpts) {
	// 	return new CalendarNextButtonState(opts, CalendarRootContext.get());
	// }

	readonly opts: T;
	readonly root: U | RangeCalendarRootState;
	readonly isDisabled = $derived.by(() => this.root.isNextButtonDisabled);

	constructor(opts: T, root: U | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);
	}

	onclick(_: BitsMouseEvent) {
		if (this.isDisabled) return;
		this.root.nextPage();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "button",
				type: "button",
				"aria-label": "Next",
				"aria-disabled": getAriaDisabled(this.isDisabled),
				"data-disabled": getDataDisabled(this.isDisabled),
				disabled: this.isDisabled,
				[this.root.getBitsAttr("next-button")]: "",
				//
				onclick: this.onclick,
				...attachRef(this.opts.ref),
			}) as const
	);
}

export interface CalendarBasePrevButtonStateOpts extends WithRefOpts {}

export class CalendarBasePrevButtonState<
	T extends CalendarBasePrevButtonStateOpts = CalendarBasePrevButtonStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	// static create(opts: CalendarPrevButtonStateOpts) {
	// 	return new CalendarPrevButtonState(opts, CalendarRootContext.get());
	// }

	readonly opts: T;
	readonly root: U | RangeCalendarRootState;
	readonly isDisabled = $derived.by(() => this.root.isPrevButtonDisabled);

	constructor(opts: T, root: U | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);
	}

	onclick(_: BitsMouseEvent) {
		if (this.isDisabled) return;
		this.root.prevPage();
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				role: "button",
				type: "button",
				"aria-label": "Previous",
				"aria-disabled": getAriaDisabled(this.isDisabled),
				"data-disabled": getDataDisabled(this.isDisabled),
				disabled: this.isDisabled,
				[this.root.getBitsAttr("prev-button")]: "",
				//
				onclick: this.onclick,
				...attachRef(this.opts.ref),
			}) as const
	);
}

export interface CalendarBaseGridStateOpts extends WithRefOpts {}

export class CalendarBaseGridState<
	T extends CalendarBaseGridStateOpts = CalendarBaseGridStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	// static create(opts: CalendarBaseGridStateOpts) {
	// 	return new CalendarGridState(opts, CalendarRootContext.get());
	// }

	readonly opts: T;
	readonly root: U | RangeCalendarRootState;

	constructor(opts: T, root: U | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				tabindex: -1,
				role: "grid",
				"aria-readonly": getAriaReadonly(this.root.opts.readonly.current),
				"aria-disabled": getAriaDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				[this.root.getBitsAttr("grid")]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

export interface CalendarBaseGridBodyStateOpts extends WithRefOpts {}

export class CalendarBaseGridBodyState<
	T extends CalendarBaseGridBodyStateOpts = CalendarBaseGridBodyStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	// static create(opts: CalendarBaseGridBodyStateOpts) {
	// 	return new CalendarGridBodyState(opts, CalendarRootContext.get());
	// }

	readonly opts: T;
	readonly root: U | RangeCalendarRootState;

	constructor(opts: T, root: U | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("grid-body")]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

export interface CalendarBaseGridHeadStateOpts extends WithRefOpts {}

export class CalendarBaseGridHeadState<
	T extends CalendarBaseGridHeadStateOpts = CalendarBaseGridHeadStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	// static create(opts: CalendarGridHeadStateOpts) {
	// 	return new CalendarGridHeadState(opts, CalendarBaseRootContext.get());
	// }

	readonly opts: T;
	readonly root: U | RangeCalendarRootState;

	constructor(opts: T, root: U | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("grid-head")]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

export interface CalendarBaseGridRowStateOpts extends WithRefOpts {}

export class CalendarBaseGridRowState<
	T extends CalendarBaseGridRowStateOpts = CalendarBaseGridRowStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	// static create(opts: CalendarGridRowStateOpts) {
	// 	return new CalendarGridRowState(opts, CalendarRootContext.get());
	// }

	readonly opts: T;
	readonly root: U | RangeCalendarRootState;

	constructor(opts: T, root: U | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("grid-row")]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

export interface CalendarBaseHeadCellStateOpts extends WithRefOpts {}

export class CalendarBaseHeadCellState<
	T extends CalendarBaseHeadCellStateOpts = CalendarBaseHeadCellStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	// static create(opts: CalendarHeadCellStateOpts) {
	// 	return new CalendarHeadCellState(opts, CalendarRootContext.get());
	// }

	readonly opts: T;
	readonly root: U | RangeCalendarRootState;

	constructor(opts: T, root: U | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("head-cell")]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}

export interface CalendarBaseHeaderStateOpts extends WithRefOpts {}

export class CalendarBaseHeaderState<
	T extends CalendarBaseHeaderStateOpts = CalendarBaseHeaderStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	// static create(opts: CalendarHeaderStateOpts) {
	// 	return new CalendarHeaderState(opts, CalendarBaseRootContext.get());
	// }

	readonly opts: T;
	readonly root: U | RangeCalendarRootState;

	constructor(opts: T, root: U | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	readonly props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("header")]: "",
				...attachRef(this.opts.ref),
			}) as const
	);
}
