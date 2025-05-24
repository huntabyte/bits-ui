import { render, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { it } from "vitest";
import NavigationMenuTest, { type NavigationMenuTestProps } from "./navigation-menu-test.svelte";
import { getTestKbd } from "../utils";

const kbd = getTestKbd();

/**
 * Helper function to reduce boilerplate in tests
 */
function setup(props: NavigationMenuTestProps = {}) {
	const user = userEvent.setup();
	const returned = render(NavigationMenuTest, { ...props });

	return { user, ...returned };
}

it("should have no accessibility violations", async () => {
	const { container } = render(NavigationMenuTest);
	expect(await axe(container)).toHaveNoViolations();
});

it("should open viewport when hovering trigger", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	expect(t.queryByTestId("viewport")).toBeNull();
	await t.user.hover(trigger);
	await waitFor(() => expect(t.queryByTestId("viewport")).not.toBeNull());
	expect(t.queryByTestId("viewport")).toContainElement(t.queryByTestId("group-item-content"));
});

it("should toggle viewport when pressing enter on focused trigger", async () => {
	const t = setup();
	t.getByTestId("sub-group-item-trigger").focus();
	expect(t.queryByTestId("viewport")).toBeNull();
	await t.user.keyboard(kbd.ENTER);
	await waitFor(() => expect(t.queryByTestId("viewport")).not.toBeNull());
	expect(t.queryByTestId("viewport")).toContainElement(t.queryByTestId("sub-group-item-content"));
	await t.user.keyboard(kbd.ENTER);
	await waitFor(() => expect(t.queryByTestId("viewport")).toBeNull());
});

it("should show initial submenu items on trigger hover", async () => {
	const t = setup();
	const trigger = t.getByTestId("sub-group-item-trigger");
	await t.user.hover(trigger);
	await waitFor(() => expect(t.queryByTestId("viewport")).not.toBeNull());
	const visibleSubContent = t.queryByTestId("sub-group-item-sub-item1-content");
	expect(visibleSubContent).not.toBeNull();
	expect(t.queryByTestId("sub-group-item-sub-item2-content")).toBeNull();
	expect(t.queryByTestId("sub-group-item-sub-viewport")).toContainElement(visibleSubContent);
});

it("should show submenu items on subtrigger hover", async () => {
	const t = setup();
	const trigger = t.getByTestId("sub-group-item-trigger");
	await t.user.hover(trigger);
	await waitFor(() => expect(t.queryByTestId("viewport")).not.toBeNull());
	const subTrigger = t.getByTestId("sub-group-item-sub-item2-trigger");
	await t.user.hover(subTrigger);
	await waitFor(() => expect(t.queryByTestId("sub-group-item-sub-item2-content")).not.toBeNull());
	expect(t.queryByTestId("sub-group-item-sub-item1-content")).toBeNull();
	expect(t.queryByTestId("sub-group-item-sub-viewport")).toContainElement(
		t.queryByTestId("sub-group-item-sub-item2-content")
	);
	// does not hide when clicking open subtrigger
	await t.user.click(t.getByTestId("sub-group-item-sub-item2-trigger"));
	expect(t.queryByTestId("sub-group-item-sub-item2-content")).not.toBeNull();
});

it("should open submenu viewport when pressing enter on focused subtrigger", async () => {
	const t = setup();
	t.getByTestId("sub-group-item-trigger").focus();
	await t.user.keyboard(kbd.ENTER);
	await waitFor(() => expect(t.queryByTestId("sub-group-item-sub-item2-trigger")).not.toBeNull());
	t.getByTestId("sub-group-item-sub-item2-trigger").focus();
	await t.user.keyboard(kbd.ENTER);
	await waitFor(() => expect(t.queryByTestId("sub-group-item-sub-item2-content")).not.toBeNull());
	expect(t.queryByTestId("sub-group-item-sub-viewport")).toContainElement(
		t.queryByTestId("sub-group-item-sub-item2-content")
	);
	// does not hide when re-pressing enter
	await t.user.keyboard(kbd.ENTER);
	expect(t.queryByTestId("sub-group-item-sub-item2-content")).not.toBeNull();
});

it("should show indicator when hovering trigger", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	await t.user.hover(trigger);
	await waitFor(() => expect(t.queryByTestId("indicator")).not.toBeNull());
});

it("should receive focus on the first item", async () => {
	const t = setup();
	t.getByTestId("previous-button").focus();
	await t.user.keyboard(kbd.TAB);
	expect(t.getByTestId("group-item-trigger")).toHaveFocus();
});

it("should focus next item with right arrow or down arrow, and previous with left or up", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	trigger.focus();
	await t.user.keyboard(kbd.ARROW_RIGHT);
	expect(t.getByTestId("sub-group-item-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_RIGHT);
	expect(t.getByTestId("link-item-link")).toHaveFocus();
});

it("should focus next item with tab", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	trigger.focus();
	await t.user.keyboard(kbd.TAB);
	expect(t.getByTestId("sub-group-item-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.TAB);
	expect(t.getByTestId("link-item-link")).toHaveFocus();
});

it("should focus next sub-item with right arrow, and previous with left", async () => {
	const t = setup();
	const trigger = t.getByTestId("sub-group-item-trigger");
	await t.user.hover(trigger);
	await waitFor(() => expect(t.queryByTestId("sub-group-item-sub-viewport")).not.toBeNull());
	const subTrigger = t.getByTestId("sub-group-item-sub-item1-trigger");
	subTrigger.focus();
	await t.user.keyboard(kbd.ARROW_RIGHT);
	expect(t.getByTestId("sub-group-item-sub-item2-trigger")).toHaveFocus();
	await t.user.keyboard(kbd.ARROW_LEFT);
	expect(t.getByTestId("sub-group-item-sub-item1-trigger")).toHaveFocus();
});

it("should focus next content item with right arrow or down arrow, and previous with left or up", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	trigger.focus();
	await t.user.keyboard(kbd.ENTER);
	t.getByTestId("group-item-content-button1").focus();
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
	trigger.focus();
	await t.user.keyboard(kbd.ENTER);
	await t.user.keyboard(kbd.TAB);
	expect(t.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should focus next on content with down arrow when opened", async () => {
	const t = setup();
	const trigger = t.getByTestId("group-item-trigger");
	trigger.focus();
	await t.user.keyboard(kbd.ENTER);
	await t.user.keyboard(kbd.ARROW_DOWN);
	expect(t.getByTestId("group-item-content-button1")).toHaveFocus();
});

it("should render content without viewport", async () => {
	const t = setup({ noViewport: true });
	const trigger = t.getByTestId("group-item-trigger");
	expect(t.queryByTestId("viewport")).toBeNull();
	expect(t.queryByTestId("group-item-content")).toBeNull();
	await t.user.hover(trigger);
	await waitFor(() => expect(t.queryByTestId("group-item-content")).not.toBeNull());
	expect(t.queryByTestId("viewport")).toBeNull();
	expect(t.queryByTestId("group-item")).toContainElement(t.queryByTestId("group-item-content"));
});

it("should render subcontent without subviewport", async () => {
	const t = setup({ noSubViewport: true });
	const trigger = t.getByTestId("sub-group-item-trigger");
	await t.user.hover(trigger);
	await waitFor(() => expect(t.queryByTestId("viewport")).not.toBeNull());
	const subTrigger = t.getByTestId("sub-group-item-sub-item2-trigger");
	await t.user.hover(subTrigger);
	await waitFor(() => expect(t.queryByTestId("sub-group-item-sub-item2-content")).not.toBeNull());
	expect(t.queryByTestId("sub-group-item-sub-item2")).toContainElement(
		t.queryByTestId("sub-group-item-sub-item2-content")
	);
	expect(t.queryByTestId("sub-group-item-sub-viewport")).toBeNull();
});

it("should switch between submenu items on pointer hover", async () => {
	const t = setup();

	// First open the main submenu
	const trigger = t.getByTestId("sub-group-item-trigger");
	await t.user.hover(trigger);
	await waitFor(() => expect(t.queryByTestId("viewport")).not.toBeNull());

	// Hover over first sub-trigger to open its content
	const subTrigger1 = t.getByTestId("sub-group-item-sub-item1-trigger");
	await t.user.hover(subTrigger1);
	await waitFor(() => expect(t.queryByTestId("sub-group-item-sub-item1-content")).not.toBeNull());
	expect(t.queryByTestId("sub-group-item-sub-item2-content")).toBeNull();

	// Hover over second sub-trigger - should close first and open second
	const subTrigger2 = t.getByTestId("sub-group-item-sub-item2-trigger");
	await t.user.hover(subTrigger2);
	await waitFor(() => expect(t.queryByTestId("sub-group-item-sub-item2-content")).not.toBeNull());
	expect(t.queryByTestId("sub-group-item-sub-item1-content")).toBeNull();
});

it("should not open menu on hover when `openOnHover` is false", async () => {
	const t = setup({ groupItemProps: { openOnHover: false } });
	const trigger = t.getByTestId("group-item-trigger");
	await t.user.hover(trigger);
	await waitFor(() => expect(t.queryByTestId("viewport")).toBeNull());
	await waitFor(() => expect(t.queryByTestId("group-item-content")).toBeNull());
});

it("should toggle on trigger click when `openOnHover` is false", async () => {
	const t = setup({ groupItemProps: { openOnHover: false } });
	const trigger = t.getByTestId("group-item-trigger");
	await t.user.click(trigger);
	await waitFor(() => expect(t.queryByTestId("viewport")).not.toBeNull());
	await waitFor(() => expect(t.queryByTestId("group-item-content")).not.toBeNull());
	await t.user.click(trigger);
	await waitFor(() => expect(t.queryByTestId("viewport")).toBeNull());
	await waitFor(() => expect(t.queryByTestId("group-item-content")).toBeNull());
});
