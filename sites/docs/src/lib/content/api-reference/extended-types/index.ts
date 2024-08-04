import rawFocusProp from "$lib/content/api-reference/extended-types/focus-target.js?raw";
import rawPageItemProp from "$lib/content/api-reference/extended-types/page-item.js?raw";
import { DateValueProp, MonthProp } from "./shared/index.js";
import type { PropType } from "$lib/types/index.js";

export const dateValueProp: PropType = {
	type: "DateValue",
	definition: DateValueProp,
};

export const monthsPropType: PropType = {
	type: "Month[]",
	definition: MonthProp,
};

export const focusProp: PropType = {
	type: "FocusProp",
	definition: rawFocusProp,
};

export const pageItemProp: PropType = {
	type: "PageItem",
	definition: rawPageItemProp,
};
