import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd, sleep } from "../utils.js";
import TooltipTest, { type TooltipTestProps } from "./tooltip-test.svelte";
import type { TooltipForceMountTestProps } from "./tooltip-force-mount-test.svelte";
import TooltipForceMountTest from "./tooltip-force-mount-test.svelte";
import TooltipPopoverTest from "./tooltip-popover-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

function setup(
	props: Partial<TooltipTestProps | TooltipForceMountTestProps> = {},
	component: Component = TooltipTest
) {
	const user = setupBrowserUserEvents();
	const t = render(component, { ...props });
	const trigger = t.getByTestId("trigger");
	return { ...t, trigger, user };
}

async function open(props: Partial<TooltipTestProps> = {}) {
	const t = setup(props);
	await expectNotExists(t.getByTestId("content"));
	await t.user.hover(t.trigger);
	await expectExists(t.getByTestId("content"));
	const content = t.getByTestId("content").element() as HTMLElement;
	return { ...t, content };
}

it("should have bits data attrs", async () => {
	const t = await open();
	const parts = ["trigger", "content"];

	for (const part of parts) {
		const el = t.getByTestId(part);
		expect(el).toHaveAttribute(`data-tooltip-${part}`);
	}
});

it("should use provider delay duration if provided and the tooltip.root did not provide one", async () => {
	const t = setup();
	expect(t.trigger).toHaveAttribute("data-delay-duration", "0");
});

it("should on hover", async () => {
	const t = await open();
	await t.user.click(t.content);
	expect(t.content).toBeVisible();
});

it("should close on escape keydown", async () => {
	const t = await open();
	await t.user.keyboard(kbd.ESCAPE);
	await expectNotExists(t.getByTestId("content"));
});

it.skip("should close when pointer moves outside the trigger and content", async () => {
	const t = await open();

	const outside = t.getByTestId("outside").element() as HTMLElement;

	await t.user.hover(outside);

	await sleep(200);
	await expectNotExists(t.getByTestId("content"));
});

it("should portal to the body by default", async () => {
	const t = await open();
	const contentWrapper = t.content.parentElement;
	expect(contentWrapper?.parentElement).toBe(document.body);
});

it("should portal to a custom element if specified", async () => {
	const t = await open({ portalProps: { to: "#portal-target" } });
	const portalTarget = t.getByTestId("portal-target").element() as HTMLElement;
	const contentWrapper = t.content.parentElement;
	expect(contentWrapper?.parentElement).toBe(portalTarget);
});

it("should not portal if `disabled` is passed to the portal", async () => {
	const t = await open({ portalProps: { disabled: true } });
	const main = t.getByTestId("main").element() as HTMLElement;
	const contentWrapper = t.content.parentElement;
	expect(contentWrapper?.parentElement).toBe(main);
});

it("should allow ignoring escapeKeydownBehavior ", async () => {
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await t.user.click(t.content);
	await t.user.keyboard(kbd.ESCAPE);
	await expectExists(t.getByTestId("content"));
});

it("should respect binding the open prop", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	const binding = t.getByTestId("binding");
	await vi.waitFor(() => expect(binding).toHaveTextContent("true"));
	await t.user.click(binding);
	await vi.waitFor(() => expect(binding).toHaveTextContent("false"));
	await expectNotExists(t.getByTestId("content"));
	await t.user.click(binding);
	await vi.waitFor(() => expect(binding).toHaveTextContent("true"));
	await expectExists(t.getByTestId("content"));
});

it("should forceMount the content when `forceMount` is true", async () => {
	const t = setup({}, TooltipForceMountTest);

	expect(t.getByTestId("content")).toBeVisible();
});

it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const t = setup({ withOpenCheck: true }, TooltipForceMountTest);
	await expectNotExists(t.getByTestId("content"));
	await t.user.hover(t.trigger);
	await expectExists(t.getByTestId("content"));
	expect(t.getByTestId("content")).toBeVisible();
});

it("should use the custom anchor element when `customAnchor` is provided", async () => {
	// type check
	const t = setup();
	await t.user.hover(t.trigger);
	await expectExists(t.getByTestId("content"));
});

it("should open when composed with another floating trigger", async () => {
	const user = setupBrowserUserEvents();
	const t = render(TooltipPopoverTest);
	await user.hover(t.getByTestId("trigger"));
	await expectExists(t.getByTestId("tooltip-content"));
	await user.click(t.getByTestId("trigger"));
	await expectExists(t.getByTestId("popover-content"));
	await expectNotExists(t.getByTestId("tooltip-content"));
});
