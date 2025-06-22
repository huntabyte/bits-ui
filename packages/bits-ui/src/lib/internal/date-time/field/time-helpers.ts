import { isBrowser, isNull } from "$lib/internal/is.js";
import type {
	EditableTimeSegmentPart,
	HourCycle,
	TimeGranularity,
	TimeSegmentContentObj,
	TimeSegmentStateMap,
	TimeSegmentValueObj,
	TimeValue,
} from "$lib/shared/date/types.js";
import { CalendarDateTime, Time, ZonedDateTime } from "@internationalized/date";
import type { TimeFormatter } from "../formatter.js";
import { ALL_TIME_SEGMENT_PARTS, EDITABLE_TIME_SEGMENT_PARTS } from "./parts.js";
import { getTimeSegments } from "./segments.js";
import type { TimeSegmentPart } from "./types.js";
import { styleToString } from "svelte-toolbelt";
import { useId } from "$lib/internal/use-id.js";
import { getPlaceholder } from "../placeholders.js";
import { isZonedDateTime } from "../utils.js";

export function initializeSegmentValues() {
	const initialParts = EDITABLE_TIME_SEGMENT_PARTS.map((part) => {
		if (part === "dayPeriod") {
			return [part, "AM"];
		}
		return [part, null];
	}).filter(([key]) => {
		if (key === "literal" || key === null) return false;
		return true;
	});
	return Object.fromEntries(initialParts) as TimeSegmentValueObj;
}

type SharedTimeContentProps = {
	granularity: TimeGranularity;
	timeRef: TimeValue;
	formatter: TimeFormatter;
	hideTimeZone: boolean;
	hourCycle: HourCycle | undefined;
};

type CreateTimeContentObjProps = SharedTimeContentProps & {
	segmentValues: TimeSegmentValueObj;
	locale: string;
};

type CreateTimeContentArrProps = SharedTimeContentProps & {
	contentObj: TimeSegmentContentObj;
};

function createTimeContentObj(props: CreateTimeContentObjProps) {
	const { segmentValues, formatter, locale, timeRef } = props;

	const content = Object.keys(segmentValues).reduce((obj, part) => {
		if (!isEditableTimeSegmentPart(part)) return obj;
		if (part === "dayPeriod") {
			const value = segmentValues[part];
			if (!isNull(value)) {
				obj[part] = value;
			} else {
				obj[part] = getPlaceholder(part, "AM", locale);
			}
		} else {
			obj[part] = getPartContent(part);
		}

		return obj;
	}, {} as TimeSegmentContentObj);

	function getPartContent(part: TimeSegmentPart) {
		const value = segmentValues[part];
		const leadingZero = typeof value === "string" && value?.startsWith("0");
		const intValue = value !== null ? Number.parseInt(value) : null;

		if (!isNull(value) && !isNull(intValue)) {
			const formatted = formatter.part(timeRef.set({ [part]: value }), part, {
				hourCycle: props.hourCycle === 24 ? "h23" : undefined,
			});

			/**
			 * If we're operating in a 12 hour clock and the part is an hour, we handle
			 * the conversion to 12 hour format with 2 digit hours and leading zeros here.
			 */
			if (part === "hour" && "dayPeriod" in segmentValues && props.hourCycle !== 24) {
				/**
				 * If the value is over 12, we convert to 12 hour format and add leading
				 * zeroes if the value is less than 10.
				 */
				if (intValue > 12) {
					const hour = intValue - 12;
					if (hour === 0) {
						return "12";
					} else if (hour < 10) {
						return `0${hour}`;
					} else {
						return `${hour}`;
					}
				}

				/**
				 * If the value is 0, we convert to 12, since 0 is not a valid 12 hour time.
				 */
				if (intValue === 0) {
					return "12";
				}

				/**
				 * If the value is less than 10, we add a leading zero to the value.
				 */
				if (intValue < 10) {
					return `0${intValue}`;
				}

				/**
				 * Otherwise, we don't need to do anything to the value.
				 */
				return `${intValue}`;
			}

			if (leadingZero && formatted.length === 1) {
				return `0${formatted}`;
			}
			return formatted;
		} else {
			return getPlaceholder(part, "", locale);
		}
	}

	return content;
}

function createTimeContentArr(props: CreateTimeContentArrProps) {
	const { granularity, timeRef, formatter, contentObj, hideTimeZone, hourCycle } = props;
	const parts = formatter.toParts(timeRef, getOptsByGranularity(granularity, hourCycle));
	const timeSegmentContentArr = parts
		.map((part) => {
			const defaultParts = ["literal", "timeZoneName", null];

			if (defaultParts.includes(part.type) || !isEditableTimeSegmentPart(part.type)) {
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
		.filter((segment): segment is { part: TimeSegmentPart; value: string } => {
			if (isNull(segment.part) || isNull(segment.value)) return false;
			if (segment.part === "timeZoneName" && (!isZonedDateTime(timeRef) || hideTimeZone)) {
				return false;
			}
			return true;
		});
	return timeSegmentContentArr;
}

type CreateTimeContentProps = CreateTimeContentObjProps;

export function createTimeContent(props: CreateTimeContentProps) {
	const contentObj = createTimeContentObj(props);
	const contentArr = createTimeContentArr({
		contentObj,
		...props,
	});
	return {
		obj: contentObj,
		arr: contentArr,
	};
}

function getOptsByGranularity(granularity: TimeGranularity, hourCycle: HourCycle | undefined) {
	const opts: Intl.DateTimeFormatOptions = {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short",
		hourCycle: hourCycle === 24 ? "h23" : undefined,
		hour12: hourCycle === 24 ? false : undefined,
	};

	if (granularity === "hour") {
		delete opts.minute;
		delete opts.second;
	}
	if (granularity === "minute") {
		delete opts.second;
	}

	return opts;
}

export function initTimeSegmentStates() {
	return EDITABLE_TIME_SEGMENT_PARTS.reduce((acc, key) => {
		acc[key] = {
			lastKeyZero: false,
			hasLeftFocus: true,
			updating: null,
		};
		return acc;
	}, {} as TimeSegmentStateMap);
}

export function initTimeSegmentIds() {
	return Object.fromEntries(
		ALL_TIME_SEGMENT_PARTS.map((part) => {
			return [part, useId()];
		}).filter(([key]) => key !== "literal")
	);
}

export function isEditableTimeSegmentPart(part: unknown): part is EditableTimeSegmentPart {
	return EDITABLE_TIME_SEGMENT_PARTS.includes(part as EditableTimeSegmentPart);
}

export function isAnyTimeSegmentPart(part: unknown): part is TimeSegmentPart {
	return ALL_TIME_SEGMENT_PARTS.includes(part as TimeSegmentPart);
}

/**
 * Get the segments being used/ are rendered in the DOM.
 * We're using this to determine when to set the value of
 * the date picker, which is when all the segments have
 * been filled.
 */
function getUsedTimeSegments(fieldNode: HTMLElement | null) {
	if (!isBrowser || !fieldNode) return [];
	const usedSegments = getTimeSegments(fieldNode)
		.map((el) => el.dataset.segment)
		.filter((part): part is EditableTimeSegmentPart => {
			return EDITABLE_TIME_SEGMENT_PARTS.includes(part as EditableTimeSegmentPart);
		});
	return usedSegments;
}

type GetTimeValueFromSegments<T extends TimeValue = Time> = {
	segmentObj: TimeSegmentValueObj;
	fieldNode: HTMLElement | null;
	timeRef: T;
};

export function getTimeValueFromSegments<T extends TimeValue = Time>(
	props: GetTimeValueFromSegments<T>
): T {
	const usedSegments = getUsedTimeSegments(props.fieldNode);

	for (const part of usedSegments) {
		const value = props.segmentObj[part];
		if (isNull(value)) continue;
		// @ts-expect-error shhh
		props.timeRef = props.timeRef.set({ [part]: props.segmentObj[part] });
	}

	return props.timeRef;
}

/**
 * Check if all the segments being used have been filled.
 * We use this to determine when we should set the value
 * store of the date field(s).
 *
 * @param segmentValues - The current `SegmentValueObj`
 * @param fieldNode  - The id of the date field
 */
export function areAllTimeSegmentsFilled(
	segmentValues: TimeSegmentValueObj,
	fieldNode: HTMLElement | null
) {
	const usedSegments = getUsedTimeSegments(fieldNode);
	for (const part of usedSegments) {
		if (segmentValues[part] === null) return false;
	}
	return true;
}

/**
 * Infer the granularity to use based on the
 * value and granularity props.
 */
export function inferTimeGranularity(granularity: TimeGranularity | undefined): TimeGranularity {
	if (granularity) return granularity;
	return "minute";
}

/**
 * Determines if the element with the provided id is the first focusable
 * segment in the date field with the provided fieldId.
 *
 * @param id - The id of the element to check if it's the first segment
 * @param fieldNode - The id of the date field associated with the segment
 */
export function isFirstTimeSegment(id: string, fieldNode: HTMLElement | null) {
	if (!isBrowser) return false;
	const segments = getTimeSegments(fieldNode);
	return segments.length ? segments[0]!.id === id : false;
}

type SetTimeDescriptionProps = {
	id: string;
	formatter: TimeFormatter;
	value: TimeValue;
	doc: Document;
};

/**
 * Creates or updates a description element for a date field
 * which enables screen readers to read the date field's value.
 *
 * This element is hidden from view, and is portalled to the body
 * so it can be associated via `aria-describedby` and read by
 * screen readers as the user interacts with the date field.
 */
export function setTimeDescription(props: SetTimeDescriptionProps) {
	if (!isBrowser) return;
	const valueString = props.formatter.selectedTime(props.value);
	const el = props.doc.getElementById(props.id);
	if (!el) {
		const div = props.doc.createElement("div");
		div.style.cssText = styleToString({
			display: "none",
		});
		div.id = props.id;
		div.innerText = `Selected Time: ${valueString}`;
		props.doc.body.appendChild(div);
	} else {
		el.innerText = `Selected Time: ${valueString}`;
	}
}

/**
 * Removes the description element for the date field with
 * the provided ID. This function should be called when the
 * date field is unmounted.
 */
export function removeTimeDescriptionElement(id: string, doc: Document) {
	if (!isBrowser) return;
	const el = doc.getElementById(id);
	if (!el) return;
	doc.body.removeChild(el);
}

export function convertTimeValueToDateValue(time: TimeValue): CalendarDateTime | ZonedDateTime {
	if (time instanceof Time) {
		return new CalendarDateTime(
			2020,
			1,
			1,
			time.hour,
			time.minute,
			time.second,
			time.millisecond
		);
	}
	return time;
}

export function convertTimeValueToTime(time: TimeValue): Time {
	if (time instanceof Time) return time;
	return new Time(time.hour, time.minute, time.second, time.millisecond);
}

export function isTimeBefore(timeToCompare: Time, referenceTime: Time) {
	return timeToCompare.compare(referenceTime) < 0;
}

export function isTimeAfter(timeToCompare: Time, referenceTime: Time) {
	return timeToCompare.compare(referenceTime) > 0;
}

export function getISOTimeValue(time: TimeValue): string {
	if (time instanceof Time) {
		return Time.toString();
	}

	return new Time(time.hour, time.minute, time.second, time.millisecond).toString();
}
