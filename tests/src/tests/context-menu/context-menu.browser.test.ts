import { page, userEvent } from "@vitest/browser/context";
import { expect, it, onTestFinished, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import ContextMenuTest from "./context-menu-test.svelte";
import type { ContextMenuTestProps } from "./context-menu-test.svelte";
import type { ContextMenuForceMountTestProps } from "./context-menu-force-mount-test.svelte";
import ContextMenuForceMountTest from "./context-menu-force-mount-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";
import ContextMenuIntegrationTest from "./context-menu-integration-test.svelte";
import ContextMenuNestedTest from "./context-menu-nested-test.svelte";
import ContextMenuTooltipTest from "./context-menu-tooltip-test.svelte";

const kbd = getTestKbd();

type ContextMenuSetupProps = (ContextMenuTestProps | ContextMenuForceMountTestProps) & {
	component?: typeof ContextMenuTest | typeof ContextMenuForceMountTest;
};

/**
 * Helper function to reduce boilerplate in tests
 */
async function setup(props: ContextMenuSetupProps = {}) {
	const { component = ContextMenuTest, ...rest } = props;
	const t = render(component, { ...rest });
	const trigger = page.getByTestId("trigger");
	onTestFinished(() => t.unmount());
	const open = async () => {
		await trigger.click({ button: "right" });
		await expectExists(page.getByTestId("content"));
	};

	return {
		...t,
		getContent: () => page.getByTestId("content"),
		getSubContent: () => page.getByTestId("sub-content"),
		trigger,
		open,
	};
}

async function open(props: ContextMenuSetupProps = {}) {
	const t = await setup(props);
	await expectNotExists(t.getContent());
	await t.trigger.click({ button: "right" });
	await expectExists(t.getContent());
	return { ...t };
}

async function openSubmenu(props: Awaited<ReturnType<typeof open>>) {
	const t = props;
	await userEvent.keyboard(kbd.ARROW_DOWN);
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

it("should have bits data attrs", async () => {
	const t = await setup();
	await t.trigger.click({ button: "right" });

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
		await expect.element(el).toHaveAttribute(`data-context-menu-${part}`);
	}

	await page.getByTestId("sub-trigger").click();

	await expect
		.element(page.getByTestId("sub-content"))
		.toHaveAttribute(`data-context-menu-sub-content`);
});

it("should open when right-clicked & respects binding", async () => {
	const t = await setup();
	const binding = page.getByTestId("binding");
	await expect.element(binding).toHaveTextContent("false");
	await t.trigger.click({ button: "right" });
	await expectExists(t.getContent());
	await expect.element(binding).toHaveTextContent("true");
});

it("should manage focus correctly when opened with pointer", async () => {
	await open();
	const item = page.getByTestId("item");
	await expect.element(item).not.toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(item).toHaveFocus();
});

it("should open submenu with keyboard on subtrigger", async () => {
	const t = await open();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await userEvent.keyboard(kbd.ARROW_DOWN);
	const subtrigger = page.getByTestId("sub-trigger");
	await expect.element(subtrigger).toHaveFocus();
	await expectNotExists(t.getSubContent());
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expectExists(t.getSubContent());
	await expect.element(page.getByTestId("sub-item")).toHaveFocus();
});

it("should toggle the checkbox item when clicked & respects binding", async () => {
	const t = await open();
	const checkedBinding = page.getByTestId("checked-binding");
	const indicator = page.getByTestId("checkbox-indicator");
	await expect.element(indicator).not.toHaveTextContent("true");
	await expect.element(checkedBinding).toHaveTextContent("false");
	const checkbox = page.getByTestId("checkbox-item");
	await checkbox.click();
	await expect.element(checkedBinding).toHaveTextContent("true");
	await t.trigger.click({ button: "right" });
	await expect.element(indicator).toHaveTextContent("true");
	await page.getByTestId("checkbox-item").click();
	await expect.element(checkedBinding).toHaveTextContent("false");
	await checkedBinding.click();

	await expect.element(checkedBinding).toHaveTextContent("true");
	await t.trigger.click({ button: "right" });
	await expectExists(page.getByTestId("content"));
	await expect.element(page.getByTestId("checkbox-indicator")).toHaveTextContent("true");
});

it("should toggle checkbox items within submenus when clicked & respects binding", async () => {
	const t = await open();
	await openSubmenu(t);
	const subCheckedBinding = page.getByTestId("sub-checked-binding");
	await expect.element(subCheckedBinding).toHaveTextContent("false");
	const indicator = page.getByTestId("sub-checkbox-indicator");
	await expect.element(indicator).not.toHaveTextContent("true");
	const subCheckbox = page.getByTestId("sub-checkbox-item");
	await subCheckbox.click();
	await expect.element(subCheckedBinding).toHaveTextContent("true");
	await t.trigger.click({ button: "right" });
	await openSubmenu(t);
	await expect.element(page.getByTestId("sub-checkbox-indicator")).toHaveTextContent("true");
	await page.getByTestId("sub-checkbox-item").click();
	await expect.element(subCheckedBinding).toHaveTextContent("false");

	await subCheckedBinding.click();
	await expect.element(subCheckedBinding).toHaveTextContent("true");
	await t.trigger.click({ button: "right" });
	await openSubmenu(t);
	await expect.element(page.getByTestId("sub-checkbox-indicator")).toHaveTextContent("true");
});

it("should check the radio item when clicked & respects binding", async () => {
	const t = await open();
	const radioBinding = page.getByTestId("radio-binding");
	await expect.element(radioBinding).toHaveTextContent("");
	const radioItem1 = page.getByTestId("radio-item");
	await radioItem1.click();
	await expect.element(radioBinding).toHaveTextContent("1");
	await t.trigger.click({ button: "right" });
	const radioIndicator = page.getByTestId("radio-indicator-1");
	await expect.element(radioIndicator).toHaveTextContent("true");
});

it("should skip disabled items when navigating with the keyboard", async () => {
	await open();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("sub-trigger")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("checkbox-item")).toHaveFocus();
	await expect.element(page.getByTestId("disabled-item")).not.toHaveFocus();
	await expect.element(page.getByTestId("disabled-item-2")).not.toHaveFocus();
});

it("should not loop through the menu items when the `loop` prop is set to false", async () => {
	await open({
		contentProps: {
			loop: false,
		},
	});
	await userEvent.keyboard(kbd.ARROW_DOWN);
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
	await expect.element(page.getByTestId("item")).not.toHaveFocus();
});

it("should loop through the menu items when the `loop` prop is set to true", async () => {
	await open({
		contentProps: {
			loop: true,
		},
	});
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("item")).toHaveFocus();
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
	const t = await open();
	await userEvent.keyboard(kbd.ESCAPE);
	await expectNotExists(t.getContent());
});

it("should respect the `escapeKeydownBehavior: 'ignore'` prop", async () => {
	const t = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});
	await userEvent.keyboard(kbd.ESCAPE);
	await expectExists(t.getContent());
});

it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
	const t = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});
	document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));

	await expectExists(t.getContent());
});

it("should portal to the body if a `to` prop is not passed to the Portal", async () => {
	await open();
	const content = page.getByTestId("content").element();
	const wrapper = content.parentElement;
	expect(wrapper?.parentElement).toEqual(document.body);
});

it("should portal to the portal target if a valid `to` prop is passed to the portal", async () => {
	await open({
		portalProps: {
			to: "#portal-target",
		},
	});
	const content = page.getByTestId("content").element();
	const wrapper = content.parentElement;
	const portalTarget = page.getByTestId("portal-target").element();
	expect(wrapper?.parentElement).toEqual(portalTarget);
});

it("should not portal if portal is disabled", async () => {
	await open({
		portalProps: {
			disabled: true,
		},
	});
	const content = page.getByTestId("content").element();
	const ogContainer = page.getByTestId("non-portal-container").element();
	const wrapper = content.parentElement;
	expect(wrapper?.parentElement).not.toEqual(document.body);
	expect(wrapper?.parentElement).toEqual(ogContainer);
});

it("should forceMount the content when `forceMount` is true", async () => {
	await setup({ component: ContextMenuForceMountTest });

	await expectExists(page.getByTestId("content"));
});

it("should forceMount the content when `forceMount` is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const t = await setup({
		withOpenCheck: true,
		component: ContextMenuForceMountTest,
	});
	await expectNotExists(page.getByTestId("content"));
	await t.trigger.click({ button: "right" });

	await expectExists(page.getByTestId("content"));
});

it.each([ContextMenuTest, ContextMenuForceMountTest])(
	"should close the menu and focus the next tabbable element when `TAB` is pressed while the menu is open",
	async (component) => {
		const t = await open({
			component,
			withOpenCheck: true,
		});
		const nextButton = page.getByTestId("next-button");
		await userEvent.tab();

		await expectNotExists(t.getContent());
		await expect.element(nextButton).toHaveFocus();
	}
);

it.each([ContextMenuTest, ContextMenuForceMountTest])(
	"should close the menu and focus the previous tabbable element when `SHIFT+TAB` is pressed while the menu is open",
	async (component) => {
		const t = await open({
			component,
			withOpenCheck: true,
		});
		const previousButton = page.getByTestId("previous-button");
		await userEvent.keyboard(kbd.SHIFT_TAB);
		await expect.element(previousButton).toHaveFocus();
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

	await expect.element(t.getContent()).not.toHaveFocus();
	await expect.element(page.getByTestId("on-open-focus-override")).toHaveFocus();
});

it("should respect the `onCloseAutoFocus` prop", async () => {
	await open({
		contentProps: {
			onCloseAutoFocus: (e) => {
				e.preventDefault();
				document.getElementById("on-close-focus-override")?.focus();
			},
		},
	});

	await userEvent.keyboard(kbd.ESCAPE);
	await expect.element(page.getByTestId("on-close-focus-override")).toHaveFocus();
});

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
});

it("calls `onValueChange` when the value of the checkbox group changes", async () => {
	const onValueChange = vi.fn();
	const t = await open({
		checkboxGroupProps: {
			onValueChange,
		},
	});
	await page.getByTestId("checkbox-group-item-1").click();
	expect(onValueChange).toHaveBeenCalledWith(["1"]);
	await t.open();
	await page.getByTestId("checkbox-group-item-2").click();
	expect(onValueChange).toHaveBeenCalledWith(["1", "2"]);
	await t.open();
	await page.getByTestId("checkbox-group-item-1").click();
	expect(onValueChange).toHaveBeenCalledWith(["2"]);
});

it("should allow switching between context menus via right-click", async () => {
	render(ContextMenuIntegrationTest);
	await page.getByTestId("context-trigger-1").click({ button: "right" });
	await expectExists(page.getByTestId("context-content-1"));
	await page.getByTestId("context-trigger-2").click({ button: "right" });
	await expectNotExists(page.getByTestId("context-content-1"));
	await expectExists(page.getByTestId("context-content-2"));
});

it("should open inside of a dialog", async () => {
	render(ContextMenuIntegrationTest);
	await page.getByTestId("dialog-trigger").click();
	await expectExists(page.getByTestId("dialog-content"));
	await page.getByTestId("context-trigger-3").click({ button: "right" });
	await expectExists(page.getByTestId("context-content-3"));
	await expectExists(page.getByTestId("dialog-content"));
	await page.getByTestId("dialog-content").click({ force: true });
	await expectExists(page.getByTestId("dialog-content"));
	await expectNotExists(page.getByTestId("context-content-3"));
});

it("should open nested context menus", async () => {
	render(ContextMenuNestedTest);
	await page.getByTestId("trigger").click({ button: "right" });
	await expectExists(page.getByTestId("content"));
	await page.getByTestId("nested-trigger").click({ button: "right" });
	await expectExists(page.getByTestId("nested-content"));
	await expectExists(page.getByTestId("content"));
});

it("should allow overriding the pointer events style", async () => {
	setup({ triggerProps: { style: { pointerEvents: undefined } } });
	const trigger = page.getByTestId("trigger");
	await trigger.click({ button: "right" });
	await expectExists(page.getByTestId("content"));
	await trigger.click({ button: "right", force: true });
	await expectNotExists(page.getByTestId("content"));
});

it("should open when right clicked inside a tooltip trigger", async () => {
	render(ContextMenuTooltipTest);

	await page.getByTestId("tooltip-trigger").hover();
	await page.getByTestId("context-menu-trigger").click({ button: "right" });
	await expectExists(page.getByTestId("context-menu-content"));
});

it("should close when the trigger is left clicked and the menu is open", async () => {
	await open();
	await page.getByTestId("trigger").click({ force: true });
	await expectNotExists(page.getByTestId("content"));
});

it("should apply custom style prop to content", async () => {
	const t = await open({
		contentProps: {
			style: { backgroundColor: "rgb(255, 0, 0)" },
		},
	});
	const contentEl = t.getContent().element() as HTMLElement;
	expect(contentEl.style.backgroundColor).toBe("rgb(255, 0, 0)");
});
