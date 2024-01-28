import type { APISchema } from "@/types";
import type * as Calendar from "$lib/bits/calendar/_types.js";
export declare const root: APISchema<Calendar.Props>;
export declare const cell: APISchema<Calendar.CellProps>;
export declare const day: APISchema<Calendar.DayProps>;
export declare const grid: APISchema<Calendar.GridProps>;
export declare const gridBody: APISchema<Calendar.GridBodyProps>;
export declare const gridHead: APISchema<Calendar.GridHeadProps>;
export declare const gridRow: APISchema<Calendar.GridRowProps>;
export declare const headCell: APISchema<Calendar.HeadCellProps>;
export declare const header: APISchema<Calendar.HeaderProps>;
export declare const heading: APISchema<Calendar.HeadingProps>;
export declare const nextButton: APISchema<Calendar.NextButtonProps>;
export declare const prevButton: APISchema<Calendar.PrevButtonProps>;
export declare const calendar: APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLTableElement | undefined;
}>[];
