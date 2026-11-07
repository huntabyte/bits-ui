import { describe, it } from "vitest";
import { bench, writeResults, assert, $, $$ } from "./harness.js";
import { props } from "./props.svelte.js";
import Calendar from "./fixtures/calendar.svelte";
import RangeCalendar from "./fixtures/range-calendar.svelte";
import DateField from "./fixtures/date-field.svelte";
import TimeField from "./fixtures/time-field.svelte";
import DateRangeField from "./fixtures/date-range-field.svelte";
import TimeRangeField from "./fixtures/time-range-field.svelte";
import DatePicker from "./fixtures/date-picker.svelte";
import DateRangePicker from "./fixtures/date-range-picker.svelte";

writeResults("dates");

for (const [name, component] of [
	["calendar", Calendar],
	["range-calendar", RangeCalendar],
] as const) {
	describe(name, () => {
		it("mount 10", () => bench(`${name}/mount-10`, { component, props: props({ count: 10 }) }));
		it("mount 1 x 12 months", () =>
			bench(`${name}/mount-12-months`, {
				component,
				props: props({ count: 1, numberOfMonths: 12 }),
			}));
		it("change month x10", () =>
			bench(`${name}/change-month-10`, {
				component,
				props: props({ count: 10, month: 1 }),
				run: ({ props }) => void (props.month = 6),
			}));
		it("click next x10", () =>
			bench(`${name}/click-next-1`, {
				component,
				props: props({ count: 1 }),
				run: ({ target }) => {
					for (let i = 0; i < 10; i++) $(target, "[data-bench=next]").click();
				},
			}));
	});
}

for (const [name, component, count] of [
	["date-field", DateField, 100],
	["time-field", TimeField, 100],
	["date-range-field", DateRangeField, 50],
	["time-range-field", TimeRangeField, 50],
] as const) {
	describe(name, () => {
		it(`mount ${count}`, () =>
			bench(`${name}/mount-${count}`, { component, props: props({ count }) }));
		it(`update value x${count}`, () =>
			bench(`${name}/update-${count}`, {
				component,
				props: props({ count, day: 1 }),
				run: ({ props }) => void (props.day = 15),
				verify: ({ target }) => {
					const part = name.startsWith("time") ? "minute" : "day";
					const segments = $$(target, `[data-segment=${part}]`);
					const values = segments.map((segment) => segment.getAttribute("aria-valuenow"));
					assert(
						values.filter((value) => value === "15").length === count,
						"start values updated"
					);
					assert(
						values.every((value) => value === "15" || value === "20"),
						"all values updated"
					);
				},
			}));
	});
}

for (const [name, component, count] of [
	["date-picker", DatePicker, 50],
	["date-range-picker", DateRangePicker, 30],
] as const) {
	describe(name, () => {
		it(`mount ${count} closed`, () =>
			bench(`${name}/mount-closed-${count}`, { component, props: props({ count }) }));
		it(`open 1 of ${count}`, () =>
			bench(`${name}/open-1-of-${count}`, {
				component,
				props: props({ count, openIndex: -1 }),
				run: ({ props }) => void (props.openIndex = 3),
				verify: () => assert($(document, "[data-bench=content]"), "open"),
			}));
	});
}
