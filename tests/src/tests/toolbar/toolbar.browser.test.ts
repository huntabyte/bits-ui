import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import ToolbarTest from "./toolbar-test.svelte";
import type { ToolbarTestProps } from "./toolbar-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

function setup(props: Partial<ToolbarTestProps> = {}) {
	const user = setupBrowserUserEvents();
	const t = render(ToolbarTest, { ...props });
	const root = t.getByTestId("root").element() as HTMLElement;
	const groupMultiple = t.getByTestId("group-multiple").element() as HTMLElement;
	const groupMultipleItemBold = t.getByTestId("group-multiple-bold").element() as HTMLElement;
	const groupMultipleItemItalic = t.getByTestId("group-multiple-italic").element() as HTMLElement;
	const groupMultipleItemStrikethrough = t
		.getByTestId("group-multiple-strikethrough")
		.element() as HTMLElement;
	const groupSingle = t.getByTestId("group-single").element() as HTMLElement;
	const groupSingleItemLeft = t.getByTestId("group-single-left").element() as HTMLElement;
	const groupSingleItemCenter = t.getByTestId("group-single-center").element() as HTMLElement;
	const groupSingleItemRight = t.getByTestId("group-single-right").element() as HTMLElement;
	const link = t.getByTestId("link").element() as HTMLElement;
	const button = t.getByTestId("button").element() as HTMLElement;
	const styleBinding = t.getByTestId("style-binding").element() as HTMLElement;
	const alignBinding = t.getByTestId("align-binding").element() as HTMLElement;
	const clickedBinding = t.getByTestId("clicked-binding").element() as HTMLElement;
	return {
		user,
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
		...t,
	};
}

describe("Toolbar", () => {
	it("should have bits data attrs", async () => {
		const t = setup();
		expect(t.root).toHaveAttribute("data-toolbar-root");
		expect(t.groupMultiple).toHaveAttribute("data-toolbar-group");
		expect(t.groupMultipleItemBold).toHaveAttribute("data-toolbar-group-item");
		expect(t.groupSingle).toHaveAttribute("data-toolbar-group");
		expect(t.groupSingleItemLeft).toHaveAttribute("data-toolbar-group-item");
		expect(t.link).toHaveAttribute("data-toolbar-link");
		expect(t.button).toHaveAttribute("data-toolbar-button");
	});

	it("should navigate between the items using the arrow keys", async () => {
		const t = setup();
		t.groupMultipleItemBold.focus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.groupMultipleItemItalic).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.groupMultipleItemStrikethrough).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.groupSingleItemLeft).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.groupSingleItemCenter).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.groupSingleItemRight).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.link).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.button).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
	});

	it("should loop around when navigating with the arrow keys", async () => {
		const t = setup();
		t.groupMultipleItemBold.focus();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(t.button).toHaveFocus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.groupMultipleItemBold).toHaveFocus();
	});

	it("should respect the loop: false prop", async () => {
		const t = setup({
			loop: false,
		});
		t.groupMultipleItemBold.focus();
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(t.button).not.toHaveFocus();
		expect(t.groupMultipleItemBold).toHaveFocus();
		t.button.focus();
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(t.groupMultipleItemBold).not.toHaveFocus();
		expect(t.button).toHaveFocus();
	});

	it("should toggles when clicked when toolbar toogle group, type `'single'`", async () => {
		const t = setup();
		expect(t.alignBinding).toHaveTextContent("");
		await t.user.click(t.groupSingleItemLeft);
		expect(t.alignBinding).toHaveTextContent("left");
		await t.user.click(t.groupSingleItemCenter);
		expect(t.alignBinding).toHaveTextContent("center");
	});

	it.each([kbd.ENTER, kbd.SPACE])(
		"should toggles when the %s key is pressed when toolbar toogle group, type `'single'`",
		async (key) => {
			const t = setup();
			expect(t.alignBinding).toHaveTextContent("");
			t.groupSingleItemLeft.focus();
			await t.user.keyboard(key);
			expect(t.alignBinding).toHaveTextContent("left");
			t.groupSingleItemCenter.focus();
			await t.user.keyboard(key);
			expect(t.alignBinding).toHaveTextContent("center");
		}
	);

	it("should allow multiple items to be selected with toolbar toggle group type `'multiple'`", async () => {
		const t = setup();
		expect(t.styleBinding).toHaveTextContent("bold");
		await t.user.click(t.groupMultipleItemItalic);
		expect(t.styleBinding).toHaveTextContent("bold,italic");
		await t.user.click(t.groupMultipleItemStrikethrough);
		expect(t.styleBinding).toHaveTextContent("bold,italic,strikethrough");
		await t.user.click(t.groupMultipleItemBold);
		expect(t.styleBinding).toHaveTextContent("italic,strikethrough");
		await t.user.click(t.groupMultipleItemItalic);
		expect(t.styleBinding).toHaveTextContent("strikethrough");
		await t.user.click(t.groupMultipleItemStrikethrough);
		expect(t.styleBinding).toHaveTextContent("");
	});

	it("should disable group items when the `disabled` prop is set to true", async () => {
		const t = setup({
			multipleProps: { disabled: true },
			singleProps: { disabled: true },
		});
		expect(t.groupMultipleItemBold).toBeDisabled();
		expect(t.groupMultipleItemItalic).toBeDisabled();
		expect(t.groupMultipleItemStrikethrough).toBeDisabled();
		expect(t.groupSingleItemLeft).toBeDisabled();
		expect(t.groupSingleItemCenter).toBeDisabled();
		expect(t.groupSingleItemRight).toBeDisabled();
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

		await t.user.click(t.groupMultipleItemStrikethrough);
		expect(newMultipleValue).toStrictEqual(["bold", "strikethrough"]);

		await t.user.click(t.groupSingleItemRight);
		expect(newSingleValue).toBe("right");
	});

	it("should respect binding to the `value` prop", async () => {
		const t = setup();
		expect(t.styleBinding).toHaveTextContent("bold");
		expect(t.alignBinding).toHaveTextContent("");
		expect(t.groupMultipleItemItalic).toHaveAttribute("data-state", "off");
		expect(t.groupMultipleItemItalic).toHaveAttribute("aria-pressed", "false");
		expect(t.groupSingleItemCenter).toHaveAttribute("data-state", "off");
		expect(t.groupSingleItemCenter).toHaveAttribute("aria-checked", "false");

		await t.user.click(t.styleBinding);
		expect(t.styleBinding).toHaveTextContent("italic");
		expect(t.groupMultipleItemItalic).toHaveAttribute("data-state", "on");
		expect(t.groupMultipleItemItalic).toHaveAttribute("aria-pressed", "true");

		await t.user.click(t.alignBinding);
		expect(t.alignBinding).toHaveTextContent("center");
		expect(t.groupSingleItemCenter).toHaveAttribute("data-state", "on");
		expect(t.groupSingleItemCenter).toHaveAttribute("aria-checked", "true");
	});

	it.each(["link", "button"])(
		"should forward click event when the %s is clicked",
		async (kind) => {
			const t = setup();

			expect(t.clickedBinding).toHaveTextContent("");
			await t.user.click(t[kind as keyof ReturnType<typeof setup>] as Element);
			expect(t.clickedBinding).toHaveTextContent(kind);
		}
	);

	it.each([kbd.ENTER, kbd.SPACE])(
		"should forward click event when the %s key is pressed",
		async (key) => {
			const t = setup();

			t.button.focus();
			expect(t.clickedBinding).toHaveTextContent("");
			await t.user.keyboard(key);
			expect(t.clickedBinding).toHaveTextContent("button");
		}
	);
});
