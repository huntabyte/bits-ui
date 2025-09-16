import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import NavigationMenuTest, { type NavigationMenuTestProps } from "./navigation-menu-test.svelte";
import { getTestKbd } from "../utils";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";
import { userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(props: NavigationMenuTestProps = {}) {
	const user = setupBrowserUserEvents();
	const returned = render(NavigationMenuTest, { ...props });

	return { user, ...returned };
}

it("should open viewport when hovering trigger", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");

	await expectNotExists(t.getByTestId("viewport"));
	await trigger.hover();

	await expectExists(t.getByTestId("viewport"));
	await expect
		.element(t.getByTestId("viewport"))
		.toContainElement(t.getByTestId("group-item-content").element() as HTMLElement);
});

it("should toggle viewport when pressing enter on focused trigger", async () => {
	const t = setup();
	(t.getByTestId("sub-group-item-trigger").element() as HTMLElement).focus();
	await expectNotExists(t.getByTestId("viewport"));
	await userEvent.keyboard(kbd.ENTER);
	await expectExists(t.getByTestId("viewport"));
	await expect
		.element(t.getByTestId("viewport"))
		.toContainElement(t.getByTestId("sub-group-item-content").element() as HTMLElement);
	await userEvent.keyboard(kbd.ENTER);
	await expectNotExists(t.getByTestId("viewport"));
});

it("should show initial submenu items on trigger hover", async () => {
	const t = setup();
	const trigger = t.getByTestId("sub-group-item-trigger");
	await trigger.hover();
	await expectExists(t.getByTestId("viewport"));
	await expect
		.element(t.getByTestId("viewport"))
		.toContainElement(t.getByTestId("sub-group-item-content").element() as HTMLElement);
});

it("should show submenu items on subtrigger hover", async () => {
	const t = setup();
	const trigger = t.getByTestId("sub-group-item-trigger");
	await trigger.hover();
	await expectExists(t.getByTestId("viewport"));
	const subTrigger = t.getByTestId("sub-group-item-sub-item2-trigger");
	await subTrigger.hover();
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
	await expectNotExists(t.getByTestId("sub-group-item-sub-item1-content"));
	await expect
		.element(t.getByTestId("viewport"))
		.toContainElement(
			t.getByTestId("sub-group-item-sub-item2-content").element() as HTMLElement
		);
	// does not hide when clicking open subtrigger
	await subTrigger.click();
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
});

it("should open submenu viewport when pressing enter on focused subtrigger", async () => {
	const t = setup();
	(t.getByTestId("sub-group-item-trigger").element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ENTER);
	await expectExists(t.getByTestId("sub-group-item-sub-item2-trigger"));
	(t.getByTestId("sub-group-item-sub-item2-trigger").element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ENTER);
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
	// does not hide when re-pressing enter
	await userEvent.keyboard(kbd.ENTER);
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
});

it("should show indicator when hovering trigger", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	await trigger.hover();
	await expectExists(t.getByTestId("indicator"));
});

it("should receive focus on the first item", async () => {
	const t = setup();
	(t.getByTestId("previous-button").element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.TAB);
	await expect.element(t.getByTestId("group-item-trigger")).toHaveFocus();
});

it("should focus next item with right arrow or down arrow, and previous with left or up", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getByTestId("sub-group-item-trigger")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getByTestId("link-item-link")).toHaveFocus();
});

it("should focus next item with tab", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.TAB);
	await expect.element(t.getByTestId("sub-group-item-trigger")).toHaveFocus();
	await userEvent.keyboard(kbd.TAB);
	await expect.element(t.getByTestId("link-item-link")).toHaveFocus();
});

it("should focus next sub-item with right arrow, and previous with left", async () => {
	const t = setup();
	const trigger = t.getByTestId("sub-group-item-trigger");
	await trigger.hover();
	await expectExists(t.getByTestId("sub-group-item-sub-viewport"));
	const subTrigger = t.getByTestId("sub-group-item-sub-item1-trigger");
	(subTrigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getByTestId("sub-group-item-sub-item2-trigger")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(t.getByTestId("sub-group-item-sub-item1-trigger")).toHaveFocus();
});

it("should focus next content item with right arrow or down arrow, and previous with left or up", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ENTER);
	(t.getByTestId("group-item-content-button1").element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(t.getByTestId("group-item-content-button2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(t.getByTestId("group-item-content-button1")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(t.getByTestId("group-item-content-button2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(t.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should focus next on content with tab when opened", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ENTER);
	await userEvent.tab();
	await expect.element(t.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should focus next on content with down arrow when opened", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ENTER);
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(t.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should render content without viewport", async () => {
	const t = setup({ noViewport: true });
	const trigger = t.getByTestId("group-item-trigger");
	await expectNotExists(t.getByTestId("viewport"));
	await expectNotExists(t.getByTestId("group-item-content"));
	await trigger.hover();
	await expectExists(t.getByTestId("group-item-content"));
	await expectNotExists(t.getByTestId("viewport"));
	await expect
		.element(t.getByTestId("group-item"))
		.toContainElement(t.getByTestId("group-item-content").element() as HTMLElement);
});

it("should render subcontent without subviewport", async () => {
	const t = setup({ noSubViewport: true });
	const trigger = t.getByTestId("sub-group-item-trigger");
	await trigger.hover();
	await expectExists(t.getByTestId("viewport"));
	const subTrigger = t.getByTestId("sub-group-item-sub-item2-trigger");
	await subTrigger.hover();
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
	await expect
		.element(t.getByTestId("sub-group-item-sub-item2"))
		.toContainElement(
			t.getByTestId("sub-group-item-sub-item2-content").element() as HTMLElement
		);
	await expectNotExists(t.getByTestId("sub-group-item-sub-viewport"));
});

it("should switch between submenu items on pointer hover", async () => {
	const t = setup();

	// First open the main submenu
	const trigger = t.getByTestId("sub-group-item-trigger");
	await trigger.hover();
	await expectExists(t.getByTestId("viewport"));

	// Hover over first sub-trigger to open its content
	const subTrigger1 = t.getByTestId("sub-group-item-sub-item1-trigger");
	await subTrigger1.hover();
	await expectExists(t.getByTestId("sub-group-item-sub-item1-content"));
	await expectNotExists(t.getByTestId("sub-group-item-sub-item2-content"));

	// Hover over second sub-trigger - should close first and open second
	const subTrigger2 = t.getByTestId("sub-group-item-sub-item2-trigger");
	await subTrigger2.hover();
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
	await expectNotExists(t.getByTestId("sub-group-item-sub-item1-content"));
});

it("should not open menu on hover when `openOnHover` is false", async () => {
	const t = setup({ groupItemProps: { openOnHover: false } });
	const trigger = t.getByTestId("group-item-trigger");
	await trigger.hover();
	await expectNotExists(t.getByTestId("viewport"));
	await expectNotExists(t.getByTestId("group-item-content"));
});

it("should toggle on trigger click when `openOnHover` is false", async () => {
	const t = setup({ groupItemProps: { openOnHover: false } });
	const trigger = t.getByTestId("group-item-trigger");
	await trigger.click();
	await expectExists(t.getByTestId("viewport"));
	await expectExists(t.getByTestId("group-item-content"));
	await trigger.click();
	await expectNotExists(t.getByTestId("viewport"));
	await expectNotExists(t.getByTestId("group-item-content"));
});
