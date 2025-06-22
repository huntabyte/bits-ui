import { page } from "@vitest/browser/context";
import { expect, it, onTestFinished, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd, sleep } from "../utils.js";
import ContextMenuTest from "./context-menu-test.svelte";
import type { ContextMenuTestProps } from "./context-menu-test.svelte";
import type { ContextMenuForceMountTestProps } from "./context-menu-force-mount-test.svelte";
import ContextMenuForceMountTest from "./context-menu-force-mount-test.svelte";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

type ContextMenuSetupProps = (ContextMenuTestProps | ContextMenuForceMountTestProps) & {
	component?: typeof ContextMenuTest | typeof ContextMenuForceMountTest;
};

/**
 * Helper function to reduce boilerplate in tests
 */
async function setup(props: ContextMenuSetupProps = {}) {
	const { component = ContextMenuTest, ...rest } = props;
	const user = setupBrowserUserEvents();
	const t = render(component, { ...rest });
	const trigger = t.getByTestId("trigger").element() as HTMLElement;
	onTestFinished(() => t.unmount());
	const open = async () => {
		await user.click(trigger, { button: "right" });
		await expectExists(t.getByTestId("content"));
	};
	await sleep(50);

	return {
		...t,
		getContent: () => page.getByTestId("content"),
		getSubContent: () => page.getByTestId("sub-content"),
		user,
		trigger,
		open,
	};
}

async function open(props: ContextMenuSetupProps = {}) {
	const t = await setup(props);
	await expectNotExists(t.getContent());
	await t.user.click(t.trigger, { button: "right" });
	await expectExists(t.getContent());
	return { ...t };
}

async function openSubmenu(props: Awaited<ReturnType<typeof open>>) {
	const t = props;
	await t.user.keyboard(kbd.ARROW_DOWN);
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

it("should have bits data attrs", async () => {
	const t = await setup();
	await t.user.click(t.trigger, { button: "right" });

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
		expect(el).toHaveAttribute(`data-context-menu-${part}`);
	}

	await t.user.click(t.getByTestId("sub-trigger"));

	const subContent = t.getByTestId("sub-content");
	expect(subContent).toHaveAttribute(`data-context-menu-sub-content`);
});

it("should open when right-clicked & respects binding", async () => {
	const t = await setup();
	const binding = t.getByTestId("binding");
	expect(binding).toHaveTextContent("false");
	await t.user.click(t.trigger, { button: "right" });
	await expectExists(t.getContent());
	expect(binding).toHaveTextContent("true");
});

it("should manage focus correctly when opened with pointer", async () => {
	const t = await open();
	const item = t.getByTestId("item");
	expect(item).not.toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(item).toHaveFocus();
});

it("should open submenu with keyboard on subtrigger", async () => {
	const t = await open();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await t.user.keyboard(kbd.ARROW_DOWN);
	const subtrigger = t.getByTestId("sub-trigger");
	expect(subtrigger).toHaveFocus();
	await expectNotExists(t.getSubContent());
	await t.user.keyboard(kbd.ARROW_RIGHT);
	await expectExists(t.getSubContent());
	expect(t.getByTestId("sub-item")).toHaveFocus();
});

// CI hates this
it.skip("should toggle the checkbox item when clicked & respects binding", async () => {
	const t = await open();
	const checkedBinding = t.getByTestId("checked-binding");
	const indicator = t.getByTestId("checkbox-indicator");
	expect(indicator).not.toHaveTextContent("true");
	expect(checkedBinding).toHaveTextContent("false");
	const checkbox = t.getByTestId("checkbox-item");
	await t.user.click(checkbox);
	await vi.waitFor(() => expect(checkedBinding).toHaveTextContent("true"));
	await t.user.click(t.trigger, { button: "right" });
	expect(indicator).toHaveTextContent("true");
	await t.user.click(t.getByTestId("checkbox-item"));
	expect(checkedBinding).toHaveTextContent("false");

	await t.user.click(checkedBinding);
	expect(checkedBinding).toHaveTextContent("true");
	await t.user.click(t.trigger, { button: "right" });
	await expectExists(t.getByTestId("content"));
	expect(t.getByTestId("checkbox-indicator")).toHaveTextContent("true");
});

// CI hates this
it.skip("should toggle checkbox items within submenus when clicked & respects binding", async () => {
	const t = await open();
	await openSubmenu(t);
	const subCheckedBinding = t.getByTestId("sub-checked-binding");
	expect(subCheckedBinding).toHaveTextContent("false");
	const indicator = t.getByTestId("sub-checkbox-indicator");
	expect(indicator).not.toHaveTextContent("true");
	const subCheckbox = t.getByTestId("sub-checkbox-item");
	await t.user.click(subCheckbox);
	await vi.waitFor(() => expect(subCheckedBinding).toHaveTextContent("true"));
	await t.user.click(t.trigger, { button: "right" });
	await openSubmenu(t);
	await vi.waitFor(() =>
		expect(t.getByTestId("sub-checkbox-indicator")).toHaveTextContent("true")
	);
	await t.user.click(t.getByTestId("sub-checkbox-item"));
	await vi.waitFor(() => expect(subCheckedBinding).toHaveTextContent("false"));

	await t.user.click(subCheckedBinding);
	await vi.waitFor(() => expect(subCheckedBinding).toHaveTextContent("true"));
	await t.user.click(t.trigger, { button: "right" });
	await openSubmenu(t);
	await vi.waitFor(() =>
		expect(t.getByTestId("sub-checkbox-indicator")).toHaveTextContent("true")
	);
});

// CI hates this
it.skip("should check the radio item when clicked & respects binding", async () => {
	const t = await open();
	const radioBinding = t.getByTestId("radio-binding");
	expect(radioBinding).toHaveTextContent("");
	const radioItem1 = t.getByTestId("radio-item");
	await t.user.click(radioItem1);
	expect(radioBinding).toHaveTextContent("1");
	await t.user.click(t.trigger, { button: "right" });
	const radioIndicator = t.getByTestId("radio-indicator-1");
	expect(radioIndicator).toHaveTextContent("true");
});

it("should skip disabled items when navigating with the keyboard", async () => {
	const t = await open();
	await t.user.keyboard(kbd.ARROW_DOWN);
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("sub-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("checkbox-item")).toHaveFocus();
	expect(t.getByTestId("disabled-item")).not.toHaveFocus();
	expect(t.getByTestId("disabled-item-2")).not.toHaveFocus();
});

it("should not loop through the menu items when the `loop` prop is set to false", async () => {
	const t = await open({
		contentProps: {
			loop: false,
		},
	});
	await t.user.keyboard(kbd.ARROW_DOWN);
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
	expect(t.getByTestId("item")).not.toHaveFocus();
});

it("should loop through the menu items when the `loop` prop is set to true", async () => {
	const { user, getByTestId } = await open({
		contentProps: {
			loop: true,
		},
	});
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("item")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("sub-trigger")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("checkbox-item")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("item-2")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("radio-item")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("radio-item-2")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("checkbox-group-item-1")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("checkbox-group-item-2")).toHaveFocus();
	await user.keyboard(kbd.ARROW_DOWN);
	expect(getByTestId("item")).toHaveFocus();
});

it("should close the menu on escape", async () => {
	const t = await open();
	await t.user.keyboard(kbd.ESCAPE);
	await expectNotExists(t.getContent());
});

it("should respect the `escapeKeydownBehavior: 'ignore'` prop", async () => {
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await t.user.keyboard(kbd.ESCAPE);
	await expectExists(t.getContent());
});

it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	await t.user.click(page.getByTestId("outside"));

	await expectExists(t.getContent());
});

it("should portal to the body if a `to` prop is not passed to the Portal", async () => {
	const t = await open();
	const content = t.getByTestId("content").element();
	const wrapper = content.parentElement;
	expect(wrapper?.parentElement).toEqual(document.body);
});

it("should portal to the portal target if a valid `to` prop is passed to the portal", async () => {
	const t = await open({
		portalProps: {
			to: "#portal-target",
		},
	});
	const content = t.getByTestId("content").element();
	const wrapper = content.parentElement;
	const portalTarget = t.getByTestId("portal-target").element();
	expect(wrapper?.parentElement).toEqual(portalTarget);
});

it("should not portal if portal is disabled", async () => {
	const t = await open({
		portalProps: {
			disabled: true,
		},
	});
	const content = t.getByTestId("content").element();
	const ogContainer = t.getByTestId("non-portal-container").element();
	const wrapper = content.parentElement;
	expect(wrapper?.parentElement).not.toEqual(document.body);
	expect(wrapper?.parentElement).toEqual(ogContainer);
});

it("should forceMount the content when `forceMount` is true", async () => {
	const t = await setup({ component: ContextMenuForceMountTest });

	await expectExists(t.getByTestId("content"));
});

it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const t = await setup({
		withOpenCheck: true,
		component: ContextMenuForceMountTest,
	});
	await expectNotExists(t.getByTestId("content"));

	await t.user.click(t.trigger, { button: "right" });

	await expectExists(t.getByTestId("content"));
});

it.each([ContextMenuTest, ContextMenuForceMountTest])(
	"should close the menu and focus the next tabbable element when `TAB` is pressed while the menu is open",
	async (component) => {
		const t = await open({
			component,
			withOpenCheck: true,
		});
		const nextButton = t.getByTestId("next-button");
		await t.user.tab();
		await sleep(10);

		await expectNotExists(t.getContent());
		expect(nextButton).toHaveFocus();
	}
);

it.each([ContextMenuTest, ContextMenuForceMountTest])(
	"should close the menu and focus the previous tabbable element when `SHIFT+TAB` is pressed while the menu is open",
	async (component) => {
		const t = await open({
			component,
			withOpenCheck: true,
		});
		const previousButton = t.getByTestId("previous-button");
		await t.user.keyboard(kbd.SHIFT_TAB);
		expect(previousButton).toHaveFocus();
		await expectNotExists(t.getContent());
	}
);

it("should respect the `onOpenAutoFocus` prop", async () => {
	const t = await open({
		openFocusOverride: true,
		contentProps: {
			onOpenAutoFocus: (e) => {
				e.preventDefault();
				document.getElementById("on-open-focus-override")?.focus();
			},
		},
	});

	expect(t.getContent()).not.toHaveFocus();
	expect(t.getByTestId("on-open-focus-override")).toHaveFocus();
});

it("should respect the `onCloseAutoFocus` prop", async () => {
	const t = await open({
		contentProps: {
			onCloseAutoFocus: (e) => {
				e.preventDefault();
				document.getElementById("on-close-focus-override")?.focus();
			},
		},
	});

	await t.user.keyboard(kbd.ESCAPE);
	expect(t.getByTestId("on-close-focus-override")).toHaveFocus();
});

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
	await t.open();
	await t.user.click(t.getByTestId("checkbox-group-item-2"));
	expect(onValueChange).toHaveBeenCalledWith(["1", "2"]);
	await t.open();
	await t.user.click(t.getByTestId("checkbox-group-item-1"));
	expect(onValueChange).toHaveBeenCalledWith(["2"]);
});
