import type { PropType } from "@/types";
import rawFocusProp from "@/content/api-reference/extended-types/focus-target.js?raw";
import rawFloatingConfigProp from "@/content/api-reference/extended-types/floating-config.js?raw";

export const focusProp: PropType = {
	type: "FocusProp",
	definition: rawFocusProp
};

export const floatingConfigProp: PropType = {
	type: "FloatingConfig",
	definition: rawFloatingConfigProp
};
