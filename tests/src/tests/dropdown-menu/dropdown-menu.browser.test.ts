import { expect, it, vi, afterEach, onTestFinished } from "vitest";
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
	const user = setupBrowserUserEvents();
	const t = render(comp, { ...rest });
	const trigger = page.getByTestId("trigger").element() as HTMLElement;
	onTestFinished(() => t.unmount());

	const open = async () => {
		await user.click(trigger);
		await expectExists(t.getByTestId("content"));
	};
	await sleep(50);
	return {
		...t,
		getContent: () => page.getByTestId("content"),
		getSubContent: () => page.getByTestId("sub-content"),
		open,
		user,
		trigger,
	};
}

async function open(props: DropdownMenuSetupProps = {}) {
	const t = await setup(props);
	await expectNotExists(t.getContent());
	await t.user.click(t.trigger);
	await expectExists(t.getContent());
	return { ...t };
}

async function openWithKbd(props: DropdownMenuSetupProps = {}, key: string = kbd.ENTER) {
	const t = await setup(props);
	await expectNotExists(page.getByTestId("content"));
	t.trigger.focus();
	await vi.waitFor(() => expect(t.trigger).toHaveFocus());
	await t.user.keyboard(key);
	await expectExists(page.getByTestId("content"));
	return t;
}

async function openSubmenu(props: Awaited<ReturnType<typeof openWithKbd>>) {
	const t = props;
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("sub-trigger")).toHaveFocus();

	await expectNotExists(t.getSubContent());
	await t.user.keyboard(kbd.ARROW_RIGHT);
	await expectExists(t.getSubContent());
	expect(t.getByTestId("sub-item")).toHaveFocus();

	return {
		...t,
	};
}

afterEach(() => {
	vi.resetAllMocks();
});

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
		const el = page.getByTestId(part);
		expect(el).toHaveAttribute(`data-dropdown-menu-${part}`);
	}

	await t.user.click(page.getByTestId("sub-trigger"));

	const subContent = page.getByTestId("sub-content");
	expect(subContent).toHaveAttribute(`data-dropdown-menu-sub-content`);
});

it.each(OPEN_KEYS)("should open when %s is pressed & respects binding", async (key) => {
	await openWithKbd({}, key);
	expect(page.getByTestId("item")).toHaveFocus();
});

it("should open when clicked & respects binding", async () => {
	const t = await setup();
	await sleep(10);
	const binding = page.getByTestId("binding");
	expect(binding).toHaveTextContent("false");
	await t.user.click(t.trigger);
	await expectExists(page.getByTestId("content"));
	expect(binding).toHaveTextContent("true");
});

it("should manage focus correctly when opened with pointer", async () => {
	const t = await open();

	const item = page.getByTestId("item");
	expect(item).not.toHaveFocus();

	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(item).toHaveFocus();
});

it("should manage focus correctly when opened with keyboard", async () => {
	const t = await setup();

	expectNotExists(page.getByTestId("content"));

	t.trigger.focus();
	await t.user.keyboard(kbd.ENTER);

	await expectExists(page.getByTestId("content"));
	const item = page.getByTestId("item");
	expect(item).toHaveFocus();
});

it("should open submenu with keyboard on subtrigger", async () => {
	const t = await openWithKbd();

	await t.user.keyboard(kbd.ARROW_DOWN);
	const subtrigger = page.getByTestId("sub-trigger");
	expect(subtrigger).toHaveFocus();
	await expectNotExists(page.getByTestId("sub-content"));
	await t.user.keyboard(kbd.ARROW_RIGHT);
	await expectExists(page.getByTestId("sub-content"));
	expect(page.getByTestId("sub-item")).toHaveFocus();
});

it("should toggle the checkbox item when clicked & respects binding", async () => {
	const t = await open();
	const checkedBinding = page.getByTestId("checked-binding");
	const indicator = page.getByTestId("checkbox-indicator");
	expect(indicator).not.toHaveTextContent("checked");
	expect(checkedBinding).toHaveTextContent("false");
	const checkbox = page.getByTestId("checkbox-item");
	await t.user.click(checkbox);
	expect(checkedBinding).toHaveTextContent("true");
	await t.user.click(t.trigger);
	expect(indicator).toHaveTextContent("true");
	await t.user.click(page.getByTestId("checkbox-item"));
	expect(checkedBinding).toHaveTextContent("false");

	await t.user.click(checkedBinding);
	expect(checkedBinding).toHaveTextContent("true");
	await t.user.click(t.trigger);
	expect(page.getByTestId("checkbox-indicator")).toHaveTextContent("true");
});

it("should toggle checkbox items within submenus when clicked & respects binding", async () => {
	const props = await openWithKbd();
	const t = await openSubmenu(props);

	const subCheckedBinding = page.getByTestId("sub-checked-binding");
	expect(subCheckedBinding).toHaveTextContent("false");
	const indicator = page.getByTestId("sub-checkbox-indicator");
	expect(indicator).not.toHaveTextContent("true");
	const subCheckbox = page.getByTestId("sub-checkbox-item");
	await t.user.click(subCheckbox);
	await expectNotExists(page.getByTestId("content"));
	await vi.waitFor(() => expect(subCheckedBinding).toHaveTextContent("true"));
});

// CI hates this
it.skip("should check the radio item when clicked & respects binding", async () => {
	const t = await open();
	const radioBinding = page.getByTestId("radio-binding");
	expect(radioBinding).toHaveTextContent("");
	const radioItem1 = page.getByTestId("radio-item");
	await t.user.click(radioItem1);
	await vi.waitFor(() => expect(radioBinding).toHaveTextContent("1"));
	await expectNotExists(page.getByTestId("content"));
});

it("should skip over disabled items when navigating with the keyboard", async () => {
	const t = await openWithKbd();
	expect(page.getByTestId("item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(page.getByTestId("sub-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(page.getByTestId("checkbox-item")).toHaveFocus();
	expect(page.getByTestId("disabled-item")).not.toHaveFocus();
	expect(page.getByTestId("disabled-item-2")).not.toHaveFocus();
});

it("should not loop through the menu items when the `loop` prop is set to false/undefined", async () => {
	const t = await openWithKbd({
		contentProps: {
			loop: false,
		},
	});
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(page.getByTestId("sub-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(page.getByTestId("checkbox-item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(page.getByTestId("item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(page.getByTestId("radio-item")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(page.getByTestId("radio-item-2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(page.getByTestId("item")).not.toHaveFocus();
});

it("should loop through the menu items when the `loop` prop is set to true", async () => {
	const t = await openWithKbd({
		contentProps: {
			loop: true,
		},
	});
	await t.user.keyboard(kbd.ARROW_DOWN);
	await vi.waitFor(() => expect(page.getByTestId("sub-trigger")).toHaveFocus());
	await t.user.keyboard(kbd.ARROW_DOWN);
	await vi.waitFor(() => expect(page.getByTestId("checkbox-item")).toHaveFocus());
	await t.user.keyboard(kbd.ARROW_DOWN);
	await vi.waitFor(() => expect(page.getByTestId("item-2")).toHaveFocus());
	await t.user.keyboard(kbd.ARROW_DOWN);
	await vi.waitFor(() => expect(page.getByTestId("radio-item")).toHaveFocus());
	await t.user.keyboard(kbd.ARROW_DOWN);
	await vi.waitFor(() => expect(page.getByTestId("radio-item-2")).toHaveFocus());
	await t.user.keyboard(kbd.ARROW_DOWN);
	await vi.waitFor(() => expect(page.getByTestId("checkbox-group-item-1")).toHaveFocus());
	await t.user.keyboard(kbd.ARROW_DOWN);
	await vi.waitFor(() => expect(page.getByTestId("checkbox-group-item-2")).toHaveFocus());
	await t.user.keyboard(kbd.ARROW_DOWN);
	await vi.waitFor(() => expect(page.getByTestId("item")).toHaveFocus());
});

it("should close the menu on escape", async () => {
	const t = await openWithKbd();
	await t.user.keyboard(kbd.ESCAPE);
	await expectNotExists(page.getByTestId("content"));
});

it("should respect the `escapeKeydownBehavior` prop", async () => {
	const t = await openWithKbd({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await t.user.keyboard(kbd.ESCAPE);
	await expectExists(page.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior` prop - ignore", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	await t.user.click(page.getByTestId("outside"));

	await expectExists(page.getByTestId("content"));
});

it("should respect the `interactOutsideBehavior` prop - close", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "close",
		},
	});
	const outside = page.getByTestId("outside");
	await t.user.click(outside);
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
	expect(page.getByTestId("item")).not.toHaveFocus();
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

	await t.user.click(t.trigger);
	await sleep(10);

	await expectExists(page.getByTestId("content"));
});

it.each([DropdownMenuTest, DropdownMenuForceMountTest])(
	"should close the menu and focus the next tabbable element when `TAB` is pressed while the menu is open",
	async (component) => {
		const t = await openWithKbd({
			component,
			withOpenCheck: true,
		});
		const nextButton = page.getByTestId("next-button");
		await t.user.tab();

		await expectNotExists(page.getByTestId("content"));
		expect(nextButton).toHaveFocus();
	}
);

it.each([DropdownMenuTest, DropdownMenuForceMountTest])(
	"should close the menu and focus the previous tabbable element when `SHIFT+TAB` is pressed while the menu is open",
	async (component) => {
		const t = await openWithKbd({
			component,
			withOpenCheck: true,
		});
		const previousButton = page.getByTestId("previous-button");
		await t.user.keyboard(kbd.SHIFT_TAB);
		expect(previousButton).toHaveFocus();
		await expectNotExists(page.getByTestId("content"));
	}
);

it("should respect the `onSelect` prop on SubTrigger", async () => {
	const onSelect = vi.fn();
	const t = await open({
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

// CI hates this
it.skip("should respect the `value` prop on CheckboxGroup", async () => {
	const t = await open({
		group: ["1"],
	});

	const checkboxGroupItem1 = t.getByTestId("checkbox-group-item-1");
	await vi.waitFor(() => expect(checkboxGroupItem1).toHaveAttribute("aria-checked", "true"));

	await vi.waitFor(() => expect(t.getByTestId("checkbox-indicator-1")).toHaveTextContent("true"));
	await vi.waitFor(() =>
		expect(t.getByTestId("checkbox-indicator-2")).toHaveTextContent("false")
	);

	await t.user.click(checkboxGroupItem1);
	await t.open();

	await vi.waitFor(() =>
		expect(t.getByTestId("checkbox-indicator-1")).toHaveTextContent("false")
	);
	await vi.waitFor(() =>
		expect(t.getByTestId("checkbox-indicator-2")).toHaveTextContent("false")
	);

	await t.user.click(t.getByTestId("checkbox-group-item-2"));
	await t.open();

	expect(t.getByTestId("checkbox-indicator-1")).toHaveTextContent("false");
	expect(t.getByTestId("checkbox-indicator-2")).toHaveTextContent("true");

	await t.user.keyboard(kbd.ESCAPE);

	await expectNotExists(page.getByTestId("content"));
	// we click twice, once to close the menu and once again to clear it
	await t.user.click(t.getByTestId("checkbox-group-binding"));
	await t.open();

	await vi.waitFor(() =>
		expect(t.getByTestId("checkbox-indicator-1")).toHaveTextContent("false")
	);
	await vi.waitFor(() =>
		expect(t.getByTestId("checkbox-indicator-2")).toHaveTextContent("false")
	);
});

// CI hates this
it.skip("calls `onValueChange` when the value of the checkbox group changes", async () => {
	const onValueChange = vi.fn();
	const t = await open({
		checkboxGroupProps: {
			onValueChange,
		},
	});
	await t.user.click(t.getByTestId("checkbox-group-item-1"));
	expect(onValueChange).toHaveBeenCalledWith(["1"]);
});

it("should call `onSelect` on the sub item when the sub item is selected", async () => {
	const onSelect = vi.fn();
	const t = await open({
		subItemProps: {
			onSelect,
		},
	});
	await t.user.click(t.getByTestId("sub-trigger"));
	await expectExists(t.getByTestId("sub-content"));

	await t.user.click(t.getByTestId("sub-item"));
	expect(onSelect).toHaveBeenCalled();
});

it.each([true, false])(
	"should respect the `closeOnSelect=%s` prop on the sub item",
	async (closeOnSelect) => {
		const t = await open({
			subItemProps: {
				closeOnSelect,
			},
		});
		await t.user.click(t.getByTestId("sub-trigger"));
		await expectExists(t.getByTestId("sub-content"));

		await t.user.click(t.getByTestId("sub-item"));
		if (closeOnSelect) {
			await expectNotExists(t.getByTestId("sub-content"));
		} else {
			await expectExists(t.getByTestId("sub-content"));
		}
	}
);
