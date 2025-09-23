import { userEvent, page } from "@vitest/browser/context";
import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd } from "../utils.js";
import DialogTest, { type DialogTestProps } from "./dialog-test.svelte";
import DialogNestedTest from "./dialog-nested-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";
import DialogForceMountTest from "./dialog-force-mount-test.svelte";
import DialogIntegrationTest from "./dialog-integration-test.svelte";

const kbd = getTestKbd();

async function setup(props: DialogTestProps = {}, component: Component = DialogTest) {
	const user = setupBrowserUserEvents();
	const t = render(component, { ...props });
	const trigger = t.getByTestId("trigger");

	return {
		...t,
		trigger,
		user,
	};
}

async function open(props: DialogTestProps = {}, component: Component = DialogTest) {
	const t = await setup(props, component);
	await expectNotExists(t.getByTestId("content"));
	await t.trigger.click();
	await expectExists(t.getByTestId("content"));
	return t;
}

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		await open();
		const parts = ["trigger", "overlay", "close", "title", "description", "content"];
		for (const part of parts) {
			const el = page.getByTestId(part);
			await expect.element(el).toHaveAttribute(`data-dialog-${part}`);
		}
	});

	it("should have expected data attributes", async () => {
		await open();
		const overlay = page.getByTestId("overlay");
		await expect.element(overlay).toHaveAttribute("data-state", "open");
		const content = page.getByTestId("content");
		await expect.element(content).toHaveAttribute("data-state", "open");
	});
});

describe("Open/Close Behavior", () => {
	it("should open when the trigger is clicked", async () => {
		await open();
	});

	it("should close when the close button is clicked", async () => {
		await open();
		const close = page.getByTestId("close");
		await close.click();
		await expectNotExists(page.getByTestId("content"));
	});

	it.todo("should close when the `Escape` key is pressed", async () => {
		await open();
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("content"));
		await expect.element(page.getByTestId("trigger")).toHaveFocus();
	});

	it("should close when the overlay is clicked", async () => {
		await open();
		await expectExists(page.getByTestId("overlay"));
		await page.getByTestId("overlay").click();
		await expectNotExists(page.getByTestId("content"));
	});

	it("should not close when content is clicked", async () => {
		await open();
		await page.getByTestId("content").click();
		await expectExists(page.getByTestId("content"));
	});
});

describe("Focus Management", () => {
	it.each([true, false])(
		"should focus the trigger when the dialog is closed (force mount: %s)",
		async (withOpenCheck) => {
			await setup({ withOpenCheck }, DialogForceMountTest);
			await page.getByTestId("trigger").click();
			await expectExists(page.getByTestId("content"));
			await userEvent.keyboard(kbd.ESCAPE);
			await expect.element(page.getByTestId("trigger")).toHaveFocus();
		}
	);

	it("should respect `onOpenAutoFocus` prop", async () => {
		await open({
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
			await setup(
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
			await page.getByTestId("trigger").click();
			await expectExists(page.getByTestId("content"));
			await expect.element(page.getByTestId("open-focus-override")).toHaveFocus();
		}
	);

	it.each([true, false])(
		"should respect `onCloseAutoFocus` prop (force mount: %s)",
		async (withOpenCheck) => {
			await setup(
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
			await page.getByTestId("trigger").click();
			await expectExists(page.getByTestId("content"));
			await userEvent.keyboard(kbd.ESCAPE);
			await expect.element(page.getByTestId("close-focus-override")).toHaveFocus();
		}
	);

	it("should respect `onCloseAutoFocus` prop", async () => {
		await open({
			contentProps: {
				onCloseAutoFocus: (e) => {
					e.preventDefault();
					document.getElementById("close-focus-override")?.focus();
				},
			},
		});
		await userEvent.keyboard(kbd.ESCAPE);
		await expect.element(page.getByTestId("close-focus-override")).toHaveFocus();
	});

	it("should focus first focusable item upon opening", async () => {
		await open();
		await expect.element(page.getByTestId("close")).toHaveFocus();
	});

	it("should return focus to programmatically focused element when closed", async () => {
		await setup();

		const outsideButton = page.getByTestId("outside").element() as HTMLElement;
		outsideButton.tabIndex = 0;
		outsideButton.focus();
		await expect.element(outsideButton).toHaveFocus();

		const toggleButton = page.getByTestId("toggle");
		await page.getByTestId("toggle").click();
		await expectExists(page.getByTestId("content"));

		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("content"));

		await expect.element(toggleButton).toHaveFocus();
	});

	it("should still respect onCloseAutoFocus when opened programmatically", async () => {
		await setup({
			contentProps: {
				onCloseAutoFocus: (e) => {
					e.preventDefault();
					document.getElementById("close-focus-override")?.focus();
				},
			},
		});

		const outsideButton = page.getByTestId("outside").element() as HTMLElement;
		outsideButton.tabIndex = 0;
		outsideButton.focus();

		await page.getByTestId("toggle").click();
		await expectExists(page.getByTestId("content"));

		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("content"));

		await expect.element(page.getByTestId("close-focus-override")).toHaveFocus();
	});
});

describe("Portal Behavior", () => {
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
		await open({
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
	await open();
	await page.getByTestId("content").click();
	await expectExists(page.getByTestId("content"));
});

it("should respect binding to the `open` prop", async () => {
	const t = await setup();
	const trigger = page.getByTestId("trigger");
	const binding = page.getByTestId("binding");
	await expect.element(binding).toHaveTextContent("false");
	await trigger.click();
	await expect.element(t.getByTestId("binding")).toHaveTextContent("true");
	await userEvent.keyboard(kbd.ESCAPE);
	await expect.element(page.getByTestId("binding")).toHaveTextContent("false");

	const toggle = t.getByTestId("toggle");
	await expectNotExists(page.getByTestId("content"));
	await toggle.click();
	await expectExists(page.getByTestId("content"));
});

it("should close on outside click", async () => {
	const mockFn = vi.fn();
	await open({
		contentProps: {
			onInteractOutside: mockFn,
		},
	});
	await page.getByTestId("overlay").click();
	await vi.waitFor(() => expect(mockFn).toHaveBeenCalled());
});

it("should not close when clicking within bounds", async () => {
	const mockFn = vi.fn();
	const t = await open({
		contentProps: { onInteractOutside: mockFn },
	});

	await page.getByTestId("content").click();
	await expectExists(t.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	const overlay = page.getByTestId("overlay");
	await expectExists(overlay);

	await overlay.click();
	await expectExists(t.getByTestId("content"));
});

it("should respect the the `escapeKeydownBehavior: 'ignore'` prop", async () => {
	await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});

	await userEvent.keyboard(kbd.ESCAPE);
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("trigger")).not.toHaveFocus();
});

describe("ARIA Attributes", () => {
	it("should apply the correct `aria-describedby` attribute to the `Dialog.Content` element", async () => {
		await open();

		const content = page.getByTestId("content");
		const description = page.getByTestId("description").element() as HTMLElement;
		await expect.element(content).toHaveAttribute("aria-describedby", description.id);
	});

	it("should have role='heading'", async () => {
		await open();

		const title = page.getByTestId("title");
		await expect.element(title).toHaveAttribute("role", "heading");
	});

	it("should apply a default `aria-level` attribute to the `Dialog.Title` element", async () => {
		await open();

		const title = page.getByTestId("title");
		await expect.element(title).toHaveAttribute("aria-level", "2");
	});

	it("should allow setting a custom level for the `Dialog.Title` element", async () => {
		await open({
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
		const description = page.getByTestId("description").element() as HTMLElement;
		await expect.element(description).toHaveAttribute("id", "description-id");
		await expect.element(content).toHaveAttribute("aria-describedby", description.id);

		const updateIdButton = page.getByTestId("update-id");
		await updateIdButton.click();

		await expect.element(description).not.toHaveAttribute("id", "description-id");
		await expect.element(description).toHaveAttribute("id", "new-id");
		await expect.element(content).toHaveAttribute("aria-describedby", description.id);
	});
});

describe("Nested Dialogs", () => {
	it("should handle focus scoping correctly", async () => {
		render(DialogNestedTest);
		const trigger = page.getByTestId("first-open");
		await trigger.click();
		await expectExists(page.getByTestId("first-close"));
		await expect.element(page.getByTestId("first-close")).toHaveFocus();
		await userEvent.keyboard(kbd.TAB);
		await expect.element(page.getByTestId("second-open")).toHaveFocus();
		await userEvent.keyboard(kbd.TAB);
		await expect.element(page.getByTestId("first-close")).toHaveFocus();
		await userEvent.keyboard(kbd.TAB);
		await expect.element(page.getByTestId("second-open")).toHaveFocus();
		await userEvent.keyboard(kbd.ENTER);
		await expectExists(page.getByTestId("second-close"));
		await expect.element(page.getByTestId("second-close")).toHaveFocus();
		await userEvent.keyboard(kbd.ENTER);
		await expectNotExists(page.getByTestId("second-close"));
		await expectExists(page.getByTestId("second-open"));
		await expect.element(page.getByTestId("second-open")).toHaveFocus();
	});
});

describe("Integration with other components", () => {
	it("should allow opening nested floating components within the dialog", async () => {
		render(DialogIntegrationTest);
		await page.getByTestId("dialog-trigger").click();
		await expectExists(page.getByTestId("dialog-content"));
		await page.getByTestId("dropdown-trigger").click();
		await expectExists(page.getByTestId("dropdown-content"));
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("dropdown-content"));
		await expectExists(page.getByTestId("dialog-content"));
		await page.getByTestId("popover-trigger").click();
		await expectExists(page.getByTestId("popover-content"));
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("popover-content"));
		await expectExists(page.getByTestId("dialog-content"));
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("dialog-content"));
	});
});
