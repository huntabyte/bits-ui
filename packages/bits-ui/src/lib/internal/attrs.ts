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

export function getDataOpenClosed(condition: boolean): "open" | "closed" {
	return condition ? "open" : "closed";
}

export function getDataChecked(condition: boolean): "checked" | "unchecked" {
	return condition ? "checked" : "unchecked";
}

export function dataDisabledAttrs(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getAriaDisabled(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaReadonly(condition: boolean): "true" | "false" {
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

export function getAriaSelected(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getAriaChecked(condition: boolean | "indeterminate"): "true" | "false" | "mixed" {
	if (condition === "indeterminate") {
		return "mixed";
	}
	return condition ? "true" : "false";
}

export function getAriaOrientation(
	orientation: "horizontal" | "vertical"
): "horizontal" | "vertical" {
	return orientation;
}

export function getAriaHidden(condition: boolean): "true" | undefined {
	return condition ? "true" : undefined;
}

export function getAriaInvalid(condition: boolean): "true" | undefined {
	return condition ? "true" : undefined;
}

export function getDataOrientation(
	orientation: "horizontal" | "vertical"
): "horizontal" | "vertical" {
	return orientation;
}

export function getDataInvalid(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataRequired(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataReadonly(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataSelected(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getDataUnavailable(condition: boolean): "" | undefined {
	return condition ? "" : undefined;
}

export function getHidden(condition: boolean): true | undefined {
	return condition ? true : undefined;
}

export function getDisabled(condition: boolean): true | undefined {
	return condition ? true : undefined;
}

export function getAriaPressed(condition: boolean): "true" | "false" {
	return condition ? "true" : "false";
}

export function getRequired(condition: boolean): true | undefined {
	return condition ? true : undefined;
}
