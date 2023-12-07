import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { testKbd as kbd } from "../utils.js";
import type { Toolbar } from "$lib";
import ToolbarTest from "./ToolbarTest.svelte";

function setup(
	props: Toolbar.Props & {
		multipleProps?: Toolbar.GroupProps<"multiple">;
		singleProps?: Toolbar.GroupProps<"single">;
	} = {}
) {
	const user = userEvent.setup();
	const returned = render(ToolbarTest, { ...props });
	const root = returned.getByTestId("root");
	const groupMultiple = returned.getByTestId("group-multiple");
	const groupMultipleItemBold = returned.getByTestId("group-multiple-bold");
	const groupMultipleItemItalic = returned.getByTestId("group-multiple-italic");
	const groupMultipleItemStrikethrough = returned.getByTestId("group-multiple-strikethrough");
	const groupSingle = returned.getByTestId("group-single");
	const groupSingleItemLeft = returned.getByTestId("group-single-left");
	const groupSingleItemCenter = returned.getByTestId("group-single-center");
	const groupSingleItemRight = returned.getByTestId("group-single-right");
	const link = returned.getByTestId("link");
	const button = returned.getByTestId("button");
	const styleBinding = returned.getByTestId("style-binding");
	const alignBinding = returned.getByTestId("align-binding");
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
		...returned
	};
}

describe("Toolbar", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(ToolbarTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const {
			root,
			groupMultiple,
			groupMultipleItemBold,
			groupSingle,
			groupSingleItemLeft,
			link,
			button
		} = setup();
		expect(root).toHaveAttribute("data-toolbar-root");
		expect(groupMultiple).toHaveAttribute("data-toolbar-group");
		expect(groupMultipleItemBold).toHaveAttribute("data-toolbar-group-item");
		expect(groupSingle).toHaveAttribute("data-toolbar-group");
		expect(groupSingleItemLeft).toHaveAttribute("data-toolbar-group-item");
		expect(link).toHaveAttribute("data-toolbar-link");
		expect(button).toHaveAttribute("data-toolbar-button");
	});

	it("navigates between the items using the arrow keys", async () => {
		const {
			user,
			groupMultipleItemBold,
			groupMultipleItemItalic,
			groupMultipleItemStrikethrough,
			groupSingleItemLeft,
			groupSingleItemCenter,
			groupSingleItemRight,
			link,
			button
		} = setup();
		groupMultipleItemBold.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupMultipleItemItalic).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupMultipleItemStrikethrough).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupSingleItemLeft).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupSingleItemCenter).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupSingleItemRight).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(link).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(button).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
	});

	it("loops around when navigating with the arrow keys", async () => {
		const { user, groupMultipleItemBold, button } = setup();
		groupMultipleItemBold.focus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(button).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupMultipleItemBold).toHaveFocus();
	});

	it("respects the loop prop", async () => {
		const { user, groupMultipleItemBold, button } = setup({
			loop: false
		});
		groupMultipleItemBold.focus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(button).not.toHaveFocus();
		expect(groupMultipleItemBold).toHaveFocus();
		button.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(groupMultipleItemBold).not.toHaveFocus();
		expect(button).toHaveFocus();
	});

	it("toolbar toogle group, type `'single'`, toggles when clicked", async () => {
		const { user, groupSingleItemLeft, groupSingleItemCenter, alignBinding } = setup();
		expect(alignBinding).toHaveTextContent("undefined");
		await user.click(groupSingleItemLeft);
		expect(alignBinding).toHaveTextContent("left");
		await user.click(groupSingleItemCenter);
		expect(alignBinding).toHaveTextContent("center");
	});

	it.each([kbd.ENTER, kbd.SPACE])(
		"toolbar toogle group, type `'single'`, toggles when the %s key is pressed",
		async (key) => {
			const { user, groupSingleItemLeft, groupSingleItemCenter, alignBinding } = setup();
			expect(alignBinding).toHaveTextContent("undefined");
			groupSingleItemLeft.focus();
			await user.keyboard(key);
			expect(alignBinding).toHaveTextContent("left");
			groupSingleItemCenter.focus();
			await user.keyboard(key);
			expect(alignBinding).toHaveTextContent("center");
		}
	);

	it("allows multiple items to be selected with toolbar toggle group type `'multiple'`", async () => {
		const {
			user,
			groupMultipleItemBold,
			groupMultipleItemItalic,
			groupMultipleItemStrikethrough,
			styleBinding
		} = setup();
		expect(styleBinding).toHaveTextContent("bold");
		await user.click(groupMultipleItemItalic);
		expect(styleBinding).toHaveTextContent("bold,italic");
		await user.click(groupMultipleItemStrikethrough);
		expect(styleBinding).toHaveTextContent("bold,italic,strikethrough");
		await user.click(groupMultipleItemBold);
		expect(styleBinding).toHaveTextContent("italic,strikethrough");
		await user.click(groupMultipleItemItalic);
		expect(styleBinding).toHaveTextContent("strikethrough");
		await user.click(groupMultipleItemStrikethrough);
		expect(styleBinding).toHaveTextContent("");
	});

	it("toolbar toogle group items should be disabled then the `disabled` prop is set to true", async () => {
		const {
			groupMultipleItemBold,
			groupMultipleItemItalic,
			groupMultipleItemStrikethrough,
			groupSingleItemLeft,
			groupSingleItemCenter,
			groupSingleItemRight
		} = setup({ multipleProps: { disabled: true }, singleProps: { disabled: true } });
		expect(groupMultipleItemBold).toBeDisabled();
		expect(groupMultipleItemItalic).toBeDisabled();
		expect(groupMultipleItemStrikethrough).toBeDisabled();
		expect(groupSingleItemLeft).toBeDisabled();
		expect(groupSingleItemCenter).toBeDisabled();
		expect(groupSingleItemRight).toBeDisabled();
	});

	it("toolbar toogle groups should fire the `onChange` callback when changing", async () => {
		let newMultipleValue = undefined;
		function multipleOnValueChange(next: string[] | undefined) {
			newMultipleValue = next;
		}

		let newSingleValue = undefined;
		function singleOnValueChange(next: string | undefined) {
			newSingleValue = next;
		}

		const { user, groupMultipleItemStrikethrough, groupSingleItemRight } = setup({
			multipleProps: { onValueChange: multipleOnValueChange },
			singleProps: { onValueChange: singleOnValueChange }
		});

		expect(newMultipleValue).toStrictEqual(["bold"]);
		expect(newSingleValue).toBe(undefined);

		await user.click(groupMultipleItemStrikethrough);
		expect(newMultipleValue).toStrictEqual(["bold", "strikethrough"]);

		await user.click(groupSingleItemRight);
		expect(newSingleValue).toBe("right");
	});

	it("toolbar toogle groups respects binding to the `value` prop", async () => {
		const { user, groupMultipleItemItalic, groupSingleItemCenter, styleBinding, alignBinding } =
			setup();
		expect(styleBinding).toHaveTextContent("bold");
		expect(alignBinding).toHaveTextContent("undefined");
		expect(groupMultipleItemItalic).toHaveAttribute("data-state", "off");
		expect(groupMultipleItemItalic).toHaveAttribute("aria-pressed", "false");
		expect(groupSingleItemCenter).toHaveAttribute("data-state", "off");
		expect(groupSingleItemCenter).toHaveAttribute("aria-checked", "false");

		await user.click(styleBinding);
		expect(styleBinding).toHaveTextContent("italic");
		expect(groupMultipleItemItalic).toHaveAttribute("data-state", "on");
		expect(groupMultipleItemItalic).toHaveAttribute("aria-pressed", "true");

		await user.click(alignBinding);
		expect(alignBinding).toHaveTextContent("center");
		expect(groupSingleItemCenter).toHaveAttribute("data-state", "on");
		expect(groupSingleItemCenter).toHaveAttribute("aria-checked", "true");
	});

	it.todo("`asChild` behavior");
});
