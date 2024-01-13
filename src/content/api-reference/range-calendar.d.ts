import type { APISchema } from "@/types/index.js";
import type * as RangeCalendar from "$lib/bits/range-calendar/_types.js";
export declare const root: APISchema<RangeCalendar.Props>;
export declare const cell: APISchema<RangeCalendar.CellProps>;
export declare const day: APISchema<RangeCalendar.DayProps>;
export declare const grid: APISchema<RangeCalendar.GridProps>;
export declare const gridBody: APISchema<RangeCalendar.GridBodyProps>;
export declare const gridHead: APISchema<RangeCalendar.GridHeadProps>;
export declare const gridRow: APISchema<RangeCalendar.GridRowProps>;
export declare const headCell: APISchema<RangeCalendar.HeadCellProps>;
export declare const header: APISchema<RangeCalendar.HeaderProps>;
export declare const heading: APISchema<RangeCalendar.HeadingProps>;
export declare const nextButton: APISchema<RangeCalendar.NextButtonProps>;
export declare const prevButton: APISchema<RangeCalendar.PrevButtonProps>;
export declare const rangeCalendar: APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLTableElement | undefined;
}>[];
