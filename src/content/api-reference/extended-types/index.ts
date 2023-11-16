import type { PropType } from "@/types";
import rawFocusProp from "@/content/api-reference/extended-types/focus-target.js?raw";

export const focusProp: PropType = {
	type: "FocusProp",
	definition: rawFocusProp
};
