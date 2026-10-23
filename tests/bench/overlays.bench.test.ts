import { describe, it } from "vitest";
import type { Component } from "svelte";
import { bench, writeResults, assert, $ } from "./harness.js";
import { props } from "./props.svelte.js";
import Popover from "./fixtures/popover.svelte";
import LinkPreview from "./fixtures/link-preview.svelte";
import Tooltip from "./fixtures/tooltip.svelte";
import Dialog from "./fixtures/dialog.svelte";
import AlertDialog from "./fixtures/alert-dialog.svelte";
import NavigationMenu from "./fixtures/navigation-menu.svelte";
import Menubar from "./fixtures/menubar.svelte";

writeResults("overlays");

const contentOpen = () => assert($(document, "[data-bench=content]"), "content mounted");

// Each fixture renders `count` closed instances; `openIndex` opens one of them.
// oxlint-disable-next-line no-explicit-any
const many: [string, Component<any>, number][] = [
	["popover", Popover, 200],
	["link-preview", LinkPreview, 200],
	["tooltip", Tooltip, 300],
	["dialog", Dialog, 200],
	["alert-dialog", AlertDialog, 200],
];

for (const [name, component, count] of many) {
	describe(name, () => {
		it(`mount ${count} closed`, () =>
			bench(`${name}/mount-closed-${count}`, { component, props: props({ count }) }));
		it(`open 1 of ${count}`, () =>
			bench(`${name}/open-1-of-${count}`, {
				component,
				props: props({ count, openIndex: -1 }),
				run: ({ props }) => void (props.openIndex = Math.floor(count / 2)),
				verify: contentOpen,
			}));
		it(`close 1 of ${count}`, () =>
			bench(`${name}/close-1-of-${count}`, {
				component,
				props: props({ count, openIndex: Math.floor(count / 2) }),
				run: ({ props }) => void (props.openIndex = -1),
				// exit may wait on animation frames; only require that it started closing
				verify: () =>
					assert(
						$(document, "[data-bench=content]")?.dataset.state !== "open",
						"content closing"
					),
			}));
	});
}

describe("navigation-menu", () => {
	it("mount 50", () =>
		bench("navigation-menu/mount-50", {
			component: NavigationMenu,
			props: props({ count: 50 }),
		}));
	it("open 1 of 50", () =>
		bench("navigation-menu/open-1-of-50", {
			component: NavigationMenu,
			props: props({ count: 50, value: "" }),
			run: ({ props }) => void (props.value = "i25"),
		}));
});

describe("menubar", () => {
	it("mount 5 menus x 100 items", () =>
		bench("menubar/mount-5x100", { component: Menubar, props: props({ count: 100 }) }));
	it("open menu of 100 items", () =>
		bench("menubar/open-100", {
			component: Menubar,
			props: props({ count: 100, value: "" }),
			run: ({ props }) => void (props.value = "m2"),
			verify: contentOpen,
		}));
});
