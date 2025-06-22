import { accordion } from "./accordion.api.js";
import { alertDialog } from "./alert-dialog.api.js";
import { aspectRatio } from "./aspect-ratio.api.js";
import { avatar } from "./avatar.api.js";
import { button } from "./button.api.js";
import { calendar } from "./calendar.api.js";
import { checkbox } from "./checkbox.api.js";
import { collapsible } from "./collapsible.api.js";
import { combobox } from "./combobox.api.js";
import { command } from "./command.api.js";
import { contextMenu } from "./context-menu.api.js";
import { dateField } from "./date-field.api.js";
import { datePicker } from "./date-picker.api.js";
import { dateRangeField } from "./date-range-field.api.js";
import { dateRangePicker } from "./date-range-picker.api.js";
import { dialog } from "./dialog.api.js";
import { dropdownMenu } from "./dropdown-menu.api.js";
import { label } from "./label.api.js";
import { linkPreview } from "./link-preview.api.js";
import { navigationMenu } from "./navigation-menu.api.js";
import { pagination } from "./pagination.api.js";
import { pinInput } from "./pin-input.api.js";
import { popover } from "./popover.api.js";
import { progress } from "./progress.api.js";
import { radioGroup } from "./radio-group.api.js";
import { rangeCalendar } from "./range-calendar.api.js";
import { ratingGroup } from "./rating-group.api.js";
import { scrollArea } from "./scroll-area.api.js";
import { select } from "./select.api.js";
import { separator } from "./separator.api.js";
import { slider } from "./slider.api.js";
import { switchData } from "./switch.api.js";
import { tabs } from "./tabs.api.js";
import { toggleGroup } from "./toggle-group.api.js";
import { toggle } from "./toggle.api.js";
import { toolbar } from "./toolbar.api.js";
import { tooltip } from "./tooltip.api.js";
import { menubar } from "./menubar.api.js";
import { meter } from "./meter.api.js";
import { timeField } from "./time-field.api.js";
import type { APISchema } from "$lib/types/index.js";
import { timeRangeField } from "./time-range-field.api.js";
import { bitsConfig } from "./bits-config.api.js";
import { portal } from "./portal.api.js";

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
	"command",
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
	"meter",
	"navigation-menu",
	"pagination",
	"pin-input",
	"popover",
	"progress",
	"radio-group",
	"range-calendar",
	"rating-group",
	"scroll-area",
	"select",
	"separator",
	"slider",
	"switch",
	"tabs",
	"time-field",
	"time-range-field",
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
	command,
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
	meter,
	"navigation-menu": navigationMenu,
	pagination,
	"pin-input": pinInput,
	popover,
	progress,
	"radio-group": radioGroup,
	"range-calendar": rangeCalendar,
	"rating-group": ratingGroup,
	"scroll-area": scrollArea,
	select,
	separator,
	slider,
	switch: switchData,
	tabs,
	"time-field": timeField,
	"time-range-field": timeRangeField,
	toggle,
	"toggle-group": toggleGroup,
	toolbar,
	tooltip,
};

export const utilities = ["bits-config", "is-using-keyboard", "merge-props", "portal", "use-id"];

export const utilitiesSet = new Set(utilities);

export type Utility = (typeof utilities)[number];

export const utilitiesSchemas: Record<Utility, APISchema[]> = {
	"bits-config": [bitsConfig],
	"is-using-keyboard": [],
	"merge-props": [],
	portal: [portal],
	"use-id": [],
};

export function isUtility(value: string): value is Utility {
	return utilitiesSet.has(value as (typeof utilities)[number]);
}

export function getUtilityAPISchemas(utility: Utility): APISchema[] {
	return utilitiesSchemas[utility];
}

export function getAPISchemas(bit: Bit): APISchema[] {
	return apiSchemas[bit];
}

export * from "./shared.js";
