import { describe, it } from "vitest";
import { flushSync } from "svelte";
import { bench, writeResults, assert, key, pointer, $, $$ } from "./harness.js";
import { props } from "./props.svelte.js";
import Command from "./fixtures/b-command.svelte";
import Fields from "./fixtures/b-fields.svelte";
import Slider from "./fixtures/b-slider.svelte";
import RadioGroup from "./fixtures/radio-group.svelte";

writeResults("b-interactions");

for (const custom of [false, true]) {
	it(`command keyword search ${custom ? "custom" : "default"} filter`, () =>
		bench(`command/keyword-search-${custom ? "custom" : "default"}-1000`, {
			component: Command,
			props: props({ count: 1000, search: "", custom }),
			run: ({ props }) => void (props.search = "alias-5-1"),
			verify: ({ target }) => {
				assert($$(target, "[data-bench=item]").length < 1000, "items filtered");
				assert(
					$(target, "[data-bench=item][data-selected]")?.dataset.value === "item 5-1",
					"keyword match selected"
				);
			},
		}));
}

for (const kind of ["date", "time"] as const) {
	describe(`${kind}-field`, () => {
		it("mount 100 with hours", () =>
			bench(`${kind}-field/mount-hours-100`, {
				component: Fields,
				props: props({ count: 100, kind }),
			}));
		it("type hours in 10", () =>
			bench(`${kind}-field/type-hours-10`, {
				component: Fields,
				props: props({ count: 10, kind }),
				run: ({ target }) => {
					for (const hour of $$(target, "[data-segment=hour]")) {
						hour.focus();
						key(hour, "1");
						flushSync();
						key(hour, "1");
						flushSync();
					}
				},
				verify: ({ target }) =>
					assert(
						$$(target, "[data-segment=hour]").length === 10 &&
							$$(target, "[data-segment=hour]").every(
								(hour) => hour.getAttribute("aria-valuenow") === "11"
							),
						"hours typed"
					),
			}));
	});
}

it("slider pointer drag through 20 values", () =>
	bench("slider/drag-20-of-10", {
		component: Slider,
		props: props({ count: 10 }),
		run: ({ target }) => {
			const slider = $(target, "[data-bench=slider]");
			const { left, top } = slider.getBoundingClientRect();
			pointer($(slider, "[data-bench=thumb]"), "pointerdown", {
				clientX: left + 20,
				clientY: top + 5,
			});
			for (let i = 1; i <= 20; i++) {
				pointer(slider, "pointermove", { clientX: left + 20 + i * 6, clientY: top + 5 });
				flushSync();
			}
			pointer(slider, "pointerup");
		},
		verify: ({ target }) => {
			const thumbs = $$(target, "[data-bench=thumb]");
			assert(thumbs[0]?.dataset.value === "70", "active slider dragged");
			assert(
				thumbs.slice(1).every((thumb) => thumb.dataset.value === "10"),
				"other sliders unchanged"
			);
		},
	}));

it("radio keyboard navigation through 50 of 500", () =>
	bench("radio-group/arrow-50-of-500", {
		component: RadioGroup,
		props: props({ count: 500, value: "0" }),
		run: ({ target }) => {
			$(target, "[data-bench=item]").focus();
			for (let i = 0; i < 50; i++) {
				key(document.activeElement!, "ArrowDown");
				flushSync();
			}
		},
		verify: ({ target }) => {
			const selected = $(target, "[data-bench=item][data-state=checked]");
			assert(selected?.dataset.value === "50", "selection moved");
			assert(selected === document.activeElement, "focus moved");
		},
	}));


it("command custom filter with groups and many keywords", () =>
	bench("command/custom-groups-keywords-8-1000", {
		component: Command,
		props: props({ count: 1000, search: "", custom: true, exact: true, keywordCount: 8 }),
		run: ({ props }) => void (props.search = "keyword-5-1-7"),
		verify: ({ target }) => {
			const items = $$(target, "[data-bench=item]");
			assert(items.length === 1 && items[0]?.dataset.value === "item 5-1", "custom keyword match retained");
			assert(items[0]?.hasAttribute("data-selected"), "match selected");
			const groups = $$(target, "[data-command-group]:not([hidden])");
			assert(groups.length === 1 && groups[0]?.dataset.value === "group-5", "matching group visible");
		},
	}));
