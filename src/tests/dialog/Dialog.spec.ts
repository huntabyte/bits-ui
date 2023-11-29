import { render, screen, type Matcher, type MatcherOptions } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import DialogTest from "./DialogTest.svelte";
import { testKbd as kbd } from "../utils.js";
import { sleep } from "$lib/internal";
import type { Dialog } from "$lib";

function expectIsClosed(
	queryByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement | null
) {
	const content = queryByTestId("content");
	expect(content).toBeNull();
}

function expectIsOpen(
	queryByTestId: (id: Matcher, options?: MatcherOptions | undefined) => HTMLElement | null
) {
	const content = queryByTestId("content");
	expect(content).not.toBeNull();
}

function setup(props: Dialog.Props = {}) {
	const user = userEvent.setup();
	const { getByTestId, queryByTestId } = render(DialogTest, { ...props });
	return {
		getByTestId,
		queryByTestId,
		user
	};
}

async function open(props: Dialog.Props = {}) {
	const { getByTestId, queryByTestId, user } = setup(props);
	const trigger = getByTestId("trigger");
	const content = queryByTestId("content");
	expect(content).toBeNull();
	await user.click(trigger);
	const contentAfter = getByTestId("content");
	expect(contentAfter).not.toBeNull();
	return { getByTestId, queryByTestId, user };
}

describe("Dialog", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(DialogTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = render(DialogTest, { open: true });
		const parts = ["trigger", "overlay", "portal", "close", "title", "description", "content"];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-dialog-${part}`);
		}
	});

	it("has expected data attributes", async () => {
		const { getByTestId } = await open();

		const overlay = getByTestId("overlay");
		expect(overlay).toHaveAttribute("data-state", "open");
		const content = getByTestId("content");
		expect(content).toHaveAttribute("data-state", "open");
		const portal = getByTestId("portal");
		expect(portal).toHaveAttribute("data-portal");
	});

	it("opens when the trigger is clicked", async () => {
		await open();
	});

	it("closes when the close button is clicked", async () => {
		const { getByTestId, queryByTestId, user } = await open();
		const close = getByTestId("close");
		await user.click(close);
		expectIsClosed(queryByTestId);
	});

	it("closes when the `Escape` key is pressed", async () => {
		const { queryByTestId, user, getByTestId } = await open();

		await user.keyboard(kbd.ESCAPE);
		expectIsClosed(queryByTestId);
		expect(getByTestId("trigger")).toHaveFocus();
	});

	it("closes when the overlay is clicked", async () => {
		const { getByTestId, queryByTestId, user } = await open();
		await sleep(100);

		const overlay = getByTestId("overlay");
		await user.click(overlay);

		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).toBeNull();
	});

	it("attaches to body when using portal element", async () => {
		await open();

		const portalled = screen.getByTestId("portal");

		expect(portalled.parentElement).toEqual(document.body);
	});

	it("doesnt attached to body when portal prop is null", async () => {
		await open({ portal: null });
		const portalled = screen.getByTestId("portal");

		expect(portalled.parentElement).not.toEqual(document.body);
	});

	it("portals to the target if passed as a prop", async () => {
		await open({ portal: "#portalTarget" });
		const portalTarget = screen.getByTestId("portalTarget");
		const portalled = screen.getByTestId("portal");
		expect(portalled.parentElement).toEqual(portalTarget);
	});

	it("Focuses first focusable item upon opening", async () => {
		const { getByTestId } = await open();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(getByTestId("content"));
	});

	it("Doesnt close when content is clicked", async () => {
		const { user, getByTestId, queryByTestId } = await open();
		const content = getByTestId("content");
		await user.click(content);
		expectIsOpen(queryByTestId);
	});

	it("Respects binding to the `open` prop", async () => {
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
		expectIsOpen(queryByTestId);
	});

	it("respects the `closeOnOutsideClick` prop", async () => {
		const { getByTestId, queryByTestId, user } = await open({ closeOnOutsideClick: false });
		await sleep(100);

		const overlay = getByTestId("overlay");
		await user.click(overlay);

		expectIsOpen(queryByTestId);
	});

	it("respects the the `closeOnEscape` prop", async () => {
		const { user, getByTestId, queryByTestId } = await open({
			closeOnEscape: false
		});

		await user.keyboard(kbd.ESCAPE);
		expectIsOpen(queryByTestId);
		expect(getByTestId("trigger")).not.toHaveFocus();
	});
});
