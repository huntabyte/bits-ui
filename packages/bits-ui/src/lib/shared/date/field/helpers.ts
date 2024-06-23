import {
	getPlaceholder,
	type Formatter,
	type Granularity,
	toDate,
	isZonedDateTime,
	hasTime,
	getSegments,
} from "../index.js";
import type { DateValue } from "@internationalized/date";
import type {
	DateSegmentPart,
	SegmentContentObj,
	EditableSegmentPart,
	SegmentStateMap,
	SegmentValueObj,
	TimeSegmentPart,
	DateAndTimeSegmentObj,
	DayPeriod,
	SegmentPart,
	HourCycle,
} from "./types.js";
import {
	ALL_SEGMENT_PARTS,
	DATE_SEGMENT_PARTS,
	EDITABLE_SEGMENT_PARTS,
	TIME_SEGMENT_PARTS,
} from "./parts.js";
import {
	isBrowser,
	isNull,
	generateId,
	kbd,
	isNumberString,
	styleToString,
} from "$lib/internal/index.js";
import { get, type Writable } from "svelte/store";

/**
 * Initializes the segment values object which keeps track of the inputs
 * for each segment in the field. This is then input into the formatter
 * to generate the formatted strings to render in the field.
 */
export function initializeSegmentValues(granularity: Granularity) {
	const calendarDateTimeGranularities = ["hour", "minute", "second"];
	const initialParts = EDITABLE_SEGMENT_PARTS.map((part) => {
		if (part === "dayPeriod") {
			return [part, "AM"];
		}
		return [part, null];
	}).filter(([key]) => {
		if (key === "literal" || key === null) return false;
		if (granularity === "day") {
			return !calendarDateTimeGranularities.includes(key!);
		} else {
			return true;
		}
	});
	return Object.fromEntries(initialParts) as SegmentValueObj;
}

type SharedContentProps = {
	granularity: Granularity;
	dateRef: DateValue;
	formatter: Formatter;
	hideTimeZone: boolean;
	hourCycle: HourCycle;
};

type CreateContentObjProps = SharedContentProps & {
	segmentValues: SegmentValueObj;
	locale: string;
};

type CreateContentArrProps = SharedContentProps & {
	contentObj: SegmentContentObj;
};

// TODO: clean me up
function createContentObj(props: CreateContentObjProps) {
	const { segmentValues, formatter, locale, dateRef } = props;

	// @ts-expect-error - we're populating the object with the keys in the loop
	const content: SegmentContentObj = {};

	for (const part of Object.keys(segmentValues)) {
		if (!isSegmentPart(part)) continue;

		if ("hour" in segmentValues && part === "dayPeriod") {
			const value = segmentValues[part];
			if (!isNull(value)) {
				content[part] = value;
			} else {
				content[part] = getPlaceholder(part, "AM", locale);
			}
		} else {
			content[part] = getPartContent(part);
		}
	}

	function getPartContent(part: DateSegmentPart | TimeSegmentPart) {
		if ("hour" in segmentValues) {
			const value = segmentValues[part];
			const leadingZero = typeof value === "string" && value?.startsWith("0");
			if (value === "0" && part !== "year") {
				return "0";
			} else if (!isNull(value)) {
				const formatted = formatter.part(dateRef.set({ [part]: value }), part, {
					hourCycle: props.hourCycle === 24 ? "h24" : undefined,
				});

				if (part === "year") {
					return `${value}`;
				}
				if (leadingZero && formatted.length === 1) {
					return `0${formatted}`;
				}
				return formatted;
			} else {
				return getPlaceholder(part, "", locale);
			}
		} else {
			if (isDateSegmentPart(part)) {
				const value = segmentValues[part];
				const leadingZero = typeof value === "string" && value?.startsWith("0");
				if (value === "0") {
					return "0";
				} else if (!isNull(value)) {
					const formatted = formatter.part(dateRef.set({ [part]: value }), part);
					if (part === "year") {
						return `${value}`;
					}
					if (leadingZero && formatted.length === 1) {
						return `0${formatted}`;
					}
					return formatted;
				} else {
					return getPlaceholder(part, "", locale);
				}
			}
			return "";
		}
	}

	return content;
}

function createContentArr(props: CreateContentArrProps) {
	const { granularity, dateRef, formatter, contentObj, hideTimeZone, hourCycle } = props;
	const parts = formatter.toParts(dateRef, getOptsByGranularity(granularity, hourCycle));
	const segmentContentArr = parts
		.map((part) => {
			const defaultParts = ["literal", "dayPeriod", "timeZoneName", null];

			if (defaultParts.includes(part.type) || !isSegmentPart(part.type)) {
				return {
					part: part.type,
					value: part.value,
				};
			}
			return {
				part: part.type,
				value: contentObj[part.type],
			};
		})
		.filter((segment): segment is { part: SegmentPart; value: string } => {
			if (isNull(segment.part) || isNull(segment.value)) return false;
			if (segment.part === "timeZoneName" && (!isZonedDateTime(dateRef) || hideTimeZone)) {
				return false;
			}
			return true;
		});
	return segmentContentArr;
}

type CreateContentProps = CreateContentObjProps;

export function createContent(props: CreateContentProps) {
	const contentObj = createContentObj(props);
	const contentArr = createContentArr({
		contentObj,
		...props,
	});
	return {
		obj: contentObj,
		arr: contentArr,
	};
}

/**
 * Get the options to use for the `Intl.DateTimeFormat` constructor based on
 * the granularity and hour cycle of the field.
 */
function getOptsByGranularity(granularity: Granularity, hourCycle: HourCycle) {
	const opts: Intl.DateTimeFormatOptions = {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
		hourCycle: hourCycle === 24 ? "h24" : undefined,
		hour12: hourCycle === 24 ? false : undefined,
	};

	if (granularity === "day") {
		delete opts.second;
		delete opts.hour;
		delete opts.minute;
		delete opts.timeZoneName;
	}
	if (granularity === "hour") {
		delete opts.minute;
	}
	if (granularity === "minute") {
		delete opts.second;
	}

	return opts;
}

/**
 * Initializes the segment states object which keeps track of state
 * necessary to manage the behavior of the segments.
 */
export function initSegmentStates(): SegmentStateMap {
	// @ts-expect-error - we're populating the object with the keys in the loop
	const segmentStates: SegmentStateMap = {};

	for (const key of EDITABLE_SEGMENT_PARTS) {
		segmentStates[key] = {
			lastKeyZero: false,
			hasLeftFocus: true,
			updating: null,
		};
	}

	return segmentStates;
}

export function isDateSegmentPart(part: unknown): part is DateSegmentPart {
	return DATE_SEGMENT_PARTS.includes(part as DateSegmentPart);
}

export function isSegmentPart(part: string): part is EditableSegmentPart {
	return EDITABLE_SEGMENT_PARTS.includes(part as EditableSegmentPart);
}

export function isAnySegmentPart(part: unknown): part is SegmentPart {
	return ALL_SEGMENT_PARTS.includes(part as EditableSegmentPart);
}

/**
 * Get the segments being used/ are rendered in the DOM.
 * We're using this to determine when to set the value of
 * the date picker, which is when all the segments have
 * been filled.
 */
function getUsedSegments(fieldNode: HTMLElement | null) {
	if (!isBrowser || !fieldNode) return [];
	const usedSegments = getSegments(fieldNode)
		.map((el) => el.dataset.segment)
		.filter((part): part is EditableSegmentPart => {
			return EDITABLE_SEGMENT_PARTS.includes(part as EditableSegmentPart);
		});
	return usedSegments;
}

type GetValueFromSegments = {
	segmentObj: SegmentValueObj;
	fieldNode: HTMLElement | null;
	dateRef: DateValue;
};

/**
 * Creates a new `DateValue` object based on the state of the field.
 */
export function getValueFromSegments(props: GetValueFromSegments) {
	const { segmentObj, fieldNode, dateRef } = props;
	const usedSegments = getUsedSegments(fieldNode);
	let date = dateRef;
	usedSegments.forEach((part) => {
		if ("hour" in segmentObj) {
			const value = segmentObj[part];
			if (isNull(value)) return;
			date = date.set({ [part]: segmentObj[part] });
			return;
		} else if (isDateSegmentPart(part)) {
			const value = segmentObj[part];
			if (isNull(value)) return;
			date = date.set({ [part]: segmentObj[part] });
			return;
		}
	});
	return date;
}

/**
 * Check if all the segments being used have been filled.
 * We use this to determine when we should set the value
 * store of the date field(s).
 *
 * @param segmentValues - The current `SegmentValueObj`
 * @param fieldNode  - The id of the date field
 */
export function areAllSegmentsFilled(
	segmentValues: SegmentValueObj,
	fieldNode: HTMLElement | null
) {
	const usedSegments = getUsedSegments(fieldNode);
	for (const part of usedSegments) {
		if ("hour" in segmentValues) {
			if (segmentValues[part] === null) {
				return false;
			}
		} else if (isDateSegmentPart(part)) {
			if (segmentValues[part] === null) {
				return false;
			}
		}
	}
	return true;
}
/**
 * Extracts the segment part from the provided node,
 * if it exists, otherwise returns null.
 */
export function getPartFromNode(node: HTMLElement) {
	const part = node.dataset.segment;
	if (!isAnySegmentPart(part)) return null;
	return part;
}

/**
 * Determines if the provided object is a valid `DateAndTimeSegmentObj`
 * by checking if it has the correct keys and values for each key.
 */
export function isDateAndTimeSegmentObj(obj: unknown): obj is DateAndTimeSegmentObj {
	if (typeof obj !== "object" || obj === null) {
		return false;
	}
	return Object.entries(obj).every(([key, value]) => {
		const validKey =
			TIME_SEGMENT_PARTS.includes(key as TimeSegmentPart) ||
			DATE_SEGMENT_PARTS.includes(key as DateSegmentPart);

		const validValue =
			key === "dayPeriod"
				? value === "AM" || value === "PM" || value === null
				: typeof value === "string" || typeof value === "number" || value === null;

		return validKey && validValue;
	});
}

/**
 * Infer the granularity to use based on the
 * value and granularity props.
 */
export function inferGranularity(
	value: DateValue,
	granularity: Granularity | undefined
): Granularity {
	if (granularity) {
		return granularity;
	}
	if (hasTime(value)) {
		return "minute";
	}
	return "day";
}

export function isAcceptableSegmentKey(key: string) {
	const acceptableSegmentKeys = [
		kbd.ENTER,
		kbd.ARROW_UP,
		kbd.ARROW_DOWN,
		kbd.ARROW_LEFT,
		kbd.ARROW_RIGHT,
		kbd.BACKSPACE,
		kbd.SPACE,
	];
	if (acceptableSegmentKeys.includes(key)) return true;
	if (isNumberString(key)) return true;
	return false;
}

type SyncSegmentValuesProps = {
	value: DateValue;
	updatingDayPeriod: Writable<DayPeriod>;
	segmentValues: Writable<SegmentValueObj>;
	formatter: Formatter;
};

/**
 * Sets the individual segment values based on the current
 * value of the date picker. This is used to initialize the
 * segment values if a default value is provided, and to
 * keep it in sync as the value changes outside the builder.
 */
export function syncSegmentValues(props: SyncSegmentValuesProps) {
	const { value, updatingDayPeriod, segmentValues, formatter } = props;

	const dateValues = DATE_SEGMENT_PARTS.map((part) => {
		return [part, value[part]];
	});
	if ("hour" in value) {
		const timeValues = TIME_SEGMENT_PARTS.map((part) => {
			if (part === "dayPeriod") {
				const $updatingDayPeriod = get(updatingDayPeriod);
				if ($updatingDayPeriod) {
					return [part, $updatingDayPeriod];
				} else {
					return [part, formatter.dayPeriod(toDate(value))];
				}
			}
			return [part, value[part]];
		});

		const mergedSegmentValues = [...dateValues, ...timeValues];
		segmentValues.set(Object.fromEntries(mergedSegmentValues) as SegmentValueObj);
		updatingDayPeriod.set(null);
		return;
	}

	segmentValues.set(Object.fromEntries(dateValues) as SegmentValueObj);
}

/**
 * Determines if the element with the provided id is the first focusable
 * segment in the date field with the provided fieldId.
 *
 * @param id - The id of the element to check if it's the first segment
 * @param fieldNode - The id of the date field associated with the segment
 */
export function isFirstSegment(id: string, fieldNode: HTMLElement | null) {
	if (!isBrowser) return false;
	const segments = getSegments(fieldNode);
	return segments.length ? segments[0]!.id === id : false;
}

/**
 * Creates or updates a description element for a date field
 * which enables screen readers to read the date field's value.
 *
 * This element is hidden from view, and is portalled to the body
 * so it can be associated via `aria-describedby` and read by
 * screen readers as the user interacts with the date field.
 */
export function setDescription(id: string, formatter: Formatter, value: DateValue) {
	if (!isBrowser) return;
	const valueString = formatter.selectedDate(value);
	const el = document.getElementById(id);
	if (!el) {
		const div = document.createElement("div");
		div.style.cssText = styleToString({
			display: "none",
		});
		div.id = id;
		div.innerText = `Selected Date: ${valueString}`;
		document.body.appendChild(div);
	} else {
		el.innerText = `Selected Date: ${valueString}`;
	}
}

/**
 * Removes the description element for the date field with
 * the provided ID. This function should be called when the
 * date field is unmounted.
 */
export function removeDescriptionElement(id: string) {
	if (!isBrowser) return;
	const el = document.getElementById(id);
	if (!el) return;
	document.body.removeChild(el);
}
