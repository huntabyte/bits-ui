import { describe, it } from "vitest";
import { bench, writeResults, assert, key, $ } from "./harness.js";
import { props } from "./props.svelte.js";
import Select from "./fixtures/select.svelte";
import DropdownMenu from "./fixtures/dropdown-menu.svelte";

writeResults("a-lists");

const typeahead = (el: Element, text: string) => {
	for (const ch of text) key(el, ch);
};

describe("typeahead", () => {
	it("dropdown-menu typeahead in 500", () =>
		bench("dropdown-menu/typeahead-500", {
			component: DropdownMenu,
			props: props({ count: 500, open: true }),
			run: () => typeahead($(document, "[data-bench=content]"), "Item 499"),
			verify: () =>
				assert(document.activeElement?.textContent?.trim() === "Item 499", "focused match"),
		}));
	it("select typeahead in 1000", () =>
		bench("select/typeahead-1000", {
			component: Select,
			props: props({ count: 1000, open: true }),
			run: ({ target }) => typeahead($(target, "[data-bench=trigger]"), "Item 999"),
			verify: () =>
				assert(
					$(document, "[data-bench=item][data-highlighted]")?.textContent?.includes(
						"Item 999"
					),
					"highlighted match"
				),
		}));
});
