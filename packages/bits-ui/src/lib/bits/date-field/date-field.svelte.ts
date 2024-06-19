import type { ReadableBoxedValues, WritableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { useRefById } from "$lib/internal/useRefById.svelte.js";
import { getAnnouncer, type Announcer } from "$lib/shared/date/announcer.js";
import {
	areAllSegmentsFilled,
	createContent,
	getValueFromSegments,
	inferGranularity,
	initializeSegmentValues,
	initSegmentStates,
	isAcceptableSegmentKey,
	isDateAndTimeSegmentObj,
	isDateSegmentPart,
	removeDescriptionElement,
} from "$lib/shared/date/field/helpers.js";
import {
	type DateAndTimeSegmentObj,
	type DateSegmentObj,
	type DateSegmentPart,
	type DayPeriod,
	type SegmentValueObj,
	type TimeSegmentObj,
	type TimeSegmentPart,
} from "$lib/shared/date/field/types.js";
import { createFormatter, type Formatter } from "$lib/shared/date/formatter.js";
import { getDaysInMonth, isBefore, toDate } from "$lib/shared/date/utils.js";
import type { Updater } from "svelte/store";
import type { DateFieldRootPropsWithoutHTML as RootComponentProps } from "./types.js";
import type { DateValue } from "@internationalized/date";
import type { WritableBox } from "svelte-toolbelt";
import { getAriaDisabled, getAriaReadonly, getDataDisabled } from "$lib/internal/attrs.js";
import { isBrowser, isNumberString } from "$lib/internal/is.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	handleSegmentNavigation,
	isSegmentNavigationKey,
	moveToNextSegment,
} from "$lib/shared/date/field.js";

type DateFieldRootStateProps = WritableBoxedValues<{
	value: DateValue | undefined;
	placeholder: DateValue;
}> &
	ReadableBoxedValues<
		Required<
			Omit<
				RootComponentProps,
				"value" | "placeholder" | "onValueChange" | "onPlaceholderChange"
			>
		> & {
			descriptionId: string;
		}
	>;

class DateFieldRootState {
	value: DateFieldRootStateProps["value"];
	placeholder: WritableBox<DateValue>;
	isDateUnavailable: DateFieldRootStateProps["isDateUnavailable"];
	minValue: DateFieldRootStateProps["minValue"];
	maxValue: DateFieldRootStateProps["maxValue"];
	disabled: DateFieldRootStateProps["disabled"];
	readonly: DateFieldRootStateProps["readonly"];
	granularity: DateFieldRootStateProps["granularity"];
	readonlySegments: DateFieldRootStateProps["readonlySegments"];
	hourCycle: DateFieldRootStateProps["hourCycle"];
	locale: DateFieldRootStateProps["locale"];
	hideTimeZone: DateFieldRootStateProps["hideTimeZone"];
	name: DateFieldRootStateProps["name"];
	required: DateFieldRootStateProps["required"];
	descriptionId: DateFieldRootStateProps["descriptionId"];
	formatter: Formatter;
	initialSegments: SegmentValueObj;
	segmentValues = $state() as SegmentValueObj;
	announcer: Announcer;
	updatingDayPeriod = $state<DayPeriod | null>(null);
	readonlySegmentsSet = $derived.by(() => new Set(this.readonlySegments.value));
	segmentStates = initSegmentStates();
	fieldNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	states = initSegmentStates();

	constructor(props: DateFieldRootStateProps) {
		this.value = props.value;
		this.placeholder = props.placeholder;
		this.isDateUnavailable = props.isDateUnavailable;
		this.minValue = props.minValue;
		this.maxValue = props.maxValue;
		this.disabled = props.disabled;
		this.readonly = props.readonly;
		this.granularity = props.granularity;
		this.readonlySegments = props.readonlySegments;
		this.hourCycle = props.hourCycle;
		this.locale = props.locale;
		this.hideTimeZone = props.hideTimeZone;
		this.name = props.name;
		this.required = props.required;
		this.descriptionId = props.descriptionId;
		this.formatter = createFormatter(this.locale.value);
		this.initialSegments = initializeSegmentValues(this.inferredGranularity);
		this.segmentValues = this.initialSegments;

		$effect(() => {
			this.announcer = getAnnouncer();
			return () => {
				removeDescriptionElement(this.descriptionId.value);
			};
		});
		this.announcer = getAnnouncer();
	}

	setValue(value: DateValue | undefined) {
		this.value.value = value;
	}

	isInvalid = $derived.by(() => {
		const value = this.value.value;
		if (!value) return false;
		if (this.isDateUnavailable.value(value)) return true;
		const minValue = this.minValue.value;
		if (minValue && isBefore(value, minValue)) return true;
		const maxValue = this.maxValue.value;
		if (maxValue && isBefore(maxValue, value)) return true;
		return false;
	});

	inferredGranularity = $derived.by(() => {
		const granularity = this.granularity.value;
		if (granularity) return granularity;
		return inferGranularity(this.placeholder.value, this.granularity.value);
	});

	allSegmentContent = $derived.by(() =>
		createContent({
			segmentValues: this.segmentValues,
			formatter: this.formatter,
			locale: this.locale.value,
			granularity: this.inferredGranularity,
			dateRef: this.placeholder.value,
			hideTimeZone: this.hideTimeZone.value,
			hourCycle: this.hourCycle.value,
		})
	);

	segmentContents = $derived.by(() => this.allSegmentContent.arr);

	defaultSegmentAttrs = {
		role: "spinbutton",
		contenteditable: true,
		tabindex: 0,
		spellcheck: false,
		inputmode: "numeric",
		autocorrect: "off",
		eterkeyhint: "next",
		style: {
			caretColor: "transparent",
		},
	};

	updateSegment<T extends keyof DateAndTimeSegmentObj>(
		part: T,
		cb: T extends DateSegmentPart
			? Updater<DateSegmentObj[T]>
			: T extends TimeSegmentPart
				? Updater<TimeSegmentObj[T]>
				: Updater<DateAndTimeSegmentObj[T]>
	) {
		const disabled = this.disabled.value;
		const readonly = this.readonly.value;
		const readonlySegmentsSet = this.readonlySegmentsSet;
		if (disabled || readonly || readonlySegmentsSet.has(part)) return;

		const prev = this.segmentValues;
		let newSegmentValues: SegmentValueObj = prev;

		const dateRef = this.placeholder.value;
		if (isDateAndTimeSegmentObj(prev)) {
			const pVal = prev[part];
			const castCb = cb as Updater<DateAndTimeSegmentObj[T]>;
			if (part === "month") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["month"];
				if (next !== null && prev.day !== null) {
					const date = dateRef.set({ month: next });
					const daysInMonth = getDaysInMonth(toDate(date));
					if (prev.day > daysInMonth) {
						prev.day = daysInMonth;
					}
				}
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "dayPeriod") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["dayPeriod"];
				this.updatingDayPeriod = next;
				const date = this.placeholder.value;
				if ("hour" in date) {
					const trueHour = date.hour;

					if (next === "AM") {
						if (trueHour >= 12) {
							prev.hour = trueHour - 12;
						}
					} else if (next === "PM") {
						if (trueHour < 12) {
							prev.hour = trueHour + 12;
						}
					}
				}
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "hour") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["hour"];
				if (next !== null && prev.dayPeriod !== null) {
					const dayPeriod = this.formatter.dayPeriod(toDate(dateRef.set({ hour: next })));
					if (dayPeriod === "AM" || dayPeriod === "PM") {
						prev.dayPeriod = dayPeriod;
					}
				}
				newSegmentValues = { ...prev, [part]: next };
			}

			const next = castCb(pVal);

			newSegmentValues = { ...prev, [part]: next };
		} else if (isDateSegmentPart(part)) {
			const pVal = prev[part];
			const castCb = cb as Updater<DateSegmentObj[DateSegmentPart]>;
			const next = castCb(pVal);
			if (part === "month" && next !== null && prev.day !== null) {
				const date = dateRef.set({ month: next });
				const daysInMonth = getDaysInMonth(toDate(date));
				if (prev.day > daysInMonth) {
					prev.day = daysInMonth;
				}
			}
			newSegmentValues = { ...prev, [part]: next };
		}
		this.segmentValues = newSegmentValues;
		if (areAllSegmentsFilled(newSegmentValues, this.fieldNode)) {
			this.setValue(
				getValueFromSegments({
					segmentObj: newSegmentValues,
					fieldNode: this.fieldNode,
					dateRef: this.placeholder.value,
				})
			);
			this.updatingDayPeriod = null;
		} else {
			this.setValue(undefined);
			this.segmentValues = newSegmentValues;
		}
	}

	handleSegmentClick = (e: MouseEvent) => {
		if (this.disabled.value) {
			e.preventDefault();
			return;
		}
	};

	// handleSegmentKeydown = (e: KeyboardEvent, part: AnyExceptLiteral) => {
	// 	if (e.key !== kbd.TAB) e.preventDefault()
	// 	if (this.disabled.value) return;

	// }
}

type DateFieldInputStateProps = WithRefProps;

class DateFieldInputState {
	#id: DateFieldInputStateProps["id"];
	#ref: DateFieldInputStateProps["ref"];
	root: DateFieldRootState;

	constructor(props: DateFieldInputStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.root.fieldNode = node;
			},
		});
	}

	#ariaDescribedBy = $derived.by(() => {
		if (!isBrowser) return undefined;
		const doesDescriptionExist = document.getElementById(this.root.descriptionId.value);
		if (!doesDescriptionExist) return undefined;
		return this.root.descriptionId.value;
	});

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				role: "group",
				"aria-labelledby": this.root.labelNode?.id ?? undefined,
				"aria-describedby": this.#ariaDescribedBy,
				"aria-disabled": getAriaDisabled(this.root.disabled.value),
				"aria-readonly": getAriaReadonly(this.root.readonly.value),
				"data-invalid": this.root.isInvalid ? "" : undefined,
				"data-disabled": getDataDisabled(this.root.disabled.value),
			}) as const
	);
}

type DateFieldDaySegmentStateProps = WithRefProps;

class DateFieldDaySegmentState {
	#id: DateFieldDaySegmentStateProps["id"];
	#ref: DateFieldDaySegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldDaySegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#announcer = this.#root.announcer;
		this.#updateSegment = this.#root.updateSegment;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key !== kbd.TAB) e.preventDefault();
		if (this.#root.disabled.value) return;
		if (!isAcceptableSegmentKey(e.key)) return;

		const segmentMonthValue = this.#root.segmentValues.month;
		const placeholder = this.#root.placeholder.value;

		const daysInMonth = segmentMonthValue
			? getDaysInMonth(placeholder.set({ month: segmentMonthValue }))
			: getDaysInMonth(placeholder);

		if (e.key === kbd.ARROW_UP) {
			this.#updateSegment("day", (prev) => {
				if (prev === null) {
					const next = placeholder.day;
					this.#announcer.announce(next);
					return next;
				}
				const next = placeholder.set({ day: prev }).cycle("day", 1).day;
				this.#announcer.announce(next);
				return next;
			});
			return;
		}
		if (e.key === kbd.ARROW_DOWN) {
			this.#updateSegment("day", (prev) => {
				if (prev === null) {
					const next = placeholder.day;
					this.#announcer.announce(next);
					return next;
				}
				const next = placeholder.set({ day: prev }).cycle("day", -1).day;
				this.#announcer.announce(next);
				return next;
			});
			return;
		}

		const fieldNode = this.#root.fieldNode;

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			this.#updateSegment("day", (prev) => {
				const max = daysInMonth;
				const maxStart = Math.floor(max / 10);
				const states = this.#root.states;

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (states.day.hasLeftFocus) {
					prev = null;
					states.day.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						states.day.lastKeyZero = true;
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (states.day.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}
					states.day.lastKeyZero = false;

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return num;
				}

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */

				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit (0-3 in most months), and if so, we're
					 * going to move to the next segment.
					 */
					if (num > maxStart || total > max) {
						moveToNext = true;
					}
					this.#announcer.announce(num);
					return num;
				}
				moveToNext = true;
				this.#announcer.announce(total);
				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, fieldNode);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			this.#updateSegment("day", (prev) => {
				if (prev === null) return null;
				const str = prev.toString();
				if (str.length === 1) return null;
				return parseInt(str.slice(0, -1));
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, fieldNode);
		}
	};

	#onfocusout = () => {
		this.#root.states.day.hasLeftFocus = true;
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const isEmpty = segmentValues.day === null;
		const placeholder = this.#root.placeholder.value;
		const date = segmentValues.day ? placeholder.set({ day: segmentValues.day }) : placeholder;

		const valueNow = date.day;
		const valueMin = 1;
		const valueMax = getDaysInMonth(toDate(date));
		const valueText = isEmpty ? "Empty" : `${valueNow}`;

		return {
			...this.#root.defaultSegmentAttrs,
			id: this.#id.value,
			"aria-label": "day,",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
		};
	});
}

type DateFieldMonthSegmentStateProps = WithRefProps;

class DateFieldMonthSegmentState {
	#id: DateFieldMonthSegmentStateProps["id"];
	#ref: DateFieldMonthSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldMonthSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;
		this.#announcer = this.#root.announcer;
		this.#updateSegment = this.#root.updateSegment;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	getAnnouncement = (month: number) => {
		return `${month} - ${this.#root.formatter.fullMonth(toDate(this.#root.placeholder.value.set({ month })))}`;
	};

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key !== kbd.TAB) e.preventDefault();
		if (this.#root.disabled.value) return;
		if (!isAcceptableSegmentKey(e.key)) return;

		const placeholder = this.#root.placeholder.value;

		const max = 12;

		this.#root.states.month.hasTouched = true;

		if (e.key === kbd.ARROW_UP) {
			this.#updateSegment("month", (prev) => {
				if (prev === null) {
					const next = placeholder.month;
					this.#announcer.announce(this.getAnnouncement(next));
					return next;
				}
				const next = placeholder.set({ month: prev }).cycle("month", 1).month;
				this.#announcer.announce(this.getAnnouncement(next));
				return next;
			});
			return;
		}

		if (e.key === kbd.ARROW_DOWN) {
			this.#updateSegment("month", (prev) => {
				if (prev === null) {
					const next = placeholder.month;
					this.#announcer.announce(this.getAnnouncement(next));
					return next;
				}
				const next = placeholder.set({ month: prev }).cycle("month", -1).month;
				this.#announcer.announce(this.getAnnouncement(next));
				return next;
			});
			return;
		}

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;

			this.#updateSegment("month", (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.month.hasLeftFocus) {
					prev = null;
					this.#root.states.month.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						this.#root.states.month.lastKeyZero = true;
						this.#announcer.announce(null);
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (1), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (this.#root.states.month.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}
					this.#root.states.month.lastKeyZero = false;

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					this.#announcer.announce(num);
					return num;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit (0-3 in most months), and if so, we're
					 * going to move to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}
					this.#announcer.announce(num);
					return num;
				}
				moveToNext = true;
				this.#announcer.announce(total);
				return total;
			});

			if (moveToNext) {
				moveToNextSegment(e, this.#root.fieldNode);
			}
		}

		if (e.key === kbd.BACKSPACE) {
			this.#root.states.month.hasLeftFocus = false;
			this.#updateSegment("month", (prev) => {
				if (prev === null) {
					this.#announcer.announce(null);
					return null;
				}

				const str = prev.toString();
				if (str.length === 1) {
					this.#announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				this.#announcer.announce(this.getAnnouncement(next));
				return next;
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.fieldNode);
		}
	};

	#onfocusout = () => {
		this.#root.states.month.hasLeftFocus = true;
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const placeholder = this.#root.placeholder.value;
		const isEmpty = segmentValues.month === null;
		const date = segmentValues.month
			? placeholder.set({ month: segmentValues.month })
			: placeholder;
		const valueNow = date.month;
		const valueMin = 1;
		const valueMax = 12;
		const valueText = isEmpty
			? "Empty"
			: `${valueNow} - ${this.#root.formatter.fullMonth(toDate(date))}`;

		return {
			...this.#root.defaultSegmentAttrs,
			id: this.#id.value,
			"aria-label": "month, ",
			contenteditable: true,
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
		} as const;
	});
}
