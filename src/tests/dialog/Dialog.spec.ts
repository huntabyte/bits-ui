import { render, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import DialogTest from "./DialogTest.svelte";
import { testKbd as kbd } from "../utils.js";
import { sleep } from "$lib/internal";

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
			expect(el).toHaveAttribute(`data-bits-dialog-${part}`);
		}
	});

	it("opens when the trigger is clicked", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(DialogTest);

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();
	});

	it("closes when the close button is clicked", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(DialogTest);

		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();

		const close = getByTestId("close");
		await user.click(close);
		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).toBeNull();
	});

	it("closes when the `Escape` key is pressed", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(DialogTest);

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

	it("closes when the overlay is clicked", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(DialogTest);

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
		expect(contentAfter2).toBeNull();
	});

	it("attaches to body when using portal element", async () => {
		const user = userEvent.setup();
		render(DialogTest);

		const trigger = screen.getByTestId("trigger");
		await user.click(trigger);

		const portalled = screen.getByTestId("portal");

		expect(portalled.parentElement).toEqual(document.body);
	});

	it("doesnt attached to body when portal prop is null", async () => {
		const user = userEvent.setup();
		render(DialogTest, { portal: null });

		const trigger = screen.getByTestId("trigger");
		await user.click(trigger);

		const portalled = screen.getByTestId("portal");

		expect(portalled.parentElement).not.toEqual(document.body);
	});

	it("Focuses first focusable item upon opening", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(DialogTest);

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
		const { getByTestId, queryByTestId } = render(DialogTest);

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
});
