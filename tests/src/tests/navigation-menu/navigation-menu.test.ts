import { render, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { it, vi } from "vitest";
import { getTestKbd } from "../utils.js";
import NavigationMenuTest, { type NavigationMenuTestProps } from "./navigation-menu-test.svelte";

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
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	expect(queryByTestId("viewport")).toBeNull();
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("viewport")).not.toBeNull());
});

it.skip("should focus items with tab", async () => {
	const { user, getByTestId } = setup();
	await user.keyboard(kbd.TAB);
	expect(getByTestId("previous-button")).toHaveFocus();
	await user.keyboard(kbd.TAB);
	expect(getByTestId("group-item-trigger")).toHaveFocus();
	await user.keyboard(kbd.TAB);
	expect(getByTestId("link-item-link")).toHaveFocus();
});

it.skip("should focus items with right arrow", async () => {
	const { user, getByTestId } = setup();
	await user.keyboard(kbd.TAB);
	expect(getByTestId("previous-button")).toHaveFocus();
	await user.keyboard(kbd.ARROW_RIGHT);
	expect(getByTestId("group-item-trigger")).toHaveFocus();
	await user.keyboard(kbd.ARROW_RIGHT);
	expect(getByTestId("link-item-link")).toHaveFocus();
});

it.skip("should show submenu items on click", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("viewport")).not.toBeNull());
	expect(queryByTestId("group-item-sub-item1-content")).not.toBeNull();
	expect(queryByTestId("group-item-sub-item2-content")).toBeNull();
});

it("should show indicator when hovering trigger", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("indicator")).not.toBeNull());
});
