import { expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd, sleep } from "../utils.js";
import type { DropdownMenuTestProps } from "./dropdown-menu-test.svelte";
import type { DropdownMenuForceMountTestProps } from "./dropdown-menu-force-mount-test.svelte";
import DropdownMenuForceMountTest from "./dropdown-menu-force-mount-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";
import DropdownMenuTest from "./dropdown-menu-test.svelte";
import { page } from "@vitest/browser/context";

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
	const user = setupBrowserUserEvents();
	const t = render(comp, { ...rest });
	const trigger = page.getByTestId("trigger");
	await sleep(15);
	return {
		...t,
		user,
		trigger,
	};
}

async function openWithPointer(props: DropdownMenuSetupProps = {}) {
	const t = await setup(props);
	expectNotExists(t.getByTestId("content"));
	await t.user.click(t.trigger);

	await vi.waitFor(() => expectExists(t.getByTestId("content")));
	return t;
}

async function openWithKbd(props: DropdownMenuSetupProps = {}, key: string = kbd.ENTER) {
	const t = await setup(props);
	expectNotExists(t.getByTestId("content"));
	(t.trigger.element() as HTMLElement).focus();
	await t.user.keyboard(key);
	await vi.waitFor(() => expectExists(t.getByTestId("content")));
	return t;
}

async function openSubmenu(props: Awaited<ReturnType<typeof openWithKbd>>) {
	const t = props;
	await t.user.keyboard(kbd.ARROW_DOWN);
	const subtrigger = t.getByTestId("sub-trigger");
	expect(subtrigger).toHaveFocus();
	expectNotExists(t.getByTestId("sub-content"));

	await t.user.keyboard(kbd.ARROW_RIGHT);
	await vi.waitFor(() => expectExists(t.getByTestId("sub-content")));
	expect(t.getByTestId("sub-item")).toHaveFocus();

	return t;
}

it("should have bits data attrs", async () => {
	const t = await setup();
	await t.user.click(t.trigger);

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
		const el = t.getByTestId(part);
		expect(el).toHaveAttribute(`data-dropdown-menu-${part}`);
	}

	await t.user.click(t.getByTestId("sub-trigger"));

	const subContent = t.getByTestId("sub-content");
	expect(subContent).toHaveAttribute(`data-dropdown-menu-sub-content`);
});

it.each(OPEN_KEYS)("should open when %s is pressed & respects binding", async (key) => {
	await openWithKbd({}, key);
});

it("should open when clicked & respects binding", async () => {
	const t = await setup();
	const binding = t.getByTestId("binding");
	expect(binding).toHaveTextContent("false");
	await t.user.click(t.trigger);
	await vi.waitFor(() => expectExists(t.getByTestId("content")));
	await vi.waitFor(() => expect(binding).toHaveTextContent("true"));
});

it("should manage focus correctly when opened with pointer", async () => {
	const t = await openWithPointer();

	const item = t.getByTestId("item");
	expect(item).not.toHaveFocus();

	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(item).toHaveFocus();
});

it("should manage focus correctly when opened with keyboard", async () => {
	const t = await setup();

	expectNotExists(t.getByTestId("content"));

	(t.trigger.element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ENTER);

	expectExists(t.getByTestId("content"));
	const item = t.getByTestId("item");
	expect(item).toHaveFocus();
});

it("should open submenu with keyboard on subtrigger", async () => {
	const t = await openWithKbd();

	await t.user.keyboard(kbd.ARROW_DOWN);
	const subtrigger = t.getByTestId("sub-trigger");
	expect(subtrigger).toHaveFocus();
	expectNotExists(t.getByTestId("sub-content"));
	await t.user.keyboard(kbd.ARROW_RIGHT);
	expectExists(t.getByTestId("sub-content"));
	expect(t.getByTestId("sub-item")).toHaveFocus();
});

it("should toggle the checkbox item when clicked & respects binding", async () => {
	const t = await openWithPointer();
	const checkedBinding = t.getByTestId("checked-binding");
	const indicator = t.getByTestId("checkbox-indicator");
	expect(indicator).not.toHaveTextContent("checked");
	expect(checkedBinding).toHaveTextContent("false");
	const checkbox = t.getByTestId("checkbox-item");
	await t.user.click(checkbox);
	await vi.waitFor(() => expect(checkedBinding).toHaveTextContent("true"));
	await t.user.click(t.trigger);
	expect(indicator).toHaveTextContent("true");
	await t.user.click(t.getByTestId("checkbox-item"));
	expect(checkedBinding).toHaveTextContent("false");

	await t.user.click(checkedBinding);
	expect(checkedBinding).toHaveTextContent("true");
	await t.user.click(t.trigger);
	expect(t.getByTestId("checkbox-indicator")).toHaveTextContent("true");
});

it("should toggle checkbox items within submenus when clicked & respects binding", async () => {
	const props = await openWithKbd();
	const t = await openSubmenu(props);
	const subCheckedBinding = t.getByTestId("sub-checked-binding");
	expect(subCheckedBinding).toHaveTextContent("false");
	const indicator = t.getByTestId("sub-checkbox-indicator");
	expect(indicator).not.toHaveTextContent("true");
	const subCheckbox = t.getByTestId("sub-checkbox-item");
	await t.user.click(subCheckbox);
	await vi.waitFor(() => expect(subCheckedBinding).toHaveTextContent("true"));
	(t.trigger.element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await openSubmenu(props);
	expect(t.getByTestId("sub-checkbox-indicator")).toHaveTextContent("true");
	await t.user.click(t.getByTestId("sub-checkbox-item"));
	expect(subCheckedBinding).toHaveTextContent("false");

	await t.user.click(subCheckedBinding);
	expect(subCheckedBinding).toHaveTextContent("true");
	(t.trigger.element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await openSubmenu(props);
	expect(t.getByTestId("sub-checkbox-indicator")).toHaveTextContent("true");
});

it("should check the radio item when clicked & respects binding", async () => {
	const t = await openWithPointer();
	const radioBinding = t.getByTestId("radio-binding");
	expect(radioBinding).toHaveTextContent("");
	const radioItem1 = t.getByTestId("radio-item");
	await t.user.click(radioItem1);
	expect(radioBinding).toHaveTextContent("1");
	await t.user.click(t.trigger);
	const radioIndicator1 = t.getByTestId("radio-indicator-1");
	expect(radioIndicator1).not.toBeNull();
	expect(radioIndicator1).toHaveTextContent("true");
	const radioItem2 = t.getByTestId("radio-item-2");
	await t.user.click(radioItem2);
	expect(radioBinding).toHaveTextContent("2");
	await t.user.click(t.trigger);
	expect(t.getByTestId("radio-indicator-1")).toHaveTextContent("false");
	expect(t.getByTestId("radio-indicator-2")).toHaveTextContent("true");

	await t.user.keyboard(kbd.ESCAPE);
	expectNotExists(t.getByTestId("content"));
	await t.user.click(radioBinding);
	expect(radioBinding).toHaveTextContent("");
	await t.user.click(t.trigger);
});

it("should skip over disabled items when navigating with the keyboard", async () => {
	const t = await openWithKbd();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("sub-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("checkbox-item")).toHaveFocus();
	expect(t.getByTestId("disabled-item")).not.toHaveFocus();
	expect(t.getByTestId("disabled-item-2")).not.toHaveFocus();
});

it("should not loop through the menu items when the `loop` prop is set to false/undefined", async () => {
	const t = await openWithKbd({
		contentProps: {
			loop: false,
		},
	});
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("sub-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("checkbox-item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("radio-item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("radio-item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("item")).not.toHaveFocus();
});

it("should loop through the menu items when the `loop` prop is set to true", async () => {
	const t = await openWithKbd({
		contentProps: {
			loop: true,
		},
	});
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("sub-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("checkbox-item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("radio-item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("radio-item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("checkbox-group-item-1")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("checkbox-group-item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("item")).toHaveFocus();
});

it("should close the menu on escape", async () => {
	const t = await openWithKbd();
	await t.user.keyboard(kbd.ESCAPE);
	expectNotExists(t.getByTestId("content"));
});

it("should respect the `escapeKeydownBehavior` prop", async () => {
	const t = await openWithKbd({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await t.user.keyboard(kbd.ESCAPE);
	expectExists(t.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior` prop - ignore", async () => {
	const t = await openWithPointer({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	const outside = t.getByTestId("outside");
	await t.user.click(outside);
	await vi.waitFor(() => expectExists(t.getByTestId("content")));
});

it("should respect the `interactOutsideBehavior` prop - close", async () => {
	const t = await openWithPointer({
		contentProps: {
			interactOutsideBehavior: "close",
		},
	});
	const outside = t.getByTestId("outside");
	await t.user.click(outside);
	await vi.waitFor(() => expectNotExists(t.getByTestId("content")));
});

it("should portal to the body if a `portal` prop is not passed", async () => {
	const t = await openWithPointer();
	const content = t.getByTestId("content").element() as HTMLElement;
	expect(content.parentElement?.parentElement).toEqual(document.body);
});

it("should portal to the portal target if a valid `portal` prop is passed", async () => {
	const t = await openWithPointer({
		portalProps: {
			to: "#portal-target",
		},
	});
	const content = t.getByTestId("content").element() as HTMLElement;
	const portalTarget = t.getByTestId("portal-target").element() as HTMLElement;
	expect(content.parentElement?.parentElement).toEqual(portalTarget);
});

it("should not portal if `disabled` is passed to the portal", async () => {
	const t = await openWithPointer({
		portalProps: {
			disabled: true,
		},
	});
	const content = t.getByTestId("content").element() as HTMLElement;
	const ogContainer = t.getByTestId("non-portal-container").element() as HTMLElement;
	const contentWrapper = content.parentElement;
	expect(contentWrapper?.parentElement).not.toEqual(document.body);
	expect(contentWrapper?.parentElement).toEqual(ogContainer);
});

it("should allow preventing autofocusing first item with `onOpenAutoFocus`  prop", async () => {
	const t = await openWithKbd({
		contentProps: {
			onOpenAutoFocus: (e) => {
				e.preventDefault();
			},
		},
	});
	expect(t.getByTestId("item")).not.toHaveFocus();
});

it("should forceMount the content when `forceMount` is true", async () => {
	const t = await setup({ component: DropdownMenuForceMountTest });

	expectExists(t.getByTestId("content"));
});

it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const t = await setup({
		withOpenCheck: true,
		component: DropdownMenuForceMountTest,
	});
	expectNotExists(t.getByTestId("content"));

	await t.user.click(t.trigger);

	await vi.waitFor(() => expectExists(t.getByTestId("content")));
});

it.each([DropdownMenuTest, DropdownMenuForceMountTest])(
	"should close the menu and focus the next tabbable element when `TAB` is pressed while the menu is open",
	async (component) => {
		const t = await openWithKbd({
			component,
			withOpenCheck: true,
		});
		const nextButton = t.getByTestId("next-button");
		await t.user.keyboard(kbd.TAB);
		expect(nextButton).toHaveFocus();

		expectNotExists(t.getByTestId("content"));
		await t.user.click(t.getByTestId("trigger"));
		await vi.waitFor(() => expectExists(t.getByTestId("content")));
	}
);

it.each([DropdownMenuTest, DropdownMenuForceMountTest])(
	"should close the menu and focus the previous tabbable element when `SHIFT+TAB` is pressed while the menu is open",
	async (component) => {
		const t = await openWithKbd({
			component,
			withOpenCheck: true,
		});
		const previousButton = t.getByTestId("previous-button");
		await t.user.keyboard(kbd.SHIFT_TAB);
		expect(previousButton).toHaveFocus();
		await vi.waitFor(() => expectNotExists(t.getByTestId("content")));
	}
);

it("should respect the `onSelect` prop on SubTrigger", async () => {
	const onSelect = vi.fn();
	const t = await openWithPointer({
		subTriggerProps: {
			onSelect,
		},
	});

	await t.user.click(t.getByTestId("sub-trigger"));
	expect(onSelect).toHaveBeenCalled();

	await t.user.keyboard(kbd.ENTER);
	expect(onSelect).toHaveBeenCalledTimes(2);

	await t.user.keyboard(kbd.ARROW_RIGHT);
	expect(onSelect).toHaveBeenCalledTimes(3);
});

it("should respect the `value` prop on CheckboxGroup", async () => {
	const t = await openWithPointer({
		group: ["1"],
	});

	const checkboxGroupItem1 = t.getByTestId("checkbox-group-item-1");
	expect(checkboxGroupItem1).toHaveAttribute("aria-checked", "true");

	expect(t.getByTestId("checkbox-indicator-1")).toHaveTextContent("true");
	expect(t.getByTestId("checkbox-indicator-2")).toHaveTextContent("false");

	await t.user.click(checkboxGroupItem1);
	await t.user.click(t.trigger);

	expect(t.getByTestId("checkbox-indicator-1")).toHaveTextContent("false");
	expect(t.getByTestId("checkbox-indicator-2")).toHaveTextContent("false");

	await t.user.click(t.getByTestId("checkbox-group-item-2"));
	await t.user.click(t.trigger);

	expect(t.getByTestId("checkbox-indicator-1")).toHaveTextContent("false");
	expect(t.getByTestId("checkbox-indicator-2")).toHaveTextContent("true");

	await t.user.keyboard(kbd.ESCAPE);

	await t.user.click(t.getByTestId("checkbox-group-binding"), { force: true });
	await t.user.click(t.trigger);
	expect(t.getByTestId("checkbox-indicator-1")).toHaveTextContent("false");
	expect(t.getByTestId("checkbox-indicator-2")).toHaveTextContent("false");
});

it("calls `onValueChange` when the value of the checkbox group changes", async () => {
	const onValueChange = vi.fn();
	const t = await openWithPointer({
		checkboxGroupProps: {
			onValueChange,
		},
	});
	await t.user.click(t.getByTestId("checkbox-group-item-1"));
	expect(onValueChange).toHaveBeenCalledWith(["1"]);
	await t.user.click(t.trigger);
	await t.user.click(t.getByTestId("checkbox-group-item-2"));
	expect(onValueChange).toHaveBeenCalledWith(["1", "2"]);
	await t.user.click(t.trigger);
	await t.user.click(t.getByTestId("checkbox-group-item-1"));
	expect(onValueChange).toHaveBeenCalledWith(["2"]);
});
