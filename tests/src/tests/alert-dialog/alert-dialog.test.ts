import { render, screen, waitFor } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it, vi } from "vitest";
import type { Component } from "svelte";
import { getTestKbd, setupUserEvents, sleep } from "../utils.js";
import AlertDialogTest, { type AlertDialogTestProps } from "./alert-dialog-test.svelte";
import AlertDialogForceMountTest from "./alert-dialog-force-mount-test.svelte";
import { testOutsideClick } from "../outside-click";

const kbd = getTestKbd();

function expectIsClosed() {
	const content = screen.queryByTestId("content");
	expect(content).toBeNull();
}

async function expectIsOpen() {
	const content = screen.queryByTestId("content");
	await waitFor(() => expect(content).not.toBeNull());
}

function setup(props: AlertDialogTestProps = {}, component: Component = AlertDialogTest) {
	const user = setupUserEvents();
	const t = render(component, { ...props });
	const trigger = t.getByTestId("trigger");
	return { ...t, trigger, user };
}

async function open(props: AlertDialogTestProps = {}) {
	const t = setup(props);
	const content = t.queryByTestId("content");
	expect(content).toBeNull();
	await t.user.pointerDownUp(t.trigger);
	const contentAfter = t.getByTestId("content");
	expect(contentAfter).not.toBeNull();
	const cancel = t.getByTestId("cancel");
	const action = t.getByTestId("action");
	return { ...t, action, cancel, content: contentAfter };
}

describe("Accessibility", () => {
	it("should have no accessibility violations when closed", async () => {
		const t = setup();
		expect(await axe(t.container)).toHaveNoViolations();
	});

	it("should have no accessibility violations when open", async () => {
		const t = setup({ open: true });
		expect(await axe(t.container)).toHaveNoViolations();
	});
});

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
		const cancel = t.getByTestId("cancel");
		await t.user.pointerDownUp(cancel);
		expectIsClosed();
	});

	it.todo("should close when the `Escape` key is pressed", async () => {
		const t = await open();
		await t.user.keyboard(kbd.ESCAPE);
		expectIsClosed();
		await sleep(100);
		await waitFor(() => expect(t.getByTestId("trigger")).toHaveFocus());
	});

	it("should not close when the overlay is clicked", async () => {
		const t = await open();
		await t.user.pointerDownUp(t.getByTestId("overlay"));
		expect(t.queryByTestId("content")).not.toBeNull();
	});

	it("should not close when content is clicked", async () => {
		const t = await open();
		await t.user.pointerDownUp(t.getByTestId("content"));
		await expectIsOpen();
	});
});

describe("Focus Management", () => {
	it("should focus the alert dialog content when opened to ensure screen readers announce the 'alert'", async () => {
		const t = await open();
		expect(t.content).toHaveFocus();
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
});

describe("Props and Rendering", () => {
	it("should forceMount the content and overlay when their `forceMount` prop is true", async () => {
		const t = setup({}, AlertDialogForceMountTest);
		expect(t.getByTestId("overlay")).toBeInTheDocument();
		expect(t.getByTestId("content")).toBeInTheDocument();
	});

	it("should forceMount the content and overlay when their `forceMount` prop is true and the `open` snippet prop is used", async () => {
		const t = setup({ withOpenCheck: true }, AlertDialogForceMountTest);
		expect(t.queryByTestId("overlay")).toBeNull();
		expect(t.queryByTestId("content")).toBeNull();
		await t.user.pointerDownUp(t.getByTestId("trigger"));
		expect(t.getByTestId("overlay")).toBeInTheDocument();
		expect(t.getByTestId("content")).toBeInTheDocument();
	});

	it("should respect binding to the `open` prop", async () => {
		const t = setup();
		const binding = t.getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await t.user.pointerDownUp(t.getByTestId("trigger"));
		expect(binding).toHaveTextContent("true");
		await t.user.keyboard(kbd.ESCAPE);
		expect(binding).toHaveTextContent("false");
		expectIsClosed();
		await t.user.click(t.getByTestId("toggle"));
		await expectIsOpen();
	});

	it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
		const t = await open({
			contentProps: { interactOutsideBehavior: "ignore" },
		});
		await t.user.click(t.getByTestId("overlay"));
		await expectIsOpen();
	});

	it("should respect the `interactOutsideBehavior: 'close'` prop", async () => {
		const mockFn = vi.fn();
		const t = await open({
			contentProps: { onInteractOutside: mockFn, interactOutsideBehavior: "close" },
		});

		const outside = t.getByTestId("outside");
		await testOutsideClick(() => t.queryByTestId("content"), outside, t.user, mockFn);
	});

	it("should respect the `escapeKeydownBehavior: 'ignore'` prop", async () => {
		const t = await open({
			contentProps: { escapeKeydownBehavior: "ignore" },
		});
		await t.user.keyboard(kbd.ESCAPE);
		await expectIsOpen();
		expect(t.getByTestId("trigger")).not.toHaveFocus();
	});
});

describe("Portal Behavior", () => {
	it("should attach to body when using portal element", async () => {
		const t = await open();
		expect(t.getByTestId("content").parentElement).toEqual(document.body);
	});

	it("should attach to body when portal is disabled", async () => {
		const t = await open({
			portalProps: { disabled: true },
		});
		expect(t.getByTestId("content").parentElement).not.toEqual(document.body);
	});

	it("should portal to the target if passed as a prop", async () => {
		const t = await open({
			portalProps: { to: "#portalTarget" },
		});
		expect(t.getByTestId("content").parentElement).toEqual(t.getByTestId("portalTarget"));
	});
});

describe("ARIA Attributes", () => {
	it("should apply the correct `aria-describedby` attribute to the `Dialog.Content` element", async () => {
		const t = await open();
		const content = t.getByTestId("content");
		const description = t.getByTestId("description");
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
