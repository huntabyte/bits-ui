import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd } from "../utils.js";
import PopoverTest, { type PopoverTestProps } from "./popover-test.svelte";
import PopoverForceMountTest, {
	type PopoverForceMountTestProps,
} from "./popover-force-mount-test.svelte";
import PopoverSiblingsTest from "./popover-siblings-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import { page, userEvent } from "@vitest/browser/context";
import PopoverMultipleTriggersTest from "./popover-multiple-triggers-test.svelte";
import PopoverOverlayTest from "./popover-overlay-test.svelte";
import PopoverHoverTest, { type PopoverHoverTestProps } from "./popover-hover-test.svelte";

const kbd = getTestKbd();

function setup(
	props: PopoverTestProps | PopoverForceMountTestProps = {},
	component: Component = PopoverTest
) {
	render(component, { ...props });

	const trigger = page.getByTestId("trigger");
	function getContent() {
		return page.getByTestId("content");
	}
	return { trigger, getContent };
}

async function open(props: PopoverTestProps = {}, openWith: "click" | (string & {}) = "click") {
	const t = setup(props);
	await expectNotExists(t.getContent());
	if (openWith === "click") {
		await t.trigger.click();
	} else {
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(openWith);
	}
	await expectExists(t.getContent());
	const content = page.getByTestId("content");
	return { content, ...t };
}

it("should have bits data attrs", async () => {
	await open();
	const parts = ["trigger", "content", "close", "arrow"];

	for (const part of parts) {
		const el = page.getByTestId(part);
		await expect.element(el).toHaveAttribute(`data-popover-${part}`);
	}
});

it("should apply custom style prop to content", async () => {
	const t = await open({
		contentProps: {
			style: { backgroundColor: "rgb(255, 0, 0)" },
		},
	});
	const contentEl = t.content.element() as HTMLElement;
	expect(contentEl.style.backgroundColor).toBe("rgb(255, 0, 0)");
});

it("should apply custom style prop to content (static)", async () => {
	const t = setup(
		{
			contentProps: {
				style: { backgroundColor: "rgb(0, 255, 0)" },
			},
		},
		PopoverForceMountTest
	);
	await expectExists(t.getContent());
	const contentEl = t.getContent().element() as HTMLElement;
	expect(contentEl.style.backgroundColor).toBe("rgb(0, 255, 0)");
});

it("should have bits data attrs for overlay", async () => {
	await open({ withOverlay: true });
	const overlay = page.getByTestId("overlay");
	await expect.element(overlay).toHaveAttribute("data-popover-overlay");
});

it("should open on click", async () => {
	await open();
});

it("should open on enter", async () => {
	await open({}, kbd.ENTER);
});

it("should open on space", async () => {
	await open({}, kbd.SPACE);
});

it("should close on escape keydown by default", async () => {
	const t = await open();
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(t.getContent());
});

it("should close on outside click", async () => {
	const mockFn = vi.fn();
	await open({
		contentProps: { onInteractOutside: mockFn },
	});

	await page.getByTestId("outside").click({ force: true });
	await vi.waitFor(() => expect(mockFn).toHaveBeenCalledTimes(1));

	vi.resetAllMocks();
});

it("should not close when clicking within bounds", async () => {
	const mockFn = vi.fn();
	const t = await open({
		contentProps: { onInteractOutside: mockFn },
	});

	await t.getContent().click();

	await expectExists(t.getContent());
});

it("should close when the close button is clicked", async () => {
	const t = await open();
	await page.getByTestId("close").click();
	await expectNotExists(t.getContent());
});

it("should portal to the body by default", async () => {
	const t = await open();
	const contentWrapper = t.getContent().element()?.parentElement;
	expect(contentWrapper?.parentElement).toBe(document.body);
});

it("should portal to a custom element if specified", async () => {
	const t = await open({ portalProps: { to: "#portal-target" } });
	const portalTarget = page.getByTestId("portal-target").element() as HTMLElement;
	const contentWrapper = t.getContent().element()?.parentElement;
	expect(contentWrapper?.parentElement).toBe(portalTarget);
});

it("should not portal if `disabled` is passed to the portal ", async () => {
	const t = await open({
		portalProps: {
			disabled: true,
		},
	});
	const main = page.getByTestId("main").element() as HTMLElement;
	const contentWrapper = t.getContent().element()?.parentElement;
	expect(contentWrapper?.parentElement).toBe(main);
});

it("should allow ignoring the escapeKeydownBehavior ", async () => {
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await userEvent.keyboard(kbd.ESCAPE);
	await expectExists(t.getContent());
});

it("should allow cancelling the `onEscapeKeydown` event", async () => {
	let preventedCount = 0;
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "close",
			onEscapeKeydown: (e) => {
				if (preventedCount > 0) return;
				e.preventDefault();
				preventedCount++;
			},
		},
	});
	await userEvent.keyboard(kbd.ESCAPE);
	await expectExists(t.getContent());
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(t.getContent());
});

it("should allow ignoring the interactOutsideBehavior", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	await page.getByTestId("outside").click({ force: true });
	await expectExists(t.getContent());
});

it("should allow binding the `open` prop", async () => {
	const t = await open();
	const binding = page.getByTestId("binding");
	await expect.element(binding).toHaveTextContent("true");
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(t.getContent());
	await expect.element(binding).toHaveTextContent("false");
	await binding.click();
	await expectExists(t.getContent());
	await expect.element(binding).toHaveTextContent("true");
});

it("should forceMount the content when `forceMount` is true", async () => {
	const t = setup({}, PopoverForceMountTest);

	await expectExists(t.getContent());
});

it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const t = setup({ withOpenCheck: true }, PopoverForceMountTest);
	await expectNotExists(t.getContent());
	await page.getByTestId("trigger").click();
	await expectExists(t.getContent());
});

it("should correctly handle focus when closing one popover by clicking another popover's trigger", async () => {
	render(PopoverSiblingsTest);
	await page.getByTestId("open-1").click();
	await expectExists(page.getByTestId("content-1"));
	await page.getByTestId("open-2").click();
	await expectNotExists(page.getByTestId("content-1"));
	await expectExists(page.getByTestId("content-2"));
	await expect.element(page.getByTestId("close-2")).toHaveFocus();
	await page.getByTestId("open-3").click();
	await expectNotExists(page.getByTestId("content-2"));
	await expectExists(page.getByTestId("content-3"));
	await expect.element(page.getByTestId("close-3")).toHaveFocus();
	await page.getByTestId("close-3").click();
	await expectNotExists(page.getByTestId("content-3"));
});

it("should restore focus to the trigger that opened the popover", async () => {
	render(PopoverMultipleTriggersTest);
	await page.getByTestId("trigger-1").click();
	await expectExists(page.getByTestId("content"));
	await userEvent.keyboard(kbd.ESCAPE);
	await expect.element(page.getByTestId("trigger-1")).toHaveFocus();

	await page.getByTestId("trigger-2").click();
	await expectExists(page.getByTestId("content"));
	await userEvent.keyboard(kbd.ESCAPE);
	await expect.element(page.getByTestId("trigger-2")).toHaveFocus();

	await page.getByTestId("trigger-3").click();
	await expectExists(page.getByTestId("content"));
	await userEvent.keyboard(kbd.ESCAPE);
	await expect.element(page.getByTestId("trigger-3")).toHaveFocus();
});

it("should render overlay when popover is open", async () => {
	await open({ withOverlay: true });
	await expectExists(page.getByTestId("overlay"));
});

it("should not render overlay when popover is closed", async () => {
	setup({ withOverlay: true });
	await expectNotExists(page.getByTestId("overlay"));
});

it("should forceMount overlay when forceMount is true", async () => {
	setup({ withOverlay: true, overlayProps: { forceMount: true } });
	await expectExists(page.getByTestId("overlay"));
});

it("should have correct data-state attribute on overlay when open", async () => {
	await open({ withOverlay: true });
	const overlay = page.getByTestId("overlay");
	await expect.element(overlay).toHaveAttribute("data-state", "open");
});

it("should have correct data-state attribute on overlay when closed with forceMount", async () => {
	setup({ withOverlay: true, overlayProps: { forceMount: true } });
	const overlay = page.getByTestId("overlay");
	await expect.element(overlay).toHaveAttribute("data-state", "closed");
});

it("should portal overlay along with content by default", async () => {
	await open({ withOverlay: true });
	const overlay = page.getByTestId("overlay").element();
	expect(overlay?.parentElement).toBe(document.body);
});

it("should portal overlay to custom element if specified", async () => {
	await open({ withOverlay: true, portalProps: { to: "#portal-target" } });
	const portalTarget = page.getByTestId("portal-target").element() as HTMLElement;
	const overlay = page.getByTestId("overlay").element();
	expect(overlay?.parentElement).toBe(portalTarget);
});

it("should render overlay with child snippet", async () => {
	render(PopoverOverlayTest, { withChild: true });
	await page.getByTestId("trigger").click();
	await expectExists(page.getByTestId("overlay-child"));
	await expect.element(page.getByTestId("overlay-child")).toHaveAttribute("data-popover-overlay");
});

it("should pass open snippet prop to overlay child", async () => {
	render(PopoverOverlayTest, { withChild: true });
	const trigger = page.getByTestId("trigger");
	await trigger.click();
	await expectExists(page.getByTestId("overlay-child"));
	await expect.element(page.getByTestId("overlay-child")).toHaveAttribute("data-open", "true");

	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(page.getByTestId("overlay-child"));
});

it("should pass open snippet prop to overlay children", async () => {
	render(PopoverOverlayTest, { withChild: true, overlayProps: { forceMount: true } });
	const overlayChild = page.getByTestId("overlay-child");
	await expect.element(overlayChild).toHaveAttribute("data-open", "false");

	await page.getByTestId("trigger").click();
	await expect.element(overlayChild).toHaveAttribute("data-open", "true");
});

describe("openOnHover", () => {
	function setupHover(props: PopoverHoverTestProps = {}) {
		render(PopoverHoverTest, { ...props });

		const trigger = page.getByTestId("trigger");
		function getContent() {
			return page.getByTestId("content");
		}
		return { trigger, getContent };
	}

	it("should open on hover when openOnHover is true", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0 } });
		await expectNotExists(t.getContent());

		await t.trigger.hover();
		await expectExists(t.getContent());
	});

	it("should not open on hover when openOnHover is false (default)", async () => {
		const t = setupHover({});
		await expectNotExists(t.getContent());

		await t.trigger.hover();
		await expectNotExists(t.getContent());
	});

	it("should respect openDelay before opening", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 100 } });
		await expectNotExists(t.getContent());

		await t.trigger.hover();
		// should not be open immediately
		await expectNotExists(t.getContent());

		// wait for delay
		await vi.waitFor(
			async () => {
				await expectExists(t.getContent());
			},
			{ timeout: 200 }
		);
	});

	it("should close on hover out when no interaction", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		// hover outside
		await page.getByTestId("outside").hover();
		await expectNotExists(t.getContent());
	});

	it("should respect closeDelay before closing", async () => {
		const t = setupHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 100 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// hover outside
		await page.getByTestId("outside").hover();
		// should still be open immediately after leaving
		await expectExists(t.getContent());

		// wait for close delay
		await vi.waitFor(
			async () => {
				await expectNotExists(t.getContent());
			},
			{ timeout: 200 }
		);
	});

	it("should stay open when moving from trigger to content (grace area)", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		// move to content
		await t.getContent().hover();
		await expectExists(t.getContent());
	});

	it("should stay open when moving from content back to trigger", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		// move to content
		await t.getContent().hover();
		await expectExists(t.getContent());

		// move back to trigger - should stay open without flickering
		await t.trigger.hover();
		await expectExists(t.getContent());
	});

	it("should close when leaving content without interaction", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		// move to content then outside
		await t.getContent().hover();
		await expectExists(t.getContent());

		await page.getByTestId("outside").hover();
		await expectNotExists(t.getContent());
	});

	it("should stay open after clicking trigger while hovering (converts to click-opened)", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		// click while hovering
		await t.trigger.click();

		// move outside - should stay open since it's now click-opened
		await page.getByTestId("outside").hover();
		await expectExists(t.getContent());
	});

	it("should stay open after clicking inside content (interaction)", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		// click inside content
		await page.getByTestId("content-text").click();

		// move outside - should stay open due to interaction
		await page.getByTestId("outside").hover();
		await expectExists(t.getContent());
	});

	it("should stay open after focusing interactive element inside content", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		// focus the button inside content
		(page.getByTestId("focusable-button").element() as HTMLElement).focus();

		// move outside - should stay open due to interaction
		await page.getByTestId("outside").hover();
		await expectExists(t.getContent());
	});

	it("should close on escape even when hover-opened", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
	});

	it("should close on outside click even when hover-opened", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		await page.getByTestId("outside").click({ force: true });
		await expectNotExists(t.getContent());
	});

	it("should still open via click when openOnHover is true", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 300 } });
		await expectNotExists(t.getContent());

		// click should open immediately without waiting for hover delay
		await t.trigger.click();
		await expectExists(t.getContent());
	});

	it("should still open via keyboard when openOnHover is true", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 300 } });
		await expectNotExists(t.getContent());

		// keyboard should open immediately
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ENTER);
		await expectExists(t.getContent());
	});

	it("should cancel open timeout if pointer leaves before delay completes", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 200 } });
		await expectNotExists(t.getContent());

		await t.trigger.hover();
		// leave before delay
		await page.getByTestId("outside").hover();

		// wait longer than the delay
		await new Promise((r) => setTimeout(r, 300));
		// should not have opened
		await expectNotExists(t.getContent());
	});

	it("should cancel close timeout if pointer re-enters before delay completes", async () => {
		const t = setupHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 200 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// leave then quickly re-enter
		await page.getByTestId("outside").hover();
		await t.trigger.hover();

		// wait longer than close delay
		await new Promise((r) => setTimeout(r, 300));
		// should still be open
		await expectExists(t.getContent());
	});

	it("should close on second click and not reopen immediately via hover", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 } });

		// hover opens
		await t.trigger.hover();
		await expectExists(t.getContent());

		// first click converts to click-based
		await t.trigger.click();
		await expectExists(t.getContent());

		// second click closes
		await t.trigger.click();
		await expectNotExists(t.getContent());

		// should not reopen via hover while mouse is still over trigger
		await new Promise((r) => setTimeout(r, 50));
		await expectNotExists(t.getContent());
	});

	it("should allow hover reopen after leaving and re-entering trigger", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 } });

		// hover opens
		await t.trigger.hover();
		await expectExists(t.getContent());

		// first click converts
		await t.trigger.click();
		await expectExists(t.getContent());

		// second click closes
		await t.trigger.click();
		await expectNotExists(t.getContent());

		// leave trigger
		await page.getByTestId("outside").hover();

		// re-enter trigger - hover should work again
		await t.trigger.hover();
		await expectExists(t.getContent());
	});

	it("should allow click to explicitly reopen while in cooldown", async () => {
		const t = setupHover({ triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 } });

		// hover opens
		await t.trigger.hover();
		await expectExists(t.getContent());

		// first click converts
		await t.trigger.click();

		// second click closes
		await t.trigger.click();
		await expectNotExists(t.getContent());

		// third click should explicitly reopen
		await t.trigger.click();
		await expectExists(t.getContent());
	});
});

describe("openOnHover with forceMount", () => {
	function setupForceMountHover(props: PopoverForceMountTestProps = {}) {
		render(PopoverForceMountTest, { withOpenCheck: true, ...props });

		const trigger = page.getByTestId("trigger");
		function getContent() {
			return page.getByTestId("content-text");
		}
		function getOutside() {
			return page.getByTestId("outside");
		}
		return { trigger, getContent, getOutside };
	}

	it("should open on hover when openOnHover is true", async () => {
		const t = setupForceMountHover({ triggerProps: { openOnHover: true, openDelay: 0 } });
		await expectNotExists(t.getContent());

		await t.trigger.hover();
		await expectExists(t.getContent());
	});

	it("should not open on hover when openOnHover is false (default)", async () => {
		const t = setupForceMountHover({});
		await expectNotExists(t.getContent());

		await t.trigger.hover();
		await expectNotExists(t.getContent());
	});

	it("should respect openDelay before opening", async () => {
		const t = setupForceMountHover({ triggerProps: { openOnHover: true, openDelay: 100 } });
		await expectNotExists(t.getContent());

		await t.trigger.hover();
		// should not be open immediately
		await expectNotExists(t.getContent());

		// wait for delay
		await vi.waitFor(
			async () => {
				await expectExists(t.getContent());
			},
			{ timeout: 200 }
		);
	});

	it("should close on hover out when no interaction", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// hover outside
		await t.getOutside().hover();
		await expectNotExists(t.getContent());
	});

	it("should reopen on second hover after closing via hover out (forceMount)", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		// first hover opens
		await t.trigger.hover();
		await expectExists(t.getContent());

		// hover out closes
		await t.getOutside().hover();
		await expectNotExists(t.getContent());

		// second hover opens again
		await t.trigger.hover();
		await expectExists(t.getContent());
	});

	it("should respect closeDelay before closing", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 100 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// hover outside
		await t.getOutside().hover();
		// should still be open immediately after leaving
		await expectExists(t.getContent());

		// wait for close delay
		await vi.waitFor(
			async () => {
				await expectNotExists(t.getContent());
			},
			{ timeout: 200 }
		);
	});

	it("should stay open when moving from trigger to content (grace area)", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// move to content
		await t.getContent().hover();
		await expectExists(t.getContent());
	});

	it("should stay open when moving from content back to trigger", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// move to content
		await t.getContent().hover();
		await expectExists(t.getContent());

		// move back to trigger - should stay open without flickering
		await t.trigger.hover();
		await expectExists(t.getContent());
	});

	it("should close when leaving content without interaction", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// move to content then outside
		await t.getContent().hover();
		await expectExists(t.getContent());

		await t.getOutside().hover();
		await expectNotExists(t.getContent());
	});

	it("should stay open after clicking trigger while hovering (converts to click-opened)", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// click while hovering
		await t.trigger.click();

		// move outside - should stay open since it's now click-opened
		await t.getOutside().hover();
		await expectExists(t.getContent());
	});

	it("should stay open after clicking inside content (interaction)", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// click inside content
		await t.getContent().click();

		// move outside - should stay open due to interaction
		await t.getOutside().hover();
		await expectExists(t.getContent());
	});

	it("should stay open after focusing interactive element inside content", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// focus the button inside content
		(page.getByTestId("focusable-button").element() as HTMLElement).focus();

		// move outside - should stay open due to interaction
		await t.getOutside().hover();
		await expectExists(t.getContent());
	});

	it("should close on escape even when hover-opened", async () => {
		const t = setupForceMountHover({ triggerProps: { openOnHover: true, openDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent());
	});

	it("should close on outside click even when hover-opened", async () => {
		const t = setupForceMountHover({ triggerProps: { openOnHover: true, openDelay: 0 } });

		await t.trigger.hover();
		await expectExists(t.getContent());

		await t.getOutside().click({ force: true });
		await expectNotExists(t.getContent());
	});

	it("should still open via click when openOnHover is true", async () => {
		const t = setupForceMountHover({ triggerProps: { openOnHover: true, openDelay: 300 } });
		await expectNotExists(t.getContent());

		// click should open immediately without waiting for hover delay
		await t.trigger.click();
		await expectExists(t.getContent());
	});

	it("should still open via keyboard when openOnHover is true", async () => {
		const t = setupForceMountHover({ triggerProps: { openOnHover: true, openDelay: 300 } });
		await expectNotExists(t.getContent());

		// keyboard should open immediately
		(t.trigger.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ENTER);
		await expectExists(t.getContent());
	});

	it("should cancel open timeout if pointer leaves before delay completes", async () => {
		const t = setupForceMountHover({ triggerProps: { openOnHover: true, openDelay: 200 } });
		await expectNotExists(t.getContent());

		await t.trigger.hover();
		// leave before delay
		await t.getOutside().hover();

		// wait longer than the delay
		await new Promise((r) => setTimeout(r, 300));
		// should not have opened
		await expectNotExists(t.getContent());
	});

	it("should cancel close timeout if pointer re-enters before delay completes", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 200 },
		});

		await t.trigger.hover();
		await expectExists(t.getContent());

		// leave then quickly re-enter
		await t.getOutside().hover();
		await t.trigger.hover();

		// wait longer than close delay
		await new Promise((r) => setTimeout(r, 300));
		// should still be open
		await expectExists(t.getContent());
	});

	it("should close on second click and not reopen immediately via hover", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		// hover opens
		await t.trigger.hover();
		await expectExists(t.getContent());

		// first click converts to click-based
		await t.trigger.click();
		await expectExists(t.getContent());

		// second click closes
		await t.trigger.click();
		await expectNotExists(t.getContent());

		// should not reopen via hover while mouse is still over trigger
		await new Promise((r) => setTimeout(r, 50));
		await expectNotExists(t.getContent());
	});

	it("should allow hover reopen after leaving and re-entering trigger", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		// hover opens
		await t.trigger.hover();
		await expectExists(t.getContent());

		// first click converts
		await t.trigger.click();
		await expectExists(t.getContent());

		// second click closes
		await t.trigger.click();
		await expectNotExists(t.getContent());

		// leave trigger
		await t.getOutside().hover();

		// re-enter trigger - hover should work again
		await t.trigger.hover();
		await expectExists(t.getContent());
	});

	it("should allow click to explicitly reopen while in cooldown", async () => {
		const t = setupForceMountHover({
			triggerProps: { openOnHover: true, openDelay: 0, closeDelay: 0 },
		});

		// hover opens
		await t.trigger.hover();
		await expectExists(t.getContent());

		// first click converts
		await t.trigger.click();

		// second click closes
		await t.trigger.click();
		await expectNotExists(t.getContent());

		// third click should explicitly reopen
		await t.trigger.click();
		await expectExists(t.getContent());
	});
});
