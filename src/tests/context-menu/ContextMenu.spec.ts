import { render, screen, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import ContextMenuTest from "./ContextMenuTest.svelte";
import { testKbd as kbd } from "../utils.js";
import type { ContextMenuTestProps } from "./ContextMenuTest.svelte";

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(props: ContextMenuTestProps = {}) {
	const user = userEvent.setup();
	const { getByTestId, queryByTestId } = render(ContextMenuTest, { ...props });
	const trigger = getByTestId("trigger");
	return {
		getByTestId,
		queryByTestId,
		user,
		trigger
	};
}

async function open(props: ContextMenuTestProps = {}) {
	const { getByTestId, queryByTestId, user, trigger } = setup(props);
	const content = queryByTestId("content");
	expect(content).toBeNull();
	await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
	expect(queryByTestId("content")).not.toBeNull();
	return { getByTestId, queryByTestId, user, trigger };
}

async function openSubmenu(props: Awaited<ReturnType<typeof open>>) {
	const { user, queryByTestId, getByTestId, trigger } = props;
	await user.keyboard(kbd.ARROW_DOWN);
	await user.keyboard(kbd.ARROW_DOWN);
	const subtrigger = getByTestId("sub-trigger");

	await waitFor(() => expect(subtrigger).toHaveFocus());
	expect(queryByTestId("sub-content")).toBeNull();
	await user.keyboard(kbd.ARROW_RIGHT);
	expect(queryByTestId("sub-content")).not.toBeNull();
	await waitFor(() => expect(getByTestId("sub-item")).toHaveFocus());

	return {
		user,
		getByTestId,
		queryByTestId,
		trigger
	};
}

describe("Context Menu", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(ContextMenuTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { user, trigger, getByTestId } = setup();
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);

		const parts = [
			"content",
			"trigger",
			"group",
			"label",
			"separator",
			"sub-trigger",
			"item",
			"checkbox-item",
			"radio-group",
			"radio-item",
			"checkbox-indicator"
		];

		for (const part of parts) {
			const el = screen.getByTestId(part);
			expect(el).toHaveAttribute(`data-menu-${part}`);
		}

		await user.click(getByTestId("sub-trigger"));

		const subContent = getByTestId("sub-content");
		expect(subContent).toHaveAttribute(`data-menu-sub-content`);
	});

	it("Opens when right-clicked & respects binding", async () => {
		const { getByTestId, queryByTestId, user, trigger } = setup();
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		expect(queryByTestId("content")).not.toBeNull();
		expect(binding).toHaveTextContent("true");
	});

	it("Manages focus correctly when opened with pointer", async () => {
		const { getByTestId, user } = await open();

		const item = getByTestId("item");
		expect(item).not.toHaveFocus();

		await user.keyboard(kbd.ARROW_DOWN);
		expect(item).toHaveFocus();
	});

	it("Opens submenu with keyboard on subtrigger", async () => {
		const { getByTestId, queryByTestId, user } = await open();

		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		const subtrigger = getByTestId("sub-trigger");
		await waitFor(() => expect(subtrigger).toHaveFocus());
		expect(queryByTestId("sub-content")).toBeNull();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(queryByTestId("sub-content")).not.toBeNull();
		await waitFor(() => expect(getByTestId("sub-item")).toHaveFocus());
	});

	it("Toggles the checkbox item when clicked & respects binding", async () => {
		const { getByTestId, user, trigger } = await open();
		const checkedBinding = getByTestId("checked-binding");
		const indicator = getByTestId("checkbox-indicator");
		expect(indicator).not.toHaveTextContent("checked");
		expect(checkedBinding).toHaveTextContent("false");
		const checkbox = getByTestId("checkbox-item");
		await user.click(checkbox);
		expect(checkedBinding).toHaveTextContent("true");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		expect(indicator).toHaveTextContent("checked");
		await user.click(getByTestId("checkbox-item"));
		expect(checkedBinding).toHaveTextContent("false");

		await user.click(checkedBinding);
		expect(checkedBinding).toHaveTextContent("true");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		expect(getByTestId("checkbox-indicator")).toHaveTextContent("checked");
	});

	it("Toggles checkbox items within submenus when clicked & respects binding", async () => {
		const props = await open();
		const { getByTestId, user, trigger } = props;
		await openSubmenu(props);
		const subCheckedBinding = getByTestId("sub-checked-binding");
		expect(subCheckedBinding).toHaveTextContent("false");
		const indicator = getByTestId("sub-checkbox-indicator");
		expect(indicator).not.toHaveTextContent("checked");
		const subCheckbox = getByTestId("sub-checkbox-item");
		await user.click(subCheckbox);
		expect(subCheckedBinding).toHaveTextContent("true");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		await openSubmenu(props);
		expect(getByTestId("sub-checkbox-indicator")).toHaveTextContent("checked");
		await user.click(getByTestId("sub-checkbox-item"));
		expect(subCheckedBinding).toHaveTextContent("false");

		await user.click(subCheckedBinding);
		expect(subCheckedBinding).toHaveTextContent("true");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		await openSubmenu(props);
		expect(getByTestId("sub-checkbox-indicator")).toHaveTextContent("checked");
	});

	it("Checks the radio item when clicked & respects binding", async () => {
		const { getByTestId, queryByTestId, user, trigger } = await open();
		const radioBinding = getByTestId("radio-binding");
		const indicator = queryByTestId("radio-indicator-1");
		expect(indicator).toBeNull();
		expect(radioBinding).toHaveTextContent("");
		const radioItem1 = getByTestId("radio-item");
		await user.click(radioItem1);
		expect(radioBinding).toHaveTextContent("1");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		const radioIndicator = getByTestId("radio-indicator-1");
		expect(radioIndicator).not.toBeNull();
		expect(radioIndicator).toHaveTextContent("checked");
		const radioItem2 = getByTestId("radio-item-2");
		await user.click(radioItem2);
		expect(radioBinding).toHaveTextContent("2");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		expect(queryByTestId("radio-indicator-1")).toBeNull();
		expect(queryByTestId("radio-indicator-2")).toHaveTextContent("checked");

		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
		await user.click(radioBinding);
		expect(radioBinding).toHaveTextContent("");
		await user.pointer([{ target: trigger }, { keys: "[MouseRight]", target: trigger }]);
		expect(queryByTestId("radio-indicator-1")).toBeNull();
		expect(queryByTestId("radio-indicator-2")).toBeNull();
	});

	it("Skips over disabled items when navigating with the keyboard", async () => {
		const { user, getByTestId } = await open();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("sub-trigger")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("checkbox-item")).toHaveFocus());
		expect(getByTestId("disabled-item")).not.toHaveFocus();
		expect(getByTestId("disabled-item-2")).not.toHaveFocus();
	});

	it("doesnt loop through the menu items when the `loop` prop is set to false/undefined", async () => {
		const { user, getByTestId } = await open();
		await user.keyboard(kbd.ARROW_DOWN);
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("sub-trigger")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("checkbox-item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("item-2")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("radio-item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("radio-item-2")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("item")).not.toHaveFocus());
	});

	it("loops through the menu items when the `loop` prop is set to true", async () => {
		const { user, getByTestId } = await open({ loop: true });
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("sub-trigger")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("checkbox-item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("item-2")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("radio-item")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("radio-item-2")).toHaveFocus());
		await user.keyboard(kbd.ARROW_DOWN);
		await waitFor(() => expect(getByTestId("item")).toHaveFocus());
	});

	it("closes the menu on escape", async () => {
		const { queryByTestId, user } = await open();
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	it("respects the `closeOnEscape` prop", async () => {
		const { queryByTestId, user } = await open({ closeOnEscape: false });
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("respects the `closeOnOutsideClick` prop", async () => {
		const { queryByTestId, user, getByTestId } = await open({
			closeOnOutsideClick: false
		});
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("portals to the body if a `portal` prop is not passed", async () => {
		const { getByTestId } = await open();
		const content = getByTestId("content");
		expect(content.parentElement).toEqual(document.body);
	});

	it("portals to the portal target if a valid `portal` prop is passed", async () => {
		const { getByTestId } = await open({ portal: "#portal-target" });
		const content = getByTestId("content");
		const portalTarget = getByTestId("portal-target");
		expect(content.parentElement).toEqual(portalTarget);
	});

	it("does not portal if `null` is passed as the portal prop", async () => {
		const { getByTestId } = await open({ portal: null });
		const content = getByTestId("content");
		const ogContainer = getByTestId("non-portal-container");
		expect(content.parentElement).not.toEqual(document.body);
		expect(content.parentElement).toEqual(ogContainer);
	});
});
