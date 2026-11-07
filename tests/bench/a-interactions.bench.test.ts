import { describe, it } from "vitest";
import { flushSync } from "svelte";
import { bench, writeResults, assert, key, pointer, settle, $, $$ } from "./harness.js";
import { props } from "./props.svelte.js";
import DropdownMenu from "./fixtures/dropdown-menu.svelte";
import MenuSub from "./fixtures/a-menu-sub.svelte";
import NestedDialog from "./fixtures/a-nested-dialog.svelte";
import SelectGroups from "./fixtures/a-select-groups.svelte";
import Combobox from "./fixtures/combobox.svelte";
import TooltipHover from "./fixtures/a-tooltip-hover.svelte";
import NavigationMenu from "./fixtures/navigation-menu.svelte";
import PopoverOpen from "./fixtures/a-popover-open.svelte";

writeResults("a-interactions");

const items = () => $$(document, "[data-bench=item]");

describe("dropdown-menu", () => {
	it("pointer hover across 100 of 500 items", () =>
		bench("dropdown-menu/hover-100-of-500", {
			component: DropdownMenu,
			props: props({ count: 500, open: true }),
			run: () => {
				const all = items();
				for (let i = 0; i < 100; i++) {
					pointer(all[i]!, "pointermove");
					flushSync();
				}
			},
			verify: () =>
				assert(document.activeElement?.textContent?.trim() === "Item 99", "last hovered"),
		}));
	// unlike `arrow-50-of-500`, each key goes to the focused item, as it does for a user
	it("arrow down x50 from the focused item in 500", () =>
		bench("dropdown-menu/arrow-focused-50-of-500", {
			component: DropdownMenu,
			props: props({ count: 500, open: true }),
			// opening may already have focused the first item (keyboard mode carries over)
			setup: () => $(document, "[data-bench=content]").focus(),
			run: () => {
				for (let i = 0; i < 50; i++) {
					key(document.activeElement ?? $(document, "[data-bench=content]"), "ArrowDown");
				}
			},
			verify: () =>
				assert(document.activeElement?.textContent?.trim() === "Item 49", "focus moved"),
		}));
	it("open submenu of 100", () =>
		bench("dropdown-menu/sub-open-100", {
			component: MenuSub,
			props: props({ count: 100, subOpen: false }),
			run: ({ props }) => void (props.subOpen = true),
			verify: () => assert($$(document, "[data-bench=sub-item]").length === 100, "sub items"),
		}));
	it("close submenu of 100", () =>
		bench("dropdown-menu/sub-close-100", {
			component: MenuSub,
			props: props({ count: 100, subOpen: true }),
			run: ({ props }) => void (props.subOpen = false),
			verify: () =>
				assert(
					$(document, "[data-bench=sub-content]")?.dataset.state !== "open",
					"sub closing"
				),
		}));
});

describe("dialog", () => {
	it("open nested dialog", () =>
		bench("dialog/nested-open", {
			component: NestedDialog,
			props: props({ innerOpen: false }),
			run: ({ props }) => void (props.innerOpen = true),
			verify: () => assert($(document, "[data-bench=inner]"), "inner open"),
		}));
	it("close nested dialog", () =>
		bench("dialog/nested-close", {
			component: NestedDialog,
			props: props({ innerOpen: true }),
			run: ({ props }) => void (props.innerOpen = false),
			verify: () =>
				assert(
					$(document, "[data-bench=inner]")?.dataset.state !== "open",
					"inner closing"
				),
		}));
});

describe("select groups", () => {
	it("open 50 groups x 20", () =>
		bench("select/groups-open-50x20", {
			component: SelectGroups,
			props: props({ groups: 50, perGroup: 20, open: false }),
			run: ({ props }) => void (props.open = true),
			verify: () => assert(items().length === 1000, "items"),
		}));
	it("arrow down x50 in 50 groups x 20", () =>
		bench("select/groups-arrow-50-of-50x20", {
			component: SelectGroups,
			props: props({ groups: 50, perGroup: 20, open: true }),
			run: ({ target }) => {
				const trigger = $(target, "[data-bench=trigger]");
				for (let i = 0; i < 50; i++) key(trigger, "ArrowDown");
			},
			verify: () =>
				assert(
					$(document, "[data-bench=item][data-highlighted]")?.textContent?.trim() ===
						"Item 2-10",
					"highlight moved"
				),
		}));
});

describe("combobox", () => {
	it("type 'Item 99' with live filter", () =>
		bench("combobox/type-filter-1000", {
			component: Combobox,
			props: props({ count: 1000, open: true, search: "" }),
			run: ({ target }) => {
				const input = $(target, "[data-bench=input]") as HTMLInputElement;
				let value = "";
				for (const ch of "Item 99") {
					value += ch;
					input.value = value;
					input.dispatchEvent(new InputEvent("input", { bubbles: true, data: ch }));
					flushSync();
				}
			},
			verify: () => assert(items().length === 11, "filtered to Item 99*"),
		}));
});

describe("tooltip", () => {
	it("hover across 20 triggers, delay 0", () =>
		bench("tooltip/hover-20-of-300", {
			component: TooltipHover,
			props: props({ count: 300 }),
			run: ({ target }) => {
				const triggers = $$(target, "[data-bench=trigger]");
				for (let i = 0; i < 20; i++) {
					if (i > 0)
						pointer(triggers[i - 1]!, "pointerleave", { relatedTarget: triggers[i] });
					pointer(triggers[i]!, "pointerenter");
					flushSync();
				}
			},
			verify: () =>
				assert(
					$$(document, "[data-bench=content]").some(
						(el) => el.textContent === "tip 19" && el.dataset.state !== "closed"
					),
					"last tooltip open"
				),
		}));
});

describe("navigation-menu", () => {
	it("hover between 10 triggers", () =>
		bench("navigation-menu/hover-10-of-50", {
			component: NavigationMenu,
			props: props({ count: 50, value: "" }),
			run: async ({ target }) => {
				const triggers = $$(target, "[data-bench=trigger]");
				for (let i = 0; i < 10; i++) {
					if (i > 0) pointer(triggers[i - 1]!, "pointerleave");
					pointer(triggers[i]!, "pointerenter");
					pointer(triggers[i]!, "pointermove");
					flushSync();
				}
			},
			verify: ({ target }) =>
				assert(
					$$(target, "[data-bench=trigger]")[9]?.dataset.state === "open",
					"last hovered trigger open"
				),
		}));
});

describe("popover scroll", () => {
	let startTransform = "";
	it("scroll the page 20 times while open", () =>
		bench("popover/scroll-20-open", {
			component: PopoverOpen,
			props: props({}),
			setup: () => {
				window.scrollTo(0, 0);
				startTransform = $(document, "[data-bench=content]")!.parentElement!.style
					.transform;
			},
			// the real `scroll` event waits for a frame; dispatch it right away instead
			run: async () => {
				for (let i = 1; i <= 20; i++) {
					window.scrollTo(0, i * 5);
					window.dispatchEvent(new Event("scroll"));
					await settle();
				}
			},
			verify: () => {
				const transform = $(document, "[data-bench=content]")?.parentElement?.style
					.transform;
				window.scrollTo(0, 0);
				assert(transform && transform !== startTransform, "content followed the scroll");
			},
		}));
	it("20 window resize events while open", () =>
		bench("popover/resize-20-open", {
			component: PopoverOpen,
			props: props({}),
			run: () => {
				for (let i = 0; i < 20; i++) window.dispatchEvent(new Event("resize"));
			},
			verify: () => assert($(document, "[data-bench=content]"), "still open"),
		}));
});
