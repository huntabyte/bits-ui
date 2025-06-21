import { userEvent, page } from "@vitest/browser/context";
import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd, sleep } from "../utils.js";
import DialogTest, { type DialogTestProps } from "./dialog-test.svelte";
import DialogNestedTest from "./dialog-nested-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";
import DialogForceMountTest from "./dialog-force-mount-test.svelte";

const kbd = getTestKbd();

async function setup(props: DialogTestProps = {}, component: Component = DialogTest) {
	const user = setupBrowserUserEvents();
	render(component, { ...props });
	const trigger = page.getByTestId("trigger");
	await sleep(15);

	return { user, trigger };
}

async function open(props: DialogTestProps = {}, component: Component = DialogTest) {
	const t = await setup(props, component);
	await expectNotExists(page.getByTestId("content"));
	await t.trigger.click();
	await expectExists(page.getByTestId("content"));
	return t;
}

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		const _ = await open();
		const parts = ["trigger", "overlay", "close", "title", "description", "content"];
		for (const part of parts) {
			const el = page.getByTestId(part);
			await expect.element(el).toHaveAttribute(`data-dialog-${part}`);
		}
	});

	it("should have expected data attributes", async () => {
		const _ = await open();
		await expect.element(page.getByTestId("overlay")).toHaveAttribute("data-state", "open");
		await expect.element(page.getByTestId("content")).toHaveAttribute("data-state", "open");
	});
});

describe("Open/Close Behavior", () => {
	it("should open when the trigger is clicked", async () => {
		await open();
	});

	it("should close when the close button is clicked", async () => {
		const _ = await open();
		const close = page.getByTestId("close");
		await close.click();
		await expectNotExists(page.getByTestId("content"));
	});

	it("should close when the `Escape` key is pressed", async () => {
		const t = await open();
		await t.user.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("content"));
		await expect.element(page.getByTestId("trigger")).toHaveFocus();
	});

	it("should close when the overlay is clicked", async () => {
		const _ = await open();
		const overlay = page.getByTestId("overlay");
		await expectExists(overlay);
		await overlay.click();
		await expectNotExists(page.getByTestId("content"));
	});

	it("should not close when content is clicked", async () => {
		const _ = await open();
		const content = page.getByTestId("content");
		await content.click();
		await expectExists(content);
	});
});

describe("Focus Management", () => {
	it.each([true, false])(
		"should focus the trigger when the dialog is closed (force mount: %s)",
		async (withOpenCheck) => {
			const t = await setup({ withOpenCheck }, DialogForceMountTest);
			await t.trigger.click();
			await expectExists(page.getByTestId("content"));
			await t.user.keyboard(kbd.ESCAPE);
			await expect.element(t.trigger).toHaveFocus();
		}
	);

	it("should respect `onOpenAutoFocus` prop", async () => {
		const _ = await open({
			contentProps: {
				onOpenAutoFocus: (e) => {
					e.preventDefault();
					document.getElementById("open-focus-override")?.focus();
				},
			},
		});
		await expect.element(page.getByTestId("open-focus-override")).toHaveFocus();
	});

	it.each([true, false])(
		"should respect `onOpenAutoFocus` prop (force mount: %s)",
		async (withOpenCheck) => {
			const t = await setup(
				{
					withOpenCheck,
					contentProps: {
						onOpenAutoFocus: (e) => {
							e.preventDefault();
							document.getElementById("open-focus-override")?.focus();
						},
					},
				},
				DialogForceMountTest
			);
			await t.trigger.click();
			await expectExists(page.getByTestId("content"));
			await expect.element(page.getByTestId("open-focus-override")).toHaveFocus();
		}
	);

	it.each([true, false])(
		"should respect `onCloseAutoFocus` prop (force mount: %s)",
		async (withOpenCheck) => {
			const t = await setup(
				{
					withOpenCheck,
					contentProps: {
						onCloseAutoFocus: (e) => {
							e.preventDefault();
							document.getElementById("close-focus-override")?.focus();
						},
					},
				},
				DialogForceMountTest
			);
			await t.trigger.click();
			await expectExists(page.getByTestId("content"));
			await t.user.keyboard(kbd.ESCAPE);
			await expect.element(page.getByTestId("close-focus-override")).toHaveFocus();
		}
	);

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
		await expect.element(page.getByTestId("close-focus-override")).toHaveFocus();
	});

	it("should focus first focusable item upon opening", async () => {
		const _ = await open();
		const closeButton = page.getByTestId("close");
		await expect.element(closeButton).toHaveFocus();
	});
});

describe("Portal Behavior", () => {
	it("should portal to body when using portal element", async () => {
		const _ = await open();

		const content = page.getByTestId("content").element();
		expect(content.parentElement).toEqual(document.body);
	});

	it("should not portal to body when portal is disabled", async () => {
		const _ = await open({
			portalProps: {
				disabled: true,
			},
		});
		const content = page.getByTestId("content").element();
		expect(content.parentElement).not.toEqual(document.body);
	});

	it("should portal to the target if passed as a prop", async () => {
		const _ = await open({
			portalProps: {
				to: "#portalTarget",
			},
		});
		const portalTarget = page.getByTestId("portalTarget").element();
		const content = page.getByTestId("content").element();
		expect(content.parentElement).toEqual(portalTarget);
	});
});

it("should not close when content is clicked", async () => {
	const _ = await open();
	const content = page.getByTestId("content");
	await content.click();
	await expectExists(content);
});

it("should respect binding to the `open` prop", async () => {
	const t = await setup();
	const trigger = page.getByTestId("trigger");
	const binding = page.getByTestId("binding");
	await expect.element(binding).toHaveTextContent("false");
	await trigger.click();
	await expect.element(binding).toHaveTextContent("true");
	await t.user.keyboard(kbd.ESCAPE);
	await expect.element(binding).toHaveTextContent("false");

	const toggle = page.getByTestId("toggle");
	const content = page.getByTestId("content");
	await expectNotExists(content);
	await toggle.click();
	await expectExists(content);
});

it("should close on outside click", async () => {
	const mockFn = vi.fn();
	const _ = await open({
		contentProps: {
			onInteractOutside: mockFn,
		},
	});
	await page.getByTestId("overlay").click();
	await vi.waitFor(() => expect(mockFn).toHaveBeenCalled());
});

it("should not close when clicking within bounds", async () => {
	const mockFn = vi.fn();
	const _ = await open({
		contentProps: { onInteractOutside: mockFn },
	});

	const content = page.getByTestId("content");
	await content.click();
	await expectExists(content);
});

it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
	const _ = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});

	await page.getByTestId("overlay").click();
	await expectExists(page.getByTestId("content"));
});

it("should respect the the `escapeKeydownBehavior: 'ignore'` prop", async () => {
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});

	await t.user.keyboard(kbd.ESCAPE);
	await expectExists(page.getByTestId("content"));
	await expect.element(t.trigger).not.toHaveFocus();
});

describe("ARIA Attributes", () => {
	it("should apply the correct `aria-describedby` attribute to the `Dialog.Content` element", async () => {
		const _ = await open();

		const content = page.getByTestId("content");
		const description = page.getByTestId("description").element();
		await expect.element(content).toHaveAttribute("aria-describedby", description.id);
	});

	it("should have role='heading'", async () => {
		const _ = await open();

		const title = page.getByTestId("title");
		await expect.element(title).toHaveAttribute("role", "heading");
	});

	it("should apply a default `aria-level` attribute to the `Dialog.Title` element", async () => {
		const _ = await open();

		const title = page.getByTestId("title");
		await expect.element(title).toHaveAttribute("aria-level", "2");
	});

	it("should allow setting a custom level for the `Dialog.Title` element", async () => {
		const _ = await open({
			titleProps: {
				level: 3,
			},
		});

		const title = page.getByTestId("title");
		await expect.element(title).toHaveAttribute("aria-level", "3");
	});

	it("should keep the `aria-describedby` attribute in sync with the `Dialog.Description` id", async () => {
		await open({
			descriptionProps: {
				id: "description-id",
			},
		});

		const content = page.getByTestId("content");
		const description = page.getByTestId("description");
		await expect.element(description).toHaveAttribute("id", "description-id");
		await expect.element(content).toHaveAttribute("aria-describedby", description.element().id);

		const updateIdButton = page.getByTestId("update-id");
		await updateIdButton.click();

		await expect.element(description).not.toHaveAttribute("id", "description-id");
		await expect.element(description).toHaveAttribute("id", "new-id");
		await expect.element(content).toHaveAttribute("aria-describedby", description.element().id);
	});
});

describe("Nested Dialogs", () => {
	it.todo("should handle focus scoping correctly", async () => {
		const user = userEvent;
		render(DialogNestedTest);
		const trigger = page.getByTestId("first-open");
		await trigger.click();

		await expectExists(page.getByTestId("first-close"));
		await expect.element(page.getByTestId("first-close")).toHaveFocus();
		await user.keyboard(kbd.TAB);
		await expect.element(page.getByTestId("second-open")).toHaveFocus();
		await user.keyboard(kbd.TAB);
		await expect.element(page.getByTestId("first-close")).toHaveFocus();
		await user.keyboard(kbd.TAB);
		await user.keyboard(kbd.ENTER);

		await expectExists(page.getByTestId("second-close"));
		await user.keyboard(kbd.TAB);
		await expect.element(page.getByTestId("second-close")).toHaveFocus();
		await user.keyboard(kbd.ESCAPE);
		await expect.element(page.getByTestId("second-open")).toHaveFocus();
	});
});
