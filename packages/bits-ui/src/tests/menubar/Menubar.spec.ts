import { render, screen, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { tick } from "svelte";
import { getTestKbd } from "../utils.js";
import MenubarTest from "./MenubarTest.svelte";
import type { Menubar } from "$lib/index.js";

const kbd = getTestKbd();

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(props: Menubar.RootProps = {}, menuId: string = "1") {
	const user = userEvent.setup();
	const returned = render(MenubarTest, { ...props });
	const { getByTestId } = returned;
	const trigger = getByTestId(`${menuId}-trigger`);
	return { user, ...returned, trigger };
}

describe("menubar", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(MenubarTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const menuId = "1";
		const { user, trigger, getByTestId, queryByTestId } = setup({}, menuId);
		await user.click(trigger);
		await user.click(trigger);
		const content = queryByTestId("1-content");
		await tick();
		await waitFor(() => expect(content).not.toBeNull());

		const root = getByTestId("root");
		expect(root).toHaveAttribute("data-menubar-root");

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
			"checkbox-indicator",
		];
		const mappedParts = parts.map((part) => `${menuId}-${part}`);

		for (const part in parts) {
			const el = screen.getByTestId(mappedParts[part] as string);
			expect(el).toHaveAttribute(`data-menu-${parts[part]}`);
		}

		await user.click(getByTestId("1-sub-trigger"));

		const subContent = getByTestId("1-sub-content");
		expect(subContent).toHaveAttribute(`data-menu-sub-content`);
	});

	it("navigates triggers within the menubar using arrow keys", async () => {
		const { user, trigger, getByTestId } = setup({}, "1");
		trigger.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId("2-trigger")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId("3-trigger")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId("4-trigger")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId("1-trigger")).toHaveFocus();
	});

	it("respects the loop prop", async () => {
		const { user, trigger, getByTestId } = setup({ loop: false }, "1");
		trigger.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId("2-trigger")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId("3-trigger")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId("4-trigger")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getByTestId("4-trigger")).toHaveFocus();
	});
});
