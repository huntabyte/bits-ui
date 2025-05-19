import { render, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { it } from "vitest";
import NavigationMenuTest, { type NavigationMenuTestProps } from "./navigation-menu-test.svelte";

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

it("should show initial submenu items on trigger hover", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("viewport")).not.toBeNull());
	expect(queryByTestId("group-item-sub-item1-content")).not.toBeNull();
	expect(queryByTestId("group-item-sub-item2-content")).toBeNull();
});

it("should show submenu items on subtrigger hover", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	await user.hover(trigger);
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("viewport")).not.toBeNull());
	const subTrigger = getByTestId("group-item-sub-item2-trigger");
	await user.hover(subTrigger);
	await waitFor(() => expect(queryByTestId("group-item-sub-item2-content")).not.toBeNull());
	expect(queryByTestId("group-item-sub-item1-content")).toBeNull();
});

it("should show indicator when hovering trigger", async () => {
	const { user, getByTestId, queryByTestId } = setup();
	const trigger = getByTestId("group-item-trigger");
	await user.hover(trigger);
	await waitFor(() => expect(queryByTestId("indicator")).not.toBeNull());
});
