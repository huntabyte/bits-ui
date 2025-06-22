import {
	type DateValue,
	getLocalTimeZone,
	isSameDay,
	isSameMonth,
	isToday,
} from "@internationalized/date";
import {
	attachRef,
	DOMContext,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { Context, watch } from "runed";
import { CalendarRootContext } from "../calendar/calendar.svelte.js";
import type { DateRange, Month } from "$lib/shared/index.js";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	RefAttachment,
	WithRefOpts,
} from "$lib/internal/types.js";
import { useId } from "$lib/internal/use-id.js";
import {
	getAriaDisabled,
	getAriaSelected,
	getDataDisabled,
	getDataSelected,
	getDataUnavailable,
} from "$lib/internal/attrs.js";
import { type Announcer, getAnnouncer } from "$lib/internal/date-time/announcer.js";
import { type Formatter, createFormatter } from "$lib/internal/date-time/formatter.js";
import {
	calendarAttrs,
	createMonths,
	getCalendarElementProps,
	getCalendarHeadingValue,
	getDefaultYears,
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
import {
	areAllDaysBetweenValid,
	getDateValueType,
	isAfter,
	isBefore,
	isBetweenInclusive,
	toDate,
} from "$lib/internal/date-time/utils.js";
import type { WeekStartsOn } from "$lib/shared/date/types.js";
import { onMount, untrack } from "svelte";

const RangeCalendarCellContext = new Context<RangeCalendarCellState>("RangeCalendar.Cell");

interface RangeCalendarRootStateOpts
	extends WithRefOpts,
		WritableBoxedValues<{
			value: DateRange;
			placeholder: DateValue;
			startValue: DateValue | undefined;
			endValue: DateValue | undefined;
		}>,
		ReadableBoxedValues<{
			preventDeselect: boolean;
			minValue: DateValue | undefined;
			maxValue: DateValue | undefined;
			disabled: boolean;
			pagedNavigation: boolean;
			weekStartsOn: WeekStartsOn | undefined;
			weekdayFormat: Intl.DateTimeFormatOptions["weekday"];
			isDateDisabled: (date: DateValue) => boolean;
			isDateUnavailable: (date: DateValue) => boolean;
			fixedWeeks: boolean;
			numberOfMonths: number;
			locale: string;
			calendarLabel: string;
			readonly: boolean;
			disableDaysOutsideMonth: boolean;
			excludeDisabled: boolean;
			minDays: number | undefined;
			maxDays: number | undefined;
			/**
			 * This is strictly used by the `DateRangePicker` component to close the popover when a date range
			 * is selected. It is not intended to be used by the user.
			 */
			onRangeSelect?: () => void;
			monthFormat: Intl.DateTimeFormatOptions["month"] | ((month: number) => string);
			yearFormat: Intl.DateTimeFormatOptions["year"] | ((year: number) => string);
		}> {
	defaultPlaceholder: DateValue;
}

export class RangeCalendarRootState {
	static create(opts: RangeCalendarRootStateOpts) {
		return CalendarRootContext.set(new RangeCalendarRootState(opts));
	}

	readonly opts: RangeCalendarRootStateOpts;
	readonly attachment: RefAttachment;
	readonly visibleMonths = $derived.by(() => this.months.map((month) => month.value));
	months: Month<DateValue>[] = $state([]);
	announcer: Announcer;
	formatter: Formatter;
	accessibleHeadingId = useId();
	focusedValue = $state<DateValue | undefined>(undefined);
	lastPressedDateValue: DateValue | undefined = undefined;
	domContext: DOMContext;

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

	readonly isStartInvalid = $derived.by(() => {
		if (!this.opts.startValue.current) return false;
		return (
			this.isDateUnavailable(this.opts.startValue.current) ||
			this.isDateDisabled(this.opts.startValue.current)
		);
	});

	readonly isEndInvalid = $derived.by(() => {
		if (!this.opts.endValue.current) return false;
		return (
			this.isDateUnavailable(this.opts.endValue.current) ||
			this.isDateDisabled(this.opts.endValue.current)
		);
	});

	readonly isInvalid = $derived.by(() => {
		if (this.isStartInvalid || this.isEndInvalid) return true;

		if (
			this.opts.endValue.current &&
			this.opts.startValue.current &&
			isBefore(this.opts.endValue.current, this.opts.startValue.current)
		)
			return true;

		return false;
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

	readonly fullCalendarLabel = $derived.by(
		() => `${this.opts.calendarLabel.current} ${this.headingValue}`
	);

	readonly highlightedRange = $derived.by(() => {
		if (this.opts.startValue.current && this.opts.endValue.current) return null;
		if (!this.opts.startValue.current || !this.focusedValue) return null;

		const isStartBeforeFocused = isBefore(this.opts.startValue.current, this.focusedValue);
		const start = isStartBeforeFocused ? this.opts.startValue.current : this.focusedValue;
		const end = isStartBeforeFocused ? this.focusedValue : this.opts.startValue.current;
		const range = { start, end };

		if (isSameDay(start.add({ days: 1 }), end) || isSameDay(start, end)) {
			return range;
		}

		const isValid = areAllDaysBetweenValid(
			start,
			end,
			this.isDateUnavailable,
			this.isDateDisabled
		);

		if (isValid) return range;
		return null;
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
		this.opts = opts;
		this.attachment = attachRef(opts.ref);
		this.domContext = new DOMContext(opts.ref);
		this.announcer = getAnnouncer(null);
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

		$effect.pre(() => {
			if (this.formatter.getLocale() === this.opts.locale.current) return;
			this.formatter.setLocale(this.opts.locale.current);
		});

		onMount(() => {
			this.announcer = getAnnouncer(this.domContext.getDocument());
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
		 * Synchronize the start and end values with the `value` in case
		 * it is updated externally.
		 */
		watch(
			() => this.opts.value.current,
			(value) => {
				if (value.start && value.end) {
					this.opts.startValue.current = value.start;
					this.opts.endValue.current = value.end;
				} else if (value.start) {
					this.opts.startValue.current = value.start;
					this.opts.endValue.current = undefined;
				} else if (value.start === undefined && value.end === undefined) {
					this.opts.startValue.current = undefined;
					this.opts.endValue.current = undefined;
				}
			}
		);

		/**
		 * Synchronize the placeholder value with the current start value
		 */
		watch(
			() => this.opts.value.current,
			(value) => {
				const startValue = value.start;
				if (startValue && this.opts.placeholder.current !== startValue) {
					this.opts.placeholder.current = startValue;
				}
			}
		);

		/**
		 * Check for disabled dates in the selected range when excludeDisabled is enabled
		 */
		watch(
			[
				() => this.opts.startValue.current,
				() => this.opts.endValue.current,
				() => this.opts.excludeDisabled.current,
			],
			([startValue, endValue, excludeDisabled]) => {
				if (!excludeDisabled || !startValue || !endValue) return;

				if (this.#hasDisabledDatesInRange(startValue, endValue)) {
					this.#setStartValue(undefined);
					this.#setEndValue(undefined);
					this.#announceEmpty();
				}
			}
		);

		watch(
			[() => this.opts.startValue.current, () => this.opts.endValue.current],
			([startValue, endValue]) => {
				if (
					this.opts.value.current &&
					this.opts.value.current.start === startValue &&
					this.opts.value.current.end === endValue
				) {
					return;
				}

				if (startValue && endValue) {
					this.#updateValue((prev) => {
						if (prev.start === startValue && prev.end === endValue) {
							return prev;
						}
						if (isBefore(endValue, startValue)) {
							const start = startValue;
							const end = endValue;
							this.#setStartValue(end);
							this.#setEndValue(start);
							if (!this.#isRangeValid(endValue, startValue)) {
								this.#setStartValue(startValue);
								this.#setEndValue(undefined);
								return { start: startValue, end: undefined };
							}
							return { start: endValue, end: startValue };
						} else {
							if (!this.#isRangeValid(startValue, endValue)) {
								this.#setStartValue(endValue);
								this.#setEndValue(undefined);
								return { start: endValue, end: undefined };
							}
							return {
								start: startValue,
								end: endValue,
							};
						}
					});
				} else if (
					this.opts.value.current &&
					this.opts.value.current.start &&
					this.opts.value.current.end
				) {
					this.opts.value.current.start = undefined;
					this.opts.value.current.end = undefined;
				}
			}
		);

		this.shiftFocus = this.shiftFocus.bind(this);
		this.handleCellClick = this.handleCellClick.bind(this);
		this.onkeydown = this.onkeydown.bind(this);
		this.nextPage = this.nextPage.bind(this);
		this.prevPage = this.prevPage.bind(this);
		this.nextYear = this.nextYear.bind(this);
		this.prevYear = this.prevYear.bind(this);
		this.setYear = this.setYear.bind(this);
		this.setMonth = this.setMonth.bind(this);
		this.isDateDisabled = this.isDateDisabled.bind(this);
		this.isDateUnavailable = this.isDateUnavailable.bind(this);
		this.isOutsideVisibleMonths = this.isOutsideVisibleMonths.bind(this);
		this.isSelected = this.isSelected.bind(this);

		useEnsureNonDisabledPlaceholder({
			placeholder: opts.placeholder,
			defaultPlaceholder: opts.defaultPlaceholder,
			isDateDisabled: opts.isDateDisabled,
			maxValue: opts.maxValue,
			minValue: opts.minValue,
			ref: opts.ref,
		});
	}

	#updateValue(cb: (value: DateRange) => DateRange) {
		const value = this.opts.value.current;
		const newValue = cb(value);
		this.opts.value.current = newValue;
		if (newValue.start && newValue.end) {
			this.opts.onRangeSelect?.current?.();
		}
	}

	#setStartValue(value: DateValue | undefined) {
		this.opts.startValue.current = value;
		// update the main value prop immediately for external consumers
		this.#updateValue((prev) => ({
			...prev,
			start: value,
		}));
	}

	#setEndValue(value: DateValue | undefined) {
		this.opts.endValue.current = value;
		// update the main value prop immediately for external consumers
		this.#updateValue((prev) => ({
			...prev,
			end: value,
		}));
	}

	setMonths = (months: Month<DateValue>[]) => {
		this.months = months;
	};

	isOutsideVisibleMonths(date: DateValue) {
		return !this.visibleMonths.some((month) => isSameMonth(date, month));
	}

	isDateDisabled(date: DateValue) {
		if (this.opts.isDateDisabled.current(date) || this.opts.disabled.current) return true;
		const minValue = this.opts.minValue.current;
		const maxValue = this.opts.maxValue.current;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isAfter(date, maxValue)) return true;
		return false;
	}

	isDateUnavailable(date: DateValue) {
		if (this.opts.isDateUnavailable.current(date)) return true;
		return false;
	}

	isSelectionStart(date: DateValue) {
		if (!this.opts.startValue.current) return false;
		return isSameDay(date, this.opts.startValue.current);
	}

	isSelectionEnd(date: DateValue) {
		if (!this.opts.endValue.current) return false;
		return isSameDay(date, this.opts.endValue.current);
	}

	isSelected(date: DateValue) {
		if (this.opts.startValue.current && isSameDay(this.opts.startValue.current, date))
			return true;
		if (this.opts.endValue.current && isSameDay(this.opts.endValue.current, date)) return true;
		if (this.opts.startValue.current && this.opts.endValue.current) {
			return isBetweenInclusive(
				date,
				this.opts.startValue.current,
				this.opts.endValue.current
			);
		}
		return false;
	}

	#isRangeValid(start: DateValue, end: DateValue): boolean {
		// ensure we always use the correct order for calculation
		const orderedStart = isBefore(end, start) ? end : start;
		const orderedEnd = isBefore(end, start) ? start : end;

		const startDate = orderedStart.toDate(getLocalTimeZone());
		const endDate = orderedEnd.toDate(getLocalTimeZone());

		const timeDifference = endDate.getTime() - startDate.getTime();
		const daysDifference = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
		const daysInRange = daysDifference + 1; // +1 to include both start and end days

		if (this.opts.minDays.current && daysInRange < this.opts.minDays.current) return false;
		if (this.opts.maxDays.current && daysInRange > this.opts.maxDays.current) return false;

		// check for disabled dates in range if excludeDisabled is enabled
		if (
			this.opts.excludeDisabled.current &&
			this.#hasDisabledDatesInRange(orderedStart, orderedEnd)
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
			months: this.months,
			numberOfMonths: this.opts.numberOfMonths.current,
		});
	}

	#announceEmpty() {
		this.announcer.announce("Selected date is now empty.", "polite");
	}

	#announceSelectedDate(date: DateValue) {
		this.announcer.announce(
			`Selected Date: ${this.formatter.selectedDate(date, false)}`,
			"polite"
		);
	}

	#announceSelectedRange(start: DateValue, end: DateValue) {
		this.announcer.announce(
			`Selected Dates: ${this.formatter.selectedDate(start, false)} to ${this.formatter.selectedDate(end, false)}`,
			"polite"
		);
	}

	handleCellClick(e: Event, date: DateValue) {
		if (this.isDateDisabled(date) || this.isDateUnavailable(date)) return;
		const prevLastPressedDate = this.lastPressedDateValue;
		this.lastPressedDateValue = date;

		if (this.opts.startValue.current && this.highlightedRange === null) {
			if (
				isSameDay(this.opts.startValue.current, date) &&
				!this.opts.preventDeselect.current &&
				!this.opts.endValue.current
			) {
				this.#setStartValue(undefined);
				this.opts.placeholder.current = date;
				this.#announceEmpty();
				return;
			} else if (!this.opts.endValue.current) {
				e.preventDefault();
				if (prevLastPressedDate && isSameDay(prevLastPressedDate, date)) {
					this.#setStartValue(date);
					this.#announceSelectedDate(date);
				}
			}
		}

		if (
			this.opts.startValue.current &&
			this.opts.endValue.current &&
			isSameDay(this.opts.endValue.current, date) &&
			!this.opts.preventDeselect.current
		) {
			this.#setStartValue(undefined);
			this.#setEndValue(undefined);
			this.opts.placeholder.current = date;
			this.#announceEmpty();
			return;
		}

		if (!this.opts.startValue.current) {
			this.#announceSelectedDate(date);
			this.#setStartValue(date);
		} else if (!this.opts.endValue.current) {
			// determine the start and end dates for validation
			const startDate = this.opts.startValue.current;
			const endDate = date;
			const orderedStart = isBefore(endDate, startDate) ? endDate : startDate;
			const orderedEnd = isBefore(endDate, startDate) ? startDate : endDate;

			// check if the range violates constraints
			if (!this.#isRangeValid(orderedStart, orderedEnd)) {
				// reset to just the clicked date
				this.#setStartValue(date);
				this.#setEndValue(undefined);
				this.#announceSelectedDate(date);
			} else {
				// ensure start and end are properly ordered
				if (isBefore(endDate, startDate)) {
					// backward selection - reorder the values
					this.#setStartValue(endDate);
					this.#setEndValue(startDate);
					this.#announceSelectedRange(endDate, startDate);
				} else {
					// forward selection - keep original order
					this.#setEndValue(date);
					this.#announceSelectedRange(this.opts.startValue.current, date);
				}
			}
		} else if (this.opts.endValue.current && this.opts.startValue.current) {
			this.#setEndValue(undefined);
			this.#announceSelectedDate(date);
			this.#setStartValue(date);
		}
	}

	onkeydown(event: BitsKeyboardEvent) {
		return handleCalendarKeydown({
			event,
			handleCellClick: this.handleCellClick,
			placeholderValue: this.opts.placeholder.current,
			shiftFocus: this.shiftFocus,
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

	getBitsAttr: (typeof calendarAttrs)["getAttr"] = (part) => {
		return calendarAttrs.getAttr(part, "range-calendar");
	};

	readonly snippetProps = $derived.by(() => ({
		months: this.months,
		weekdays: this.weekdays,
	}));

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
				...this.attachment,
			}) as const
	);

	#hasDisabledDatesInRange(start: DateValue, end: DateValue): boolean {
		for (
			let date = start;
			isBefore(date, end) || isSameDay(date, end);
			date = date.add({ days: 1 })
		) {
			if (this.isDateDisabled(date)) return true;
		}
		return false;
	}
}

interface RangeCalendarCellStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			date: DateValue;
			month: DateValue;
		}> {}

export class RangeCalendarCellState {
	static create(opts: RangeCalendarCellStateOpts) {
		return RangeCalendarCellContext.set(
			new RangeCalendarCellState(opts, CalendarRootContext.get() as RangeCalendarRootState)
		);
	}
	readonly opts: RangeCalendarCellStateOpts;
	readonly root: RangeCalendarRootState;
	readonly attachment: RefAttachment;
	readonly cellDate = $derived.by(() => toDate(this.opts.date.current));
	readonly isOutsideMonth = $derived.by(
		() => !isSameMonth(this.opts.date.current, this.opts.month.current)
	);
	readonly isDisabled = $derived.by(
		() =>
			this.root.isDateDisabled(this.opts.date.current) ||
			(this.isOutsideMonth && this.root.opts.disableDaysOutsideMonth.current)
	);
	readonly isUnavailable = $derived.by(() =>
		this.root.opts.isDateUnavailable.current(this.opts.date.current)
	);
	readonly isDateToday = $derived.by(() => isToday(this.opts.date.current, getLocalTimeZone()));

	readonly isOutsideVisibleMonths = $derived.by(() =>
		this.root.isOutsideVisibleMonths(this.opts.date.current)
	);
	readonly isFocusedDate = $derived.by(() =>
		isSameDay(this.opts.date.current, this.root.opts.placeholder.current)
	);
	readonly isSelectedDate = $derived.by(() => this.root.isSelected(this.opts.date.current));
	readonly isSelectionStart = $derived.by(() =>
		this.root.isSelectionStart(this.opts.date.current)
	);

	readonly isRangeStart = $derived.by(() => this.root.isSelectionStart(this.opts.date.current));

	readonly isRangeEnd = $derived.by(() => {
		if (!this.root.opts.endValue.current)
			return this.root.isSelectionStart(this.opts.date.current);
		return this.root.isSelectionEnd(this.opts.date.current);
	});

	readonly isRangeMiddle = $derived.by(() => this.isSelectionMiddle);

	readonly isSelectionMiddle = $derived.by(() => {
		return this.isSelectedDate && !this.isSelectionStart && !this.isSelectionEnd;
	});

	readonly isSelectionEnd = $derived.by(() => this.root.isSelectionEnd(this.opts.date.current));
	readonly isHighlighted = $derived.by(() =>
		this.root.highlightedRange
			? isBetweenInclusive(
					this.opts.date.current,
					this.root.highlightedRange.start,
					this.root.highlightedRange.end
				)
			: false
	);

	readonly labelText = $derived.by(() =>
		this.root.formatter.custom(this.cellDate, {
			weekday: "long",
			month: "long",
			day: "numeric",
			year: "numeric",
		})
	);

	constructor(opts: RangeCalendarCellStateOpts, root: RangeCalendarRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(opts.ref);
	}

	readonly snippetProps = $derived.by(() => ({
		disabled: this.isDisabled,
		unavailable: this.isUnavailable,
		selected: this.isSelectedDate,
	}));

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
				...this.attachment,
			}) as const
	);
}

interface RangeCalendarDayStateOpts extends WithRefOpts {}

export class RangeCalendarDayState {
	static create(opts: RangeCalendarDayStateOpts) {
		return new RangeCalendarDayState(opts, RangeCalendarCellContext.get());
	}

	readonly opts: RangeCalendarDayStateOpts;
	readonly cell: RangeCalendarCellState;
	readonly attachment: RefAttachment;

	constructor(opts: RangeCalendarDayStateOpts, cell: RangeCalendarCellState) {
		this.opts = opts;
		this.cell = cell;
		this.attachment = attachRef(opts.ref);

		this.onclick = this.onclick.bind(this);
		this.onmouseenter = this.onmouseenter.bind(this);
		this.onfocusin = this.onfocusin.bind(this);
	}

	readonly #tabindex = $derived.by(() =>
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

	onmouseenter(_: BitsMouseEvent) {
		if (this.cell.isDisabled) return;
		this.cell.root.focusedValue = this.cell.opts.date.current;
	}

	onfocusin(_: BitsFocusEvent) {
		if (this.cell.isDisabled) return;
		this.cell.root.focusedValue = this.cell.opts.date.current;
	}

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
				...this.attachment,
			}) as const
	);
}
