import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import NavigationMenuTest, { type NavigationMenuTestProps } from "./navigation-menu-test.svelte";
import { getTestKbd } from "../utils";
import { expectExists, expectNotExists } from "../browser-utils";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(props: NavigationMenuTestProps = {}) {
	const returned = render(NavigationMenuTest, { ...props });

	return { ...returned };
}

it("should open viewport when hovering trigger", async () => {
	setup();
	const trigger = page.getByTestId("group-item-trigger");

	await expectNotExists(page.getByTestId("viewport"));
	await trigger.hover();

	await expectExists(page.getByTestId("viewport"));
	await expect
		.element(page.getByTestId("viewport"))
		.toContainElement(page.getByTestId("group-item-content").element() as HTMLElement);
});

it("should toggle viewport when pressing enter on focused trigger", async () => {
	setup();
	(page.getByTestId("sub-group-item-trigger").element() as HTMLElement).focus();
	await expectNotExists(page.getByTestId("viewport"));
	await userEvent.keyboard(kbd.ENTER);
	await expectExists(page.getByTestId("viewport"));
	await expect
		.element(page.getByTestId("viewport"))
		.toContainElement(page.getByTestId("sub-group-item-content").element() as HTMLElement);
	await userEvent.keyboard(kbd.ENTER);
	await expectNotExists(page.getByTestId("viewport"));
});

it("should show initial submenu items on trigger hover", async () => {
	setup();
	const trigger = page.getByTestId("sub-group-item-trigger");
	await trigger.hover();
	await expectExists(page.getByTestId("viewport"));
	await expect
		.element(page.getByTestId("viewport"))
		.toContainElement(page.getByTestId("sub-group-item-content").element() as HTMLElement);
});

it("should show submenu items on subtrigger hover", async () => {
	setup();
	const trigger = page.getByTestId("sub-group-item-trigger");
	await trigger.hover();
	await expectExists(page.getByTestId("viewport"));
	const subTrigger = page.getByTestId("sub-group-item-sub-item2-trigger");
	await subTrigger.hover();
	await expectExists(page.getByTestId("sub-group-item-sub-item2-content"));
	await expectNotExists(page.getByTestId("sub-group-item-sub-item1-content"));
	await expect
		.element(page.getByTestId("viewport"))
		.toContainElement(
			page.getByTestId("sub-group-item-sub-item2-content").element() as HTMLElement
		);
	// does not hide when clicking open subtrigger
	await subTrigger.click();
	await expectExists(page.getByTestId("sub-group-item-sub-item2-content"));
});

it("should open submenu viewport when pressing enter on focused subtrigger", async () => {
	setup();
	(page.getByTestId("sub-group-item-trigger").element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ENTER);
	await expectExists(page.getByTestId("sub-group-item-sub-item2-trigger"));
	(page.getByTestId("sub-group-item-sub-item2-trigger").element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ENTER);
	await expectExists(page.getByTestId("sub-group-item-sub-item2-content"));
	// does not hide when re-pressing enter
	await userEvent.keyboard(kbd.ENTER);
	await expectExists(page.getByTestId("sub-group-item-sub-item2-content"));
});

it("should show indicator when hovering trigger", async () => {
	setup();
	const trigger = page.getByTestId("group-item-trigger");
	await trigger.hover();
	await expectExists(page.getByTestId("indicator"));
});

it("should receive focus on the first item", async () => {
	setup();
	(page.getByTestId("previous-button").element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.TAB);
	await expect.element(page.getByTestId("group-item-trigger")).toHaveFocus();
});

it("should focus next item with right arrow or down arrow, and previous with left or up", async () => {
	setup();
	const trigger = page.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(page.getByTestId("sub-group-item-trigger")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(page.getByTestId("link-item-link")).toHaveFocus();
});

it("should focus next item with tab", async () => {
	setup();
	const trigger = page.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.TAB);
	await expect.element(page.getByTestId("sub-group-item-trigger")).toHaveFocus();
	await userEvent.keyboard(kbd.TAB);
	await expect.element(page.getByTestId("link-item-link")).toHaveFocus();
});

it("should focus next sub-item with right arrow, and previous with left", async () => {
	setup();
	const trigger = page.getByTestId("sub-group-item-trigger");
	await trigger.hover();
	await expectExists(page.getByTestId("sub-group-item-sub-viewport"));
	const subTrigger = page.getByTestId("sub-group-item-sub-item1-trigger");
	(subTrigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(page.getByTestId("sub-group-item-sub-item2-trigger")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(page.getByTestId("sub-group-item-sub-item1-trigger")).toHaveFocus();
});

it("should focus next content item with right arrow or down arrow, and previous with left or up", async () => {
	setup();
	const trigger = page.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ENTER);
	(page.getByTestId("group-item-content-button1").element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ARROW_RIGHT);
	await expect.element(page.getByTestId("group-item-content-button2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_LEFT);
	await expect.element(page.getByTestId("group-item-content-button1")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("group-item-content-button2")).toHaveFocus();
	await userEvent.keyboard(kbd.ARROW_UP);
	await expect.element(page.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should focus next on content with tab when opened", async () => {
	setup();
	const trigger = page.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ENTER);
	await userEvent.tab();
	await expect.element(page.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should focus next on content with down arrow when opened", async () => {
	setup();
	const trigger = page.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await userEvent.keyboard(kbd.ENTER);
	await userEvent.keyboard(kbd.ARROW_DOWN);
	await expect.element(page.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should render content without viewport", async () => {
	setup({ noViewport: true });
	const trigger = page.getByTestId("group-item-trigger");
	await expectNotExists(page.getByTestId("viewport"));
	await expectNotExists(page.getByTestId("group-item-content"));
	await trigger.hover();
	await expectExists(page.getByTestId("group-item-content"));
	await expectNotExists(page.getByTestId("viewport"));
	await expect
		.element(page.getByTestId("group-item"))
		.toContainElement(page.getByTestId("group-item-content").element() as HTMLElement);
});

it("should render subcontent without subviewport", async () => {
	setup({ noSubViewport: true });
	const trigger = page.getByTestId("sub-group-item-trigger");
	await trigger.hover();
	await expectExists(page.getByTestId("viewport"));
	const subTrigger = page.getByTestId("sub-group-item-sub-item2-trigger");
	await subTrigger.hover();
	await expectExists(page.getByTestId("sub-group-item-sub-item2-content"));
	await expect
		.element(page.getByTestId("sub-group-item-sub-item2"))
		.toContainElement(
			page.getByTestId("sub-group-item-sub-item2-content").element() as HTMLElement
		);
	await expectNotExists(page.getByTestId("sub-group-item-sub-viewport"));
});

it("should switch between submenu items on pointer hover", async () => {
	setup();

	// First open the main submenu
	const trigger = page.getByTestId("sub-group-item-trigger");
	await trigger.hover();
	await expectExists(page.getByTestId("viewport"));

	// Hover over first sub-trigger to open its content
	const subTrigger1 = page.getByTestId("sub-group-item-sub-item1-trigger");
	await subTrigger1.hover();
	await expectExists(page.getByTestId("sub-group-item-sub-item1-content"));
	await expectNotExists(page.getByTestId("sub-group-item-sub-item2-content"));

	// Hover over second sub-trigger - should close first and open second
	const subTrigger2 = page.getByTestId("sub-group-item-sub-item2-trigger");
	await subTrigger2.hover();
	await expectExists(page.getByTestId("sub-group-item-sub-item2-content"));
	await expectNotExists(page.getByTestId("sub-group-item-sub-item1-content"));
});

it("should not open menu on hover when `openOnHover` is false", async () => {
	setup({ groupItemProps: { openOnHover: false } });
	const trigger = page.getByTestId("group-item-trigger");
	await trigger.hover();
	await expectNotExists(page.getByTestId("viewport"));
	await expectNotExists(page.getByTestId("group-item-content"));
});

it("should toggle on trigger click when `openOnHover` is false", async () => {
	setup({ groupItemProps: { openOnHover: false } });
	const trigger = page.getByTestId("group-item-trigger");
	await trigger.click();
	await expectExists(page.getByTestId("viewport"));
	await expectExists(page.getByTestId("group-item-content"));
	await trigger.click();
	await expectNotExists(page.getByTestId("viewport"));
	await expectNotExists(page.getByTestId("group-item-content"));
});
