import type * as DateRangeField from "$lib/bits/date-range-field/_types.js";
import type { APISchema } from "@/types/index.js";
export declare const root: APISchema<DateRangeField.Props>;
export declare const input: APISchema<DateRangeField.InputProps>;
export declare const segment: APISchema<DateRangeField.SegmentProps>;
export declare const label: APISchema<DateRangeField.LabelProps>;
export declare const dateRangeField: (APISchema<{
    disabled?: boolean | undefined;
    minValue?: import("@internationalized/date").DateValue | undefined;
    maxValue?: import("@internationalized/date").DateValue | undefined;
    isDateUnavailable?: import("@melt-ui/svelte/index.js").Matcher | undefined;
    locale?: string | undefined;
    readonly?: boolean | undefined;
    readonlySegments?: {
        start: ("month" | "day" | "year" | "hour" | "minute" | "second" | "dayPeriod")[];
        end: ("month" | "day" | "year" | "hour" | "minute" | "second" | "dayPeriod")[];
    } | undefined;
    hourCycle?: 12 | 24 | undefined;
    granularity?: import("@melt-ui/svelte/index.js").Granularity | undefined;
    hideTimeZone?: boolean | undefined;
    value?: import("../../lib/index.js").DateRange | undefined;
    onValueChange?: import("../../lib/internal/types.js").OnChangeFn<import("../../lib/index.js").DateRange | undefined> | undefined;
    placeholder?: import("@internationalized/date").DateValue | undefined;
    onPlaceholderChange?: import("../../lib/internal/types.js").OnChangeFn<import("@internationalized/date").DateValue> | undefined;
    validationId?: string | undefined;
    descriptionId?: string | undefined;
}> | APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLDivElement | undefined;
}>)[];
