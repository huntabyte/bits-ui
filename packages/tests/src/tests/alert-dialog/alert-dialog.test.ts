import {
	type Matcher,
	type MatcherOptions,
	render,
	waitFor,
} from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { it } from "vitest";
import type { Component } from "svelte";
import { getTestKbd, setupUserEvents } from "../utils.js";
import AlertDialogTest, { type AlertDialogTestProps } from "./alert-dialog-test.svelte";
import AlertDialogForceMountTest from "./alert-dialog-force-mount-test.svelte";

const kbd = getTestKbd();

function expectIsClosed(
	queryByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement | null
) {
	const content = queryByTestId("content");
	expect(content).toBeNull();
}

async function expectIsOpen(
	queryByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement | null
) {
	const content = queryByTestId("content");
	await waitFor(() => expect(content).not.toBeNull());
}

function setup(props: AlertDialogTestProps = {}, component: Component = AlertDialogTest) {
	const user = setupUserEvents();
	const returned = render(component, { ...props });
	const trigger = returned.getByTestId("trigger");

	return {
		...returned,
		trigger,
		user,
	};
}

async function open(props: AlertDialogTestProps = {}) {
	const { getByTestId, queryByTestId, user, trigger } = setup(props);
	const content = queryByTestId("content");
	expect(content).toBeNull();
	await user.pointerDownUp(trigger);
	const contentAfter = getByTestId("content");
	expect(contentAfter).not.toBeNull();
	const cancel = getByTestId("cancel");
	const action = getByTestId("action");
	return { getByTestId, queryByTestId, user, action, cancel };
}

it("should have no accessibility violations", async () => {
	const { container } = render(AlertDialogTest);
	expect(await axe(container)).toHaveNoViolations();
});

it("should have bits data attrs", async () => {
	const { getByTestId } = await open();
	const parts = ["trigger", "overlay", "cancel", "title", "description", "content"];

	for (const part of parts) {
		const el = getByTestId(part);
		expect(el).toHaveAttribute(`data-alert-dialog-${part}`);
	}
});

it("should have expected data attributes", async () => {
	const { getByTestId } = await open();

	const overlay = getByTestId("overlay");
	expect(overlay).toHaveAttribute("data-state", "open");
	const content = getByTestId("content");
	expect(content).toHaveAttribute("data-state", "open");
});

it("should open when the trigger is clicked", async () => {
	await open();
});

it("should forceMount the content and overlay when their `forceMount` prop is true", async () => {
	const { getByTestId } = setup({}, AlertDialogForceMountTest);

	expect(getByTestId("overlay")).toBeInTheDocument();
	expect(getByTestId("content")).toBeInTheDocument();
});

it("should forceMount the content and overlay when their `forceMount` prop is true and the `open` snippet prop is used to conditionally render the content", async () => {
	const { getByTestId, queryByTestId, user } = setup(
		{
			withOpenCheck: true,
		},
		AlertDialogForceMountTest
	);

	expect(queryByTestId("overlay")).toBeNull();
	expect(queryByTestId("content")).toBeNull();

	await user.pointerDownUp(getByTestId("trigger"));

	expect(getByTestId("overlay")).toBeInTheDocument();

	expect(getByTestId("content")).toBeInTheDocument();
});

it("should focus the cancel button by default when opened", async () => {
	const { cancel } = await open();
	expect(cancel).toHaveFocus();
});

it("should close when the cancel button is clicked", async () => {
	const { getByTestId, queryByTestId, user } = await open();
	const cancel = getByTestId("cancel");
	await user.pointerDownUp(cancel);
	expectIsClosed(queryByTestId);
});

it("should close when the `Escape` key is pressed", async () => {
	const { queryByTestId, user, getByTestId } = await open();

	await user.keyboard(kbd.ESCAPE);
	expectIsClosed(queryByTestId);
	expect(getByTestId("trigger")).toHaveFocus();
});

it("should not close when the overlay is clicked", async () => {
	const { getByTestId, queryByTestId, user } = await open();

	await user.pointerDownUp(getByTestId("overlay"));

	expect(queryByTestId("content")).not.toBeNull();
});

it("should attach to body when using portal element", async () => {
	const { getByTestId } = await open();

	expect(getByTestId("content").parentElement).toEqual(document.body);
});

it("should attach to body when portal is disabled", async () => {
	const { getByTestId } = await open({
		portalProps: {
			disabled: true,
		},
	});
	expect(getByTestId("content").parentElement).not.toEqual(document.body);
});

it("should portal to the target if passed as a prop", async () => {
	const { getByTestId } = await open({
		portalProps: {
			to: "#portalTarget",
		},
	});

	expect(getByTestId("content").parentElement).toEqual(getByTestId("portalTarget"));
});

it("should not close when content is clicked", async () => {
	const { user, getByTestId, queryByTestId } = await open();
	await user.pointerDownUp(getByTestId("content"));
	await expectIsOpen(queryByTestId);
});

it("should respect binding to the `open` prop", async () => {
	const { getByTestId, queryByTestId, user } = setup();

	const binding = getByTestId("binding");
	expect(binding).toHaveTextContent("false");
	await user.pointerDownUp(getByTestId("trigger"));
	expect(binding).toHaveTextContent("true");
	await user.keyboard(kbd.ESCAPE);
	expect(binding).toHaveTextContent("false");

	expectIsClosed(queryByTestId);
	await user.click(getByTestId("toggle"));
	await expectIsOpen(queryByTestId);
});

it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
	const { getByTestId, queryByTestId, user } = await open({
		contentProps: {
			interactOutsideBehavior: "ignore",
		},
	});

	await user.click(getByTestId("overlay"));
	await expectIsOpen(queryByTestId);
});

it("should respect the the `escapeKeydownBehavior: 'ignore'` prop", async () => {
	const { user, getByTestId, queryByTestId } = await open({
		contentProps: {
			escapeKeydownBehavior: "ignore",
		},
	});

	await user.keyboard(kbd.ESCAPE);
	await expectIsOpen(queryByTestId);
	expect(getByTestId("trigger")).not.toHaveFocus();
});

it("should apply the correct `aria-describedby` attribute to the `Dialog.Content` element", async () => {
	const { getByTestId } = await open();

	const content = getByTestId("content");
	const description = getByTestId("description");
	expect(content).toHaveAttribute("aria-describedby", description.id);
});

it("should apply a default `aria-level` attribute to the `AlertDialog.Title` element", async () => {
	const { getByTestId } = await open();

	expect(getByTestId("title")).toHaveAttribute("aria-level", "2");
});

it("should allow setting a custom level for the `AlertDialog.Title` element", async () => {
	const { getByTestId } = await open({
		titleProps: {
			level: 3,
		},
	});

	expect(getByTestId("title")).toHaveAttribute("aria-level", "3");
});
