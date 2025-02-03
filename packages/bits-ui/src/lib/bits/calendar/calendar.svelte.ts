import {
	type DateValue,
	getLocalTimeZone,
	isSameDay,
	isSameMonth,
	isToday,
} from "@internationalized/date";
import { DEV } from "esm-env";
import { untrack } from "svelte";
import { useRefById } from "svelte-toolbelt";
import { Context } from "runed";
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
	type CalendarParts,
	createAccessibleHeading,
	createMonths,
	getCalendarElementProps,
	getCalendarHeadingValue,
	getIsNextButtonDisabled,
	getIsPrevButtonDisabled,
	getWeekdays,
	handleCalendarKeydown,
	handleCalendarNextPage,
	handleCalendarPrevPage,
	shiftCalendarFocus,
	useMonthViewOptionsSync,
	useMonthViewPlaceholderSync,
} from "$lib/internal/date-time/calendar-helpers.svelte.js";
import { isBefore, toDate } from "$lib/internal/date-time/utils.js";

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
			weekStartsOn: 0 | 1 | 2 | 3 | 4 | 5 | 6;
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
			/**
			 * This is strictly used by the `DatePicker` component to close the popover when a date
			 * is selected. It is not intended to be used by the user.
			 */
			onDateSelect?: () => void;
		}>
>;

export class CalendarRootState {
	months: Month<DateValue>[] = $state([]);
	visibleMonths = $derived.by(() => this.months.map((month) => month.value));
	announcer: Announcer;
	formatter: Formatter;
	accessibleHeadingId = useId();

	constructor(readonly opts: CalendarRootStateProps) {
		this.announcer = getAnnouncer();
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

		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});

		this.months = createMonths({
			dateObj: this.opts.placeholder.current,
			weekStartsOn: this.opts.weekStartsOn.current,
			locale: this.opts.locale.current,
			fixedWeeks: this.opts.fixedWeeks.current,
			numberOfMonths: this.opts.numberOfMonths.current,
		});

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

		$effect(() => {
			if (!this.opts.ref.current) return;
			const removeHeading = createAccessibleHeading({
				calendarNode: this.opts.ref.current,
				label: this.fullCalendarLabel,
				accessibleHeadingId: this.accessibleHeadingId,
			});
			return removeHeading;
		});

		$effect(() => {
			if (this.formatter.getLocale() === this.opts.locale.current) return;
			this.formatter.setLocale(this.opts.locale.current);
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
		$effect(() => {
			this.opts.value.current;
			untrack(() => {
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
			});
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
		} else {
			return isSameDay(value, date);
		}
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

	handleCellClick(_: Event, date: DateValue) {
		const readonly = this.opts.readonly.current;
		if (readonly) return;
		const isDateDisabled = this.opts.isDateDisabled.current;
		const isDateUnavailable = this.opts.isDateUnavailable.current;
		if (isDateDisabled?.(date) || isDateUnavailable?.(date)) return;

		const prev = this.opts.value.current;
		const multiple = this.opts.type.current === "multiple";
		if (multiple) {
			if (Array.isArray(prev) || prev === undefined) {
				this.opts.value.current = this.handleMultipleUpdate(prev, date);
			}
		} else {
			if (!Array.isArray(prev)) {
				const next = this.handleSingleUpdate(prev, date);
				if (!next) {
					this.announcer.announce("Selected date is now empty.", "polite", 5000);
				} else {
					this.announcer.announce(
						`Selected Date: ${this.formatter.selectedDate(next, false)}`,
						"polite"
					);
				}
				this.opts.value.current = next;
				if (next !== undefined) {
					this.opts.onDateSelect?.current?.();
				}
			}
		}
	}

	handleMultipleUpdate(prev: DateValue[] | undefined, date: DateValue) {
		if (!prev) return [date];
		if (!Array.isArray(prev)) {
			if (DEV) throw new Error("Invalid value for multiple prop.");
			return;
		}
		const index = prev.findIndex((d) => isSameDay(d, date));
		const preventDeselect = this.opts.preventDeselect.current;
		if (index === -1) {
			return [...prev, date];
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

	getBitsAttr(part: CalendarParts) {
		return `data-bits-calendar-${part}`;
	}

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
			}) as const
	);
}

export type CalendarHeadingStateProps = WithRefProps;
export class CalendarHeadingState {
	id: CalendarHeadingStateProps["id"];
	ref: CalendarHeadingStateProps["ref"];
	headingValue = $derived.by(() => this.root.headingValue);

	constructor(
		props: CalendarHeadingStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.id = props.id;
		this.ref = props.ref;

		useRefById({
			id: this.id,
			ref: this.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.id.current,
				"aria-hidden": getAriaHidden(true),
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("heading")]: "",
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

	constructor(
		readonly opts: CalendarCellStateProps,
		readonly root: CalendarRootState
	) {
		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
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
			}) as const
	);
}

type CalendarDayStateProps = WithRefProps;

class CalendarDayState {
	constructor(
		readonly opts: CalendarDayStateProps,
		readonly cell: CalendarCellState
	) {
		this.onclick = this.onclick.bind(this);

		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
	}

	#tabindex = $derived.by(() =>
		this.cell.isFocusedDate
			? 0
			: (this.cell.isOutsideMonth && this.cell.root.opts.disableDaysOutsideMonth.current) ||
				  this.cell.isDisabled
				? undefined
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
			}) as const
	);
}

export type CalendarNextButtonStateProps = WithRefProps;

export class CalendarNextButtonState {
	isDisabled = $derived.by(() => this.root.isNextButtonDisabled);

	constructor(
		readonly opts: CalendarNextButtonStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.onclick = this.onclick.bind(this);

		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
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
			}) as const
	);
}

export type CalendarPrevButtonStateProps = WithRefProps;

export class CalendarPrevButtonState {
	isDisabled = $derived.by(() => this.root.isPrevButtonDisabled);

	constructor(
		readonly opts: CalendarPrevButtonStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		this.onclick = this.onclick.bind(this);

		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
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
			}) as const
	);
}

export type CalendarGridStateProps = WithRefProps;

export class CalendarGridState {
	constructor(
		readonly opts: CalendarGridStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
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
			}) as const
	);
}

export type CalendarGridBodyStateProps = WithRefProps;

export class CalendarGridBodyState {
	constructor(
		readonly opts: CalendarGridBodyStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("grid-body")]: "",
			}) as const
	);
}

export type CalendarGridHeadStateProps = WithRefProps;

export class CalendarGridHeadState {
	constructor(
		readonly opts: CalendarGridHeadStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("grid-head")]: "",
			}) as const
	);
}

export type CalendarGridRowStateProps = WithRefProps;

export class CalendarGridRowState {
	constructor(
		readonly opts: CalendarGridRowStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("grid-row")]: "",
			}) as const
	);
}

export type CalendarHeadCellStateProps = WithRefProps;

export class CalendarHeadCellState {
	constructor(
		readonly opts: CalendarHeadCellStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("head-cell")]: "",
			}) as const
	);
}

export type CalendarHeaderStateProps = WithRefProps;

export class CalendarHeaderState {
	constructor(
		readonly opts: CalendarHeaderStateProps,
		readonly root: CalendarRootState | RangeCalendarRootState
	) {
		useRefById({
			id: this.opts.id,
			ref: this.opts.ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				"data-disabled": getDataDisabled(this.root.opts.disabled.current),
				"data-readonly": getDataReadonly(this.root.opts.readonly.current),
				[this.root.getBitsAttr("header")]: "",
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
