import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import ToolbarTest from "./toolbar-test.svelte";
import type { ToolbarTestProps } from "./toolbar-test.svelte";
import { page, userEvent } from "vitest/browser";

const kbd = getTestKbd();

async function setup(props: Partial<ToolbarTestProps> = {}) {
	await render(ToolbarTest, { ...props });
	const root = page.getByTestId("root");
	const groupMultiple = page.getByTestId("group-multiple");
	const groupMultipleItemBold = page.getByTestId("group-multiple-bold");
	const groupMultipleItemItalic = page.getByTestId("group-multiple-italic");
	const groupMultipleItemStrikethrough = page.getByTestId("group-multiple-strikethrough");

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
		const t = await setup();
		await expect.element(t.root).toHaveAttribute("data-toolbar-root");
		await expect.element(t.groupMultiple).toHaveAttribute("data-toolbar-group");
		await expect.element(t.groupMultipleItemBold).toHaveAttribute("data-toolbar-group-item");
		await expect.element(t.groupSingle).toHaveAttribute("data-toolbar-group");
		await expect.element(t.groupSingleItemLeft).toHaveAttribute("data-toolbar-group-item");
		await expect.element(t.link).toHaveAttribute("data-toolbar-link");
		await expect.element(t.button).toHaveAttribute("data-toolbar-button");
	});

	it("should navigate between the items using the arrow keys", async () => {
		const t = await setup();
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
		const t = await setup();
		(t.groupMultipleItemBold.element() as HTMLElement).focus();
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(t.button).toHaveFocus();
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(t.groupMultipleItemBold).toHaveFocus();
	});

	it("should respect the loop: false prop", async () => {
		const t = await setup({
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
		const t = await setup();
		await expect.element(t.alignBinding).toMatchTextContent("");
		await t.groupSingleItemLeft.click();
		await expect.element(t.alignBinding).toMatchTextContent("left");
		await t.groupSingleItemCenter.click();
		await expect.element(t.alignBinding).toMatchTextContent("center");
	});

	it.each([kbd.ENTER, kbd.SPACE])(
		"should toggles when the %s key is pressed when toolbar toogle group, type `'single'`",
		async (key) => {
			const t = await setup();
			await expect.element(t.alignBinding).toMatchTextContent("");
			(t.groupSingleItemLeft.element() as HTMLElement).focus();
			await userEvent.keyboard(key);
			await expect.element(t.alignBinding).toMatchTextContent("left");
			(t.groupSingleItemCenter.element() as HTMLElement).focus();
			await userEvent.keyboard(key);
			await expect.element(t.alignBinding).toMatchTextContent("center");
		}
	);

	it("should allow multiple items to be selected with toolbar toggle group type `'multiple'`", async () => {
		const t = await setup();
		await expect.element(t.styleBinding).toMatchTextContent("bold");
		await t.groupMultipleItemItalic.click();
		await expect.element(t.styleBinding).toMatchTextContent("bold,italic");
		await t.groupMultipleItemStrikethrough.click();
		await expect.element(t.styleBinding).toMatchTextContent("bold,italic,strikethrough");
		await t.groupMultipleItemBold.click();
		await expect.element(t.styleBinding).toMatchTextContent("italic,strikethrough");
		await t.groupMultipleItemItalic.click();
		await expect.element(t.styleBinding).toMatchTextContent("strikethrough");
		await t.groupMultipleItemStrikethrough.click();
		await expect.element(t.styleBinding).toMatchTextContent("");
	});

	it("should disable group items when the `disabled` prop is set to true", async () => {
		const t = await setup({
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

		const t = await setup({
			multipleProps: { onValueChange: multipleOnValueChange },
			singleProps: { onValueChange: singleOnValueChange },
		});

		await t.groupMultipleItemStrikethrough.click();
		expect(newMultipleValue).toStrictEqual(["bold", "strikethrough"]);

		await t.groupSingleItemRight.click();
		expect(newSingleValue).toBe("right");
	});

	it("should respect binding to the `value` prop", async () => {
		const t = await setup();
		await expect.element(t.styleBinding).toMatchTextContent("bold");
		await expect.element(t.alignBinding).toMatchTextContent("");
		await expect.element(t.groupMultipleItemItalic).toHaveAttribute("data-state", "off");
		await expect.element(t.groupMultipleItemItalic).toHaveAttribute("aria-pressed", "false");
		await expect.element(t.groupSingleItemCenter).toHaveAttribute("data-state", "off");
		await expect.element(t.groupSingleItemCenter).toHaveAttribute("aria-checked", "false");

		await t.styleBinding.click();
		await expect.element(t.styleBinding).toMatchTextContent("italic");
		await expect.element(t.groupMultipleItemItalic).toHaveAttribute("data-state", "on");
		await expect.element(t.groupMultipleItemItalic).toHaveAttribute("aria-pressed", "true");

		await t.alignBinding.click();
		await expect.element(t.alignBinding).toMatchTextContent("center");
		await expect.element(t.groupSingleItemCenter).toHaveAttribute("data-state", "on");
		await expect.element(t.groupSingleItemCenter).toHaveAttribute("aria-checked", "true");
	});

	it.each(["link", "button"])(
		"should forward click event when the %s is clicked",
		async (kind) => {
			const t = await setup();

			expect(t.clickedBinding).toMatchTextContent("");
			const el = t[kind as keyof Awaited<ReturnType<typeof setup>>];
			await el.click();
			await expect.element(t.clickedBinding).toMatchTextContent(kind);
		}
	);

	it.each([kbd.ENTER, kbd.SPACE])(
		"should forward click event when the %s key is pressed",
		async (key) => {
			const t = await setup();

			(t.button.element() as HTMLElement).focus();
			await expect.element(t.clickedBinding).toMatchTextContent("");
			await userEvent.keyboard(key);
			await expect.element(t.clickedBinding).toMatchTextContent("button");
		}
	);
});
