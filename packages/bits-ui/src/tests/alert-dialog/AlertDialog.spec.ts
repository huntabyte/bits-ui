import {
	type Matcher,
	type MatcherOptions,
	render,
	screen,
	waitFor,
} from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { getTestKbd } from "../utils.js";
import AlertDialogTest, { type AlertDialogTestProps } from "./AlertDialogTest.svelte";
import { sleep } from "$lib/internal/index.js";

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

function setup(props: AlertDialogTestProps = {}) {
	const user = userEvent.setup({ pointerEventsCheck: 0 });
	const returned = render(AlertDialogTest, { ...props });
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
	await user.click(trigger);
	const contentAfter = getByTestId("content");
	expect(contentAfter).not.toBeNull();
	const cancel = getByTestId("cancel");
	const action = getByTestId("action");
	return { getByTestId, queryByTestId, user, action, cancel };
}

describe("alert dialog", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(AlertDialogTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["trigger", "overlay", "cancel", "title", "description", "content"];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-dialog-${part}`);
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

	it("should focus the cancel button by default when opened", async () => {
		const { cancel } = await open();
		expect(cancel).toHaveFocus();
	});

	it("should close when the cancel button is clicked", async () => {
		const { getByTestId, queryByTestId, user } = await open();
		const cancel = getByTestId("cancel");
		await user.click(cancel);
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
		await sleep(100);

		const overlay = getByTestId("overlay");
		await user.click(overlay);
		await sleep(25);

		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).not.toBeNull();
	});

	it("should attach to body when using portal element", async () => {
		await open();

		const content = screen.getByTestId("content");
		expect(content.parentElement).toEqual(document.body);
	});

	it("should attach to body when portal is disabled", async () => {
		await open({
			portalProps: {
				disabled: true,
			},
		});
		const content = screen.getByTestId("content");
		expect(content.parentElement).not.toEqual(document.body);
	});

	it("should portal to the target if passed as a prop", async () => {
		await open({
			portalProps: {
				to: "#portalTarget",
			},
		});
		const portalTarget = screen.getByTestId("portalTarget");
		const content = screen.getByTestId("content");
		expect(content.parentElement).toEqual(portalTarget);
	});

	it("should not close when content is clicked", async () => {
		const { user, getByTestId, queryByTestId } = await open();
		const content = getByTestId("content");
		await user.click(content);
		await expectIsOpen(queryByTestId);
	});

	it("should respect binding to the `open` prop", async () => {
		const { getByTestId, queryByTestId, user } = setup();

		const trigger = getByTestId("trigger");
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.click(trigger);
		expect(binding).toHaveTextContent("true");
		await user.keyboard(kbd.ESCAPE);
		expect(binding).toHaveTextContent("false");

		const toggle = getByTestId("toggle");
		expectIsClosed(queryByTestId);
		await user.click(toggle);
		await expectIsOpen(queryByTestId);
	});

	it("should respect the `interactOutsideBehavior: 'ignore'` prop", async () => {
		const { getByTestId, queryByTestId, user } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		await sleep(100);

		const overlay = getByTestId("overlay");
		await user.click(overlay);

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
});
