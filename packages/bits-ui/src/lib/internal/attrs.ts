export const bits = [
	"accordion",
	"alert-dialog",
	"aspect-ratio",
	"avatar",
	"button",
	"calendar",
	"checkbox",
	"collapsible",
	"combobox",
	"context-menu",
	"date-field",
	"date-picker",
	"date-range-field",
	"date-range-picker",
	"dialog",
	"dropdown-menu",
	"label",
	"link-preview",
	"menubar",
	"pagination",
	"pin-input",
	"popover",
	"progress",
	"radio-group",
	"range-calendar",
	"scroll-area",
	"select",
	"separator",
	"slider",
	"switch",
	"tabs",
	"toggle",
	"toggle-group",
	"toolbar",
	"tooltip",
] as const;

export function createBitAttrs<T extends readonly string[]>(
	bit: (typeof bits)[number] | "menu",
	parts: T
) {
	const attrs: Record<string, Record<string, string>> = {};
	parts.forEach((part) => {
		attrs[part] = {
			[`data-${bit}-${part}`]: "",
		};
	});

	return (part: T[number]) => attrs[part];
}

export function disabledAttrs(disabled: boolean | undefined | null) {
	return disabled
		? { "aria-disabled": "true", "data-disabled": "" }
		: { "aria-disabled": undefined, "data-disabled": undefined };
}

export function getDataOpenClosed(condition: boolean): "open" | "closed" {
	return condition ? "open" : "closed";
}

export function dataDisabledAttrs(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getAriaDisabled(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaExpanded(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getDataDisabled(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getAriaRequired(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaChecked(condition: boolean | "indeterminate"): "true" | "false" | "mixed" {
	if (condition === "indeterminate") {
		return "mixed";
	}
	return condition ? "true" : "false";
}
