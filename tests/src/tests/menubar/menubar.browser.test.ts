import { render } from "vitest-browser-svelte";
import { it, vi, expect } from "vitest";
import { getTestKbd } from "../utils.js";
import MenubarTest, { type MenubarTestProps } from "./menubar-test.svelte";
import { page, userEvent } from "@vitest/browser/context";
import { expectExists, expectNotExists } from "../browser-utils";

const kbd = getTestKbd();

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(props: MenubarTestProps = {}) {
	const returned = render(MenubarTest, { ...props });

	const getTrigger = (id: string) => page.getByTestId(`${id}-trigger`);
	const getContent = (id: string) => page.getByTestId(`${id}-content`);
	const getSubTrigger = (id: string) => page.getByTestId(`${id}-sub-trigger`);
	const getSubContent = (id: string) => page.getByTestId(`${id}-sub-content`);

	return { ...returned, getTrigger, getContent, getSubTrigger, getSubContent };
}

it("should navigate triggers within the menubar using arrow keys", async () => {
	const t = setup();
	const trigger = t.getTrigger("1");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getTrigger("2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getTrigger("3")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getTrigger("4")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getTrigger("1")).toHaveFocus();
});

it("should respect `loop: false`", async () => {
	const t = setup({ loop: false });
	const trigger = t.getTrigger("1");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getTrigger("2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getTrigger("3")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getTrigger("4")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getTrigger("4")).toHaveFocus();
});

it.skip("should return focus to the menu trigger when closed via `ESC`", async () => {
	const t = setup();
	const trigger = t.getTrigger("1");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	const content1 = t.getContent("1");
	await expectExists(content1);

	await userEvent.keyboard(kbd.ESCAPE);
	await expect.element(trigger).toHaveFocus();
});

it("should navigate between menus when using the arrow keys and focus is within a menu", async () => {
	const t = setup();
	const trigger = t.getTrigger("1");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	const content1 = t.getContent("1");
	await expectExists(content1);
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	const content2 = t.getContent("2");
	await expectExists(content2);
	await expectNotExists(content1);
	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expectExists(content1);
	await expectNotExists(content2);
});

it("should close the menu and focus the next tabbable element when `TAB` is pressed while the menu is open", async () => {
	const t = setup();
	const trigger = t.getTrigger("1");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	const content1 = t.getContent("1");
	await expectExists(content1);

	const nextButton = page.getByTestId("next-button");
	await userEvent.keyboard(kbd.TAB);
	await expect.element(nextButton).toHaveFocus();
});

it("should close the menu and focus the previous tabbable element when `SHIFT+TAB` is pressed while the menu is open", async () => {
	const t = setup();
	const trigger = t.getTrigger("1");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	const content1 = t.getContent("1");
	await expectExists(content1);
	expect(content1).toBeVisible();
	const previousButton = page.getByTestId("previous-button");
	await userEvent.keyboard(kbd.SHIFT_TAB);
	await expect.element(previousButton).toHaveFocus();
});

it("should call the menus `onOpenChange` callback when the menu is opened or closed", async () => {
	const callbacks = {
		one: vi.fn(),
		two: vi.fn(),
		three: vi.fn(),
		four: vi.fn(),
	};
	const t = setup({
		one: { onOpenChange: callbacks.one },
		two: { onOpenChange: callbacks.two },
		three: { onOpenChange: callbacks.three },
		four: { onOpenChange: callbacks.four },
	});

	for (const id of ["1", "2", "3", "4"]) {
		// @ts-expect-error - sh
		const callback = callbacks[Object.keys(callbacks)[Number(id) - 1]];

		await t.getTrigger(id).click();
		await expectExists(t.getContent(id));
		expect(callback).toHaveBeenCalledWith(true);
		expect(callback).toHaveBeenCalledTimes(1);

		await userEvent.keyboard(kbd.ESCAPE);
		await expectNotExists(t.getContent(id));
		expect(callback).toHaveBeenCalledWith(false);
		expect(callback).toHaveBeenCalledTimes(2);
	}
});

it("should respect the `onSelect` prop on SubTrigger", async () => {
	const onSelect = vi.fn();
	const t = setup({
		one: {
			subTriggerProps: {
				onSelect,
			},
		},
	});

	const trigger = t.getTrigger("1");
	await trigger.click();
	const subTrigger = t.getSubTrigger("1");

	expect(subTrigger).not.toBeNull();
	await subTrigger.click();
	expect(onSelect).toHaveBeenCalled();

	await userEvent.keyboard(kbd.ENTER);
	expect(onSelect).toHaveBeenCalledTimes(2);

	await userEvent.keyboard(kbd.ARROW_RIGHT);
	expect(onSelect).toHaveBeenCalledTimes(3);
});
