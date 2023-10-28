import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import AlertDialogTest from "./AlertDialogTest.svelte";
import { testKbd as kbd } from "../utils.js";
import { sleep } from "$lib/internal";

describe("Alert Dialog", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(AlertDialogTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = render(AlertDialogTest, { open: true });
		const parts = [
			"trigger",
			"overlay",
			"portal",
			"cancel",
			"action",
			"title",
			"description",
			"content"
		];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-bits-alert-dialog-${part}`);
		}
	});

	it("opens when the trigger is clicked", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AlertDialogTest);

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();
	});

	it("closes when the cancel button is clicked", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AlertDialogTest);

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();

		const cancel = getByTestId("cancel");
		await user.click(cancel);
		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).toBeNull();
	});

	it("closes when the action button is clicked", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AlertDialogTest);

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();

		const action = getByTestId("action");
		await user.click(action);
		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).toBeNull();
	});

	it("closes when the `Escape` key is pressed", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AlertDialogTest);

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();

		await user.keyboard(kbd.ESCAPE);
		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).toBeNull();
		expect(trigger).toHaveFocus();
	});

	it("doesnt close when the overlay is clicked", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AlertDialogTest);

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();
		await sleep(100);

		const overlay = getByTestId("overlay");
		await user.click(overlay);

		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).not.toBeNull();
	});

	it("attaches to body when using portal element", async () => {
		const user = userEvent.setup();
		render(AlertDialogTest);

		const trigger = screen.getByTestId("trigger");
		await user.click(trigger);

		const portalled = screen.getByTestId("portal");

		expect(portalled.parentElement).toEqual(document.body);
	});

	it("doesnt attached to body when portal prop is null", async () => {
		const user = userEvent.setup();
		render(AlertDialogTest, { portal: null });

		const trigger = screen.getByTestId("trigger");
		await user.click(trigger);

		const portalled = screen.getByTestId("portal");

		expect(portalled.parentElement).not.toEqual(document.body);
	});

	it("portals to the target if passed as a prop", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(AlertDialogTest, { portal: "#portalTarget" });

		const trigger = getByTestId("trigger");
		const portalTarget = getByTestId("portalTarget");
		await user.click(trigger);

		const portalled = getByTestId("portal");

		expect(portalled.parentElement).toEqual(portalTarget);
	});

	it("Focuses first focusable item upon opening", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AlertDialogTest);

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");

		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();
		// Testing focus-trap is a bit flaky. So the focusable element is
		// always content here.
		expect(document.activeElement).toBe(contentAfter);
	});

	it("Doesnt close when content is clicked", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AlertDialogTest);

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");

		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();
		await user.click(contentAfter);
		const contentAfter2 = getByTestId("content");
		expect(contentAfter2).not.toBeNull();
	});

	it("Respects binding to the `open` prop", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AlertDialogTest);

		const trigger = getByTestId("trigger");
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.click(trigger);
		expect(binding).toHaveTextContent("true");
		await user.keyboard(kbd.ESCAPE);
		expect(binding).toHaveTextContent("false");

		const toggle = getByTestId("toggle");
		expect(queryByTestId("content")).toBeNull();
		await user.click(toggle);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("respects the `closeOnOutsideClick` prop", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AlertDialogTest, { closeOnOutsideClick: false });

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();
		await sleep(100);

		const overlay = getByTestId("overlay");
		await user.click(overlay);

		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).not.toBeNull();
	});

	it("respects the the `closeOnEscape` prop", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(AlertDialogTest, { closeOnEscape: false });

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();

		await user.keyboard(kbd.ESCAPE);
		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).not.toBeNull();
		expect(trigger).not.toHaveFocus();
	});
});
