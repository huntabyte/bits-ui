import { DateValueProp, TimeValueProp } from "./shared/index.js";
import type { PropType } from "$lib/types/index.js";
import { PaginationPageItemProp } from "./pagination/index.js";

export const dateValueProp: PropType = {
	type: "DateValue",
	definition: DateValueProp,
	stringDefinition: `import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date";

type DateValue = CalendarDate | CalendarDateTime | ZonedDateTime`,
};

export const timeValueProp: PropType = {
	type: "TimeValue",
	definition: TimeValueProp,
	stringDefinition: `import type { Time, CalendarDateTime, ZonedDateTime } from "@internationalized/date";

	type TimeValue = Time | CalendarDateTime | ZonedDateTime`,
};

export const pageItemProp: PropType = {
	type: "PageItem",
	definition: PaginationPageItemProp,
	stringDefinition: `export type Page = {
	type: "page";
	/** The page number the 'PageItem' represents */
	value: number;
}

export type Ellipsis = {
	type: "ellipsis";
}

export type PageItem = (Page | Ellipsis) & {
	/** Unique key for the item, for svelte #each block */
	key: string;
}`,
};
