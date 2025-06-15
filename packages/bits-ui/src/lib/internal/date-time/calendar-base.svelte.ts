import { type DateValue } from "@internationalized/date";
import { onMount, untrack } from "svelte";
import {
	attachRef,
	DOMContext,
	type ReadableBoxedValues,
	type WritableBoxedValues,
} from "svelte-toolbelt";
import { watch } from "runed";
import type { RangeCalendarRootState } from "../../bits/range-calendar/range-calendar.svelte.js";
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
			isUnitDisabled: DateMatcher;
			isUnitUnavailable: DateMatcher;
			locale: string;
			calendarLabel: string;
			type: "single" | "multiple";
			readonly: boolean;
			initialFocus: boolean;
			/**
			 * This is strictly used by the `DatePicker` component to close the popover when a date
			 * is selected. It is not intended to be used by the user.
			 */
			onDateSelect?: () => void;
		}> {
	defaultPlaceholder: DateValue;
}

export abstract class CalendarBaseRootState<
	T extends CalendarBaseRootStateOpts = CalendarBaseRootStateOpts,
> {
	readonly opts: T;
	abstract readonly formatter: Formatter;
	readonly accessibleHeadingId = useId();
	readonly domContext: DOMContext;
	announcer: Announcer;

	constructor(opts: T) {
		this.opts = opts;
		this.domContext = new DOMContext(opts.ref);
		this.announcer = getAnnouncer(null);

		this.nextPage = this.nextPage.bind(this);
		this.prevPage = this.prevPage.bind(this);
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

		this.#setupInitialFocusEffect();
		this.#setupAccessibleHeadingEffect();
		this.#setupFormatterEffect();

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
	}

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

	/**
	 * Navigates to the previous page of the calendar.
	 */
	abstract prevPage(): void;

	abstract isNextButtonDisabled: boolean;
	abstract isPrevButtonDisabled: boolean;

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

	readonly fullCalendarLabel = $derived.by(() => {
		return `${this.opts.calendarLabel.current} ${this.headingValue}`;
	});

	isUnitDisabled(date: DateValue) {
		if (this.opts.isUnitDisabled.current(date) || this.opts.disabled.current) return true;
		const minValue = this.opts.minValue.current;
		const maxValue = this.opts.maxValue.current;
		if (minValue && isBefore(date, minValue)) return true;
		if (maxValue && isBefore(maxValue, date)) return true;
		return false;
	}

	abstract isUnitSelected(date: DateValue): boolean;

	abstract shiftFocus(node: HTMLElement, add: number): void;

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

	abstract handleSingleUpdate(
		prev: DateValue | undefined,
		date: DateValue
	): DateValue | undefined;

	onkeydown(event: BitsKeyboardEvent) {
		handleCalendarKeydown({
			event,
			handleCellClick: this.handleCellClick,
			shiftFocus: this.shiftFocus,
			placeholderValue: this.opts.placeholder.current,
		});
	}

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

export interface CalendarBaseCellStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			date: DateValue;
		}> {}

export abstract class CalendarBaseCellState<
	T extends CalendarBaseCellStateOpts = CalendarBaseCellStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
	readonly opts: T;
	readonly root: U;
	readonly cellDate = $derived.by(() => toDate(this.opts.date.current));
	readonly isDisabled = $derived.by(() => this.root.isUnitDisabled(this.opts.date.current));
	readonly isUnavailable = $derived.by(() =>
		this.root.opts.isUnitUnavailable.current(this.opts.date.current)
	);
	readonly isSelectedDate = $derived.by(() => this.root.isUnitSelected(this.opts.date.current));
	abstract readonly labelText: string;

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

export interface CalendarBaseUnitStateOpts extends WithRefOpts {}

export class CalendarBaseUnitState<
	T extends CalendarBaseUnitStateOpts = CalendarBaseUnitStateOpts,
	U extends CalendarBaseCellState = CalendarBaseCellState,
> {
	readonly opts: T;
	readonly cell: U;

	constructor(opts: T, cell: U) {
		this.opts = opts;
		this.cell = cell;
		this.onclick = this.onclick.bind(this);
	}

	onclick(e: BitsMouseEvent) {
		if (this.cell.isDisabled) return;
		this.cell.root.handleCellClick(e, this.cell.opts.date.current);
	}
}

export interface CalendarBaseNextButtonStateOpts extends WithRefOpts {}

export class CalendarBaseNextButtonState<
	T extends CalendarBaseNextButtonStateOpts = CalendarBaseNextButtonStateOpts,
	U extends CalendarBaseRootState = CalendarBaseRootState,
> {
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
