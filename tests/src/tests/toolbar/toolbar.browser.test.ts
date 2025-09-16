import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import ToolbarTest from "./toolbar-test.svelte";
import type { ToolbarTestProps } from "./toolbar-test.svelte";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

function setup(props: Partial<ToolbarTestProps> = {}) {
	const t = render(ToolbarTest, { ...props });
	const root = page.getByTestId("root");
	const groupMultiple = page.getByTestId("group-multiple");
	const groupMultipleItemBold = page.getByTestId("group-multiple-bold");
	const groupMultipleItemItalic = page.getByTestId("group-multiple-italic");
	const groupMultipleItemStrikethrough = t.getByTestId("group-multiple-strikethrough");

	const groupSingle = page.getByTestId("group-single");
	const groupSingleItemLeft = page.getByTestId("group-single-left");
	const groupSingleItemCenter = page.getByTestId("group-single-center");
	const groupSingleItemRight = page.getByTestId("group-single-right");
	const link = page.getByTestId("link");
	const button = page.getByTestId("button");
	const styleBinding = page.getByTestId("style-binding");
	const alignBinding = page.getByTestId("align-binding");
	const clickedBinding = page.getByTestId("clicked-binding");
	return {
		root,
		groupMultiple,
		groupMultipleItemBold,
		groupMultipleItemItalic,
		groupMultipleItemStrikethrough,
		groupSingle,
		groupSingleItemLeft,
		groupSingleItemCenter,
		groupSingleItemRight,
		link,
		button,
		styleBinding,
		alignBinding,
		clickedBinding,
	};
}

describe("Toolbar", () => {
	it("should have bits data attrs", async () => {
		const t = setup();
		await expect.element(t.root).toHaveAttribute("data-toolbar-root");
		await expect.element(t.groupMultiple).toHaveAttribute("data-toolbar-group");
		await expect.element(t.groupMultipleItemBold).toHaveAttribute("data-toolbar-group-item");
		await expect.element(t.groupSingle).toHaveAttribute("data-toolbar-group");
		await expect.element(t.groupSingleItemLeft).toHaveAttribute("data-toolbar-group-item");
		await expect.element(t.link).toHaveAttribute("data-toolbar-link");
		await expect.element(t.button).toHaveAttribute("data-toolbar-button");
	});

	it("should navigate between the items using the arrow keys", async () => {
		const t = setup();
		(t.groupMultipleItemBold.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.groupMultipleItemItalic).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.groupMultipleItemStrikethrough).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.groupSingleItemLeft).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.groupSingleItemCenter).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.groupSingleItemRight).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.link).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.button).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
	});

	it("should loop around when navigating with the arrow keys", async () => {
		const t = setup();
		(t.groupMultipleItemBold.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.button).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.groupMultipleItemBold).toHaveFocus();
	});

	it("should respect the loop: false prop", async () => {
		const t = setup({
			loop: false,
		});
		(t.groupMultipleItemBold.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.button).not.toHaveFocus();
		await expect.element(t.groupMultipleItemBold).toHaveFocus();
		(t.button.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.groupMultipleItemBold).not.toHaveFocus();
		await expect.element(t.button).toHaveFocus();
	});

	it("should toggles when clicked when toolbar toggle group, type `'single'`", async () => {
		const t = setup();
		await expect.element(t.alignBinding).toHaveTextContent("");
		await userEvent.click(t.groupSingleItemLeft);
		await expect.element(t.alignBinding).toHaveTextContent("left");
		await userEvent.click(t.groupSingleItemCenter);
		await expect.element(t.alignBinding).toHaveTextContent("center");
	});

	it.each([kbd.ENTER, kbd.SPACE])(
		"should toggles when the %s key is pressed when toolbar toogle group, type `'single'`",
		async (key) => {
			const t = setup();
			await expect.element(t.alignBinding).toHaveTextContent("");
			(t.groupSingleItemLeft.element() as HTMLElement).focus();
			await userEvent.keyboard(key);
			await expect.element(t.alignBinding).toHaveTextContent("left");
			(t.groupSingleItemCenter.element() as HTMLElement).focus();
			await userEvent.keyboard(key);
			await expect.element(t.alignBinding).toHaveTextContent("center");
		}
	);

	it("should allow multiple items to be selected with toolbar toggle group type `'multiple'`", async () => {
		const t = setup();
		await expect.element(t.styleBinding).toHaveTextContent("bold");
		await userEvent.click(t.groupMultipleItemItalic);
		await expect.element(t.styleBinding).toHaveTextContent("bold,italic");
		await userEvent.click(t.groupMultipleItemStrikethrough);
		await expect.element(t.styleBinding).toHaveTextContent("bold,italic,strikethrough");
		await userEvent.click(t.groupMultipleItemBold);
		await expect.element(t.styleBinding).toHaveTextContent("italic,strikethrough");
		await userEvent.click(t.groupMultipleItemItalic);
		await expect.element(t.styleBinding).toHaveTextContent("strikethrough");
		await userEvent.click(t.groupMultipleItemStrikethrough);
		await expect.element(t.styleBinding).toHaveTextContent("");
	});

	it("should disable group items when the `disabled` prop is set to true", async () => {
		const t = setup({
			multipleProps: { disabled: true },
			singleProps: { disabled: true },
		});
		await expect.element(t.groupMultipleItemBold).toBeDisabled();
		await expect.element(t.groupMultipleItemItalic).toBeDisabled();
		await expect.element(t.groupMultipleItemStrikethrough).toBeDisabled();
		await expect.element(t.groupSingleItemLeft).toBeDisabled();
		await expect.element(t.groupSingleItemCenter).toBeDisabled();
		await expect.element(t.groupSingleItemRight).toBeDisabled();
	});

	it("should fire the `onChange` callback when changing", async () => {
		let newMultipleValue;
		function multipleOnValueChange(next: string[] | undefined) {
			newMultipleValue = next;
		}

		let newSingleValue;
		function singleOnValueChange(next: string | undefined) {
			newSingleValue = next;
		}

		const t = setup({
			multipleProps: { onValueChange: multipleOnValueChange },
			singleProps: { onValueChange: singleOnValueChange },
		});

		await t.groupMultipleItemStrikethrough.click();
		expect(newMultipleValue).toStrictEqual(["bold", "strikethrough"]);

		await t.groupSingleItemRight.click();
		expect(newSingleValue).toBe("right");
	});

	it("should respect binding to the `value` prop", async () => {
		const t = setup();
		await expect.element(t.styleBinding).toHaveTextContent("bold");
		await expect.element(t.alignBinding).toHaveTextContent("");
		await expect.element(t.groupMultipleItemItalic).toHaveAttribute("data-state", "off");
		await expect.element(t.groupMultipleItemItalic).toHaveAttribute("aria-pressed", "false");
		await expect.element(t.groupSingleItemCenter).toHaveAttribute("data-state", "off");
		await expect.element(t.groupSingleItemCenter).toHaveAttribute("aria-checked", "false");

		await t.styleBinding.click();
		await expect.element(t.styleBinding).toHaveTextContent("italic");
		await expect.element(t.groupMultipleItemItalic).toHaveAttribute("data-state", "on");
		await expect.element(t.groupMultipleItemItalic).toHaveAttribute("aria-pressed", "true");

		await t.alignBinding.click();
		await expect.element(t.alignBinding).toHaveTextContent("center");
		await expect.element(t.groupSingleItemCenter).toHaveAttribute("data-state", "on");
		await expect.element(t.groupSingleItemCenter).toHaveAttribute("aria-checked", "true");
	});

	it.each(["link", "button"])(
		"should forward click event when the %s is clicked",
		async (kind) => {
			const t = setup();

			expect(t.clickedBinding).toHaveTextContent("");
			const el = t[kind as keyof ReturnType<typeof setup>];
			await el.click();
			await expect.element(t.clickedBinding).toHaveTextContent(kind);
		}
	);

	it.each([kbd.ENTER, kbd.SPACE])(
		"should forward click event when the %s key is pressed",
		async (key) => {
			const t = setup();

			(t.button.element() as HTMLElement).focus();
			await expect.element(t.clickedBinding).toHaveTextContent("");
			await userEvent.keyboard(key);
			await expect.element(t.clickedBinding).toHaveTextContent("button");
		}
	);
});
