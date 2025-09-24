import { describe, expect, it, vi } from "vitest";
import { page, userEvent } from "@vitest/browser/context";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import AlertDialogTest, { type AlertDialogTestProps } from "./alert-dialog-test.svelte";
import AlertDialogForceMountTest from "./alert-dialog-force-mount-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";

const kbd = getTestKbd();

async function setup(props: AlertDialogTestProps = {}, component = AlertDialogTest) {
	render(component, { ...props });
	const trigger = page.getByTestId("trigger");
	return { trigger };
}

async function open(props: AlertDialogTestProps = {}) {
	const t = await setup(props);
	const content = page.getByTestId("content");
	await expectNotExists(content);

	await t.trigger.click();

	await expectExists(content);

	const cancel = page.getByTestId("cancel");
	const action = page.getByTestId("action");

	return { ...t, action, cancel, content };
}

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		await open();
		const parts = ["trigger", "overlay", "cancel", "title", "description", "content"];
		for (const part of parts) {
			const el = page.getByTestId(part);
			await expect.element(el).toHaveAttribute(`data-alert-dialog-${part}`);
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

	it("should close when the cancel button is clicked", async () => {
		await open();
		const cancel = page.getByTestId("cancel");
		await cancel.click();
		await expectNotExists(page.getByTestId("content"));
	});

	it("should close when the `Escape` key is pressed", async () => {
		await open();
		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(page.getByTestId("content"));
		await expect.element(page.getByTestId("trigger")).toHaveFocus();
	});

	it("should not close when the overlay is clicked", async () => {
		await open();

		const overlay = page.getByTestId("overlay");
		await expect.element(overlay).toBeInTheDocument();

		await overlay.click();
		await expect.element(page.getByTestId("content")).toBeVisible();
	});

	it("should not close when content is clicked", async () => {
		await open();
		const content = page.getByTestId("content");
		await content.click();
		await expectExists(content);
	});
});

describe("Focus Management", () => {
	it("should focus the alert dialog content when opened to ensure screen readers announce the 'alert'", async () => {
		const t = await open();
		expect(t.content).toHaveFocus();
	});

	it.each([true, false])(
		"should focus the alert dialog content when opened to ensure screen readers announce the 'alert' (force mount)",
		async (withOpenCheck) => {
			const t = await setup({ withOpenCheck }, AlertDialogForceMountTest);
			await t.trigger.click();
			await expectExists(page.getByTestId("content"));
			await expect.element(page.getByTestId("content")).toHaveFocus();
		}
	);

	it.each([true, false])(
		"should focus the trigger when the dialog is closed (force mount: %s)",
		async (withOpenCheck) => {
			const t = await setup({ withOpenCheck }, AlertDialogForceMountTest);
			await t.trigger.click();
			await expectExists(page.getByTestId("content"));
			await expect.element(page.getByTestId("content")).toHaveFocus();
			await userEvent.keyboard(kbd.ESCAPE);
			await expect.element(t.trigger).toHaveFocus();
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
				AlertDialogForceMountTest
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
				AlertDialogForceMountTest
			);
			await t.trigger.click();
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
});

describe("Props and Rendering", () => {
	it("should forceMount the content and overlay when their `forceMount` prop is true", async () => {
		await setup({}, AlertDialogForceMountTest);
		await expect.element(page.getByTestId("overlay")).toBeInTheDocument();
		await expect.element(page.getByTestId("content")).toBeInTheDocument();
	});

	it("should forceMount the content and overlay when their `forceMount` prop is true and the `open` snippet prop is used", async () => {
		const t = await setup({ withOpenCheck: true }, AlertDialogForceMountTest);
		await expectNotExists(page.getByTestId("overlay"));
		await expectNotExists(page.getByTestId("content"));
		await t.trigger.click();
		await expectExists(page.getByTestId("overlay"));
		await expectExists(page.getByTestId("content"));
	});

	it("should respect binding to the `open` prop", async () => {
		const t = await setup();
		const binding = page.getByTestId("binding");
		await expect.element(binding).toHaveTextContent("false");
		await t.trigger.click();
		await expect.element(binding).toHaveTextContent("true");
		await userEvent.keyboard(kbd.ESCAPE);
		await expect.element(binding).toHaveTextContent("false");
		await expectNotExists(page.getByTestId("content"));
		await page.getByTestId("toggle").click();
		await expectExists(page.getByTestId("content"));
	});

	it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
		await open({
			contentProps: { interactOutsideBehavior: "ignore" },
		});
		await page.getByTestId("overlay").click();
		await expectExists(page.getByTestId("content"));
	});

	it("should respect the `interactOutsideBehavior: 'close'` prop", async () => {
		const mockFn = vi.fn();
		await open({
			contentProps: { interactOutsideBehavior: "close", onInteractOutside: mockFn },
		});

		await page.getByTestId("overlay").click();
		await vi.waitFor(() => expect(mockFn).toHaveBeenCalled());
		await expectNotExists(page.getByTestId("content"));
	});

	it("should respect the `escapeKeydownBehavior: 'ignore'` prop", async () => {
		await open({
			contentProps: { escapeKeydownBehavior: "ignore" },
		});
		await userEvent.keyboard(kbd.ESCAPE);
		await expectExists(page.getByTestId("content"));
		await expect.element(page.getByTestId("trigger")).not.toHaveFocus();
	});
});

describe("Portal Behavior", () => {
	it("should attach to body when using portal element", async () => {
		await open();
		expect(page.getByTestId("content").element().parentElement).toEqual(document.body);
	});

	it("should attach to body when portal is disabled", async () => {
		await open({
			portalProps: { disabled: true },
		});
		expect(page.getByTestId("content").element().parentElement).not.toEqual(document.body);
	});

	it("should portal to the target if passed as a prop", async () => {
		await open({
			portalProps: { to: "#portalTarget" },
		});
		expect(page.getByTestId("content").element().parentElement).toEqual(
			page.getByTestId("portalTarget").element()
		);
	});
});

describe("ARIA Attributes", () => {
	it("should apply the correct `aria-describedby` attribute to the `Dialog.Content` element", async () => {
		await open();
		const content = page.getByTestId("content");
		const description = page.getByTestId("description");
		await expect.element(content).toHaveAttribute("aria-describedby", description.element().id);
	});

	it("should apply a default `aria-level` attribute to the `AlertDialog.Title` element", async () => {
		await open();
		await expect.element(page.getByTestId("title")).toHaveAttribute("aria-level", "2");
	});

	it("should allow setting a custom level for the `AlertDialog.Title` element", async () => {
		await open({
			titleProps: { level: 3 },
		});
		await expect.element(page.getByTestId("title")).toHaveAttribute("aria-level", "3");
	});
});
