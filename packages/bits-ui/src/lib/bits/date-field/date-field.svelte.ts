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
	isFirstSegment,
	removeDescriptionElement,
	setDescription,
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
import type { DateValue } from "@internationalized/date";
import type { WritableBox } from "svelte-toolbelt";
import {
	getAriaDisabled,
	getAriaHidden,
	getAriaInvalid,
	getAriaReadonly,
	getDataDisabled,
	getDataInvalid,
	getDataReadonly,
} from "$lib/internal/attrs.js";
import { isBrowser, isNumberString } from "$lib/internal/is.js";
import { kbd } from "$lib/internal/kbd.js";
import {
	getFirstSegment,
	handleSegmentNavigation,
	isSegmentNavigationKey,
	moveToNextSegment,
	moveToPrevSegment,
} from "$lib/shared/date/field.js";
import type { SegmentPart } from "$lib/shared/index.js";
import { DATE_SEGMENT_PARTS, TIME_SEGMENT_PARTS } from "$lib/shared/date/field/parts.js";
import { untrack } from "svelte";
import { createContext } from "$lib/internal/createContext.js";
import { useId } from "$lib/internal/useId.svelte.js";
import type { Granularity, Matcher } from "$lib/shared/date/types.js";

type DateFieldRootStateProps = WritableBoxedValues<{
	value: DateValue | undefined;
	placeholder: DateValue;
}> &
	ReadableBoxedValues<{
		readonlySegments: SegmentPart[];
		isDateUnavailable: Matcher | undefined;
		minValue: DateValue | undefined;
		maxValue: DateValue | undefined;
		disabled: boolean;
		readonly: boolean;
		granularity: Granularity | undefined;
		hourCycle: 12 | 24 | undefined;
		locale: string;
		hideTimeZone: boolean;
		name: string;
		required: boolean;
	}>;

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
	descriptionId = useId();
	formatter: Formatter;
	initialSegments: SegmentValueObj;
	segmentValues = $state() as SegmentValueObj;
	announcer: Announcer;
	readonlySegmentsSet = $derived.by(() => new Set(this.readonlySegments.value));
	segmentStates = initSegmentStates();
	fieldNode = $state<HTMLElement | null>(null);
	labelNode = $state<HTMLElement | null>(null);
	descriptionNode = $state<HTMLElement | null>(null);
	validationNode = $state<HTMLElement | null>(null);
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
		this.formatter = createFormatter(this.locale.value);
		this.initialSegments = initializeSegmentValues(this.inferredGranularity);
		this.segmentValues = this.initialSegments;

		$effect(() => {
			untrack(() => {
				this.initialSegments = initializeSegmentValues(this.inferredGranularity);
			});
		});

		$effect(() => {
			this.announcer = getAnnouncer();
			return () => {
				removeDescriptionElement(this.descriptionId);
			};
		});
		this.announcer = getAnnouncer();

		$effect(() => {
			if (this.formatter.getLocale() === this.locale.value) return;
			this.formatter.setLocale(this.locale.value);
		});

		$effect(() => {
			if (this.value.value) {
				const descriptionId = untrack(() => this.descriptionId);
				setDescription(descriptionId, this.formatter, this.value.value);
			}
			const placeholder = untrack(() => this.placeholder.value);
			if (this.value.value && placeholder !== this.value.value) {
				untrack(() => {
					if (this.value.value) {
						this.placeholder.value = this.value.value;
					}
				});
			}
		});

		if (this.value.value) {
			this.syncSegmentValues(this.value.value);
		}

		$effect(() => {
			this.locale.value;
			if (this.value.value) {
				this.syncSegmentValues(this.value.value);
			}
		});
	}

	setValue(value: DateValue | undefined) {
		this.value.value = value;
	}

	syncSegmentValues(value: DateValue) {
		const dateValues = DATE_SEGMENT_PARTS.map((part) => {
			const partValue = value[part];

			if (part === "month") {
				if (partValue < 10) {
					return [part, `0${partValue}`];
				}
			}

			if (part === "day") {
				if (this.states.day.updating) {
					return [part, this.states.day.updating];
				}
				return [part, String(partValue)];
			}

			if (part === "year") {
				if (this.states.year.updating) {
					return [part, this.states.year.updating];
				}
				const valueDigits = String(partValue).length;
				const diff = 4 - valueDigits;
				if (diff > 0) {
					return [part, `${"0".repeat(diff)}${partValue}`];
				}
			}

			return [part, String(value[part])];
		});
		if ("hour" in value) {
			const timeValues = TIME_SEGMENT_PARTS.map((part) => {
				if (part === "dayPeriod") {
					if (this.states.dayPeriod.updating) {
						return [part, this.states.dayPeriod.updating];
					} else {
						return [part, this.formatter.dayPeriod(toDate(value))];
					}
				}
				return [part, String(value[part])];
			});

			const mergedSegmentValues = [...dateValues, ...timeValues];
			this.segmentValues = Object.fromEntries(mergedSegmentValues);
			this.states.dayPeriod.updating = null;
			return;
		}

		this.segmentValues = Object.fromEntries(dateValues);
	}

	isInvalid = $derived.by(() => {
		const value = this.value.value;
		if (!value) return false;
		if (this.isDateUnavailable.value?.(value)) return true;
		const minValue = this.minValue.value;
		if (minValue && isBefore(value, minValue)) return true;
		const maxValue = this.maxValue.value;
		if (maxValue && isBefore(maxValue, value)) return true;
		return false;
	});

	inferredGranularity = $derived.by(() => {
		const granularity = this.granularity.value;
		if (granularity) return granularity;
		const inferred = inferGranularity(this.placeholder.value, this.granularity.value);
		return inferred;
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

	sharedSegmentAttrs = {
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

	getLabelledBy = (segmentId: string) => {
		return `${segmentId} ${this.labelNode?.id ?? ""}`;
	};

	updateSegment = <T extends keyof DateAndTimeSegmentObj>(
		part: T,
		cb: T extends DateSegmentPart
			? Updater<DateSegmentObj[T]>
			: T extends TimeSegmentPart
				? Updater<TimeSegmentObj[T]>
				: Updater<DateAndTimeSegmentObj[T]>
	) => {
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
					const date = dateRef.set({ month: parseInt(next) });
					const daysInMonth = getDaysInMonth(toDate(date));
					const prevDay = parseInt(prev.day);
					if (prevDay > daysInMonth) {
						prev.day = `${daysInMonth}`;
					}
				}
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "dayPeriod") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["dayPeriod"];
				this.states.dayPeriod.updating = next;
				const date = this.value.value;
				if (date && "hour" in date) {
					const trueHour = date.hour;
					if (next === "AM") {
						if (trueHour >= 12) {
							prev.hour = `${trueHour - 12}`;
						}
					} else if (next === "PM") {
						if (trueHour < 12) {
							prev.hour = `${trueHour + 12}`;
						}
					}
				}
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "hour") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["hour"];
				if (next !== null && prev.dayPeriod !== null) {
					const dayPeriod = this.formatter.dayPeriod(
						toDate(dateRef.set({ hour: parseInt(next) }))
					);
					if (dayPeriod === "AM" || dayPeriod === "PM") {
						prev.dayPeriod = dayPeriod;
					}
				}
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "year") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["year"];
				this.states.year.updating = next;
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "day") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["day"];
				this.states.day.updating = next;
				newSegmentValues = { ...prev, [part]: next };
			} else if (part === "month") {
				const next = castCb(pVal) as DateAndTimeSegmentObj["month"];
				this.states.month.updating = next;
				newSegmentValues = { ...prev, [part]: next };
			} else {
				const next = castCb(pVal);
				newSegmentValues = { ...prev, [part]: next };
			}
		} else if (isDateSegmentPart(part)) {
			const pVal = prev[part];
			const castCb = cb as Updater<DateSegmentObj[DateSegmentPart]>;
			const next = castCb(pVal);
			if (part === "month" && next !== null && prev.day !== null) {
				const date = dateRef.set({ month: parseInt(next) });
				const daysInMonth = getDaysInMonth(toDate(date));
				if (parseInt(prev.day) > daysInMonth) {
					prev.day = `${daysInMonth}`;
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
			this.states.year.updating = null;
			this.states.month.updating = null;
			this.states.dayPeriod.updating = null;
			this.states.day.updating = null;
		} else {
			this.setValue(undefined);
			this.segmentValues = newSegmentValues;
		}
	};

	handleSegmentClick = (e: MouseEvent) => {
		if (this.disabled.value) {
			e.preventDefault();
			return;
		}
	};

	getBaseSegmentAttrs = (part: SegmentPart, segmentId: string) => {
		const inReadonlySegments = this.readonlySegmentsSet.has(part);
		const defaultAttrs = {
			"aria-invalid": getAriaInvalid(this.isInvalid),
			"aria-disabled": getAriaDisabled(this.disabled.value),
			"aria-readonly": getAriaReadonly(this.readonly.value || inReadonlySegments),
			"data-invalid": getDataInvalid(this.isInvalid),
			"data-disabled": getDataDisabled(this.disabled.value),
			"data-segment": `${part}`,
		};

		if (part === "literal") return defaultAttrs;

		const descriptionId = this.descriptionNode?.id;
		const hasDescription = isFirstSegment(segmentId, this.fieldNode) && descriptionId;
		const validationId = this.validationNode?.id;

		const describedBy = hasDescription
			? `${descriptionId} ${this.isInvalid && validationId ? validationId : ""}`
			: undefined;

		const contenteditable =
			this.readonly.value || inReadonlySegments || this.disabled.value ? false : undefined;

		return {
			...defaultAttrs,
			"aria-labelledby": this.getLabelledBy(segmentId),
			contenteditable,
			"aria-describedby": describedBy,
			tabindex: this.disabled.value ? undefined : 0,
		};
	};

	createInput(props: DateFieldInputStateProps) {
		return new DateFieldInputState(props, this);
	}

	createLabel(props: DateFieldLabelStateProps) {
		return new DateFieldLabelState(props, this);
	}

	createHiddenInput() {
		return new DateFieldHiddenInputState(this);
	}

	createSegment(part: SegmentPart, props: WithRefProps) {
		return segmentPartToInstance({
			part,
			segmentProps: props,
			root: this,
		});
	}
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
		const doesDescriptionExist = document.getElementById(this.root.descriptionId);
		if (!doesDescriptionExist) return undefined;
		return this.root.descriptionId;
	});

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				role: "group",
				"aria-labelledby": this.root.labelNode?.id ?? undefined,
				"aria-describedby": this.#ariaDescribedBy,
				"aria-disabled": getAriaDisabled(this.root.disabled.value),
				"data-invalid": this.root.isInvalid ? "" : undefined,
				"data-disabled": getDataDisabled(this.root.disabled.value),
			}) as const
	);
}

class DateFieldHiddenInputState {
	#root: DateFieldRootState;
	shouldRender = $derived.by(() => this.#root.name.value !== "");
	isoValue = $derived.by(() => (this.#root.value.value ? this.#root.value.value.toString() : ""));

	constructor(root: DateFieldRootState) {
		this.#root = root;
	}

	props = $derived.by(() => {
		return {
			name: this.#root.name.value,
			value: this.isoValue,
			required: this.#root.required.value,
		};
	});
}

type DateFieldLabelStateProps = WithRefProps;

class DateFieldLabelState {
	#id: DateFieldLabelStateProps["id"];
	#ref: DateFieldLabelStateProps["ref"];
	#root: DateFieldRootState;

	constructor(props: DateFieldLabelStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
			onRefChange: (node) => {
				this.#root.labelNode = node;
			},
		});
	}

	#onclick = () => {
		if (this.#root.disabled.value) return;
		const firstSegment = getFirstSegment(this.#root.fieldNode);
		if (!firstSegment) return;
		firstSegment.focus();
	};

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				"data-invalid": getDataInvalid(this.#root.isInvalid),
				"data-disabled": getDataDisabled(this.#root.disabled.value),
				onclick: this.#onclick,
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
			? getDaysInMonth(placeholder.set({ month: parseInt(segmentMonthValue) }))
			: getDaysInMonth(placeholder);

		if (isArrowUp(e.key)) {
			this.#updateSegment("day", (prev) => {
				if (prev === null) {
					const next = placeholder.day;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder.set({ day: parseInt(prev) }).cycle("day", 1).day;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}
		if (isArrowDown(e.key)) {
			this.#updateSegment("day", (prev) => {
				if (prev === null) {
					const next = placeholder.day;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder.set({ day: parseInt(prev) }).cycle("day", -1).day;
				this.#announcer.announce(next);
				return `${next}`;
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
				const numIsZero = num === 0;

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.day.hasLeftFocus) {
					prev = null;
					this.#root.states.day.hasLeftFocus = false;
				}

				/**
				 * We are starting over in the segment if prev is null, which could
				 * happen in one of two scenarios:
				 * - the user has left the segment and then comes back to it
				 * - the segment was empty and the user begins typing a number
				 */
				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (numIsZero) {
						this.#root.states.day.lastKeyZero = true;
						this.#announcer.announce("0");
						return "0";
					}

					///////////////////////////

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (this.#root.states.day.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					this.#root.states.day.lastKeyZero = false;

					/**
					 * If we're moving to the next segment and the number is less than
					 * two digits, we want to announce the number and return it with a
					 * leading zero to follow the placeholder format of `MM/DD/YYYY`.
					 */
					if (moveToNext && String(num).length === 1) {
						this.#announcer.announce(num);
						return `0${num}`;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return `${num}`;
				}

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				const total = parseInt(prev.toString() + num.toString());

				if (this.#root.states.day.lastKeyZero) {
					/**
					 * If the new number is not 0, then we reset the lastKeyZero state and
					 * move to the next segment, returning the new number with a leading 0.
					 */
					if (num !== 0) {
						moveToNext = true;
						this.#root.states.day.lastKeyZero = false;
						return `0${num}`;
					}

					/**
					 * If the new number is 0, then we simply return the previous value, since
					 * they didn't actually type a new number.
					 */
					return prev;
				}

				/**
				 * If the total is greater than the max day value possible for this month, then
				 * we want to move to the next segment, trimming the first digit from the total,
				 * replacing it with a 0.
				 */
				if (total > max) {
					moveToNext = true;
					return `0${num}`;
				}

				/**
				 * If the total has two digits and is less than or equal to the max day value,
				 * we will move to the next segment and return the total as the segment value.
				 */
				moveToNext = true;
				return `${total}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, fieldNode);
			}
		}

		if (isBackspace(e.key)) {
			let moveToPrev = false;
			this.#updateSegment("day", (prev) => {
				this.#root.states.day.hasLeftFocus = false;
				if (prev === null) {
					moveToPrev = true;
					return null;
				}
				if (prev.length === 2 && prev.startsWith("0")) {
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) return null;
				return str.slice(0, -1);
			});

			if (moveToPrev) {
				moveToPrevSegment(e, fieldNode);
			}
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
		const date = segmentValues.day
			? placeholder.set({ day: parseInt(segmentValues.day) })
			: placeholder;

		const valueNow = date.day;
		const valueMin = 1;
		const valueMax = getDaysInMonth(toDate(date));
		const valueText = isEmpty ? "Empty" : `${valueNow}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "day,",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("day", this.#id.value),
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

		if (isArrowUp(e.key)) {
			this.#updateSegment("month", (prev) => {
				if (prev === null) {
					const next = placeholder.month;
					this.#announcer.announce(this.getAnnouncement(next));

					if (String(next).length === 1) {
						return `0${next}`;
					}

					return `${next}`;
				}
				const next = placeholder.set({ month: parseInt(prev) }).cycle("month", 1).month;
				this.#announcer.announce(this.getAnnouncement(next));
				if (String(next).length === 1) {
					return `0${next}`;
				}
				return `${next}`;
			});
			return;
		}

		if (isArrowDown(e.key)) {
			this.#updateSegment("month", (prev) => {
				if (prev === null) {
					const next = placeholder.month;
					this.#announcer.announce(this.getAnnouncement(next));
					if (String(next).length === 1) {
						return `0${next}`;
					}
					return `${next}`;
				}
				const next = placeholder.set({ month: parseInt(prev) }).cycle("month", -1).month;
				this.#announcer.announce(this.getAnnouncement(next));
				if (String(next).length === 1) {
					return `0${next}`;
				}
				return `${next}`;
			});
			return;
		}

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;

			this.#updateSegment("month", (prev) => {
				const maxStart = Math.floor(max / 10);
				const numIsZero = num === 0;

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.month.hasLeftFocus) {
					prev = null;
					this.#root.states.month.hasLeftFocus = false;
				}

				/**
				 * We are starting over in the segment if prev is null, which could
				 * happen in one of two scenarios:
				 * - the user has left the segment and then comes back to it
				 * - the segment was empty and the user begins typing a number
				 */
				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (numIsZero) {
						this.#root.states.month.lastKeyZero = true;
						this.#announcer.announce("0");
						return "0";
					}

					///////////////////////////

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit (0-3 in most cases), then
					 * we want to move to the next segment, since it's not possible
					 * to continue typing a valid number in this segment.
					 */
					if (this.#root.states.month.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					this.#root.states.month.lastKeyZero = false;

					/**
					 * If we're moving to the next segment and the number is less than
					 * two digits, we want to announce the number and return it with a
					 * leading zero to follow the placeholder format of `MM/DD/YYYY`.
					 */
					if (moveToNext && String(num).length === 1) {
						this.#announcer.announce(num);
						return `0${num}`;
					}

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return `${num}`;
				}

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value for this
				 * month, then we will reset the segment as if the user had pressed the
				 * backspace key and then typed the number.
				 */
				const total = parseInt(prev.toString() + num.toString());

				if (this.#root.states.month.lastKeyZero) {
					/**
					 * If the new number is not 0, then we reset the lastKeyZero state and
					 * move to the next segment, returning the new number with a leading 0.
					 */
					if (num !== 0) {
						moveToNext = true;
						this.#root.states.month.lastKeyZero = false;
						return `0${num}`;
					}

					/**
					 * If the new number is 0, then we simply return the previous value, since
					 * they didn't actually type a new number.
					 */
					return prev;
				}

				/**
				 * If the total is greater than the max day value possible for this month, then
				 * we want to move to the next segment, trimming the first digit from the total,
				 * replacing it with a 0.
				 */
				if (total > max) {
					moveToNext = true;
					return `0${num}`;
				}

				/**
				 * If the total has two digits and is less than or equal to the max day value,
				 * we will move to the next segment and return the total as the segment value.
				 */
				moveToNext = true;
				return `${total}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, this.#root.fieldNode);
			}
		}

		if (isBackspace(e.key)) {
			this.#root.states.month.hasLeftFocus = false;
			let moveToPrev = false;
			this.#updateSegment("month", (prev) => {
				if (prev === null) {
					this.#announcer.announce(null);
					moveToPrev = true;
					return null;
				}

				if (prev.length === 2 && prev.startsWith("0")) {
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
				return `${next}`;
			});

			if (moveToPrev) {
				moveToPrevSegment(e, this.#root.fieldNode);
			}
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
			? placeholder.set({ month: parseInt(segmentValues.month) })
			: placeholder;
		const valueNow = date.month;
		const valueMin = 1;
		const valueMax = 12;
		const valueText = isEmpty
			? "Empty"
			: `${valueNow} - ${this.#root.formatter.fullMonth(toDate(date))}`;

		return {
			...this.#root.sharedSegmentAttrs,
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
			...this.#root.getBaseSegmentAttrs("month", this.#id.value),
		} as const;
	});
}

type DateFieldYearSegmentStateProps = WithRefProps;

class DateFieldYearSegmentState {
	#id: DateFieldYearSegmentStateProps["id"];
	#ref: DateFieldYearSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldYearSegmentStateProps, root: DateFieldRootState) {
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
		if (this.#root.disabled.value || !isAcceptableSegmentKey(e.key)) return;

		this.#root.states.year.hasTouched = true;
		const placeholder = this.#root.placeholder.value;

		if (isArrowUp(e.key)) {
			this.#updateSegment("year", (prev) => {
				if (prev === null) {
					const next = placeholder.year;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder.set({ year: parseInt(prev) }).cycle("year", 1).year;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}
		if (isArrowDown(e.key)) {
			this.#updateSegment("year", (prev) => {
				if (prev === null) {
					const next = placeholder.year;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder.set({ year: parseInt(prev) }).cycle("year", -1).year;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isNumberString(e.key)) {
			let moveToNext = false;
			const num = parseInt(e.key);
			this.#updateSegment("year", (prev) => {
				if (this.#root.states.year.hasLeftFocus) {
					prev = null;
					this.#root.states.year.hasLeftFocus = false;
				}

				if (prev === null) {
					this.#announcer.announce(num);
					return `000${num}`;
				}

				const str = prev.toString() + num.toString();
				const mergedInt = parseInt(str);
				const mergedIntDigits = String(mergedInt).length;

				if (mergedIntDigits < 4) {
					this.#announcer.announce(mergedInt);
					return prependYearZeros(mergedInt);
				}

				this.#announcer.announce(mergedInt);
				moveToNext = true;
				return `${mergedInt}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, this.#root.fieldNode);
			}
		}

		if (isBackspace(e.key)) {
			let moveToPrev = false;
			this.#updateSegment("year", (prev) => {
				this.#root.states.year.hasLeftFocus = false;
				if (prev === null) {
					moveToPrev = true;
					this.#announcer.announce(null);
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					this.#announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				this.#announcer.announce(next);
				return `${next}`;
			});

			if (moveToPrev) {
				moveToPrevSegment(e, this.#root.fieldNode);
			}
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.fieldNode);
		}
	};

	#onfocusout = () => {
		this.#root.states.year.hasLeftFocus = true;
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const placeholder = this.#root.placeholder.value;
		const isEmpty = segmentValues.year === null;
		const date = segmentValues.year
			? placeholder.set({ year: parseInt(segmentValues.year) })
			: placeholder;
		const valueMin = 1;
		const valueMax = 9999;
		const valueNow = date.year;
		const valueText = isEmpty ? "Empty" : `${valueNow}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "year, ",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onclick: this.#root.handleSegmentClick,
			onfocusout: this.#onfocusout,
			...this.#root.getBaseSegmentAttrs("year", this.#id.value),
		};
	});
}

type DateFieldHourSegmentStateProps = WithRefProps;

class DateFieldHourSegmentState {
	#id: DateFieldHourSegmentStateProps["id"];
	#ref: DateFieldHourSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldHourSegmentStateProps, root: DateFieldRootState) {
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
		const placeholder = this.#root.placeholder.value;
		if (
			this.#root.disabled.value ||
			!isAcceptableSegmentKey(e.key) ||
			!("hour" in placeholder)
		) {
			return;
		}

		this.#root.states.hour.hasTouched = true;

		const hourCycle = this.#root.hourCycle.value;

		if (isArrowUp(e.key)) {
			this.#updateSegment("hour", (prev) => {
				if (prev === null) {
					const next = placeholder.cycle("hour", 1, { hourCycle }).hour;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder
					.set({ hour: parseInt(prev) })
					.cycle("hour", 1, { hourCycle }).hour;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isArrowDown(e.key)) {
			this.#updateSegment("hour", (prev) => {
				if (prev === null) {
					const next = placeholder.cycle("hour", -1, { hourCycle }).hour;
					this.#announcer.announce(next);
					return `${next}`;
				}
				const next = placeholder
					.set({ hour: parseInt(prev) })
					.cycle("hour", -1, { hourCycle }).hour;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			const max = 24;
			const maxStart = Math.floor(max / 10);
			let moveToNext = false;
			this.#updateSegment("hour", (prev) => {
				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.hour.hasLeftFocus) {
					prev = null;
					this.#root.states.hour.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						this.#root.states.hour.lastKeyZero = true;
						this.#announcer.announce(null);
						return null;
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (this.#root.states.hour.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					this.#root.states.hour.lastKeyZero = false;
					this.#announcer.announce(num);
					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return `${num}`;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value, then we will
				 * reset the segment as if the user had pressed the backspace key and then
				 * typed a number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit, and if so, we're moving to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}
					this.#announcer.announce(num);
					return `${num}`;
				}
				moveToNext = true;
				this.#announcer.announce(total);
				return `${total}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, this.#root.fieldNode);
			}
		}

		if (isBackspace(e.key)) {
			this.#root.states.hour.hasLeftFocus = false;
			let moveToPrev = false;
			this.#updateSegment("hour", (prev) => {
				if (prev === null) {
					this.#announcer.announce(null);
					moveToPrev = true;
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					this.#announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				this.#announcer.announce(next);
				return `${next}`;
			});

			if (moveToPrev) {
				moveToPrevSegment(e, this.#root.fieldNode);
			}
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.fieldNode);
		}
	};

	#onfocusout = () => {
		this.#root.states.hour.hasLeftFocus = true;
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const hourCycle = this.#root.hourCycle.value;
		const placeholder = this.#root.placeholder.value;
		if (!("hour" in segmentValues) || !("hour" in placeholder)) return {};
		const isEmpty = segmentValues.hour === null;
		const date = segmentValues.hour
			? placeholder.set({ hour: parseInt(segmentValues.hour) })
			: placeholder;
		const valueMin = hourCycle === 12 ? 1 : 0;
		const valueMax = hourCycle === 12 ? 12 : 23;
		const valueNow = date.hour;
		const valueText = isEmpty ? "Empty" : `${valueNow} ${segmentValues.dayPeriod ?? ""}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "hour, ",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("hour", this.#id.value),
		};
	});
}

type DateFieldMinuteSegmentStateProps = WithRefProps;

class DateFieldMinuteSegmentState {
	#id: DateFieldMinuteSegmentStateProps["id"];
	#ref: DateFieldMinuteSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldMinuteSegmentStateProps, root: DateFieldRootState) {
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
		const placeholder = this.#root.placeholder.value;
		if (
			this.#root.disabled.value ||
			!isAcceptableSegmentKey(e.key) ||
			!("minute" in placeholder)
		)
			return;

		this.#root.states.minute.hasTouched = true;

		const min = 0;
		const max = 59;

		if (isArrowUp(e.key)) {
			this.#updateSegment("minute", (prev) => {
				if (prev === null) {
					this.#announcer.announce(min);
					return `${min}`;
				}
				const next = placeholder.set({ minute: parseInt(prev) }).cycle("minute", 1).minute;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isArrowDown(e.key)) {
			this.#updateSegment("minute", (prev) => {
				if (prev === null) {
					this.#announcer.announce(max);
					return `${max}`;
				}
				const next = placeholder.set({ minute: parseInt(prev) }).cycle("minute", -1).minute;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			this.#updateSegment("minute", (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.minute.hasLeftFocus) {
					prev = null;
					this.#root.states.minute.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						this.#root.states.minute.lastKeyZero = true;
						this.#announcer.announce(null);
						return "0";
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (this.#root.states.minute.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}

					this.#root.states.minute.lastKeyZero = false;
					this.#announcer.announce(num);
					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					return `${num}`;
				}

				const digits = prev.length;
				const total = parseInt(prev + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value, then we will
				 * reset the segment as if the user had pressed the backspace key and then
				 * typed a number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit, and if so, we're moving to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}
					this.#announcer.announce(num);
					return `${num}`;
				}
				moveToNext = true;
				this.#announcer.announce(total);
				return `${total}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, this.#root.fieldNode);
			}
			return;
		}

		if (isBackspace(e.key)) {
			this.#root.states.minute.hasLeftFocus = false;
			let moveToPrev = false;
			this.#updateSegment("minute", (prev) => {
				if (prev === null) {
					moveToPrev = true;
					this.#announcer.announce("Empty");
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					this.#announcer.announce("Empty");
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				this.#announcer.announce(next);
				return `${next}`;
			});

			if (moveToPrev) {
				moveToPrevSegment(e, this.#root.fieldNode);
			}
			return;
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.fieldNode);
		}
	};

	#onfocusout = () => {
		this.#root.states.minute.hasLeftFocus = true;
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const placeholder = this.#root.placeholder.value;

		if (!("minute" in segmentValues) || !("minute" in placeholder)) return {};
		const isEmpty = segmentValues.minute === null;
		const date = segmentValues.minute
			? placeholder.set({ minute: parseInt(segmentValues.minute) })
			: placeholder;
		const valueNow = date.minute;
		const valueMin = 0;
		const valueMax = 59;
		const valueText = isEmpty ? "Empty" : `${valueNow}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "minute, ",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("minute", this.#id.value),
		};
	});
}

type DateFieldSecondSegmentStateProps = WithRefProps;

class DateFieldSecondSegmentState {
	#id: DateFieldSecondSegmentStateProps["id"];
	#ref: DateFieldSecondSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldSecondSegmentStateProps, root: DateFieldRootState) {
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
		if (!isAcceptableSegmentKey(e.key) || this.#root.disabled.value) return;

		this.#root.states.second.hasTouched = true;

		const min = 0;
		const max = 59;

		const placeholder = this.#root.placeholder.value;

		if (!("second" in placeholder)) return;

		if (isArrowUp(e.key)) {
			this.#updateSegment("second", (prev) => {
				if (prev === null) {
					this.#announcer.announce(min);
					return `${min}`;
				}
				const next = placeholder.set({ second: parseInt(prev) }).cycle("second", 1).second;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isArrowDown(e.key)) {
			this.#updateSegment("second", (prev) => {
				if (prev === null) {
					this.#announcer.announce(max);
					return `${max}`;
				}
				const next = placeholder.set({ second: parseInt(prev) }).cycle("second", -1).second;
				this.#announcer.announce(next);
				return `${next}`;
			});
			return;
		}

		if (isNumberString(e.key)) {
			const num = parseInt(e.key);
			let moveToNext = false;
			this.#updateSegment("second", (prev) => {
				const maxStart = Math.floor(max / 10);

				/**
				 * If the user has left the segment, we want to reset the
				 * `prev` value so that we can start the segment over again
				 * when the user types a number.
				 */
				if (this.#root.states.second.hasLeftFocus) {
					prev = null;
					this.#root.states.second.hasLeftFocus = false;
				}

				if (prev === null) {
					/**
					 * If the user types a 0 as the first number, we want
					 * to keep track of that so that when they type the next
					 * number, we can move to the next segment.
					 */
					if (num === 0) {
						this.#root.states.second.lastKeyZero = true;
						this.#announcer.announce(null);
						return "0";
					}

					/**
					 * If the last key was a 0, or if the first number is
					 * greater than the max start digit, then we want to move
					 * to the next segment, since it's not possible to continue
					 * typing a valid number in this segment.
					 */
					if (this.#root.states.second.lastKeyZero || num > maxStart) {
						moveToNext = true;
					}
					this.#root.states.second.lastKeyZero = false;

					/**
					 * If none of the above conditions are met, then we can just
					 * return the number as the segment value and continue typing
					 * in this segment.
					 */
					this.#announcer.announce(num);
					return `${num}`;
				}

				const digits = prev.toString().length;
				const total = parseInt(prev.toString() + num.toString());

				/**
				 * If the number of digits is 2, or if the total with the existing digit
				 * and the pressed digit is greater than the maximum value, then we will
				 * reset the segment as if the user had pressed the backspace key and then
				 * typed a number.
				 */
				if (digits === 2 || total > max) {
					/**
					 * As we're doing elsewhere, we're checking if the number is greater
					 * than the max start digit, and if so, we're moving to the next segment.
					 */
					if (num > maxStart) {
						moveToNext = true;
					}
					this.#announcer.announce(num);
					return `${num}`;
				}
				moveToNext = true;
				this.#announcer.announce(total);
				return `${total}`;
			});

			if (moveToNext) {
				moveToNextSegment(e, this.#root.fieldNode);
			}
		}

		if (isBackspace(e.key)) {
			this.#root.states.second.hasLeftFocus = false;
			let moveToPrev = false;
			this.#updateSegment("second", (prev) => {
				if (prev === null) {
					moveToPrev = true;
					this.#announcer.announce(null);
					return null;
				}
				const str = prev.toString();
				if (str.length === 1) {
					this.#announcer.announce(null);
					return null;
				}
				const next = parseInt(str.slice(0, -1));
				this.#announcer.announce(next);
				return `${next}`;
			});

			if (moveToPrev) {
				moveToPrevSegment(e, this.#root.fieldNode);
			}
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.fieldNode);
		}
	};

	#onfocusout = () => {
		this.#root.states.second.hasLeftFocus = true;
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		const placeholder = this.#root.placeholder.value;
		if (!("second" in segmentValues) || !("second" in placeholder)) return {};
		const isEmpty = segmentValues.second === null;
		const date = segmentValues.second
			? placeholder.set({ second: parseInt(segmentValues.second) })
			: placeholder;
		const valueNow = date.second;
		const valueMin = 0;
		const valueMax = 59;
		const valueText = isEmpty ? "Empty" : `${valueNow}`;

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			"aria-label": "second, ",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onfocusout: this.#onfocusout,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("second", this.#id.value),
		};
	});
}

type DateFieldDayPeriodSegmentStateProps = WithRefProps;

class DateFieldDayPeriodSegmentState {
	#id: DateFieldDayPeriodSegmentStateProps["id"];
	#ref: DateFieldDayPeriodSegmentStateProps["ref"];
	#root: DateFieldRootState;
	#announcer: Announcer;
	#updateSegment: DateFieldRootState["updateSegment"];

	constructor(props: DateFieldMinuteSegmentStateProps, root: DateFieldRootState) {
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
		if (!isAcceptableDayPeriodKey(e.key) || this.#root.disabled.value) return;

		if (isArrowUp(e.key) || isArrowDown(e.key)) {
			this.#updateSegment("dayPeriod", (prev) => {
				if (prev === "AM") {
					const next = "PM";
					this.#announcer.announce(next);
					return next;
				}
				const next = "AM";
				this.#announcer.announce(next);
				return next;
			});
			return;
		}

		if (isBackspace(e.key)) {
			this.#root.states.dayPeriod.hasLeftFocus = false;
			this.#updateSegment("dayPeriod", () => {
				const next = "AM";
				this.#announcer.announce(next);
				return next;
			});
		}

		if (e.key === kbd.A || e.key === kbd.P) {
			this.#updateSegment("dayPeriod", () => {
				const next = e.key === kbd.A ? "AM" : "PM";
				this.#announcer.announce(next);
				return next;
			});
		}

		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.fieldNode);
		}
	};

	props = $derived.by(() => {
		const segmentValues = this.#root.segmentValues;
		if (!("dayPeriod" in segmentValues)) return;

		const valueMin = 0;
		const valueMax = 12;
		const valueNow = segmentValues.dayPeriod ?? 0;
		const valueText = segmentValues.dayPeriod ?? "AM";

		return {
			...this.#root.sharedSegmentAttrs,
			id: this.#id.value,
			inputmode: "text",
			"aria-label": "AM/PM",
			"aria-valuemin": valueMin,
			"aria-valuemax": valueMax,
			"aria-valuenow": valueNow,
			"aria-valuetext": valueText,
			onkeydown: this.#onkeydown,
			onclick: this.#root.handleSegmentClick,
			...this.#root.getBaseSegmentAttrs("dayPeriod", this.#id.value),
		};
	});
}

type DateFieldDayLiteralSegmentStateProps = WithRefProps;

class DateFieldDayLiteralSegmentState {
	#id: DateFieldDayLiteralSegmentStateProps["id"];
	#ref: DateFieldDayLiteralSegmentStateProps["ref"];
	#root: DateFieldRootState;

	constructor(props: DateFieldMinuteSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.#id.value,
				"aria-hidden": getAriaHidden(true),
				...this.#root.getBaseSegmentAttrs("literal", this.#id.value),
			}) as const
	);
}

type DateFieldTimeZoneSegmentStateProps = WithRefProps;

class DateFieldTimeZoneSegmentState {
	#id: DateFieldTimeZoneSegmentStateProps["id"];
	#ref: DateFieldTimeZoneSegmentStateProps["ref"];
	#root: DateFieldRootState;

	constructor(props: DateFieldMinuteSegmentStateProps, root: DateFieldRootState) {
		this.#id = props.id;
		this.#ref = props.ref;
		this.#root = root;

		useRefById({
			id: this.#id,
			ref: this.#ref,
		});
	}

	#onkeydown = (e: KeyboardEvent) => {
		if (e.key !== kbd.TAB) e.preventDefault();
		if (this.#root.disabled.value) return;
		if (isSegmentNavigationKey(e.key)) {
			handleSegmentNavigation(e, this.#root.fieldNode);
		}
	};

	props = $derived.by(
		() =>
			({
				role: "textbox",
				id: this.#id.value,
				"aria-label": "timezone, ",
				"data-readonly": getDataReadonly(true),
				tabindex: 0,
				style: {
					caretColor: "transparent",
				},
				onkeydown: this.#onkeydown,
				...this.#root.getBaseSegmentAttrs("timeZoneName", this.#id.value),
			}) as const
	);
}

// Utils/helpers

function isAcceptableDayPeriodKey(key: string) {
	return isAcceptableSegmentKey(key) || key === kbd.A || key === kbd.P;
}

function isArrowUp(key: string) {
	return key === kbd.ARROW_UP;
}

function isArrowDown(key: string) {
	return key === kbd.ARROW_DOWN;
}

function isBackspace(key: string) {
	return key === kbd.BACKSPACE;
}

const [setDateFieldRootContext, getDateFieldRootContext] =
	createContext<DateFieldRootState>("DateField.Root");

export function useDateFieldRoot(props: DateFieldRootStateProps) {
	return setDateFieldRootContext(new DateFieldRootState(props));
}

export function useDateFieldInput(props: DateFieldInputStateProps) {
	return getDateFieldRootContext().createInput(props);
}

export function useDateFieldHiddenInput() {
	return getDateFieldRootContext().createHiddenInput();
}

export function useDateFieldSegment(part: SegmentPart, props: WithRefProps) {
	return getDateFieldRootContext().createSegment(part, props);
}

export function useDateFieldLabel(props: DateFieldLabelStateProps) {
	return getDateFieldRootContext().createLabel(props);
}

type SegmentPartToInstanceProps = {
	part: SegmentPart;
	root: DateFieldRootState;
	segmentProps: WithRefProps;
};

function segmentPartToInstance(props: SegmentPartToInstanceProps) {
	const { part, root, segmentProps } = props;
	switch (part) {
		case "day":
			return new DateFieldDaySegmentState(segmentProps, root);
		case "month":
			return new DateFieldMonthSegmentState(segmentProps, root);
		case "year":
			return new DateFieldYearSegmentState(segmentProps, root);
		case "hour":
			return new DateFieldHourSegmentState(segmentProps, root);
		case "minute":
			return new DateFieldMinuteSegmentState(segmentProps, root);
		case "second":
			return new DateFieldSecondSegmentState(segmentProps, root);
		case "dayPeriod":
			return new DateFieldDayPeriodSegmentState(segmentProps, root);
		case "literal":
			return new DateFieldDayLiteralSegmentState(segmentProps, root);
		case "timeZoneName":
			return new DateFieldTimeZoneSegmentState(segmentProps, root);
	}
}

function prependYearZeros(year: number) {
	const digits = String(year).length;
	const diff = 4 - digits;
	return `${"0".repeat(diff)}${year}`;
}
