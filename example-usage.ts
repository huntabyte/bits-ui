import { createBitsAttrs } from "$lib/internal/attrs.js";

// Simple case - accordion
const accordionParts = ["root", "trigger", "content", "item", "header"] as const;
const accordionAttrs = createBitsAttrs({
	component: "accordion",
	parts: accordionParts,
});

// Usage:
// accordionAttrs.root → "data-accordion-root"
// accordionAttrs.trigger → "data-accordion-trigger"
// accordionAttrs.selector("root") → "[data-accordion-root]"

// Conditional case - calendar with range support
const calendarParts = ["root", "header", "grid", "cell", "prev", "next"] as const;
const createCalendarAttrs = (isRange: boolean) =>
	createBitsAttrs({
		component: "calendar",
		parts: calendarParts,
		getVariant: () => (isRange ? "range-calendar" : null),
	});

const normalCalendar = createCalendarAttrs(false);
// normalCalendar.root → "data-calendar-root"

const rangeCalendar = createCalendarAttrs(true);
// rangeCalendar.root → "data-range-calendar-root"

// Select/Combobox case with state-based variant
const selectParts = ["trigger", "content", "item", "label"] as const;
const createSelectAttrs = (isCombobox: boolean) =>
	createBitsAttrs({
		component: "select",
		parts: selectParts,
		getVariant: () => (isCombobox ? "combobox" : null),
	});

const select = createSelectAttrs(false);
// select.trigger → "data-select-trigger"

const combobox = createSelectAttrs(true);
// combobox.trigger → "data-combobox-trigger"

// CSS selectors
const styles = `
  ${accordionAttrs.selector("trigger")} {
    /* styles for [data-accordion-trigger] */
  }

  ${select.selector("content")} {
    /* styles for [data-select-content] */
  }
`;
