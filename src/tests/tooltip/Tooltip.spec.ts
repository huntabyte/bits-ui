import { render, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { testKbd as kbd } from "../utils.js";
import TooltipTest from "./TooltipTest.svelte";
import type { Tooltip } from "$lib";

function setup(props: Tooltip.Props = {}) {
	const user = userEvent.setup();
	const { getByTestId, queryByTestId } = render(TooltipTest, { ...props });
	const trigger = getByTestId("trigger");
	return { trigger, getByTestId, queryByTestId, user };
}

async function open(props: Tooltip.Props = {}) {
	const { trigger, getByTestId, queryByTestId, user } = setup(props);
	expect(queryByTestId("content")).toBeNull();
	user.hover(trigger);
	await waitFor(() => expect(queryByTestId("content")).not.toBeNull());
	const content = getByTestId("content");
	return { trigger, getByTestId, queryByTestId, user, content };
}

describe("Tooltip", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(TooltipTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["trigger", "content"];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-tooltip-${part}`);
		}
	});

	it("opens on hover", async () => {
		const { user, content } = await open();
		await user.click(content);
		expect(content).toBeVisible();
	});

	it("closes on escape keydown", async () => {
		const { user, content, queryByTestId } = await open();
		await user.click(content);
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	it("closes when pointer moves outside the trigger and content", async () => {
		const { user, getByTestId, queryByTestId } = await open();
		const outside = getByTestId("outside");
		await user.hover(outside);
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
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

	it("respects the close on escape prop", async () => {
		const { content, user, queryByTestId } = await open({ closeOnEscape: false });
		await user.click(content);
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("respects the `closeOnPointerDown` prop", async () => {
		const { content, user, queryByTestId, getByTestId } = await open({
			closeOnPointerDown: false
		});
		await user.click(content);
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("respects binding the open prop", async () => {
		const { queryByTestId, getByTestId, user } = await open({ closeOnPointerDown: false });
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
