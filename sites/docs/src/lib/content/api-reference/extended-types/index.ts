import rawFocusProp from "$lib/content/api-reference/extended-types/focus-target.js?raw";
import rawMonthProp from "$lib/content/api-reference/extended-types/months.js?raw";
import rawDateValueProp from "$lib/content/api-reference/extended-types/date-value.js?raw";
import rawPageItemProp from "$lib/content/api-reference/extended-types/page-item.js?raw";
import type { PropType } from "$lib/types/index.js";

export const dateValueProp: PropType = {
	type: "DateValue",
	definition: rawDateValueProp,
};

export const monthsPropType: PropType = {
	type: "Month[]",
	definition: rawMonthProp,
};

export const focusProp: PropType = {
	type: "FocusProp",
	definition: rawFocusProp,
};

export const pageItemProp: PropType = {
	type: "PageItem",
	definition: rawPageItemProp,
};
