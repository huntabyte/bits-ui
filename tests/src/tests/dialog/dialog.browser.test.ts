import { userEvent, page } from "@vitest/browser/context";
import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { tick, type Component } from "svelte";
import { getTestKbd, sleep } from "../utils.js";
import DialogTest, { type DialogTestProps } from "./dialog-test.svelte";
import DialogNestedTest from "./dialog-nested-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";
import DialogForceMountTest from "./dialog-force-mount-test.svelte";

const kbd = getTestKbd();

async function setup(props: DialogTestProps = {}, component: Component = DialogTest) {
	const user = setupBrowserUserEvents();
	const t = render(component, { ...props });
	const trigger = t.getByTestId("trigger").element() as HTMLElement;
	await sleep(15);

	return {
		...t,
		trigger,
		user,
	};
}

async function open(props: DialogTestProps = {}, component: Component = DialogTest) {
	const t = await setup(props, component);
	await expectNotExists(t.getByTestId("content"));
	await t.user.click(t.trigger);
	await expectExists(t.getByTestId("content"));
	return t;
}

describe("Data Attributes", () => {
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
});

describe("Open/Close Behavior", () => {
	it("should open when the trigger is clicked", async () => {
		await open();
	});

	it("should close when the close button is clicked", async () => {
		const t = await open();
		const close = t.getByTestId("close").element();
		await t.user.click(close);
		await expectNotExists(t.getByTestId("content"));
	});

	it.todo("should close when the `Escape` key is pressed", async () => {
		const t = await open();
		await t.user.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getByTestId("content"));
		expect(t.getByTestId("trigger").element()).toHaveFocus();
	});

	it("should close when the overlay is clicked", async () => {
		const t = await open();
		await expectExists(t.getByTestId("overlay"));
		await t.user.click(t.getByTestId("overlay"));
		await expectNotExists(t.getByTestId("content"));
	});

	it("should not close when content is clicked", async () => {
		const t = await open();
		await t.user.click(t.getByTestId("content").element());
		await expectExists(t.getByTestId("content"));
	});
});

describe("Focus Management", () => {
	it.each([true, false])(
		"should focus the trigger when the dialog is closed (force mount: %s)",
		async (withOpenCheck) => {
			const t = await setup({ withOpenCheck }, DialogForceMountTest);
			await t.user.click(t.trigger);
			await expectExists(t.getByTestId("content"));
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
				DialogForceMountTest
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
				DialogForceMountTest
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

	it("should focus first focusable item upon opening", async () => {
		const t = await open();
		const closeButton = t.getByTestId("close").element();
		expect(document.activeElement).toBe(closeButton);
	});
});

describe("Portal Behavior", () => {
	it("should portal to body when using portal element", async () => {
		const t = await open();

		const content = t.getByTestId("content").element();
		expect(content.parentElement).toEqual(document.body);
	});

	it("should not portal to body when portal is disabled", async () => {
		const t = await open({
			portalProps: {
				disabled: true,
			},
		});
		const content = t.getByTestId("content").element();
		expect(content.parentElement).not.toEqual(document.body);
	});

	it("should portal to the target if passed as a prop", async () => {
		const t = await open({
			portalProps: {
				to: "#portalTarget",
			},
		});
		const portalTarget = t.getByTestId("portalTarget").element();
		const content = t.getByTestId("content").element();
		expect(content.parentElement).toEqual(portalTarget);
	});
});

it("should not close when content is clicked", async () => {
	const t = await open();
	const content = t.getByTestId("content").element();
	await t.user.click(content);
	await expectExists(t.getByTestId("content"));
});

it("should respect binding to the `open` prop", async () => {
	const t = await setup();
	const trigger = t.getByTestId("trigger");
	const binding = t.getByTestId("binding");
	expect(binding).toHaveTextContent("false");
	await t.user.click(trigger);
	expect(t.getByTestId("binding")).toHaveTextContent("true");
	await t.user.keyboard(kbd.ESCAPE);
	expect(t.getByTestId("binding")).toHaveTextContent("false");

	const toggle = t.getByTestId("toggle");
	await expectNotExists(t.getByTestId("content"));
	await t.user.click(toggle);
	await expectExists(t.getByTestId("content"));
});

it("should close on outside click", async () => {
	const mockFn = vi.fn();
	const t = await open({
		contentProps: {
			onInteractOutside: mockFn,
		},
	});
	await t.user.click(t.getByTestId("overlay"));
	await vi.waitFor(() => expect(mockFn).toHaveBeenCalled());
});

it("should not close when clicking within bounds", async () => {
	const mockFn = vi.fn();
	const t = await open({
		contentProps: { onInteractOutside: mockFn },
	});

	await t.user.click(t.getByTestId("content").element());
	await expectExists(t.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	await sleep(100);

	await t.user.click(t.getByTestId("overlay"));
	await expectExists(t.getByTestId("content"));
});

it("should respect the the `escapeKeydownBehavior: 'ignore'` prop", async () => {
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});

	await t.user.keyboard(kbd.ESCAPE);
	await expectExists(t.getByTestId("content"));
	expect(t.trigger).not.toHaveFocus();
});

describe("ARIA Attributes", () => {
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
		const t = await open();

		const title = t.getByTestId("title");
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
		await open({
			descriptionProps: {
				id: "description-id",
			},
		});

		const content = page.getByTestId("content");
		const description = page.getByTestId("description").element() as HTMLElement;
		expect(description).toHaveAttribute("id", "description-id");
		expect(content).toHaveAttribute("aria-describedby", description.id);

		const updateIdButton = page.getByTestId("update-id");
		await updateIdButton.click();

		expect(description.id).not.toBe("description-id");
		expect(description.id).toBe("new-id");
		expect(content).toHaveAttribute("aria-describedby", description.id);
	});
});

describe("Nested Dialogs", () => {
	it.todo("should handle focus scoping correctly", async () => {
		const user = userEvent;
		const t = render(DialogNestedTest);
		const trigger = t.getByTestId("first-open");
		await user.click(trigger);
		await tick();
		await expectExists(t.getByTestId("first-close"));
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
