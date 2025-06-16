import { page, userEvent } from "@vitest/browser/context";
import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick } from "svelte";
import { getTestKbd, mockBoundingClientRect, sleep } from "../utils.js";
import DialogTest, { type DialogTestProps } from "./dialog-test.svelte";
import DialogNestedTest from "./dialog-nested-test.svelte";
import {
	expectExists,
	expectNotExists,
	setupBrowserUserEvents,
	simulateOutsideClick,
} from "../browser-utils";

const kbd = getTestKbd();

async function setup(props: DialogTestProps = {}) {
	const user = setupBrowserUserEvents();
	const returned = render(DialogTest, { ...props });
	const trigger = page.getByTestId("trigger");
	await sleep(15);

	return {
		...returned,
		trigger,
		user,
	};
}

async function open(props: DialogTestProps = {}) {
	const t = await setup(props);
	expectNotExists(page.getByTestId("content"));
	await sleep(50);
	await t.user.click(t.trigger);
	await sleep(50);
	expectExists(page.getByTestId("content"));
	return t;
}

it("should have bits data attrs", async () => {
	const t = await open();
	const parts = ["trigger", "overlay", "close", "title", "description", "content"];

	for (const part of parts) {
		const el = t.getByTestId(part);
		expect(el).toHaveAttribute(`data-dialog-${part}`);
	}
});

it("should have expected data attributes", async () => {
	const t = await open();

	const overlay = t.getByTestId("overlay");
	expect(overlay).toHaveAttribute("data-state", "open");
	const content = t.getByTestId("content");
	expect(content).toHaveAttribute("data-state", "open");
});

it("should open when the trigger is clicked", async () => {
	await open();
});

it("should close when the close button is clicked", async () => {
	const t = await open();
	const close = t.getByTestId("close");
	await t.user.click(close);
	expectNotExists(page.getByTestId("content"));
});

it.todo("should close when the `Escape` key is pressed", async () => {
	const t = await open();

	await t.user.keyboard(kbd.ESCAPE);
	expectNotExists(page.getByTestId("content"));
	expect(t.trigger).toHaveFocus();
});

it("should close when the overlay is clicked", async () => {
	const t = await open();

	const overlay = t.getByTestId("overlay");
	mockBoundingClientRect();
	await t.user.click(overlay);
	await sleep(25);

	expectNotExists(page.getByTestId("content"));
});

it("should portal to body when using portal element", async () => {
	await open();

	const content = page.getByTestId("content").element();
	expect(content.parentElement).toEqual(document.body);
});

it("should not portal to body when portal is disabled", async () => {
	await open({
		portalProps: {
			disabled: true,
		},
	});
	const content = page.getByTestId("content").element();
	expect(content.parentElement).not.toEqual(document.body);
});

it("should portal to the target if passed as a prop", async () => {
	const t = await open({
		portalProps: {
			to: "#portalTarget",
		},
	});
	const portalTarget = t.getByTestId("portalTarget").element();
	const content = page.getByTestId("content").element();
	expect(content.parentElement).toEqual(portalTarget);
});

it("should focus first focusable item upon opening", async () => {
	const t = await open();
	const closeButton = t.getByTestId("close").element();
	expect(document.activeElement).toBe(closeButton);
});

it("should not close when content is clicked", async () => {
	const t = await open();
	const content = page.getByTestId("content").element();
	await t.user.click(content);
	expectExists(page.getByTestId("content"));
});

it("should respect binding to the `open` prop", async () => {
	const t = await setup();
	const trigger = page.getByTestId("trigger");
	const binding = page.getByTestId("binding");
	expect(binding).toHaveTextContent("false");
	await t.user.click(trigger);
	expect(page.getByTestId("binding")).toHaveTextContent("true");
	await t.user.keyboard(kbd.ESCAPE);
	expect(page.getByTestId("binding")).toHaveTextContent("false");

	const toggle = t.getByTestId("toggle");
	expectNotExists(page.getByTestId("content"));
	await t.user.click(toggle);
	expectExists(page.getByTestId("content"));
});

it("should close on outside click", async () => {
	const mockFn = vi.fn();
	const t = await open({
		contentProps: {
			onInteractOutside: mockFn,
		},
	});
	await sleep(10);
	await simulateOutsideClick(t.getByTestId("overlay"));
	await sleep(10);
	expect(mockFn).toHaveBeenCalled();
});

it("should not close when clicking within bounds", async () => {
	const mockFn = vi.fn();
	const t = await open({
		contentProps: { onInteractOutside: mockFn },
	});

	await t.user.click(page.getByTestId("content").element());
	expectExists(page.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	await sleep(100);

	await t.user.click(t.getByTestId("overlay"));
	expectExists(page.getByTestId("content"));
});

it("should respect the the `escapeKeydownBehavior: 'ignore'` prop", async () => {
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});

	await t.user.keyboard(kbd.ESCAPE);
	expectExists(page.getByTestId("content"));
	expect(t.trigger).not.toHaveFocus();
});

it("should apply the correct `aria-describedby` attribute to the `Dialog.Content` element", async () => {
	const t = await open();

	const content = t.getByTestId("content");
	const description = t.getByTestId("description").element() as HTMLElement;
	expect(content).toHaveAttribute("aria-describedby", description.id);
});

it("should have role='heading'", async () => {
	const t = await open();

	const title = t.getByTestId("title");
	expect(title).toHaveAttribute("role", "heading");
});

it("should apply a default `aria-level` attribute to the `Dialog.Title` element", async () => {
	const { getByTestId } = await open();

	const title = getByTestId("title");
	expect(title).toHaveAttribute("aria-level", "2");
});

it("should allow setting a custom level for the `Dialog.Title` element", async () => {
	const t = await open({
		titleProps: {
			level: 3,
		},
	});

	const title = t.getByTestId("title");
	expect(title).toHaveAttribute("aria-level", "3");
});

it("should keep the `aria-describedby` attribute in sync with the `Dialog.Description` id", async () => {
	const t = await open({
		descriptionProps: {
			id: "description-id",
		},
	});

	const content = t.getByTestId("content");
	const description = t.getByTestId("description").element() as HTMLElement;
	expect(description).toHaveAttribute("id", "description-id");
	expect(content).toHaveAttribute("aria-describedby", description.id);

	const updateIdButton = t.getByTestId("update-id");
	await t.user.click(updateIdButton);
	await t.user.click(updateIdButton);
	await tick();

	expect(description.id).not.toBe("description-id");
	expect(description.id).toBe("new-id");
	expect(content).toHaveAttribute("aria-describedby", description.id);
});

it("should respect `onOpenAutoFocus` prop", async () => {
	const t = await open({
		contentProps: {
			onOpenAutoFocus: (e) => {
				e.preventDefault();
				document.getElementById("open-focus-override")?.focus();
			},
		},
	});

	expect(t.getByTestId("open-focus-override")).toHaveFocus();
});

it("should respect `onCloseAutoFocus` prop", async () => {
	const t = await open({
		contentProps: {
			onCloseAutoFocus: (e) => {
				e.preventDefault();
				document.getElementById("close-focus-override")?.focus();
			},
		},
	});

	await t.user.keyboard(kbd.ESCAPE);

	expect(t.getByTestId("close-focus-override")).toHaveFocus();
});

describe("nested", () => {
	it.todo("should handle focus scoping correctly", async () => {
		const user = userEvent;
		const t = render(DialogNestedTest);
		const trigger = t.getByTestId("first-open");
		await user.click(trigger);
		await tick();
		expectExists(t.getByTestId("first-close"));
		expect(t.getByTestId("first-close")).toHaveFocus();
		await user.keyboard(kbd.TAB);
		expect(t.getByTestId("second-open")).toHaveFocus();
		await user.keyboard(kbd.TAB);
		expect(t.getByTestId("first-close")).toHaveFocus();
		await user.keyboard(kbd.TAB);
		await user.keyboard(kbd.ENTER);
		await tick();
		expectExists(t.getByTestId("second-close"));
		await user.keyboard(kbd.TAB);
		expect(t.getByTestId("second-close")).toHaveFocus();
		await user.keyboard(kbd.ESCAPE);
		expect(t.getByTestId("second-open")).toHaveFocus();
	});
});
