import {
	type DateValue,
	getLocalTimeZone,
	isSameDay,
	isSameMonth,
	isToday,
} from "@internationalized/date";
import { DEV } from "esm-env";
import { onMount, untrack } from "svelte";
import { attachRef, DOMContext } from "svelte-toolbelt";
import { Context, watch } from "runed";
import type { RangeCalendarRootState } from "../range-calendar/range-calendar.svelte.js";
import {
	getAriaDisabled,
	getAriaHidden,
	getAriaReadonly,
	getAriaSelected,
	getDataDisabled,
	getDataReadonly,
	getDataSelected,
	getDataUnavailable,
} from "$lib/internal/attrs.js";
import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsKeyboardEvent, BitsMouseEvent, WithRefProps } from "$lib/internal/types.js";
import { useId } from "$lib/internal/use-id.js";
import type { DateMatcher, Month } from "$lib/shared/index.js";
import { type Announcer, getAnnouncer } from "$lib/internal/date-time/announcer.js";
import { type Formatter, createFormatter } from "$lib/internal/date-time/formatter.js";
import {
	calendarAttrs,
	createAccessibleHeading,
	createMonths,
	getCalendarElementProps,
	getCalendarHeadingValue,
	getDateWithPreviousTime,
	getIsNextButtonDisabled,
	getIsPrevButtonDisabled,
	getWeekdays,
	handleCalendarKeydown,
	handleCalendarNextPage,
	handleCalendarPrevPage,
	shiftCalendarFocus,
	useEnsureNonDisabledPlaceholder,
	useMonthViewOptionsSync,
	useMonthViewPlaceholderSync,
} from "$lib/internal/date-time/calendar-helpers.svelte.js";
import { getDateValueType, isBefore, toDate } from "$lib/internal/date-time/utils.js";
import type { WeekStartsOn } from "$lib/shared/date/types.js";

type CalendarRootStateProps = WithRefProps<
	WritableBoxedValues<{
		value: DateValue | undefined | DateValue[];
		placeholder: DateValue;
	}> &
		ReadableBoxedValues<{
			preventDeselect: boolean;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			disabled: boolean;
			pagedNavigation: boolean;
			weekStartsOn: WeekStartsOn | undefined;
			weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
			isDateDisabled: DateMatcher;
			isDateUnavailable: DateMatcher;
			fixedWeeks: boolean;
			numberOfMonths: number;
			locale: string;
			calendarLabel: string;
			type: "single" | "multiple";
			readonly: boolean;
			disableDaysOutsideMonth: boolean;
			initialFocus: boolean;
			maxDays: number | undefined;
			/**
			 * This is strictly used by the `DatePicker` component to close the popover when a date
			 * is selected. It is not intended to be used by the user.
			 */
			onDateSelect?: () => void;
		}> & {
			defaultPlaceholder: DateValue;
		}
>;

export class CalendarRootState {
	readonly opts: CalendarRootStateProps;
	months: Month<DateValue>[] = $state([]);
	visibleMonths = $derived.by(() => this.months.map((month) => month.value));
	announcer: Announcer;
	formatter: Formatter;
	accessibleHeadingId = useId();
	domContext: DOMContext;

	constructor(opts: CalendarRootStateProps) {
		this.opts = opts;
		this.domContext = new DOMContext(opts.ref);
		this.announcer = getAnnouncer(null);
		this.formatter = createFormatter(this.opts.locale.current);

		this.setMonths = this.setMonths.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.prevPage = this.prevPage.bind(this);
		this.prevYear = this.prevYear.bind(this);
		this.nextYear = this.nextYear.bind(this);
		this.setYear = this.setYear.bind(this);
		this.setMonth = this.setMonth.bind(this);
		this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this);
		this.isDateDisabled = this.isDateDisabled.bind(this);
		this.isDateSelected = this.isDateSelected.bind(this);
		this.shiftFocus = this.shiftFocus.bind(this);
		this.handleCellClick = this.handleCellClick.bind(this);
		this.handleMultipleUpdate = this.handleMultipleUpdate.bind(this);
		this.handleSingleUpdate = this.handleSingleUpdate.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.getBitsAttr = this.getBitsAttr.bind(this);

		onMount(() => {
			this.announcer = getAnnouncer(this.domContext.getDocument());
		});

		this.months = createMonths({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current,
		});

		this.#setupInitialFocusEffect();
		this.#setupAccessibleHeadingEffect();
		this.#setupFormatterEffect();

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

		/**
		 * Update the accessible heading's text content when the `fullCalendarLabel`
		 * changes.
		 */
		$effect(() => {
			const node = this.domContext.getElementById(this.accessibleHeadingId);
			if (!node) return;
			node.textContent = this.fullCalendarLabel;
		});

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

		useEnsureNonDisabledPlaceholder({
			placeholder: opts.placeholder,
			defaultPlaceholder: opts.defaultPlaceholder,
			isDateDisabled: opts.isDateDisabled,
			maxValue: opts.maxValue,
			minValue: opts.minValue,
			ref: opts.ref,
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
	weekdays = $derived.by(() => {
		return getWeekdays({
			months: this.months,
			formatter: this.formatter,
			weekdayFormat: this.opts.weekdayFormat.current,
		});
	});

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
		$effect.pre(() => {
			if (this.formatter.getLocale() === this.opts.locale.current) return;
			this.formatter.setLocale(this.opts.locale.current);
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

	isInvalid = $derived.by(() => {
		const value = this.opts.value.current;
		const isDateDisabled = this.opts.isDateDisabled.current;
		const isDateUnavailable = this.opts.isDateUnavailable.current;
		if (Array.isArray(value)) {
			if (!value.length) return false;
			for (const date of value) {
				if (isDateDisabled(date)) return true;
				if (isDateUnavailable(date)) return true;
			}
		} else {
			if (!value) return false;
			if (isDateDisabled(value)) return true;
			if (isDateUnavailable(value)) return true;
		}
		return false;
	});

	headingValue = $derived.by(() => {
		return getCalendarHeadingValue({
			months: this.months,
			formatter: this.formatter,
			locale: this.opts.locale.current,
		});
	});

	fullCalendarLabel = $derived.by(() => {
		return `${this.opts.calendarLabel.current} ${this.headingValue}`;
	});

	isOutsideVisibleMonths(date: DateValue) {
		return !this.visibleMonths.some((month) => isSameMonth(date, month));
	}

	isDateDisabled(date: DateValue) {
		if (this.opts.isDateDisabled.current(date) || this.opts.disabled.current) return true;
		const minValue = this.opts.minValue.current;
		const maxValue = this.opts.maxValue.current;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isBefore(maxValue, date)) return true;
		return false;
	}

	isDateSelected(date: DateValue) {
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
			months: this.months,
			numberOfMonths: this.opts.numberOfMonths.current,
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

	handleCellClick(_: Event, date: DateValue) {
		if (
			this.opts.readonly.current ||
			this.opts.isDateDisabled.current?.(date) ||
			this.opts.isDateUnavailable.current?.(date)
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

	onkeydown(event: BitsKeyboardEvent) {
		handleCalendarKeydown({
			event,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.opts.placeholder.current,
		});
	}

	snippetProps = $derived.by(() => ({
		months: this.months,
		weekdays: this.weekdays,
	}));

	getBitsAttr: (typeof calendarAttrs)["getAttr"] = (part) => {
		return calendarAttrs.getAttr(part);
	};

	props = $derived.by(
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

export type CalendarHeadingStateProps = WithRefProps;
export class CalendarHeadingState {
	readonly opts: CalendarHeadingStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;
	headingValue = $derived.by(() => this.root.headingValue);

	constructor(opts: CalendarHeadingStateProps, root: CalendarRootState | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
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

type CalendarCellStateProps = WithRefProps<
	ReadableBoxedValues<{
		date: DateValue;
		month: DateValue;
	}>
>;

class CalendarCellState {
	readonly opts: CalendarCellStateProps;
	readonly root: CalendarRootState;
	cellDate = $derived.by(() => toDate(this.opts.date.current));
	isDisabled = $derived.by(() => this.root.isDateDisabled(this.opts.date.current));
	isUnavailable = $derived.by(() =>
		this.root.opts.isDateUnavailable.current(this.opts.date.current)
	);
	isDateToday = $derived.by(() => isToday(this.opts.date.current, getLocalTimeZone()));
	isOutsideMonth = $derived.by(
		() => !isSameMonth(this.opts.date.current, this.opts.month.current)
	);
	isOutsideVisibleMonths = $derived.by(() =>
		this.root.isOutsideVisibleMonths(this.opts.date.current)
	);
	isFocusedDate = $derived.by(() =>
		isSameDay(this.opts.date.current, this.root.opts.placeholder.current)
	);
	isSelectedDate = $derived.by(() => this.root.isDateSelected(this.opts.date.current));
	labelText = $derived.by(() =>
		this.root.formatter.custom(this.cellDate, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})
	);

	constructor(opts: CalendarCellStateProps, root: CalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	snippetProps = $derived.by(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
	}));

	ariaDisabled = $derived.by(() => {
		return (
			this.isDisabled ||
			(this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current) ||
			this.isUnavailable
		);
	});

	sharedDataAttrs = $derived.by(
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

	props = $derived.by(
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

type CalendarDayStateProps = WithRefProps;

class CalendarDayState {
	readonly opts: CalendarDayStateProps;
	readonly cell: CalendarCellState;

	constructor(opts: CalendarDayStateProps, cell: CalendarCellState) {
		this.opts = opts;
		this.cell = cell;
		this.onclick = this.onclick.bind(this);
	}

	#tabindex = $derived.by(() =>
		(this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current) ||
		this.cell.isDisabled
			? undefined
			: this.cell.isFocusedDate
				? 0
				: -1
	);

	onclick(e: BitsMouseEvent) {
		if (this.cell.isDisabled) return;
		this.cell.root.handleCellClick(e, this.cell.opts.date.current);
	}

	snippetProps = $derived.by(() => ({
		disabled: this.cell.isDisabled,
		unavailable: this.cell.isUnavailable,
		selected: this.cell.isSelectedDate,
		day: `${this.cell.opts.date.current.day}`,
	}));

	props = $derived.by(
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

export type CalendarNextButtonStateProps = WithRefProps;

export class CalendarNextButtonState {
	readonly opts: CalendarNextButtonStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;
	isDisabled = $derived.by(() => this.root.isNextButtonDisabled);

	constructor(
		opts: CalendarNextButtonStateProps,
		root: CalendarRootState | RangeCalendarRootState
	) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);
	}

	onclick(_: BitsMouseEvent) {
		if (this.isDisabled) return;
		this.root.nextPage();
	}

	props = $derived.by(
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

export type CalendarPrevButtonStateProps = WithRefProps;

export class CalendarPrevButtonState {
	readonly opts: CalendarPrevButtonStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;
	isDisabled = $derived.by(() => this.root.isPrevButtonDisabled);

	constructor(
		opts: CalendarPrevButtonStateProps,
		root: CalendarRootState | RangeCalendarRootState
	) {
		this.opts = opts;
		this.root = root;
		this.onclick = this.onclick.bind(this);
	}

	onclick(_: BitsMouseEvent) {
		if (this.isDisabled) return;
		this.root.prevPage();
	}

	props = $derived.by(
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

export type CalendarGridStateProps = WithRefProps;

export class CalendarGridState {
	readonly opts: CalendarGridStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;

	constructor(opts: CalendarGridStateProps, root: CalendarRootState | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
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

export type CalendarGridBodyStateProps = WithRefProps;

export class CalendarGridBodyState {
	readonly opts: CalendarGridBodyStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;

	constructor(
		opts: CalendarGridBodyStateProps,
		root: CalendarRootState | RangeCalendarRootState
	) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
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

export type CalendarGridHeadStateProps = WithRefProps;

export class CalendarGridHeadState {
	readonly opts: CalendarGridHeadStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;

	constructor(
		opts: CalendarGridHeadStateProps,
		root: CalendarRootState | RangeCalendarRootState
	) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
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

export type CalendarGridRowStateProps = WithRefProps;

export class CalendarGridRowState {
	readonly opts: CalendarGridRowStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;

	constructor(opts: CalendarGridRowStateProps, root: CalendarRootState | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
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

export type CalendarHeadCellStateProps = WithRefProps;

export class CalendarHeadCellState {
	readonly opts: CalendarHeadCellStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;

	constructor(
		opts: CalendarHeadCellStateProps,
		root: CalendarRootState | RangeCalendarRootState
	) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
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

export type CalendarHeaderStateProps = WithRefProps;

export class CalendarHeaderState {
	readonly opts: CalendarHeaderStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;

	constructor(opts: CalendarHeaderStateProps, root: CalendarRootState | RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
	}

	props = $derived.by(
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

export type CalendarMonthSelectStateProps = WithRefProps<
	ReadableBoxedValues<{
		months: number[];
		monthFormat: Intl.DateTimeFormatOptions["month"];
		disabled: boolean;
	}>
>;

export class CalendarMonthSelectState {
	readonly opts: CalendarMonthSelectStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;

	constructor(
		opts: CalendarMonthSelectStateProps,
		root: CalendarRootState | RangeCalendarRootState
	) {
		this.opts = opts;
		this.root = root;
		this.onchange = this.onchange.bind(this);
	}

	readonly months = $derived.by(() => {
		this.root.opts.locale.current;
		const monthNumbers = this.opts.months.current;
		const monthFormat = this.opts.monthFormat.current;
		const months = [];

		for (const month of monthNumbers) {
			// create a date with the current year and the month to get localized name
			const date = this.root.opts.placeholder.current.set({ month });
			const label = this.root.formatter.custom(toDate(date), { month: monthFormat });
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
			months: this.months,
			selectedMonth: this.months.find((month) => month.value === this.currentMonth) as {
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

	props = $derived.by(
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

export type CalendarYearSelectStateProps = WithRefProps<
	ReadableBoxedValues<{
		years: number[];
		yearFormat: Intl.DateTimeFormatOptions["year"];
		disabled: boolean;
	}>
>;

export class CalendarYearSelectState {
	readonly opts: CalendarYearSelectStateProps;
	readonly root: CalendarRootState | RangeCalendarRootState;

	constructor(
		opts: CalendarYearSelectStateProps,
		root: CalendarRootState | RangeCalendarRootState
	) {
		this.opts = opts;
		this.root = root;
		this.onchange = this.onchange.bind(this);
	}

	readonly years = $derived.by(() => {
		this.root.opts.locale.current;
		const yearNumbers = this.opts.years.current;
		const yearFormat = this.opts.yearFormat.current;
		const years = [];

		for (const year of yearNumbers) {
			// create a date with the year to get localized formatting
			const date = this.root.opts.placeholder.current.set({ year });
			const label = this.root.formatter.custom(toDate(date), { year: yearFormat });
			years.push({
				value: year,
				label,
			});
		}

		return years;
	});

	readonly currentYear = $derived.by(() => this.root.opts.placeholder.current.year);

	readonly isDisabled = $derived.by(
		() => this.root.opts.disabled.current || this.opts.disabled.current
	);

	readonly snippetProps = $derived.by(() => {
		return {
			years: this.years,
			selectedYear: this.years.find((year) => year.value === this.currentYear) as {
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

	props = $derived.by(
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

export const CalendarRootContext = new Context<CalendarRootState | RangeCalendarRootState>(
	"Calendar.Root | RangeCalender.Root"
);

const CalendarCellContext = new Context<CalendarCellState>("Calendar.Cell | RangeCalendar.Cell");

export function useCalendarRoot(props: CalendarRootStateProps) {
	return CalendarRootContext.set(new CalendarRootState(props));
}

export function useCalendarGrid(props: CalendarGridStateProps) {
	return new CalendarGridState(props, CalendarRootContext.get());
}

export function useCalendarCell(props: CalendarCellStateProps) {
	return CalendarCellContext.set(
		new CalendarCellState(props, CalendarRootContext.get() as CalendarRootState)
	);
}

export function useCalendarNextButton(props: CalendarNextButtonStateProps) {
	return new CalendarNextButtonState(props, CalendarRootContext.get());
}

export function useCalendarPrevButton(props: CalendarPrevButtonStateProps) {
	return new CalendarPrevButtonState(props, CalendarRootContext.get());
}

export function useCalendarDay(props: CalendarDayStateProps) {
	return new CalendarDayState(props, CalendarCellContext.get());
}

export function useCalendarGridBody(props: CalendarGridBodyStateProps) {
	return new CalendarGridBodyState(props, CalendarRootContext.get());
}

export function useCalendarGridHead(props: CalendarGridHeadStateProps) {
	return new CalendarGridHeadState(props, CalendarRootContext.get());
}

export function useCalendarGridRow(props: CalendarGridRowStateProps) {
	return new CalendarGridRowState(props, CalendarRootContext.get());
}

export function useCalendarHeadCell(props: CalendarHeadCellStateProps) {
	return new CalendarHeadCellState(props, CalendarRootContext.get());
}

export function useCalendarHeader(props: CalendarHeaderStateProps) {
	return new CalendarHeaderState(props, CalendarRootContext.get());
}

export function useCalendarHeading(props: CalendarHeadingStateProps) {
	return new CalendarHeadingState(props, CalendarRootContext.get());
}

export function useCalendarMonthSelect(props: CalendarMonthSelectStateProps) {
	return new CalendarMonthSelectState(props, CalendarRootContext.get());
}

export function useCalendarYearSelect(props: CalendarYearSelectStateProps) {
	return new CalendarYearSelectState(props, CalendarRootContext.get());
}
