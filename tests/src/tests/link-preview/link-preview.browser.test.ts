import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd, sleep } from "../utils.js";
import LinkPreviewTest, { type LinkPreviewTestProps } from "./link-preview-test.svelte";
import type { LinkPreviewForceMountTestProps } from "./link-preview-force-mount-test.svelte";
import LinkPreviewForceMountTest from "./link-preview-force-mount-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";
import { page } from "@vitest/browser/context";

const kbd = getTestKbd();

function setup(
	props: LinkPreviewTestProps | LinkPreviewForceMountTestProps = {},
	component: Component = LinkPreviewTest
) {
	const user = setupBrowserUserEvents();
	const t = render(component, { ...props });
	const trigger = page.getByTestId("trigger");
	return { ...t, trigger, user };
}

async function open(props: LinkPreviewTestProps = {}) {
	const t = setup(props);
	await expectNotExists(page.getByTestId("content"));
	await t.user.hover(t.trigger);
	await sleep(100);
	await expectExists(page.getByTestId("content"));

	return { ...t };
}

it("should have bits data attrs", async () => {
	await open();
	const parts = ["trigger", "content"];

	for (const part of parts) {
		const el = page.getByTestId(part);
		expect(el).toHaveAttribute(`data-link-preview-${part}`);
	}
});

it("should open on hover", async () => {
	const t = await open();
	await t.user.click(page.getByTestId("content"));
	await expectExists(page.getByTestId("content"));
});

it("should close on escape keydown", async () => {
	const mockEsc = vi.fn();
	const t = await open({
		contentProps: {
			onEscapeKeydown: mockEsc,
		},
	});
	await t.user.click(page.getByTestId("content"));
	await t.user.keyboard(kbd.ESCAPE);
	expect(mockEsc).toHaveBeenCalledTimes(1);
});

it.skip("closes when pointer moves outside the trigger and content", async () => {
	const t = await open();
	const outside = page.getByTestId("outside");
	await t.user.hover(outside);
	await sleep(100);
	await vi.waitFor(() => expectNotExists(page.getByTestId("content")));
});

it("should portal to the body by default", async () => {
	await open();
	expect(page.getByTestId("content").element().parentElement?.parentElement).toBe(document.body);
});

it("should portal to a custom element if specified", async () => {
	await open({
		portalProps: {
			to: "#portal-target",
		},
	});
	const portalTarget = page.getByTestId("portal-target").element();
	expect(page.getByTestId("content").element().parentElement?.parentElement).toBe(portalTarget);
});

it("should not portal if `disabled` is passed as portal prop", async () => {
	await open({ portalProps: { disabled: true } });
	const main = page.getByTestId("main").element();
	expect(page.getByTestId("content").element().parentElement?.parentElement).toBe(main);
});

it("should respect the `escapeKeydownBehavior` prop", async () => {
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await t.user.click(page.getByTestId("content"));
	await t.user.keyboard(kbd.ESCAPE);
	await expectExists(page.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior` prop", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	await t.user.click(page.getByTestId("content"));
	const outside = page.getByTestId("outside");
	await t.user.click(outside);
	await expectExists(page.getByTestId("content"));
});

it("should respect binding the open prop", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	const binding = page.getByTestId("binding");
	expect(binding).toHaveTextContent("true");
	await t.user.click(binding);
	expect(binding).toHaveTextContent("false");
	expectNotExists(page.getByTestId("content"));
	await t.user.click(binding);
	expect(binding).toHaveTextContent("true");
	await expectExists(page.getByTestId("content"));
});

it("should forceMount the content when `forceMount` is true", async () => {
	setup({}, LinkPreviewForceMountTest);

	await expectExists(page.getByTestId("content"));
});

it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const t = setup({ withOpenCheck: true }, LinkPreviewForceMountTest);
	await expectNotExists(page.getByTestId("content"));
	await t.user.hover(t.trigger);
	await sleep(100);
	await expectExists(page.getByTestId("content"));
});
