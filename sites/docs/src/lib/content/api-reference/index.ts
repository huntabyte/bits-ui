import { accordion } from "./accordion.js";
import { alertDialog } from "./alert-dialog.js";
import { aspectRatio } from "./aspect-ratio.js";
import { avatar } from "./avatar.js";
import { button } from "./button.js";
import { calendar } from "./calendar.js";
import { checkbox } from "./checkbox.js";
import { collapsible } from "./collapsible.js";
import { combobox } from "./combobox.js";
import { contextMenu } from "./context-menu.js";
import { dateField } from "./date-field.js";
import { datePicker } from "./date-picker.js";
import { dateRangeField } from "./date-range-field.js";
import { dateRangePicker } from "./date-range-picker.js";
import { dialog } from "./dialog.js";
import { dropdownMenu } from "./dropdown-menu.js";
import { label } from "./label.js";
import { linkPreview } from "./link-preview.js";
import { menubar } from "./menubar.js";
import { pagination } from "./pagination.js";
import { pinInput } from "./pin-input.js";
import { popover } from "./popover.js";
import { progress } from "./progress.js";
import { radioGroup } from "./radio-group.js";
import { rangeCalendar } from "./range-calendar.js";
import { scrollArea } from "./scroll-area.js";
import { select } from "./select.js";
import { separator } from "./separator.js";
import { slider } from "./slider.js";
import { switchData } from "./switch.js";
import { tabs } from "./tabs.js";
import { toggleGroup } from "./toggle-group.js";
import { toggle } from "./toggle.js";
import { toolbar } from "./toolbar.js";
import { tooltip } from "./tooltip.js";
import type { APISchema } from "$lib/types/index.js";

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

export const bitsSet = new Set(bits);

export function isBit(value: string): value is (typeof bits)[number] {
	return bitsSet.has(value as (typeof bits)[number]);
}

export type Bit = (typeof bits)[number];

export const apiSchemas: Record<Bit, APISchema[]> = {
	accordion,
	"alert-dialog": alertDialog,
	"aspect-ratio": aspectRatio,
	avatar,
	button,
	calendar,
	checkbox,
	collapsible,
	combobox,
	"context-menu": contextMenu,
	"date-field": dateField,
	"date-picker": datePicker,
	"date-range-field": dateRangeField,
	"date-range-picker": dateRangePicker,
	dialog,
	"dropdown-menu": dropdownMenu,
	label,
	"link-preview": linkPreview,
	menubar,
	pagination,
	"pin-input": pinInput,
	popover,
	progress,
	"radio-group": radioGroup,
	"range-calendar": rangeCalendar,
	"scroll-area": scrollArea,
	select,
	separator,
	slider,
	switch: switchData,
	tabs,
	toggle,
	"toggle-group": toggleGroup,
	toolbar,
	tooltip,
};

export function getAPISchemas(bit: Bit): APISchema[] {
	return apiSchemas[bit];
}

export * from "./helpers.js";
