import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import NavigationMenuTest, { type NavigationMenuTestProps } from "./navigation-menu-test.svelte";
import { getTestKbd } from "../utils";
import { expectExists, expectNotExists, setupBrowserUserEvents } from "../browser-utils";

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
	await t.user.hover(trigger);

	await expectExists(t.getByTestId("viewport"));
	expect(t.getByTestId("viewport").element()).toContainElement(
		t.getByTestId("group-item-content").element() as HTMLElement
	);
});

it("should toggle viewport when pressing enter on focused trigger", async () => {
	const t = setup();
	(t.getByTestId("sub-group-item-trigger").element() as HTMLElement).focus();
	await expectNotExists(t.getByTestId("viewport"));
	await t.user.keyboard(kbd.ENTER);
	await expectExists(t.getByTestId("viewport"));
	expect(t.getByTestId("viewport").element()).toContainElement(
		t.getByTestId("sub-group-item-content").element() as HTMLElement
	);
	await t.user.keyboard(kbd.ENTER);
	await expectNotExists(t.getByTestId("viewport"));
});

it("should show initial submenu items on trigger hover", async () => {
	const t = setup();
	const trigger = t.getByTestId("sub-group-item-trigger");
	await t.user.hover(trigger);
	await expectExists(t.getByTestId("viewport"));
	expect(t.getByTestId("viewport").element()).toContainElement(
		t.getByTestId("sub-group-item-content").element() as HTMLElement
	);
});

it("should show submenu items on subtrigger hover", async () => {
	const t = setup();
	const trigger = t.getByTestId("sub-group-item-trigger");
	await t.user.hover(trigger);
	await expectExists(t.getByTestId("viewport"));
	const subTrigger = t.getByTestId("sub-group-item-sub-item2-trigger");
	await t.user.hover(subTrigger);
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
	await expectNotExists(t.getByTestId("sub-group-item-sub-item1-content"));
	expect(t.getByTestId("viewport").element()).toContainElement(
		t.getByTestId("sub-group-item-sub-item2-content").element() as HTMLElement
	);
	// does not hide when clicking open subtrigger
	await t.user.click(t.getByTestId("sub-group-item-sub-item2-trigger"));
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
});

it("should open submenu viewport when pressing enter on focused subtrigger", async () => {
	const t = setup();
	(t.getByTestId("sub-group-item-trigger").element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ENTER);
	await expectExists(t.getByTestId("sub-group-item-sub-item2-trigger"));
	(t.getByTestId("sub-group-item-sub-item2-trigger").element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ENTER);
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
	// does not hide when re-pressing enter
	await t.user.keyboard(kbd.ENTER);
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
});

it("should show indicator when hovering trigger", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	await t.user.hover(trigger);
	await expectExists(t.getByTestId("indicator"));
});

it("should receive focus on the first item", async () => {
	const t = setup();
	(t.getByTestId("previous-button").element() as HTMLElement).focus();
	await t.user.keyboard(kbd.TAB);
	expect(t.getByTestId("group-item-trigger")).toHaveFocus();
});

it("should focus next item with right arrow or down arrow, and previous with left or up", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ARROW_RIGHT);
	expect(t.getByTestId("sub-group-item-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_RIGHT);
	expect(t.getByTestId("link-item-link")).toHaveFocus();
});

it("should focus next item with tab", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await t.user.keyboard(kbd.TAB);
	expect(t.getByTestId("sub-group-item-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.TAB);
	expect(t.getByTestId("link-item-link")).toHaveFocus();
});

it("should focus next sub-item with right arrow, and previous with left", async () => {
	const t = setup();
	const trigger = t.getByTestId("sub-group-item-trigger");
	await t.user.hover(trigger);
	await expectExists(t.getByTestId("sub-group-item-sub-viewport"));
	const subTrigger = t.getByTestId("sub-group-item-sub-item1-trigger");
	(subTrigger.element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ARROW_RIGHT);
	expect(t.getByTestId("sub-group-item-sub-item2-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_LEFT);
	expect(t.getByTestId("sub-group-item-sub-item1-trigger")).toHaveFocus();
});

it("should focus next content item with right arrow or down arrow, and previous with left or up", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ENTER);
	(t.getByTestId("group-item-content-button1").element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ARROW_RIGHT);
	expect(t.getByTestId("group-item-content-button2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_LEFT);
	expect(t.getByTestId("group-item-content-button1")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("group-item-content-button2")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_UP);
	expect(t.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should focus next on content with tab when opened", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ENTER);
	await t.user.tab();
	expect(t.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should focus next on content with down arrow when opened", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	(trigger.element() as HTMLElement).focus();
	await t.user.keyboard(kbd.ENTER);
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should render content without viewport", async () => {
	const t = setup({ noViewport: true });
	const trigger = t.getByTestId("group-item-trigger");
	await expectNotExists(t.getByTestId("viewport"));
	await expectNotExists(t.getByTestId("group-item-content"));
	await t.user.hover(trigger);
	await expectExists(t.getByTestId("group-item-content"));
	await expectNotExists(t.getByTestId("viewport"));
	expect(t.getByTestId("group-item").element()).toContainElement(
		t.getByTestId("group-item-content").element() as HTMLElement
	);
});

it("should render subcontent without subviewport", async () => {
	const t = setup({ noSubViewport: true });
	const trigger = t.getByTestId("sub-group-item-trigger");
	await t.user.hover(trigger);
	await expectExists(t.getByTestId("viewport"));
	const subTrigger = t.getByTestId("sub-group-item-sub-item2-trigger");
	await t.user.hover(subTrigger);
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
	expect(t.getByTestId("sub-group-item-sub-item2").element()).toContainElement(
		t.getByTestId("sub-group-item-sub-item2-content").element() as HTMLElement
	);
	await expectNotExists(t.getByTestId("sub-group-item-sub-viewport"));
});

it("should switch between submenu items on pointer hover", async () => {
	const t = setup();

	// First open the main submenu
	const trigger = t.getByTestId("sub-group-item-trigger");
	await t.user.hover(trigger);
	await expectExists(t.getByTestId("viewport"));

	// Hover over first sub-trigger to open its content
	const subTrigger1 = t.getByTestId("sub-group-item-sub-item1-trigger");
	await t.user.hover(subTrigger1);
	await expectExists(t.getByTestId("sub-group-item-sub-item1-content"));
	await expectNotExists(t.getByTestId("sub-group-item-sub-item2-content"));

	// Hover over second sub-trigger - should close first and open second
	const subTrigger2 = t.getByTestId("sub-group-item-sub-item2-trigger");
	await t.user.hover(subTrigger2);
	await expectExists(t.getByTestId("sub-group-item-sub-item2-content"));
	await expectNotExists(t.getByTestId("sub-group-item-sub-item1-content"));
});

it("should not open menu on hover when `openOnHover` is false", async () => {
	const t = setup({ groupItemProps: { openOnHover: false } });
	const trigger = t.getByTestId("group-item-trigger");
	await t.user.hover(trigger);
	await expectNotExists(t.getByTestId("viewport"));
	await expectNotExists(t.getByTestId("group-item-content"));
});

it("should toggle on trigger click when `openOnHover` is false", async () => {
	const t = setup({ groupItemProps: { openOnHover: false } });
	const trigger = t.getByTestId("group-item-trigger");
	await t.user.click(trigger);
	await expectExists(t.getByTestId("viewport"));
	await expectExists(t.getByTestId("group-item-content"));
	await t.user.click(trigger);
	await expectNotExists(t.getByTestId("viewport"));
	await expectNotExists(t.getByTestId("group-item-content"));
});
