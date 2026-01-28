import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd } from "../utils.js";
import LinkPreviewTest, { type LinkPreviewTestProps } from "./link-preview-test.svelte";
import type { LinkPreviewForceMountTestProps } from "./link-preview-force-mount-test.svelte";
import LinkPreviewForceMountTest from "./link-preview-force-mount-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

function setup(
	props: LinkPreviewTestProps | LinkPreviewForceMountTestProps = {},
	component: Component = LinkPreviewTest
) {
	const t = render(component, { ...props });
	const trigger = page.getByTestId("trigger");
	return { ...t, trigger };
}

async function open(props: LinkPreviewTestProps = {}) {
	const t = setup(props);
	await expectNotExists(page.getByTestId("content"));
	await t.trigger.hover();
	await expectExists(page.getByTestId("content"));

	return { ...t };
}

it("should have bits data attrs", async () => {
	await open();
	const parts = ["trigger", "content"];

	for (const part of parts) {
		const el = page.getByTestId(part);
		await expect.element(el).toHaveAttribute(`data-link-preview-${part}`);
	}
});

it("should open on hover", async () => {
	await open();
	await page.getByTestId("content").click();
	await expectExists(page.getByTestId("content"));
});

it("should close on escape keydown", async () => {
	const mockEsc = vi.fn();
	await open({
		contentProps: {
			onEscapeKeydown: mockEsc,
		},
	});
	await page.getByTestId("content").click();
	await userEvent.keyboard(kbd.ESCAPE);
	expect(mockEsc).toHaveBeenCalledTimes(1);
});

it("closes when pointer moves outside the trigger and content", async () => {
	await open();
	const outside = page.getByTestId("outside");
	await outside.hover();
	await expectNotExists(page.getByTestId("content"));
});

it("should stay open when hovering content", async () => {
	await open();
	const content = page.getByTestId("content");
	await content.hover();
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
	await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await page.getByTestId("content").click();
	await userEvent.keyboard(kbd.ESCAPE);
	await expectExists(page.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior` prop", async () => {
	await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	await page.getByTestId("content").click();
	const outside = page.getByTestId("outside");
	await outside.click({ force: true });
	await expectExists(page.getByTestId("content"));
});

it("should respect binding the open prop", async () => {
	await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	const binding = page.getByTestId("binding");
	expect(binding).toHaveTextContent("true");
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(page.getByTestId("content"));
	expect(binding).toHaveTextContent("false");
	await binding.click();
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
	await t.trigger.hover();
	await expectExists(page.getByTestId("content"));
});

it("should apply custom style prop to content", async () => {
	await open({
		contentProps: {
			style: { backgroundColor: "rgb(255, 0, 0)" },
		},
	});
	const contentEl = page.getByTestId("content").element() as HTMLElement;
	expect(contentEl.style.backgroundColor).toBe("rgb(255, 0, 0)");
});
