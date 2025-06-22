import { render, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { it, vi } from "vitest";
import { getTestKbd } from "../utils.js";
import MenubarTest, { type MenubarTestProps } from "./menubar-test.svelte";

const kbd = getTestKbd();

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(props: MenubarTestProps = {}) {
	const user = userEvent.setup();
	const returned = render(MenubarTest, { ...props });
	const { getByTestId, queryByTestId } = returned;

	const getTrigger = (id: string) => getByTestId(`${id}-trigger`);
	const getContent = (id: string) => queryByTestId(`${id}-content`);
	const getSubTrigger = (id: string) => queryByTestId(`${id}-sub-trigger`);
	const getSubContent = (id: string) => queryByTestId(`${id}-sub-content`);

	return { user, ...returned, getTrigger, getContent, getSubTrigger, getSubContent };
}

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

it.skip("should return focus to the menu trigger when closed via `ESC`", async () => {
	const { user, getTrigger, getContent } = setup();
	const trigger = getTrigger("1");
	trigger.focus();
	await user.keyboard(kbd.ARROW_DOWN);
	const content1 = getContent("1");
	await waitFor(() => expect(content1).toBeVisible());
	await user.keyboard(kbd.ESCAPE);
	await waitFor(() => expect(trigger).toHaveFocus());
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

it("should call the menus `onOpenChange` callback when the menu is opened or closed", async () => {
	const callbacks = {
		one: vi.fn(),
		two: vi.fn(),
		three: vi.fn(),
		four: vi.fn(),
	};
	const { user, getTrigger, getContent } = setup({
		one: { onOpenChange: callbacks.one },
		two: { onOpenChange: callbacks.two },
		three: { onOpenChange: callbacks.three },
		four: { onOpenChange: callbacks.four },
	});

	for (const id of ["1", "2", "3", "4"]) {
		// @ts-expect-error - sh
		const callback = callbacks[Object.keys(callbacks)[Number(id) - 1]];

		await user.click(getTrigger(id));
		await waitFor(() => expect(getContent(id)).toBeVisible());
		expect(callback).toHaveBeenCalledWith(true);
		expect(callback).toHaveBeenCalledTimes(1);

		await user.keyboard(kbd.ESCAPE);
		await waitFor(() => expect(getContent(id)).not.toBeInTheDocument());
		expect(callback).toHaveBeenCalledWith(false);
		expect(callback).toHaveBeenCalledTimes(2);
	}
});

it("should respect the `onSelect` prop on SubTrigger", async () => {
	const onSelect = vi.fn();
	const { user, getTrigger, getSubTrigger } = setup({
		one: {
			subTriggerProps: {
				onSelect,
			},
		},
	});

	const trigger = getTrigger("1");
	await user.click(trigger);
	const subTrigger = getSubTrigger("1");

	expect(subTrigger).not.toBeNull();
	await user.click(subTrigger!);
	expect(onSelect).toHaveBeenCalled();

	await user.keyboard(kbd.ENTER);
	expect(onSelect).toHaveBeenCalledTimes(2);

	await user.keyboard(kbd.ARROW_RIGHT);
	expect(onSelect).toHaveBeenCalledTimes(3);
});
