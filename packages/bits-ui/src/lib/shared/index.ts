import type { DateValue } from "@internationalized/date";

import type * as CSS from "csstype";

export type Selected<Value> = {
	value: Value;
	label?: string;
};

export type DateRange = {
	start: DateValue | undefined;
	end: DateValue | undefined;
};

export type SegmentPart =
	| "month"
	| "day"
	| "year"
	| "hour"
	| "minute"
	| "second"
	| "dayPeriod"
	| "timeZoneName"
	| "literal";

export type FocusTarget = string | HTMLElement | SVGElement | null;
export type FocusProp = FocusTarget | ((defaultEl?: HTMLElement | null) => FocusTarget);

export type StyleProperties = CSS.Properties;

export type Orientation = "horizontal" | "vertical";
export type Direction = "ltr" | "rtl";

export type WithoutChildrenOrChild<T> = Omit<T, "children" | "child">;
export type WithoutChildren<T> = Omit<T, "children">;
export type WithoutChild<T> = Omit<T, "child">;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
export type { EditableSegmentPart } from "./date/field/types.js";
export type { Month } from "./date/types.js";
export type { WithChild, Expand, Without } from "$lib/internal/types.js";
