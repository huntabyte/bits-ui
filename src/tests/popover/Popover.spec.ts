import { render, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { testKbd as kbd } from "../utils.js";
import PopoverTest from "./PopoverTest.svelte";
import type { Popover } from "$lib";

function setup(props: Popover.Props = {}) {
	const user = userEvent.setup();
	const returned = render(PopoverTest, { ...props });
	const { getByTestId } = returned;
	const trigger = getByTestId("trigger");
	return { trigger, user, ...returned };
}

async function open(props: Popover.Props = {}, openWith: "click" | (string & {}) = "click") {
	const { trigger, getByTestId, queryByTestId, user } = setup(props);
	expect(queryByTestId("content")).toBeNull();
	if (openWith === "click") {
		await user.click(trigger);
	} else {
		trigger.focus();
		await user.keyboard(openWith);
	}
	await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	const content = getByTestId("content");
	return { trigger, getByTestId, queryByTestId, user, content };
}

describe("Popover", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(PopoverTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["trigger", "content", "close"];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-popover-${part}`);
		}
	});

	it("opens on click", async () => {
		await open();
	});

	it("opens on enter", async () => {
		await open({}, kbd.ENTER);
	});

	it("opens on space", async () => {
		await open({}, kbd.SPACE);
	});

	it("closes on escape keydown", async () => {
		const { user, queryByTestId } = await open();
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	it("closes on outside click", async () => {
		const { user, queryByTestId, getByTestId } = await open();
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(queryByTestId("content")).toBeNull();
	});

	it("closes when the close button is clicked", async () => {
		const { user, queryByTestId, getByTestId } = await open();
		const close = getByTestId("close");
		await user.click(close);
		expect(queryByTestId("content")).toBeNull();
	});

	it("portals to the body by default", async () => {
		const { content } = await open();
		expect(content.parentElement).toBe(document.body);
	});

	it("portals to a custom element if specified", async () => {
		const { content, getByTestId } = await open({ portal: "#portal-target" });
		const portalTarget = getByTestId("portal-target");
		expect(content.parentElement).toBe(portalTarget);
	});

	it("does not portal if `null` is passed as portal prop", async () => {
		const { content, getByTestId } = await open({ portal: null });
		const main = getByTestId("main");
		expect(content.parentElement).toBe(main);
	});

	it("respects the `closeOnEscape` prop", async () => {
		const { user, queryByTestId } = await open({ closeOnEscape: false });
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("respects the `closeOnOutsideClick` prop", async () => {
		const { user, queryByTestId, getByTestId } = await open({
			closeOnOutsideClick: false
		});
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("respects binding the `open` prop", async () => {
		const { queryByTestId, getByTestId, user } = await open({ closeOnOutsideClick: false });
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("true");
		await user.click(binding);
		expect(binding).toHaveTextContent("false");
		expect(queryByTestId("content")).toBeNull();
		await user.click(binding);
		expect(binding).toHaveTextContent("true");
		expect(queryByTestId("content")).not.toBeNull();
	});
});
