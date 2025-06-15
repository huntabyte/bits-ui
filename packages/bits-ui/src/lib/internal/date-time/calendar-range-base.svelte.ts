import { type DateValue } from "@internationalized/date";
import {
	attachRef,
	DOMContext,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { watch } from "runed";
import type { DateRange } from "$lib/shared/index.js";
import type {
	BitsFocusEvent,
	BitsKeyboardEvent,
	BitsMouseEvent,
	WithRefOpts,
} from "$lib/internal/types.js";
import { useId } from "$lib/internal/use-id.js";
import { type Announcer, getAnnouncer } from "$lib/internal/date-time/announcer.js";
import { type Formatter } from "$lib/internal/date-time/formatter.js";
import {
	calendarAttrs,
	CELL_UNIT_MAP,
	getCalendarElementProps,
	handleCalendarKeydown,
	SAME_FN_MAP,
	type CalendarUnit,
	type SameFn,
} from "$lib/internal/date-time/calendar-helpers.svelte.js";
import {
	areAllDaysBetweenValid,
	isAfter,
	isBefore,
	isBetweenInclusive,
	toDate,
} from "$lib/internal/date-time/utils.js";
import { onMount } from "svelte";

export interface RangeCalendarBaseRootStateOpts
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
			isUnitDisabled: (date: DateValue) => boolean;
			isUnitUnavailable: (date: DateValue) => boolean;
			locale: string;
			calendarLabel: string;
			readonly: boolean;
			excludeDisabled: boolean;
			minUnits: number | undefined;
			maxUnits: number | undefined;
			/**
			 * This is strictly used by the `DateRangePicker` component to close the popover when a date range
			 * is selected. It is not intended to be used by the user.
			 */
			onRangeSelect?: () => void;
		}> {
	defaultPlaceholder: DateValue;
}

export abstract class RangeCalendarBaseRootState<
	T extends RangeCalendarBaseRootStateOpts = RangeCalendarBaseRootStateOpts,
> {
	readonly opts: T;
	announcer: Announcer;
	abstract readonly formatter: Formatter;
	readonly accessibleHeadingId = useId();
	focusedValue = $state<DateValue | undefined>(undefined);
	lastPressedUnitValue: DateValue | undefined = undefined;
	readonly domContext: DOMContext;

	readonly isSame: SameFn;
	readonly cellUnit: "months" | "days" | "years";

	readonly isStartInvalid = $derived.by(() => {
		if (!this.opts.startValue.current) return false;
		return (
			this.isUnitUnavailable(this.opts.startValue.current) ||
			this.isUnitDisabled(this.opts.startValue.current)
		);
	});

	readonly isEndInvalid = $derived.by(() => {
		if (!this.opts.endValue.current) return false;
		return (
			this.isUnitUnavailable(this.opts.endValue.current) ||
			this.isUnitDisabled(this.opts.endValue.current)
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

	abstract isNextButtonDisabled: boolean;
	abstract isPrevButtonDisabled: boolean;

	abstract readonly headingValue: string;

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

		if (this.isSame(start.add({ [this.cellUnit]: 1 }), end) || this.isSame(start, end)) {
			return range;
		}

		const isValid = areAllDaysBetweenValid(
			start,
			end,
			this.isUnitUnavailable,
			this.isUnitDisabled
		);

		if (isValid) return range;
		return null;
	});

	constructor(opts: T, unit: CalendarUnit) {
		this.opts = opts;
		this.domContext = new DOMContext(opts.ref);
		this.announcer = getAnnouncer(null);

		this.isSame = SAME_FN_MAP[unit];
		this.cellUnit = CELL_UNIT_MAP[unit];

		$effect(() => {
			if (this.formatter.getLocale() === this.opts.locale.current) return;
			this.formatter.setLocale(this.opts.locale.current);
		});

		onMount(() => {
			this.announcer = getAnnouncer(this.domContext.getDocument());
		});

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

				if (this.hasDisabledDatesInRange(startValue, endValue)) {
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
							if (!this.isRangeValid(endValue, startValue)) {
								this.#setStartValue(startValue);
								this.#setEndValue(undefined);
								return { start: startValue, end: undefined };
							}
							return { start: endValue, end: startValue };
						} else {
							if (!this.isRangeValid(startValue, endValue)) {
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
		this.isUnitDisabled = this.isUnitDisabled.bind(this);
		this.isUnitUnavailable = this.isUnitUnavailable.bind(this);
		this.isSelected = this.isSelected.bind(this);
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

	isUnitDisabled(date: DateValue) {
		if (this.opts.isUnitDisabled.current(date) || this.opts.disabled.current) return true;
		const minValue = this.opts.minValue.current;
		const maxValue = this.opts.maxValue.current;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isAfter(date, maxValue)) return true;
		return false;
	}

	isUnitUnavailable(date: DateValue) {
		if (this.opts.isUnitUnavailable.current(date)) return true;
		return false;
	}

	isSelectionStart(date: DateValue) {
		if (!this.opts.startValue.current) return false;
		return this.isSame(date, this.opts.startValue.current);
	}

	isSelectionEnd(date: DateValue) {
		if (!this.opts.endValue.current) return false;
		return this.isSame(date, this.opts.endValue.current);
	}

	isSelected(date: DateValue) {
		if (this.opts.startValue.current && this.isSame(this.opts.startValue.current, date))
			return true;
		if (this.opts.endValue.current && this.isSame(this.opts.endValue.current, date))
			return true;
		if (this.opts.startValue.current && this.opts.endValue.current) {
			return isBetweenInclusive(
				date,
				this.opts.startValue.current,
				this.opts.endValue.current
			);
		}
		return false;
	}

	abstract isRangeValid(start: DateValue, end: DateValue): boolean;

	abstract shiftFocus(node: HTMLElement, add: number): void;

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
		if (this.isUnitDisabled(date) || this.isUnitUnavailable(date)) return;
		const prevLastPressedDate = this.lastPressedUnitValue;
		this.lastPressedUnitValue = date;

		if (this.opts.startValue.current && this.highlightedRange === null) {
			if (
				this.isSame(this.opts.startValue.current, date) &&
				!this.opts.preventDeselect.current &&
				!this.opts.endValue.current
			) {
				this.#setStartValue(undefined);
				this.opts.placeholder.current = date;
				this.#announceEmpty();
				return;
			} else if (!this.opts.endValue.current) {
				e.preventDefault();
				if (prevLastPressedDate && this.isSame(prevLastPressedDate, date)) {
					this.#setStartValue(date);
					this.#announceSelectedDate(date);
				}
			}
		}

		if (
			this.opts.startValue.current &&
			this.opts.endValue.current &&
			this.isSame(this.opts.endValue.current, date) &&
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
			if (!this.isRangeValid(orderedStart, orderedEnd)) {
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
	abstract nextPage(): void;

	/**
	 * Navigates to the previous page of the calendar.
	 */
	abstract prevPage(): void;

	getBitsAttr: (typeof calendarAttrs)["getAttr"] = (part) => {
		return calendarAttrs.getAttr(part, "range-calendar");
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

	hasDisabledDatesInRange(start: DateValue, end: DateValue): boolean {
		for (
			let date = start;
			isBefore(date, end) || this.isSame(date, end);
			date = date.add({ [this.cellUnit]: 1 })
		) {
			if (this.isUnitDisabled(date)) return true;
		}
		return false;
	}
}

export interface RangeCalendarBaseCellStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			date: DateValue;
			month: DateValue;
		}> {}

export abstract class RangeCalendarBaseCellState<
	T extends RangeCalendarBaseCellStateOpts = RangeCalendarBaseCellStateOpts,
	U extends RangeCalendarBaseRootState = RangeCalendarBaseRootState,
> {
	readonly opts: T;
	readonly root: U;
	readonly cellDate = $derived.by(() => toDate(this.opts.date.current));
	readonly isDisabled = $derived.by(() => this.root.isUnitDisabled(this.opts.date.current));
	readonly isUnavailable = $derived.by(() =>
		this.root.opts.isUnitUnavailable.current(this.opts.date.current)
	);
	readonly isFocusedUnit = $derived.by(() =>
		this.root.isSame(this.opts.date.current, this.root.opts.placeholder.current)
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
}

export interface RangeCalendarUnitStateOpts extends WithRefOpts {}

export abstract class RangeCalendarBaseUnitState<
	T extends RangeCalendarUnitStateOpts = RangeCalendarUnitStateOpts,
	U extends RangeCalendarBaseCellState = RangeCalendarBaseCellState,
> {
	readonly opts: T;
	readonly cell: U;

	constructor(opts: T, cell: U) {
		this.opts = opts;
		this.cell = cell;

		this.onclick = this.onclick.bind(this);
		this.onmouseenter = this.onmouseenter.bind(this);
		this.onfocusin = this.onfocusin.bind(this);
	}

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
}
