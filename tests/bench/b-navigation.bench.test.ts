import { it } from "vitest";
import { flushSync, tick } from "svelte";
import { bench, writeResults, assert, key, pointer, $, $$ } from "./harness.js";
import { props } from "./props.svelte.js";
import Calendar from "./fixtures/calendar.svelte";
import RangeCalendar from "./fixtures/range-calendar.svelte";
import Tabs from "./fixtures/tabs.svelte";
import ToggleGroup from "./fixtures/toggle-group.svelte";
import Toolbar from "./fixtures/toolbar.svelte";
import Accordion from "./fixtures/b-accordion.svelte";
import Slider from "./fixtures/b-slider.svelte";
import PinInput from "./fixtures/b-pin-input.svelte";
import DateRangeField from "./fixtures/date-range-field.svelte";
import TimeRangeField from "./fixtures/time-range-field.svelte";

writeResults("b-navigation");

for (const [name, component] of [
	["calendar", Calendar],
	["range-calendar", RangeCalendar],
] as const) {
	it(`${name} keyboard across two month boundaries`, () =>
		bench(`${name}/arrow-35-across-months`, {
			component,
			props: props({ count: 1 }),
			setup: ({ target }) => $(target, '[data-bench=day][data-value="2025-01-31"]').focus(),
			run: async () => {
				for (let i = 0; i < 35; i++) {
					key(document.activeElement!, "ArrowRight");
					flushSync();
					await tick();
				}
			},
			verify: ({ target }) => {
				const day = $(target, '[data-bench=day][data-value="2025-03-07"]');
				assert(day === document.activeElement, "focus crossed month boundaries");
				assert(day?.getAttribute("tabindex") === "0", "focused day is tabbable");
			},
		}));
}

it("range-calendar select range by pointer", () =>
	bench("range-calendar/pointer-range-20-days", {
		component: RangeCalendar,
		props: props({ count: 1 }),
		run: ({ target }) => {
			const first = $(target, '[data-bench=day][data-value="2025-01-05"]');
			first.click();
			flushSync();
			for (let day = 6; day <= 25; day++) {
				pointer(
					$(
						target,
						`[data-bench=day][data-value="2025-01-${String(day).padStart(2, "0")}"]`
					),
					"pointerenter"
				);
				flushSync();
			}
			$(target, '[data-bench=day][data-value="2025-01-25"]').click();
		},
		verify: ({ target }) => {
			assert($$(target, "[data-bench=day][data-selected]").length === 21, "range selected");
			assert(
				$(target, '[data-bench=day][data-value="2025-01-05"]').hasAttribute(
					"data-selection-start"
				),
				"start selected"
			);
			assert(
				$(target, '[data-bench=day][data-value="2025-01-25"]').hasAttribute(
					"data-selection-end"
				),
				"end selected"
			);
		},
	}));

for (const [name, component, selector] of [
	["tabs", Tabs, "[data-bench=trigger]"],
	["toggle-group", ToggleGroup, "[data-bench=item]"],
	["toolbar", Toolbar, "[data-bench=item]"],
] as const) {
	it(`${name} arrow navigation through 50 of 200`, () =>
		bench(`${name}/arrow-50-of-200`, {
			component,
			props: props({ count: 200 }),
			setup: ({ target }) => $(target, selector).focus(),
			run: () => {
				for (let i = 0; i < 50; i++) {
					key(document.activeElement!, "ArrowRight");
					flushSync();
				}
			},
			verify: ({ target }) => {
				const item = $$(target, selector)[50];
				assert(item === document.activeElement, "focus advanced fifty items");
				assert(item?.getAttribute("tabindex") === "0", "focused item is tabbable");
				if (name === "tabs")
					assert(item?.getAttribute("aria-selected") === "true", "tab activated");
			},
		}));
}

for (const open of [true, false]) {
	it(`accordion ${open ? "open" : "close"} all 200`, () =>
		bench(`accordion/${open ? "open" : "close"}-all-200`, {
			component: Accordion,
			props: props({
				count: 200,
				value: open ? ([] as string[]) : Array.from({ length: 200 }, (_, i) => String(i)),
			}),
			run: ({ props }) =>
				void (props.value = open ? Array.from({ length: 200 }, (_, i) => String(i)) : []),
			verify: ({ target }) =>
				assert(
					$$(target, "[data-bench=trigger]").every(
						(item) => item.dataset.state === (open ? "open" : "closed")
					),
					"all items updated"
				),
		}));
}

it("slider keyboard fifty steps", () =>
	bench("slider/keyboard-50-of-10", {
		component: Slider,
		props: props({ count: 10 }),
		run: ({ target }) => {
			const thumb = $(target, "[data-bench=thumb]");
			for (let i = 0; i < 50; i++) {
				key(thumb, "ArrowRight");
				flushSync();
			}
		},
		verify: ({ target }) => {
			const thumbs = $$(target, "[data-bench=thumb]");
			assert(thumbs[0]?.dataset.value === "60", "fifty keyboard steps applied");
			assert(
				thumbs.slice(1).every((thumb) => thumb.dataset.value === "10"),
				"other sliders unchanged"
			);
		},
	}));

for (const paste of [false, true]) {
	it(`pin-input ${paste ? "paste" : "type"} six digits in ten inputs`, () =>
		bench(`pin-input/${paste ? "paste" : "type"}-6-in-10`, {
			component: PinInput,
			props: props({ count: 10 }),
			run: ({ target }) => {
				for (const input of target.querySelectorAll<HTMLInputElement>("input")) {
					input.focus();
					if (paste) {
						const clipboardData = new DataTransfer();
						clipboardData.setData("text/plain", "123-456");
						input.dispatchEvent(
							new ClipboardEvent("paste", {
								clipboardData,
								bubbles: true,
								cancelable: true,
							})
						);
						flushSync();
					} else {
						for (const digit of "123456") {
							input.value += digit;
							input.dispatchEvent(
								new InputEvent("input", {
									data: digit,
									inputType: "insertText",
									bubbles: true,
								})
							);
							flushSync();
						}
					}
				}
			},
			verify: ({ target }) => {
				const inputs = [...target.querySelectorAll<HTMLInputElement>("input")];
				assert(
					inputs.length === 10 && inputs.every((input) => input.value === "123456"),
					"all inputs filled"
				);
				assert(
					$$(target, "[data-pin-input-root]").every(
						(root) =>
							$$(root, "[data-bench=cell]")
								.map((cell) => cell.textContent)
								.join("") === "123456"
					),
					"cells reflect all digits"
				);
			},
		}));
}

for (const [name, component, part] of [
	["date-range-field", DateRangeField, "day"],
	["time-range-field", TimeRangeField, "minute"],
] as const) {
	it(`${name} type in both ends of ten ranges`, () =>
		bench(`${name}/type-${part}-in-10`, {
			component,
			props: props({ count: 10 }),
			run: ({ target }) => {
				for (const segment of $$(target, `[data-segment=${part}]`)) {
					segment.focus();
					key(segment, "2");
					flushSync();
					key(segment, "5");
					flushSync();
				}
			},
			verify: ({ target }) => {
				const segments = $$(target, `[data-segment=${part}]`);
				assert(
					segments.length === 20 &&
						segments.every((segment) => segment.getAttribute("aria-valuenow") === "25"),
					"both ends updated"
				);
			},
		}));
}
