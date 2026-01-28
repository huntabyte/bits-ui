import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd } from "../utils.js";
import TooltipTest, { type TooltipTestProps } from "./tooltip-test.svelte";
import type { TooltipForceMountTestProps } from "./tooltip-force-mount-test.svelte";
import TooltipForceMountTest from "./tooltip-force-mount-test.svelte";
import TooltipPopoverTest from "./tooltip-popover-test.svelte";
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

it("should on hover", async () => {
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
