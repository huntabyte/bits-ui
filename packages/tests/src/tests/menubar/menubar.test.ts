import { render, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import type { Menubar } from "bits-ui";
import { getTestKbd } from "../utils.js";
import MenubarTest from "./menubar-test.svelte";

const kbd = getTestKbd();

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(props: Menubar.RootProps = {}) {
	const user = userEvent.setup();
	const returned = render(MenubarTest, { ...props });
	const { getByTestId } = returned;

	const getTrigger = (id: string) => getByTestId(`${id}-trigger`);
	const getContent = (id: string) => getByTestId(`${id}-content`);
	const getSubTrigger = (id: string) => getByTestId(`${id}-sub-trigger`);
	const getSubContent = (id: string) => getByTestId(`${id}-sub-content`);

	return { user, ...returned, getTrigger, getContent, getSubTrigger, getSubContent };
}

describe("menubar", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(MenubarTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should navigate triggers within the menubar using arrow keys", async () => {
		const { user, getTrigger } = setup();
		const trigger = getTrigger("1");
		trigger.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("2")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("3")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("4")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("1")).toHaveFocus();
	});

	it("should respect `loop: false`", async () => {
		const { user, getTrigger } = setup({ loop: false });
		const trigger = getTrigger("1");
		trigger.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("2")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("3")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("4")).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(getTrigger("4")).toHaveFocus();
	});

	it("should navigate between menus when using the arrow keys and focus is within a menu", async () => {
		const { user, getTrigger, getContent } = setup();
		const trigger = getTrigger("1");
		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		const content1 = getContent("1");
		expect(content1).toBeVisible();
		await user.keyboard(kbd.ARROW_RIGHT);
		const content2 = getContent("2");
		expect(content2).toBeVisible();
		expect(content1).not.toBeVisible();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(getContent("1")).toBeVisible();
		expect(content2).not.toBeVisible();
	});

	it("should close the menu and focus the next tabbable element when `TAB` is pressed while the menu is open", async () => {
		const { user, getTrigger, getContent, getByTestId } = setup();
		const trigger = getTrigger("1");
		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		const content1 = getContent("1");
		await waitFor(() => expect(content1).toBeVisible());

		const nextButton = getByTestId("next-button");
		await user.keyboard(kbd.TAB);
		await waitFor(() => expect(nextButton).toHaveFocus());
	});

	it("should close the menu and focus the previous tabbable element when `SHIFT+TAB` is pressed while the menu is open", async () => {
		const { user, getTrigger, getContent, getByTestId } = setup();
		const trigger = getTrigger("1");
		trigger.focus();
		await user.keyboard(kbd.ARROW_DOWN);
		const content1 = getContent("1");
		expect(content1).toBeVisible();
		const previousButton = getByTestId("previous-button");
		await user.keyboard(kbd.SHIFT_TAB);
		await waitFor(() => expect(previousButton).toHaveFocus());
	});
});
