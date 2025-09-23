import { expect, it, vi } from "vitest";
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
	const t = render(PopoverSiblingsTest);
	await t.getByTestId("open-1").click();
	await expectExists(t.getByTestId("content-1"));
	await t.getByTestId("open-2").click();
	await expectNotExists(t.getByTestId("content-1"));
	await expectExists(t.getByTestId("content-2"));
	await expect.element(t.getByTestId("close-2")).toHaveFocus();
	await t.getByTestId("open-3").click();
	await expectNotExists(t.getByTestId("content-2"));
	await expectExists(t.getByTestId("content-3"));
	await expect.element(t.getByTestId("close-3")).toHaveFocus();
	await t.getByTestId("close-3").click();
	await expectNotExists(t.getByTestId("content-3"));
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
