import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd } from "../utils.js";
import TooltipTest, { type TooltipTestProps } from "./tooltip-test.svelte";
import type { TooltipForceMountTestProps } from "./tooltip-force-mount-test.svelte";
import TooltipForceMountTest from "./tooltip-force-mount-test.svelte";
import TooltipPopoverTest from "./tooltip-popover-test.svelte";
import TooltipManyTest from "./tooltip-many-test.svelte";
import TooltipSingletonTest, { type TooltipSingletonTestProps } from "./tooltip-singleton-test.svelte";
import TooltipTetherTest from "./tooltip-tether-test.svelte";
import TooltipSingletonControlledTest from "./tooltip-singleton-controlled-test.svelte";
import TooltipSingletonForceMountTest, {
	type TooltipSingletonForceMountTestProps,
} from "./tooltip-singleton-force-mount-test.svelte";
import TooltipSingletonEdgeTest from "./tooltip-singleton-edge-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

function setup(
	props: Partial<TooltipTestProps | TooltipForceMountTestProps> = {},
	component: Component = TooltipTest
) {
	render(component, { ...props });
	const trigger = page.getByTestId("trigger");
	return { trigger };
}

async function open(props: Partial<TooltipTestProps> = {}) {
	const t = setup(props);
	await expectNotExists(page.getByTestId("content"));
	await t.trigger.hover();
	await expectExists(page.getByTestId("content"));
	const content = page.getByTestId("content");
	return { content, trigger: t.trigger };
}

function setupSingleton(
	component: Component = TooltipSingletonTest,
	props: Partial<TooltipSingletonForceMountTestProps> | TooltipSingletonTestProps = {}
) {
	render(component, { ...props });
	const trigger1 = page.getByTestId("trigger-1");
	const trigger2 = page.getByTestId("trigger-2");
	const outside = page.getByTestId("outside");
	return { trigger1, trigger2, outside };
}

it("should have bits data attrs", async () => {
	await open();
	const parts = ["trigger", "content"];

	for (const part of parts) {
		const el = page.getByTestId(part);
		await expect.element(el).toHaveAttribute(`data-tooltip-${part}`);
	}
});

it("should use provider delay duration if provided and the tooltip.root did not provide one", async () => {
	const t = setup();
	expect(t.trigger).toHaveAttribute("data-delay-duration", "0");
});

it("should open on hover", async () => {
	const t = await open();
	await t.content.click();
	await expect.element(t.content).toBeVisible();
});

it("should close on escape keydown", async () => {
	await open();
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(page.getByTestId("content"));
});

it("should close when pointer moves outside the trigger and content", async () => {
	await open();

	const outside = page.getByTestId("outside");

	await outside.hover();

	await expectNotExists(page.getByTestId("content"));
});

it("should close on scroll when the scrolled target contains the trigger", async () => {
	const t = await open();
	const main = page.getByTestId("main").element() as HTMLElement;
	main.dispatchEvent(new Event("scroll", { bubbles: true }));
	await expectNotExists(page.getByTestId("content"));
	await expect.element(t.trigger).toBeVisible();
});

it("should stay open when hovering content", async () => {
	const t = await open();
	await t.content.hover();
	await expectExists(page.getByTestId("content"));
});

it("should open on focus and close on blur", async () => {
	const t = setup();
	await expectNotExists(page.getByTestId("content"));

	(t.trigger.element() as HTMLElement).focus();
	await expectExists(page.getByTestId("content"));

	(t.trigger.element() as HTMLElement).blur();
	await expectNotExists(page.getByTestId("content"));
});

it("should portal to the body by default", async () => {
	const t = await open();
	const contentWrapper = t.content.element().parentElement;
	expect(contentWrapper?.parentElement).toBe(document.body);
});

it("should portal to a custom element if specified", async () => {
	const t = await open({ portalProps: { to: "#portal-target" } });
	const portalTarget = page.getByTestId("portal-target").element() as HTMLElement;
	const contentWrapper = t.content.element().parentElement;
	expect(contentWrapper?.parentElement).toBe(portalTarget);
});

it("should not portal if `disabled` is passed to the portal", async () => {
	const t = await open({ portalProps: { disabled: true } });
	const main = page.getByTestId("main").element() as HTMLElement;
	const contentWrapper = t.content.element().parentElement;
	expect(contentWrapper?.parentElement).toBe(main);
});

it("should allow ignoring escapeKeydownBehavior ", async () => {
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await t.content.click();
	await userEvent.keyboard(kbd.ESCAPE);
	await expectExists(page.getByTestId("content"));
});

it("should respect binding the open prop", async () => {
	await open();
	const binding = page.getByTestId("binding");
	await expect.element(binding).toHaveTextContent("true");
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(page.getByTestId("content"));
	await expect.element(binding).toHaveTextContent("false");
	await binding.click();
	await expect.element(binding).toHaveTextContent("true");
	await expectExists(page.getByTestId("content"));
});

it("should forceMount the content when `forceMount` is true", async () => {
	setup({}, TooltipForceMountTest);

	expect(page.getByTestId("content")).toBeVisible();
});

it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const t = setup({ withOpenCheck: true }, TooltipForceMountTest);
	await expectNotExists(page.getByTestId("content"));
	await t.trigger.hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("content")).toBeVisible();
});

it("should open and close correctly with forceMount + open check", async () => {
	const t = setup({ withOpenCheck: true }, TooltipForceMountTest);
	await expectNotExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("binding")).toHaveTextContent("false");

	await t.trigger.hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("binding")).toHaveTextContent("true");

	await page.getByTestId("outside").hover();
	await expectNotExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("binding")).toHaveTextContent("false");
});

it("should keep open state behavior when forceMount keeps content mounted", async () => {
	const t = setup({}, TooltipForceMountTest);
	const binding = page.getByTestId("binding");
	await expect.element(page.getByTestId("content")).toBeVisible();
	await expect.element(binding).toHaveTextContent("false");

	await t.trigger.hover();
	await expect.element(binding).toHaveTextContent("true");

	await page.getByTestId("outside").hover();
	await expect.element(binding).toHaveTextContent("false");
	await expect.element(page.getByTestId("content")).toBeVisible();
});

it("should close on trigger leave after reopening with forceMount", async () => {
	const t = setup({ withOpenCheck: true }, TooltipForceMountTest);
	const outside = page.getByTestId("outside");

	await t.trigger.hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("binding")).toHaveTextContent("true");

	await outside.hover();
	await expectNotExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("binding")).toHaveTextContent("false");

	await t.trigger.hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("binding")).toHaveTextContent("true");

	await outside.hover();
	await expect.element(page.getByTestId("binding")).toHaveTextContent("false");
	await expectNotExists(page.getByTestId("content"));
});

it("should use the custom anchor element when `customAnchor` is provided", async () => {
	// type check
	const t = setup();
	await t.trigger.hover();
	await expectExists(page.getByTestId("content"));
});

it("should open when composed with another floating trigger", async () => {
	render(TooltipPopoverTest);
	await page.getByTestId("trigger").hover();
	await expectExists(page.getByTestId("tooltip-content"));
	await page.getByTestId("trigger").click();
	await expectExists(page.getByTestId("popover-content"));
	await expectNotExists(page.getByTestId("tooltip-content"));
});

it("should have pointer-events: auto on content by default", async () => {
	const t = await open();
	const contentEl = t.content.element() as HTMLElement;
	expect(contentEl.style.pointerEvents).toBe("auto");
});

it("should have pointer-events: none on content when disableHoverableContent is true", async () => {
	const t = await open({ providerProps: { disableHoverableContent: true } });
	const contentEl = t.content.element() as HTMLElement;
	expect(contentEl.style.pointerEvents).toBe("none");
});

it("should close when hovering content with disableHoverableContent: true", async () => {
	await open({ providerProps: { disableHoverableContent: true } });
	const outside = page.getByTestId("outside");
	await outside.hover();
	await expectNotExists(page.getByTestId("content"));
});

it("should respect custom tabindex on trigger", async () => {
	const t = setup({ triggerProps: { tabindex: -1 } });
	await expect.element(t.trigger).toHaveAttribute("tabindex", "-1");
});

it("should have default tabindex of 0 on trigger", async () => {
	const t = setup();
	await expect.element(t.trigger).toHaveAttribute("tabindex", "0");
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

it("should not add a scroll listener per tooltip instance", async () => {
	const addEventListenerSpy = vi.spyOn(window, "addEventListener");

	render(TooltipManyTest, { count: 80 });

	const scrollListenerCalls = addEventListenerSpy.mock.calls.filter(
		([type]) => type === "scroll"
	).length;
	expect(scrollListenerCalls).toBe(1);

	addEventListenerSpy.mockRestore();
});

it("singleton: should open with either trigger and update payload", async () => {
	const t = setupSingleton();
	await expectNotExists(page.getByTestId("content"));

	await t.trigger1.hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Bold");
	await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-1");

	await t.trigger2.hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Italic");
	await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-2");

	await t.outside.hover();
	await expectNotExists(page.getByTestId("content"));
});

it("singleton: should reuse the same content node while switching triggers", async () => {
	const t = setupSingleton();
	await t.trigger1.hover();
	await expectExists(page.getByTestId("content"));
	const contentEl = page.getByTestId("content").element() as HTMLElement;

	await t.trigger2.hover();
	await expectExists(page.getByTestId("content"));
	expect(page.getByTestId("content").element()).toBe(contentEl);
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Italic");
});

it("singleton: should work with detached triggers through tether", async () => {
	render(TooltipTetherTest);
	const triggerTop = page.getByTestId("trigger-top");
	const triggerBottom = page.getByTestId("trigger-bottom");
	const topEl = triggerTop.element() as HTMLElement;
	const bottomEl = triggerBottom.element() as HTMLElement;

	topEl.focus();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Top");
	await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-top");

	topEl.blur();
	bottomEl.focus();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Bottom");
	await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-bottom");

	bottomEl.blur();
	await expectNotExists(page.getByTestId("content"));
});

it("singleton: should support imperative tether open/close", async () => {
	render(TooltipTetherTest);

	await page.getByTestId("tether-open-top").click();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Top");
	await expect.element(page.getByTestId("open-binding")).toHaveTextContent("true");

	await page.getByTestId("tether-open-bottom").click();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Bottom");
	await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-bottom");

	await page.getByTestId("tether-close").click();
	await expectNotExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
});

it("singleton: should close when hovering a detached disabled trigger", async () => {
	render(TooltipTetherTest);
	await page.getByTestId("trigger-top").hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Top");

	await page.getByTestId("trigger-disabled").hover();
	await expectNotExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
});

it("singleton: controlled mode should support programmatic trigger changes", async () => {
	render(TooltipSingletonControlledTest);

	await page.getByTestId("open-trigger-1").click();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("One");
	await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-1");

	await page.getByTestId("open-trigger-2").click();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Two");
	await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-2");

	await page.getByTestId("set-null-trigger").click();
	await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("null");

	await page.getByTestId("close").click();
	await expectNotExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
});

it("singleton forceMount: should keep mounted content and update payload", async () => {
	const t = setupSingleton(TooltipSingletonForceMountTest);
	await expectExists(page.getByTestId("content-node"));

	await t.trigger1.hover();
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Alpha");
	await expect.element(page.getByTestId("open-binding")).toHaveTextContent("true");

	await t.trigger2.hover();
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Beta");
	await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("trigger-2");

	await t.outside.hover();
	await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
	await expectExists(page.getByTestId("content-node"));
});

it("singleton forceMount: should support open-check conditional rendering", async () => {
	const t = setupSingleton(TooltipSingletonForceMountTest, { withOpenCheck: true });
	await expectNotExists(page.getByTestId("content-node"));

	await t.trigger1.hover();
	await expectExists(page.getByTestId("content-node"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("Alpha");

	await t.outside.hover();
	await expectNotExists(page.getByTestId("content-node"));
});

it("singleton edge: should close when active trigger unmounts", async () => {
	render(TooltipSingletonEdgeTest);
	await page.getByTestId("trigger-1").hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("payload")).toHaveTextContent("First");

	await page.getByTestId("toggle-trigger-one").click();
	await expectNotExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
	await expect.element(page.getByTestId("trigger-binding")).toHaveTextContent("null");
});

it("singleton edge: should keep aria-describedby only on active trigger", async () => {
	render(TooltipSingletonEdgeTest);
	const trigger1 = page.getByTestId("trigger-1");
	const trigger2 = page.getByTestId("trigger-2");
	await trigger1.hover();
	await expectExists(page.getByTestId("content"));

	const contentId = (page.getByTestId("content").element() as HTMLElement).id;
	await expect.element(trigger1).toHaveAttribute("aria-describedby", contentId);
	await expect.element(trigger2).not.toHaveAttribute("aria-describedby");

	await trigger2.hover();
	const updatedContentId = (page.getByTestId("content").element() as HTMLElement).id;
	await expect.element(trigger2).toHaveAttribute("aria-describedby", updatedContentId);
	await expect.element(trigger1).not.toHaveAttribute("aria-describedby");
});

it("singleton edge: disabled trigger interaction should close open content", async () => {
	render(TooltipSingletonEdgeTest);
	await page.getByTestId("trigger-1").hover();
	await expectExists(page.getByTestId("content"));

	await page.getByTestId("toggle-trigger-two-disabled").click();
	await page.getByTestId("trigger-2").hover();
	await expectNotExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("open-binding")).toHaveTextContent("false");
});

it("singleton edge: customAnchor should override active trigger anchoring", async () => {
	render(TooltipSingletonEdgeTest);
	await page.getByTestId("trigger-1").hover();
	await expectExists(page.getByTestId("content"));
	const contentLeftWithoutCustomAnchor = (
		page.getByTestId("content").element() as HTMLElement
	).getBoundingClientRect().left;

	await page.getByTestId("toggle-custom-anchor").click();
	await page.getByTestId("outside").hover();
	await expectNotExists(page.getByTestId("content"));

	await page.getByTestId("trigger-2").hover();
	await expectExists(page.getByTestId("content"));

	const contentLeftWithCustomAnchor = (
		page.getByTestId("content").element() as HTMLElement
	).getBoundingClientRect().left;
	const customAnchorLeft = (
		page.getByTestId("custom-anchor").element() as HTMLElement
	).getBoundingClientRect().left;

	expect(Math.abs(contentLeftWithCustomAnchor - customAnchorLeft)).toBeLessThan(20);
	expect(contentLeftWithCustomAnchor).not.toBe(contentLeftWithoutCustomAnchor);
});

it("singleton: should not transition through closed state when moving directly between sibling triggers (skipDelayDuration > 0)", async () => {
	const t = setupSingleton();
	await t.trigger1.hover();
	await expectExists(page.getByTestId("content"));
	const contentEl = page.getByTestId("content").element() as HTMLElement;

	const stateHistory: string[] = [];
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.attributeName === "data-state") {
				stateHistory.push((mutation.target as Element).getAttribute("data-state") ?? "");
			}
		}
	});
	observer.observe(contentEl, { attributes: true });

	await t.trigger2.hover();
	observer.disconnect();

	await expectExists(page.getByTestId("content"));
	expect(stateHistory).not.toContain("closed");
});

it("singleton: should transition through closed state when moving between triggers with skipDelayDuration=0", async () => {
	const t = setupSingleton(TooltipSingletonTest, { delayDuration: 50, skipDelayDuration: 0 });
	await t.trigger1.hover();
	await expectExists(page.getByTestId("content"));
	const contentEl = page.getByTestId("content").element() as HTMLElement;

	const stateHistory: string[] = [];
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			if (mutation.type === "attributes" && mutation.attributeName === "data-state") {
				stateHistory.push((mutation.target as Element).getAttribute("data-state") ?? "");
			}
		}
	});
	observer.observe(contentEl, { attributes: true });

	await t.trigger2.hover();
	observer.disconnect();

	expect(stateHistory).toContain("closed");
});

it("singleton: should use instant-open state (no enter animation) when sliding between triggers within skipDelayDuration window", async () => {
	const t = setupSingleton(TooltipSingletonTest, { delayDuration: 50, skipDelayDuration: 300 });

	await t.trigger1.hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("content")).toHaveAttribute("data-state", "delayed-open");

	await t.trigger2.hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("content")).toHaveAttribute("data-state", "instant-open");
});

it("singleton: should use delayed-open state (re-animate) when sliding between triggers with skipDelayDuration=0", async () => {
	const t = setupSingleton(TooltipSingletonTest, { delayDuration: 50, skipDelayDuration: 0 });

	await t.trigger1.hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("content")).toHaveAttribute("data-state", "delayed-open");

	await t.trigger2.hover();
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("content")).toHaveAttribute("data-state", "delayed-open");
});

it("should stay open on first hover when pointer moves through gap between trigger and content", async () => {
	render(TooltipTetherTest);
	const trigger = page.getByTestId("trigger-top");
	await trigger.hover();
	await expectExists(page.getByTestId("content"));

	// first-open regression: leaving trigger toward the floating wrapper should
	// not close before reaching content.
	const triggerEl = trigger.element() as HTMLElement;
	const contentEl = page.getByTestId("content").element() as HTMLElement;
	const floatingWrapper = contentEl.parentElement as HTMLElement;
	const rect = triggerEl.getBoundingClientRect();
	triggerEl.dispatchEvent(
		new PointerEvent("pointerleave", {
			bubbles: true,
			clientX: rect.left + rect.width / 2,
			clientY: rect.bottom,
			relatedTarget: floatingWrapper,
		})
	);

	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("open-binding")).toHaveTextContent("true");
});
