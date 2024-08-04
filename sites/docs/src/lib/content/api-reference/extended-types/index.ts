import rawFocusProp from "$lib/content/api-reference/extended-types/focus-target.js?raw";
import rawPageItemProp from "$lib/content/api-reference/extended-types/page-item.js?raw";
import Month from "$lib/content/api-reference/extended-types/shared/month.md";
import DateValue from "$lib/content/api-reference/extended-types/shared/date-value.md";
import type { PropType } from "$lib/types/index.js";

export const dateValueProp: PropType = {
	type: "DateValue",
	definition: DateValue,
};

export const monthsPropType: PropType = {
	type: "Month[]",
	definition: Month,
};

export const focusProp: PropType = {
	type: "FocusProp",
	definition: rawFocusProp,
};

export const pageItemProp: PropType = {
	type: "PageItem",
	definition: rawPageItemProp,
};
