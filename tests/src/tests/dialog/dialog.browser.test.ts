import { userEvent, page } from "@vitest/browser/context";
import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Component } from "svelte";
import { getTestKbd } from "../utils.js";
import DialogTest, { type DialogTestProps } from "./dialog-test.svelte";
import DialogNestedTest from "./dialog-nested-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import DialogForceMountTest from "./dialog-force-mount-test.svelte";
import DialogIntegrationTest from "./dialog-integration-test.svelte";
import DialogTooltipTest from "./dialog-tooltip-test.svelte";
import DialogAlertDialogNestedTest from "./dialog-alert-dialog-nested-test.svelte";
import DialogScrollbarGutterTest from "./dialog-scrollbar-gutter-test.svelte";
import DialogSingleFocusableTest from "./dialog-single-focusable-test.svelte";

const kbd = getTestKbd();

async function setup(props: DialogTestProps = {}, component: Component = DialogTest) {
	const t = render(component, { ...props });
	const trigger = page.getByTestId("trigger");

	return {
		...t,
		trigger,
	};
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

	it("should trap focus and allow Escape to close when only one focusable element exists", async () => {
		render(DialogSingleFocusableTest);
		const trigger = page.getByTestId("trigger");
		await trigger.click();
		await expectExists(page.getByTestId("content"));

		const closeButton = page.getByTestId("close");
		await expect.element(closeButton).toHaveFocus();

		await userEvent.keyboard(kbd.TAB);
		await expect.element(closeButton).toHaveFocus();

		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("content"));
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
	await setup();
	const trigger = page.getByTestId("trigger");
	const binding = page.getByTestId("binding");
	await expect.element(binding).toHaveTextContent("false");
	await trigger.click();
	await expect.element(page.getByTestId("binding")).toHaveTextContent("true");
	await userEvent.keyboard(kbd.ESCAPE);
	await expect.element(page.getByTestId("binding")).toHaveTextContent("false");

	const toggle = page.getByTestId("toggle");
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
	await open({
		contentProps: { onInteractOutside: mockFn },
	});

	await page.getByTestId("content").click();
	await expectExists(page.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
	await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	const overlay = page.getByTestId("overlay");
	await expectExists(overlay);

	await overlay.click();
	await expectExists(page.getByTestId("content"));
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

	it("should track dialog depth correctly", async () => {
		render(DialogNestedTest);

		// open first dialog
		await page.getByTestId("first-open").click();
		await expectExists(page.getByTestId("first-content"));

		const firstContent = page.getByTestId("first-content").element() as HTMLElement;
		expect(firstContent.style.getPropertyValue("--bits-dialog-depth")).toBe("0");
		expect(firstContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("first-content"))
			.not.toHaveAttribute("data-nested-open");
		await expect
			.element(page.getByTestId("first-overlay"))
			.not.toHaveAttribute("data-nested-open");

		// open second dialog
		await page.getByTestId("second-open").click();
		await expectExists(page.getByTestId("second-content"));

		const secondContent = page.getByTestId("second-content").element() as HTMLElement;
		expect(firstContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("1");
		expect(secondContent.style.getPropertyValue("--bits-dialog-depth")).toBe("1");
		expect(secondContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("first-content"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("first-overlay"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("second-content"))
			.not.toHaveAttribute("data-nested-open");
		await expect.element(page.getByTestId("second-content")).toHaveAttribute("data-nested", "");
		await expect
			.element(page.getByTestId("second-overlay"))
			.not.toHaveAttribute("data-nested-open");
		await expect.element(page.getByTestId("second-content")).toHaveAttribute("data-nested", "");

		// open third dialog
		await page.getByTestId("third-open").click();
		await expectExists(page.getByTestId("third-content"));

		const thirdContent = page.getByTestId("third-content").element() as HTMLElement;
		expect(firstContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("2");
		expect(secondContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("1");
		expect(thirdContent.style.getPropertyValue("--bits-dialog-depth")).toBe("2");
		expect(thirdContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("first-content"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("first-overlay"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("second-content"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("second-overlay"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("third-content"))
			.not.toHaveAttribute("data-nested-open");
		await expect
			.element(page.getByTestId("third-overlay"))
			.not.toHaveAttribute("data-nested-open");

		// close third dialog
		await page.getByTestId("third-close").click();
		await expectNotExists(page.getByTestId("third-content"));

		expect(firstContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("1");
		expect(secondContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("first-content"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("first-overlay"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("second-content"))
			.not.toHaveAttribute("data-nested-open");
		await expect
			.element(page.getByTestId("second-overlay"))
			.not.toHaveAttribute("data-nested-open");

		// close second dialog
		await page.getByTestId("second-close").click();
		await expectNotExists(page.getByTestId("second-content"));

		expect(firstContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("first-content"))
			.not.toHaveAttribute("data-nested-open");
		await expect
			.element(page.getByTestId("first-overlay"))
			.not.toHaveAttribute("data-nested-open");
	});
});

describe("Nested Alert Dialogs and Dialogs", () => {
	it("should handle Alert Dialog nested inside Dialog with correct depth tracking", async () => {
		render(DialogAlertDialogNestedTest);

		// open dialog
		await page.getByTestId("dialog-open").click();
		await expectExists(page.getByTestId("dialog-content"));

		const dialogContent = page.getByTestId("dialog-content").element() as HTMLElement;
		expect(dialogContent.style.getPropertyValue("--bits-dialog-depth")).toBe("0");
		expect(dialogContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("dialog-content"))
			.not.toHaveAttribute("data-nested-open");

		// open alert dialog inside
		await page.getByTestId("alert-open").click();
		await expectExists(page.getByTestId("alert-content"));

		const alertContent = page.getByTestId("alert-content").element() as HTMLElement;
		expect(dialogContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("1");
		expect(alertContent.style.getPropertyValue("--bits-dialog-depth")).toBe("1");
		expect(alertContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("dialog-content"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("dialog-overlay"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("alert-content"))
			.not.toHaveAttribute("data-nested-open");
		await expect.element(page.getByTestId("alert-content")).toHaveAttribute("data-nested", "");

		// close alert dialog
		await page.getByTestId("alert-cancel").click();
		await expectNotExists(page.getByTestId("alert-content"));

		expect(dialogContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("dialog-content"))
			.not.toHaveAttribute("data-nested-open");
		await expect
			.element(page.getByTestId("dialog-overlay"))
			.not.toHaveAttribute("data-nested-open");
	});

	it("should handle Dialog nested inside Alert Dialog with correct depth tracking", async () => {
		render(DialogAlertDialogNestedTest);

		// open alert dialog
		await page.getByTestId("alert-first-open").click();
		await expectExists(page.getByTestId("alert-first-content"));

		const alertContent = page.getByTestId("alert-first-content").element() as HTMLElement;
		expect(alertContent.style.getPropertyValue("--bits-dialog-depth")).toBe("0");
		expect(alertContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("alert-first-content"))
			.not.toHaveAttribute("data-nested-open");

		// open dialog inside
		await page.getByTestId("dialog-nested-open").click();
		await expectExists(page.getByTestId("dialog-nested-content"));

		const dialogContent = page.getByTestId("dialog-nested-content").element() as HTMLElement;
		expect(alertContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("1");
		expect(dialogContent.style.getPropertyValue("--bits-dialog-depth")).toBe("1");
		expect(dialogContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("alert-first-content"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("alert-first-overlay"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("dialog-nested-content"))
			.not.toHaveAttribute("data-nested-open");
		await expect
			.element(page.getByTestId("dialog-nested-content"))
			.toHaveAttribute("data-nested", "");

		// close dialog
		await page.getByTestId("dialog-nested-close").click();
		await expectNotExists(page.getByTestId("dialog-nested-content"));

		expect(alertContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("alert-first-content"))
			.not.toHaveAttribute("data-nested-open");
		await expect
			.element(page.getByTestId("alert-first-overlay"))
			.not.toHaveAttribute("data-nested-open");
	});

	it("should handle three-level nesting: Dialog -> Alert Dialog -> Dialog", async () => {
		render(DialogAlertDialogNestedTest);

		// open first dialog
		await page.getByTestId("dialog-open").click();
		await expectExists(page.getByTestId("dialog-content"));

		const dialogContent = page.getByTestId("dialog-content").element() as HTMLElement;
		expect(dialogContent.style.getPropertyValue("--bits-dialog-depth")).toBe("0");

		// open alert dialog
		await page.getByTestId("alert-open").click();
		await expectExists(page.getByTestId("alert-content"));

		const alertContent = page.getByTestId("alert-content").element() as HTMLElement;
		expect(dialogContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("1");
		expect(alertContent.style.getPropertyValue("--bits-dialog-depth")).toBe("1");

		// open nested dialog
		await page.getByTestId("nested-dialog-open").click();
		await expectExists(page.getByTestId("nested-dialog-content"));

		const nestedDialogContent = page
			.getByTestId("nested-dialog-content")
			.element() as HTMLElement;
		expect(dialogContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("2");
		expect(alertContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("1");
		expect(nestedDialogContent.style.getPropertyValue("--bits-dialog-depth")).toBe("2");
		expect(nestedDialogContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");

		// verify data attributes
		await expect
			.element(page.getByTestId("dialog-content"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("dialog-overlay"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("alert-content"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("alert-overlay"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("nested-dialog-content"))
			.not.toHaveAttribute("data-nested-open");
		await expect
			.element(page.getByTestId("nested-dialog-overlay"))
			.not.toHaveAttribute("data-nested-open");

		// close nested dialog
		await page.getByTestId("nested-dialog-close").click();
		await expectNotExists(page.getByTestId("nested-dialog-content"));

		expect(dialogContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("1");
		expect(alertContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("dialog-content"))
			.toHaveAttribute("data-nested-open", "");
		await expect
			.element(page.getByTestId("alert-content"))
			.not.toHaveAttribute("data-nested-open");

		// close alert dialog
		await page.getByTestId("alert-cancel").click();
		await expectNotExists(page.getByTestId("alert-content"));

		expect(dialogContent.style.getPropertyValue("--bits-dialog-nested-count")).toBe("0");
		await expect
			.element(page.getByTestId("dialog-content"))
			.not.toHaveAttribute("data-nested-open");
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

	it("should not break tooltip when opened from tooltip trigger and disableCloseOnTriggerClick is true", async () => {
		// https://github.com/huntabyte/bits-ui/issues/1666
		render(DialogTooltipTest);
		const trigger = page.getByTestId("trigger");
		await trigger.hover();
		await expectExists(page.getByTestId("tooltip-content"));
		await trigger.click();
		await expectExists(page.getByTestId("dialog-content"));
		await expectNotExists(page.getByTestId("tooltip-content"));
		await page.getByTestId("dialog-close").click();

		await expectNotExists(page.getByTestId("dialog-content"));
		await trigger.hover();
		await expectExists(page.getByTestId("tooltip-content"));
	});
});

describe("Scroll Lock", () => {
	it("should not add padding when scrollbar-gutter: stable is applied", async () => {
		render(DialogScrollbarGutterTest);

		const initialPadding = document.body.style.paddingRight;

		await page.getByTestId("trigger").click();
		await expectExists(page.getByTestId("content"));

		// with scrollbar-gutter: stable, no padding compensation should be added
		expect(document.body.style.paddingRight).toBe(initialPadding);
	});
});
