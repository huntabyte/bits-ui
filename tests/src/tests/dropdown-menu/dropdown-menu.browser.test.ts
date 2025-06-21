import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "@vitest/browser/context";
import { getTestKbd, sleep } from "../utils.js";
import type { DropdownMenuTestProps } from "./dropdown-menu-test.svelte";
import type { DropdownMenuForceMountTestProps } from "./dropdown-menu-force-mount-test.svelte";
import DropdownMenuForceMountTest from "./dropdown-menu-force-mount-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";
import DropdownMenuTest from "./dropdown-menu-test.svelte";

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
	render(comp, { ...rest });

	const user = setupBrowserUserEvents();

	const open = async () => {
		const content = page.getByTestId("content");
		const trigger = page.getByTestId("trigger");
		await expectNotExists(content);
		await trigger.click();
		await expectExists(content);
	};

	const outsideClick = async () => {
		// user.click looks to work better in this scenario
		await user.click(page.getByTestId("outside"));
	};

	await sleep(25); // annoyingly necessary

	return {
		user,
		open,
		outsideClick,
		trigger: page.getByTestId("trigger"),
		content: page.getByTestId("content"),
		subContent: page.getByTestId("sub-content"),
	};
}

async function open(props: DropdownMenuSetupProps = {}) {
	const t = await setup(props);
	await expectNotExists(t.content);
	await t.trigger.click();
	await expectExists(t.content);

	return t;
}

async function openWithKbd(props: DropdownMenuSetupProps = {}, key: string = kbd.ENTER) {
	const t = await setup(props);
	await expectNotExists(t.content);
	t.trigger.element().focus();
	await expect.element(t.trigger).toHaveFocus();
	await t.user.keyboard(key);
	await expectExists(t.content);

	return t;
}

async function openSubmenu(props: Awaited<ReturnType<typeof openWithKbd>>) {
	const t = props;
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();

	await expectNotExists(t.subContent);
	await t.user.keyboard(kbd.ARROW_RIGHT);
	await expectExists(t.subContent);
	await expect.element(page.getByTestId("sub-item")).toHaveFocus();

	return t;
}

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
	await expect.element(t.subContent).toHaveAttribute(`data-dropdown-menu-sub-content`);
});

it.each(OPEN_KEYS)("should open when %s is pressed & respects binding", async (key) => {
	await openWithKbd({}, key);
	await expect.element(page.getByTestId("item")).toHaveFocus();
});

it("should open when clicked & respects binding", async () => {
	const t = await setup();
	const binding = page.getByTestId("binding");
	await expect.element(binding).toHaveTextContent("false");
	await t.open();
	await expect.element(binding).toHaveTextContent("true");
});

it("should manage focus correctly when opened with pointer", async () => {
	const t = await open();

	const item = page.getByTestId("item");
	await expect.element(item).not.toHaveFocus();

	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(item).toHaveFocus();
});

it("should manage focus correctly when opened with keyboard", async () => {
	const t = await setup();

	await expectNotExists(t.content);

	t.trigger.element().focus();
	await t.user.keyboard(kbd.ENTER);

	await expectExists(t.content);
	const item = page.getByTestId("item");
	await expect.element(item).toHaveFocus();
});

it("should open submenu with keyboard on subtrigger", async () => {
	const t = await openWithKbd();

	await t.user.keyboard(kbd.ARROW_DOWN);
	const subtrigger = page.getByTestId("sub-trigger");
	await expect.element(subtrigger).toHaveFocus();
	await expectNotExists(t.subContent);
	await t.user.keyboard(kbd.ARROW_RIGHT);
	await expectExists(t.subContent);
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
	const t = await openSubmenu(props);

	const subCheckedBinding = page.getByTestId("sub-checked-binding");
	await expect.element(subCheckedBinding).toHaveTextContent("false");
	const indicator = page.getByTestId("sub-checkbox-indicator");
	await expect.element(indicator).not.toHaveTextContent("true");
	const subCheckbox = page.getByTestId("sub-checkbox-item");
	await subCheckbox.click();
	await expectNotExists(t.content);
	await expect.element(subCheckedBinding).toHaveTextContent("true");
});

// CI hates this
it("should check the radio item when clicked & respects binding", async () => {
	const t = await open();
	const radioBinding = page.getByTestId("radio-binding");
	await expect.element(radioBinding).toHaveTextContent("");
	const radioItem1 = page.getByTestId("radio-item");
	await radioItem1.click();
	await expect.element(radioBinding).toHaveTextContent("1");
	await expectNotExists(t.content);
});

it("should skip over disabled items when navigating with the keyboard", async () => {
	const t = await openWithKbd();
	await expect.element(page.getByTestId("item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-item")).toHaveFocus();
	await expect.element(page.getByTestId("disabled-item")).not.toHaveFocus();
	await expect.element(page.getByTestId("disabled-item-2")).not.toHaveFocus();
});

it("should not loop through the menu items when the `loop` prop is set to false/undefined", async () => {
	const t = await openWithKbd({
		contentProps: {
			loop: false,
		},
	});
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("radio-item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("radio-item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("item")).not.toHaveFocus();
});

it("should loop through the menu items when the `loop` prop is set to true", async () => {
	const t = await openWithKbd({
		contentProps: {
			loop: true,
		},
	});
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("radio-item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("radio-item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-group-item-1")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-group-item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("item")).toHaveFocus();
});

it("should close the menu on escape", async () => {
	const t = await openWithKbd();
	await t.user.keyboard(kbd.ESCAPE);
	await expectNotExists(t.content);
});

it("should respect the `escapeKeydownBehavior` prop", async () => {
	const t = await openWithKbd({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await t.user.keyboard(kbd.ESCAPE);
	await expectExists(t.content);
});

it("should respect the `interactOutsideBehavior` prop - ignore", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});

	await t.outsideClick();

	await expectExists(t.content);
});

it("should respect the `interactOutsideBehavior` prop - close", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "close",
		},
	});

	await t.outsideClick();

	await expectNotExists(t.content);
});

it("should portal to the body if a `portal` prop is not passed", async () => {
	const t = await open();
	const content = t.content.element();
	expect(content.parentElement?.parentElement).toEqual(document.body);
});

it("should portal to the portal target if a valid `portal` prop is passed", async () => {
	const t = await open({
		portalProps: {
			to: "#portal-target",
		},
	});
	const content = t.content.element();
	const portalTarget = page.getByTestId("portal-target").element();
	expect(content.parentElement?.parentElement).toEqual(portalTarget);
});

it("should not portal if `disabled` is passed to the portal", async () => {
	const t = await open({
		portalProps: {
			disabled: true,
		},
	});
	const ogContainer = page.getByTestId("non-portal-container").element();
	const contentWrapper = t.content.element().parentElement;
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
	const t = await setup({ component: DropdownMenuForceMountTest });

	await expectExists(t.content);
});

it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const t = await setup({
		withOpenCheck: true,
		component: DropdownMenuForceMountTest,
	});

	await expectNotExists(t.content);

	await t.trigger.click();
	// await sleep(10);

	await expectExists(t.content);
});

it.each([DropdownMenuTest, DropdownMenuForceMountTest])(
	"should close the menu and focus the next tabbable element when `TAB` is pressed while the menu is open",
	async (component) => {
		const t = await openWithKbd({ component, withOpenCheck: true });
		const nextButton = page.getByTestId("next-button");
		await t.user.tab();

		await expectNotExists(t.content);
		await expect.element(nextButton).toHaveFocus();
	}
);

it.each([DropdownMenuTest, DropdownMenuForceMountTest])(
	"should close the menu and focus the previous tabbable element when `SHIFT+TAB` is pressed while the menu is open",
	async (component) => {
		const t = await openWithKbd({ component, withOpenCheck: true });
		const previousButton = page.getByTestId("previous-button");
		await t.user.keyboard(kbd.SHIFT_TAB);
		await expect.element(previousButton).toHaveFocus();
		await expectNotExists(t.content);
	}
);

it("should respect the `onSelect` prop on SubTrigger", async () => {
	const onSelect = vi.fn();
	const t = await open({
		subTriggerProps: {
			onSelect,
		},
	});

	await page.getByTestId("sub-trigger").click();
	expect(onSelect).toHaveBeenCalled();

	await t.user.keyboard(kbd.ENTER);
	expect(onSelect).toHaveBeenCalledTimes(2);

	await t.user.keyboard(kbd.ARROW_RIGHT);
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
	await t.open();

	await expect.element(page.getByTestId("checkbox-indicator-1")).toHaveTextContent("false");
	await expect.element(page.getByTestId("checkbox-indicator-2")).toHaveTextContent("false");

	await page.getByTestId("checkbox-group-item-2").click();
	await t.open();

	await expect.element(page.getByTestId("checkbox-indicator-1")).toHaveTextContent("false");
	await expect.element(page.getByTestId("checkbox-indicator-2")).toHaveTextContent("true");

	await t.user.keyboard(kbd.ESCAPE);

	await expectNotExists(t.content);
	// we click twice, once to close the menu and once again to clear it
	await page.getByTestId("checkbox-group-binding").click();
	await t.open();

	await expect.element(page.getByTestId("checkbox-indicator-1")).toHaveTextContent("false");
	await expect.element(page.getByTestId("checkbox-indicator-2")).toHaveTextContent("false");
});

// CI hates this
it("calls `onValueChange` when the value of the checkbox group changes", async () => {
	const onValueChange = vi.fn();
	const _ = await open({
		checkboxGroupProps: {
			onValueChange,
		},
	});
	await page.getByTestId("checkbox-group-item-1").click();
	expect(onValueChange).toHaveBeenCalledWith(["1"]);
});
