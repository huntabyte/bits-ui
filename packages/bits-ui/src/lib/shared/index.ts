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

export type StyleProperties = CSS.Properties & {
	// Allow any CSS Custom Properties
	// eslint-disable-next-line ts/no-explicit-any
	[str: `--${string}`]: any;
};

export type Orientation = "horizontal" | "vertical";
export type Direction = "ltr" | "rtl";

export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
// eslint-disable-next-line ts/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, "children"> : T;
// eslint-disable-next-line ts/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, "child"> : T;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
export type { EditableSegmentPart } from "./date/field/types.js";
export type {
	Month,
	DateMatcher,
	DateOnInvalid,
	DateRangeValidator,
	DateValidator,
} from "./date/types.js";
export type { WithChild, Without, WithChildren } from "$lib/internal/types.js";
export { mergeProps } from "$lib/internal/mergeProps.js";
export { useId } from "$lib/internal/useId.js";
export * from "./attributes.js";
