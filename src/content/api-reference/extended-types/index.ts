import type { PropType } from "@/types";
import rawFocusProp from "@/content/api-reference/extended-types/focus-target.js?raw";
import rawMonthProp from "@/content/api-reference/extended-types/months.js?raw";
import rawPageItemProp from "@/content/api-reference/extended-types/page-item.js?raw";

export const monthsPropType: PropType = {
	type: "Month[]",
	definition: rawMonthProp
};

export const focusProp: PropType = {
	type: "FocusProp",
	definition: rawFocusProp
};

export const pageItemProp: PropType = {
	type: "PageItem",
	definition: rawPageItemProp
};
