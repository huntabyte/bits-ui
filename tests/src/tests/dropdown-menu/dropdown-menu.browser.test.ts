import { expect, it, vi, afterEach, onTestFinished } from "vitest";
import { render } from "vitest-browser-svelte";
import { page, userEvent } from "@vitest/browser/context";
import { getTestKbd } from "../utils.js";
import type { DropdownMenuTestProps } from "./dropdown-menu-test.svelte";
import type { DropdownMenuForceMountTestProps } from "./dropdown-menu-force-mount-test.svelte";
import DropdownMenuForceMountTest from "./dropdown-menu-force-mount-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import DropdownMenuTest from "./dropdown-menu-test.svelte";
import DropdownMenuMultipleTest from "./dropdown-menu-multiple-test.svelte";

const kbd = getTestKbd();
const OPEN_KEYS = [kbd.ENTER, kbd.ARROW_DOWN, kbd.SPACE];

type DropdownMenuSetupProps = (DropdownMenuTestProps | DropdownMenuForceMountTestProps) & {
	component?: typeof DropdownMenuTest | typeof DropdownMenuForceMountTest;
};

/**
 * Helper function to reduce boilerplate in tests
 */
async function setup(props: DropdownMenuSetupProps = {}) {
	const { component: comp = DropdownMenuTest, ...rest } = props;
	const t = render(comp, { ...rest });
	const trigger = page.getByTestId("trigger");
	onTestFinished(() => t.unmount());

	const open = async () => {
		await trigger.click();
		await expectExists(page.getByTestId("content"));
	};
	return {
		...t,
		getContent: () => page.getByTestId("content"),
		getSubContent: () => page.getByTestId("sub-content"),
		open,
		trigger,
	};
}

async function open(props: DropdownMenuSetupProps = {}) {
	const t = await setup(props);
	await expectNotExists(t.getContent());
	await t.trigger.click();
	await expectExists(t.getContent());
	return { ...t };
}

async function openWithKbd(props: DropdownMenuSetupProps = {}, key: string = kbd.ENTER) {
	const t = await setup(props);
	await expectNotExists(page.getByTestId("content"));
	(t.trigger.element() as HTMLElement).focus();
	await expect.element(t.trigger).toHaveFocus();
	await userEvent.keyboard(key);
	await expectExists(page.getByTestId("content"));
	return t;
}

async function openSubmenu(props: Awaited<ReturnType<typeof openWithKbd>>) {
	const t = props;
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();

	await expectNotExists(t.getSubContent());
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expectExists(t.getSubContent());
	await expect.element(page.getByTestId("sub-item")).toHaveFocus();

	return {
		...t,
	};
}

afterEach(() => {
	vi.resetAllMocks();
});

it("should have bits data attrs", async () => {
	const t = await setup();
	await t.trigger.click();

	const parts = [
		"content",
		"trigger",
		"group",
		"group-heading",
		"separator",
		"sub-trigger",
		"item",
		"checkbox-item",
		"radio-group",
		"radio-item",
		"checkbox-group",
	];

	for (const part of parts) {
		const el = page.getByTestId(part);
		await expect.element(el).toHaveAttribute(`data-dropdown-menu-${part}`);
	}

	await page.getByTestId("sub-trigger").click();

	const subContent = page.getByTestId("sub-content");
	await expect.element(subContent).toHaveAttribute(`data-dropdown-menu-sub-content`);
});

it.each(OPEN_KEYS)("should open when %s is pressed & respects binding", async (key) => {
	await openWithKbd({}, key);
	await expect.element(page.getByTestId("item")).toHaveFocus();
});

it("should open when clicked & respects binding", async () => {
	const t = await setup();
	const binding = page.getByTestId("binding");
	await expect.element(binding).toHaveTextContent("false");
	await t.trigger.click();
	await expectExists(page.getByTestId("content"));
	await expect.element(binding).toHaveTextContent("true");
});

it("should manage focus correctly when opened with pointer", async () => {
	await open();

	const item = page.getByTestId("item");
	await expect.element(item).not.toHaveFocus();

	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(item).toHaveFocus();
});

it("should manage focus correctly when opened with keyboard", async () => {
	const t = await setup();

	await expectNotExists(page.getByTestId("content"));

	(t.trigger.element() as HTMLElement).focus();
	await expect.element(t.trigger).toHaveFocus();
	await userEvent.keyboard(kbd.ENTER);

	await expectExists(page.getByTestId("content"));
	const item = page.getByTestId("item");
	await expect.element(item).toHaveFocus();
});

it("should open submenu with keyboard on subtrigger", async () => {
	await openWithKbd();

	await userEvent.keyboard(kbd.ARROW_DOWN);
	const subtrigger = page.getByTestId("sub-trigger");
	await expect.element(subtrigger).toHaveFocus();
	await expectNotExists(page.getByTestId("sub-content"));
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expectExists(page.getByTestId("sub-content"));
	await expect.element(page.getByTestId("sub-item")).toHaveFocus();
});

it("should toggle the checkbox item when clicked & respects binding", async () => {
	const t = await open();
	const checkedBinding = page.getByTestId("checked-binding");
	const indicator = page.getByTestId("checkbox-indicator");
	await expect.element(indicator).not.toHaveTextContent("checked");
	await expect.element(checkedBinding).toHaveTextContent("false");
	const checkbox = page.getByTestId("checkbox-item");
	await checkbox.click();
	await expect.element(checkedBinding).toHaveTextContent("true");
	await t.trigger.click();
	await expect.element(indicator).toHaveTextContent("true");
	await page.getByTestId("checkbox-item").click();
	await expect.element(checkedBinding).toHaveTextContent("false");

	await checkedBinding.click();
	await expect.element(checkedBinding).toHaveTextContent("true");
	await t.trigger.click();
	await expect.element(page.getByTestId("checkbox-indicator")).toHaveTextContent("true");
});

it("should toggle checkbox items within submenus when clicked & respects binding", async () => {
	const props = await openWithKbd();
	await openSubmenu(props);

	const subCheckedBinding = page.getByTestId("sub-checked-binding");
	await expect.element(subCheckedBinding).toHaveTextContent("false");
	const indicator = page.getByTestId("sub-checkbox-indicator");
	await expect.element(indicator).not.toHaveTextContent("true");
	const subCheckbox = page.getByTestId("sub-checkbox-item");
	await subCheckbox.click();
	await expectNotExists(page.getByTestId("content"));
	await expect.element(subCheckedBinding).toHaveTextContent("true");
});

it("should check the radio item when clicked & respects binding", async () => {
	await open();
	const radioBinding = page.getByTestId("radio-binding");
	await expect.element(radioBinding).toHaveTextContent("");
	const radioItem1 = page.getByTestId("radio-item");
	await radioItem1.click();
	await expect.element(radioBinding).toHaveTextContent("1");
	await expectNotExists(page.getByTestId("content"));
});

it("should skip over disabled items when navigating with the keyboard", async () => {
	await openWithKbd();
	await expect.element(page.getByTestId("item")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-item")).toHaveFocus();
	await expect.element(page.getByTestId("disabled-item")).not.toHaveFocus();
	await expect.element(page.getByTestId("disabled-item-2")).not.toHaveFocus();
});

it("should not loop through the menu items when the `loop` prop is set to false/undefined", async () => {
	await openWithKbd({
		contentProps: {
			loop: false,
		},
	});
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-item")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("item-2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("radio-item")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("radio-item-2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("item")).not.toHaveFocus();
});

it("should loop through the menu items when the `loop` prop is set to true", async () => {
	await openWithKbd({
		contentProps: {
			loop: true,
		},
	});
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-item")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("item-2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("radio-item")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("radio-item-2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-group-item-1")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-group-item-2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("item")).toHaveFocus();
});

it("should close the menu on escape", async () => {
	await openWithKbd();
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(page.getByTestId("content"));
});

it("should respect the `escapeKeydownBehavior` prop", async () => {
	await openWithKbd({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await userEvent.keyboard(kbd.ESCAPE);
	await expectExists(page.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior` prop - ignore", async () => {
	await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	await page.getByTestId("outside").click({ force: true });
	await expectExists(page.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior` prop - close", async () => {
	await open({
		contentProps: {
			interactOutsideBehavior: "close",
		},
	});

	const outside = page.getByTestId("outside");
	await outside.click({ force: true });
	await expectNotExists(page.getByTestId("content"));
});

it("should portal to the body if a `portal` prop is not passed", async () => {
	await open();
	const content = page.getByTestId("content").element() as HTMLElement;
	expect(content.parentElement?.parentElement).toEqual(document.body);
});

it("should portal to the portal target if a valid `portal` prop is passed", async () => {
	await open({
		portalProps: {
			to: "#portal-target",
		},
	});
	const content = page.getByTestId("content").element() as HTMLElement;
	const portalTarget = page.getByTestId("portal-target").element() as HTMLElement;
	expect(content.parentElement?.parentElement).toEqual(portalTarget);
});

it("should not portal if `disabled` is passed to the portal", async () => {
	await open({
		portalProps: {
			disabled: true,
		},
	});
	const content = page.getByTestId("content").element() as HTMLElement;
	const ogContainer = page.getByTestId("non-portal-container").element() as HTMLElement;
	const contentWrapper = content.parentElement;
	expect(contentWrapper?.parentElement).not.toEqual(document.body);
	expect(contentWrapper?.parentElement).toEqual(ogContainer);
});

it("should allow preventing autofocusing first item with `onOpenAutoFocus`  prop", async () => {
	await openWithKbd({
		openFocusOverride: true,
		contentProps: {
			onOpenAutoFocus: (e) => {
				e.preventDefault();
			},
		},
	});
	await expect.element(page.getByTestId("item")).not.toHaveFocus();
});

it("should forceMount the content when `forceMount` is true", async () => {
	await setup({ component: DropdownMenuForceMountTest });

	await expectExists(page.getByTestId("content"));
});

it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const t = await setup({
		withOpenCheck: true,
		component: DropdownMenuForceMountTest,
	});

	await expectNotExists(page.getByTestId("content"));

	await t.trigger.click();
	await expectExists(page.getByTestId("content"));
});

it.each([DropdownMenuTest, DropdownMenuForceMountTest])(
	"should close the menu and focus the next tabbable element when `TAB` is pressed while the menu is open",
	async (component) => {
		await openWithKbd({
			component,
			withOpenCheck: true,
		});
		const nextButton = page.getByTestId("next-button");
		await userEvent.tab();

		await expectNotExists(page.getByTestId("content"));
		await expect.element(nextButton).toHaveFocus();
	}
);

it.each([DropdownMenuTest, DropdownMenuForceMountTest])(
	"should close the menu and focus the previous tabbable element when `SHIFT+TAB` is pressed while the menu is open",
	async (component) => {
		await openWithKbd({
			component,
			withOpenCheck: true,
		});
		const previousButton = page.getByTestId("previous-button");
		await userEvent.keyboard(kbd.SHIFT_TAB);
		await expect.element(previousButton).toHaveFocus();
		await expectNotExists(page.getByTestId("content"));
	}
);

it("should respect the `onSelect` prop on SubTrigger", async () => {
	const onSelect = vi.fn();
	await open({
		subTriggerProps: {
			onSelect,
		},
	});
	await page.getByTestId("sub-trigger").click();

	expect(onSelect).toHaveBeenCalled();

	await userEvent.keyboard(kbd.ENTER);
	expect(onSelect).toHaveBeenCalledTimes(2);

	await userEvent.keyboard(kbd.ARROW_RIGHT);
	expect(onSelect).toHaveBeenCalledTimes(3);
});

// CI hates this
it("should respect the `value` prop on CheckboxGroup", async () => {
	const t = await open({
		group: ["1"],
	});

	const checkboxGroupItem1 = page.getByTestId("checkbox-group-item-1");
	await expect.element(checkboxGroupItem1).toHaveAttribute("aria-checked", "true");

	await expect.element(page.getByTestId("checkbox-indicator-1")).toHaveTextContent("true");
	await expect.element(page.getByTestId("checkbox-indicator-2")).toHaveTextContent("false");

	await checkboxGroupItem1.click();
	await expectNotExists(page.getByTestId("content"));
	await t.open();

	await expect.element(page.getByTestId("checkbox-indicator-1")).toHaveTextContent("false");
	await expect.element(page.getByTestId("checkbox-indicator-2")).toHaveTextContent("false");

	await page.getByTestId("checkbox-group-item-2").click();
	await t.open();

	await expect.element(page.getByTestId("checkbox-indicator-1")).toHaveTextContent("false");
	await expect.element(page.getByTestId("checkbox-indicator-2")).toHaveTextContent("true");

	await userEvent.keyboard(kbd.ESCAPE);

	await expectNotExists(page.getByTestId("content"));
	// we click twice, once to close the menu and once again to clear it
	await page.getByTestId("checkbox-group-binding").click();
	await expectNotExists(page.getByTestId("content"));
	await t.open();

	await expect.element(page.getByTestId("checkbox-indicator-1")).toHaveTextContent("false");
	await expect.element(page.getByTestId("checkbox-indicator-2")).toHaveTextContent("false");
});

// CI hates this
it("calls `onValueChange` when the value of the checkbox group changes", async () => {
	const onValueChange = vi.fn();
	await open({
		checkboxGroupProps: {
			onValueChange,
		},
	});
	await page.getByTestId("checkbox-group-item-1").click();
	expect(onValueChange).toHaveBeenCalledWith(["1"]);
});

it("should only call `onValueChange` once when the value of the checkbox group changes", async () => {
	const onValueChange = vi.fn();
	const t = await open({
		checkboxGroupProps: {
			onValueChange,
		},
	});
	await t.getByTestId("checkbox-group-item-1").click();
	expect(onValueChange).toHaveBeenCalledExactlyOnceWith(["1"]);
	onValueChange.mockClear();

	// re-open the menu since we can't pass `closeOnSelect` to CheckboxItem
	await t.open();
	await t.getByTestId("checkbox-group-item-2").click();
	expect(onValueChange).toHaveBeenCalledExactlyOnceWith(["1", "2"]);
	onValueChange.mockClear();

	await t.open();
	await t.getByTestId("checkbox-group-item-1").click();
	expect(onValueChange).toHaveBeenCalledExactlyOnceWith(["2"]);
});

it("should call `onSelect` on the sub item when the sub item is selected", async () => {
	const onSelect = vi.fn();
	await open({
		subItemProps: {
			onSelect,
		},
	});
	await page.getByTestId("sub-trigger").click();
	await expectExists(page.getByTestId("sub-content"));

	await page.getByTestId("sub-item").click();
	expect(onSelect).toHaveBeenCalled();
});

it.each([true, false])(
	"should respect the `closeOnSelect=%s` prop on the sub item",
	async (closeOnSelect) => {
		await open({
			subItemProps: {
				closeOnSelect,
			},
		});
		await page.getByTestId("sub-trigger").click();
		await expectExists(page.getByTestId("sub-content"));

		await page.getByTestId("sub-item").click();
		if (closeOnSelect) {
			await expectNotExists(page.getByTestId("sub-content"));
		} else {
			await expectExists(page.getByTestId("sub-content"));
		}
	}
);

it("should not cause unwanted focus jumps between different dropdown menus", async () => {
	const t = render(DropdownMenuMultipleTest);
	onTestFinished(() => t.unmount());

	const trigger1 = page.getByTestId("trigger-1");
	const trigger2 = page.getByTestId("trigger-2");
	const content1 = page.getByTestId("content-1");
	const content2 = page.getByTestId("content-2");

	// open and close dropdown 1
	await trigger1.click();
	await expectExists(content1);
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(content1);

	// trigger 1 should have focus after closing
	await expect.element(trigger1).toHaveFocus();

	// now open dropdown 2
	await trigger2.click();
	await expectExists(content2);

	// close dropdown 2
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(content2);

	// focus should return to trigger 2, NOT jump back to trigger 1
	await expect.element(trigger2).toHaveFocus();
	await expect.element(trigger1).not.toHaveFocus();
});

it("should not scroll to previous dropdown trigger when closing a different dropdown", async () => {
	const t = render(DropdownMenuMultipleTest);
	onTestFinished(() => t.unmount());

	const trigger1 = page.getByTestId("trigger-1");
	const trigger2 = page.getByTestId("trigger-2");
	const trigger3 = page.getByTestId("trigger-3");
	const topButton = page.getByTestId("top-button");
	const content1 = page.getByTestId("content-1");
	const content2 = page.getByTestId("content-2");
	const content3 = page.getByTestId("content-3");

	// open and close dropdown 1
	await trigger1.click();
	await expectExists(content1);
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(content1);

	// focus something else to clear focus from trigger 1
	await topButton.click();
	await expect.element(topButton).toHaveFocus();

	// open and close dropdown 2
	await trigger2.click();
	await expectExists(content2);
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(content2);

	// trigger 2 should have focus, not trigger 1
	await expect.element(trigger2).toHaveFocus();
	await expect.element(trigger1).not.toHaveFocus();

	// open dropdown 3
	await trigger3.click();
	await expectExists(content3);
	await userEvent.click(topButton, { force: true });

	await expectNotExists(content3);
});

it("should properly restore focus when clicking between multiple dropdowns", async () => {
	const t = render(DropdownMenuMultipleTest);
	onTestFinished(() => t.unmount());

	const trigger1 = page.getByTestId("trigger-1");
	const trigger2 = page.getByTestId("trigger-2");
	const trigger3 = page.getByTestId("trigger-3");
	const content1 = page.getByTestId("content-1");
	const content2 = page.getByTestId("content-2");
	const content3 = page.getByTestId("content-3");

	// open dropdown 1
	await trigger1.click();
	await expectExists(content1);
	await userEvent.keyboard(kbd.ESCAPE);

	await expectNotExists(content1);
	await expect.element(trigger1).toHaveFocus();

	// open dropdown 2
	await trigger2.click();
	await expectExists(content2);
	await userEvent.keyboard(kbd.ESCAPE);

	await expectNotExists(content2);
	await expect.element(trigger2).toHaveFocus();

	// open dropdown 3
	await trigger3.click();
	await expectExists(content3);
	await userEvent.keyboard(kbd.ESCAPE);

	await expectNotExists(content3);

	// trigger 3 should have focus, not any other trigger
	await expect.element(trigger3).toHaveFocus();
	await expect.element(trigger1).not.toHaveFocus();
	await expect.element(trigger2).not.toHaveFocus();
});

it("should maintain correct focus when opening dropdown via keyboard", async () => {
	const t = render(DropdownMenuMultipleTest);
	onTestFinished(() => t.unmount());

	const trigger1 = page.getByTestId("trigger-1");
	const trigger2 = page.getByTestId("trigger-2");

	// focus and open dropdown 1 with keyboard
	(trigger1.element() as HTMLElement).focus();
	await expect.element(trigger1).toHaveFocus();
	await userEvent.keyboard(kbd.ENTER);
	await expectExists(page.getByTestId("content-1"));

	// close with escape
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(page.getByTestId("content-1"));

	// tab to trigger 2
	await userEvent.tab();
	await expect.element(trigger2).toHaveFocus();

	// open dropdown 2 with keyboard
	await userEvent.keyboard(kbd.ENTER);
	await expectExists(page.getByTestId("content-2"));

	// close with escape
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(page.getByTestId("content-2"));

	// focus should be on trigger 2, not trigger 1
	await expect.element(trigger2).toHaveFocus();
	await expect.element(trigger1).not.toHaveFocus();
});
