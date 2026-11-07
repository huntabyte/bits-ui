import { describe, it } from "vitest";
import { flushSync } from "svelte";
import type { Component } from "svelte";
import { bench, writeResults, assert, key, $, $$ } from "./harness.js";
import { props } from "./props.svelte.js";
import Select from "./fixtures/select.svelte";
import Combobox from "./fixtures/combobox.svelte";
import Command from "./fixtures/command.svelte";
import DropdownMenu from "./fixtures/dropdown-menu.svelte";
import ContextMenu from "./fixtures/context-menu.svelte";

writeResults("lists");

const highlighted = () => $(document, "[data-bench=item][data-highlighted]");

describe("select", () => {
	it("mount closed 1000", () =>
		bench("select/mount-closed-1000", { component: Select, props: props({ count: 1000 }) }));
	it("open 1000", () =>
		bench("select/open-1000", {
			component: Select,
			props: props({ count: 1000, open: false }),
			run: ({ props }) => void (props.open = true),
			verify: () => assert($$(document, "[data-bench=item]").length === 1000, "items"),
		}));
	it("arrow down x50 in 1000", () =>
		bench("select/arrow-50-of-1000", {
			component: Select,
			props: props({ count: 1000, open: true }),
			run: ({ target }) => {
				const trigger = $(target, "[data-bench=trigger]");
				for (let i = 0; i < 50; i++) key(trigger, "ArrowDown");
			},
			verify: () =>
				assert(highlighted()?.textContent?.includes("Item 50"), "highlight moved"),
		}));
	it("select value in 1000 (open)", () =>
		bench("select/set-value-1000", {
			component: Select,
			props: props({ count: 1000, open: true, value: "1" }),
			run: ({ props }) => void (props.value = "500"),
		}));
});

describe("combobox", () => {
	it("mount closed 1000", () =>
		bench("combobox/mount-closed-1000", {
			component: Combobox,
			props: props({ count: 1000 }),
		}));
	it("open 1000", () =>
		bench("combobox/open-1000", {
			component: Combobox,
			props: props({ count: 1000, open: false }),
			run: ({ props }) => void (props.open = true),
			verify: () => assert($$(document, "[data-bench=item]").length === 1000, "items"),
		}));
	it("filter 1000 -> ~100", () =>
		bench("combobox/filter-1000", {
			component: Combobox,
			props: props({ count: 1000, open: true, search: "" }),
			run: ({ props }) => void (props.search = "Item 1"),
			verify: () => assert($$(document, "[data-bench=item]").length < 1000, "filtered"),
		}));
	it("arrow down x50 in 1000", () =>
		bench("combobox/arrow-50-of-1000", {
			component: Combobox,
			props: props({ count: 1000, open: true }),
			run: ({ target }) => {
				const input = $(target, "[data-bench=input]");
				for (let i = 0; i < 50; i++) key(input, "ArrowDown");
			},
			verify: () => assert(highlighted(), "highlighted"),
		}));
});

describe("command", () => {
	it("mount 1000 items", () =>
		bench("command/mount-1000", { component: Command, props: props({ count: 1000 }) }));
	it("search 1000", () =>
		bench("command/search-1000", {
			component: Command,
			props: props({ count: 1000, search: "" }),
			run: ({ props }) => void (props.search = "item 5-1"),
			verify: ({ target }) =>
				assert(
					$$(target, "[data-bench=item]").length < 1000 ||
						$$(target, "[data-bench=item][hidden]").length > 0 ||
						$$(target, "[data-bench=item]").some(
							(e) => getComputedStyle(e).display === "none"
						),
					"filtered"
				),
		}));
	it("clear search 1000", () =>
		bench("command/clear-search-1000", {
			component: Command,
			props: props({ count: 1000, search: "item 5-1" }),
			run: ({ props }) => void (props.search = ""),
			verify: ({ target }) =>
				assert($$(target, "[data-bench=item]").length === 1000, "all items restored"),
		}));
	it("arrow down x50 in 1000", () =>
		bench("command/arrow-50-of-1000", {
			component: Command,
			props: props({ count: 1000 }),
			run: ({ target }) => {
				const input = $(target, "[data-bench=input]");
				for (let i = 0; i < 50; i++) {
					key(input, "ArrowDown");
					flushSync();
				}
			},
			verify: ({ target }) =>
				assert(
					$(target, "[data-bench=item][data-selected]")?.dataset.value === "item 0-50",
					"selection moved fifty items"
				),
		}));
});

// oxlint-disable-next-line no-explicit-any
const menus: [string, Component<any>][] = [
	["dropdown-menu", DropdownMenu],
	["context-menu", ContextMenu],
];
for (const [name, component] of menus) {
	describe(name, () => {
		it("mount closed 500", () =>
			bench(`${name}/mount-closed-500`, { component, props: props({ count: 500 }) }));
		it("open 500", () =>
			bench(`${name}/open-500`, {
				component,
				props: props({ count: 500, open: false }),
				run: ({ props }) => void (props.open = true),
				verify: () => assert($$(document, "[data-bench=item]").length === 500, "items"),
			}));
		it("arrow down x50 in 500", () =>
			bench(`${name}/arrow-50-of-500`, {
				component,
				props: props({ count: 500, open: true }),
				run: () => {
					const content = $(document, "[data-bench=content]");
					for (let i = 0; i < 50; i++) key(content, "ArrowDown");
				},
			}));
	});
}
