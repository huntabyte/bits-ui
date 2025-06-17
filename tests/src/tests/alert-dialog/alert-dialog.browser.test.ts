import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd, sleep } from "../utils.js";
import AlertDialogTest, { type AlertDialogTestProps } from "./alert-dialog-test.svelte";
import AlertDialogForceMountTest from "./alert-dialog-force-mount-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

async function setup(props: AlertDialogTestProps = {}, component = AlertDialogTest) {
	const user = setupBrowserUserEvents();
	const t = render(component, { ...props });
	await sleep(10);
	const trigger = t.getByTestId("trigger");
	return { ...t, trigger, user };
}

async function open(props: AlertDialogTestProps = {}) {
	const t = await setup(props);
	const content = t.getByTestId("content");
	await expectNotExists(content);

	await t.user.click(t.trigger);

	await expectExists(content);

	const cancel = t.getByTestId("cancel").element();
	const action = t.getByTestId("action").element();

	return { ...t, action, cancel, content };
}

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		const t = await open();
		const parts = ["trigger", "overlay", "cancel", "title", "description", "content"];
		for (const part of parts) {
			const el = t.getByTestId(part);
			expect(el).toHaveAttribute(`data-alert-dialog-${part}`);
		}
	});

	it("should have expected data attributes", async () => {
		const t = await open();
		const overlay = t.getByTestId("overlay");
		expect(overlay).toHaveAttribute("data-state", "open");
		const content = t.getByTestId("content");
		expect(content).toHaveAttribute("data-state", "open");
	});
});

describe("Open/Close Behavior", () => {
	it("should open when the trigger is clicked", async () => {
		await open();
	});

	it("should close when the cancel button is clicked", async () => {
		const t = await open();
		const cancel = t.getByTestId("cancel").element();
		await t.user.click(cancel);
		await expectNotExists(t.getByTestId("content"));
	});

	it.todo("should close when the `Escape` key is pressed", async () => {
		const t = await open();
		await t.user.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getByTestId("content"));
		expect(t.getByTestId("trigger").element()).toHaveFocus();
	});

	it("should not close when the overlay is clicked", async () => {
		const t = await open();

		expect(t.getByTestId("overlay")).toBeInTheDocument();

		await t.user.click(t.getByTestId("overlay").element());
		expect(t.getByTestId("content")).toBeVisible();
	});

	it("should not close when content is clicked", async () => {
		const t = await open();
		await t.user.click(t.getByTestId("content").element());
		await expectExists(t.getByTestId("content"));
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
			await t.user.click(t.trigger);
			await expectExists(t.getByTestId("content"));
			expect(t.getByTestId("content")).toHaveFocus();
		}
	);

	it.each([true, false])(
		"should focus the trigger when the dialog is closed (force mount: %s)",
		async (withOpenCheck) => {
			const t = await setup({ withOpenCheck }, AlertDialogForceMountTest);
			await t.user.click(t.trigger);
			await expectExists(t.getByTestId("content"));
			expect(t.getByTestId("content")).toHaveFocus();
			await t.user.keyboard(kbd.ESCAPE);
			expect(t.trigger).toHaveFocus();
		}
	);

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
			await t.user.click(t.trigger);
			await expectExists(t.getByTestId("content"));
			expect(t.getByTestId("open-focus-override")).toHaveFocus();
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
			await t.user.click(t.trigger);
			await expectExists(t.getByTestId("content"));
			await t.user.keyboard(kbd.ESCAPE);
			expect(t.getByTestId("close-focus-override")).toHaveFocus();
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
		expect(t.getByTestId("close-focus-override")).toHaveFocus();
	});
});

describe("Props and Rendering", () => {
	it("should forceMount the content and overlay when their `forceMount` prop is true", async () => {
		const t = await setup({}, AlertDialogForceMountTest);
		expect(t.getByTestId("overlay")).toBeInTheDocument();
		expect(t.getByTestId("content")).toBeInTheDocument();
	});

	it("should forceMount the content and overlay when their `forceMount` prop is true and the `open` snippet prop is used", async () => {
		const t = await setup({ withOpenCheck: true }, AlertDialogForceMountTest);
		await expectNotExists(t.getByTestId("overlay"));
		await expectNotExists(t.getByTestId("content"));
		await t.user.click(t.getByTestId("trigger"));
		await expectExists(t.getByTestId("overlay"));
		await expectExists(t.getByTestId("content"));
	});

	it("should respect binding to the `open` prop", async () => {
		const t = await setup();
		const binding = t.getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await t.user.click(t.getByTestId("trigger"));
		expect(binding).toHaveTextContent("true");
		await t.user.keyboard(kbd.ESCAPE);
		expect(binding).toHaveTextContent("false");
		await expectNotExists(t.getByTestId("content"));
		await t.user.click(t.getByTestId("toggle"));
		await expectExists(t.getByTestId("content"));
	});

	it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
		const t = await open({
			contentProps: { interactOutsideBehavior: "ignore" },
		});
		await t.user.click(t.getByTestId("overlay"));
		await expectExists(t.getByTestId("content"));
	});

	it("should respect the `interactOutsideBehavior: 'close'` prop", async () => {
		const mockFn = vi.fn();
		const t = await open({
			contentProps: { interactOutsideBehavior: "close", onInteractOutside: mockFn },
		});

		await t.user.click(t.getByTestId("overlay").element());
		expect(mockFn).toHaveBeenCalled();
		await expectNotExists(t.getByTestId("content"));
	});

	it("should respect the `escapeKeydownBehavior: 'ignore'` prop", async () => {
		const t = await open({
			contentProps: { escapeKeydownBehavior: "ignore" },
		});
		await t.user.keyboard(kbd.ESCAPE);
		await expectExists(t.getByTestId("content"));
		expect(t.getByTestId("trigger")).not.toHaveFocus();
	});
});

describe("Portal Behavior", () => {
	it("should attach to body when using portal element", async () => {
		const t = await open();
		expect(t.getByTestId("content").element().parentElement).toEqual(document.body);
	});

	it("should attach to body when portal is disabled", async () => {
		const t = await open({
			portalProps: { disabled: true },
		});
		expect(t.getByTestId("content").element().parentElement).not.toEqual(document.body);
	});

	it("should portal to the target if passed as a prop", async () => {
		const t = await open({
			portalProps: { to: "#portalTarget" },
		});
		expect(t.getByTestId("content").element().parentElement).toEqual(
			t.getByTestId("portalTarget").element()
		);
	});
});

describe("ARIA Attributes", () => {
	it("should apply the correct `aria-describedby` attribute to the `Dialog.Content` element", async () => {
		const t = await open();
		const content = t.getByTestId("content").element();
		const description = t.getByTestId("description").element();
		expect(content).toHaveAttribute("aria-describedby", description.id);
	});

	it("should apply a default `aria-level` attribute to the `AlertDialog.Title` element", async () => {
		const t = await open();
		expect(t.getByTestId("title")).toHaveAttribute("aria-level", "2");
	});

	it("should allow setting a custom level for the `AlertDialog.Title` element", async () => {
		const t = await open({
			titleProps: { level: 3 },
		});
		expect(t.getByTestId("title")).toHaveAttribute("aria-level", "3");
	});
});
