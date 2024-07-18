import { render, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { getTestKbd, setupUserEvents } from "../utils.js";
import PopoverTest, { type PopoverTestProps } from "./PopoverTest.svelte";
import { sleep } from "$lib/internal/sleep.js";

const kbd = getTestKbd();

function setup(props: PopoverTestProps = {}) {
	const user = setupUserEvents();
	const returned = render(PopoverTest, { ...props });
	const { getByTestId } = returned;
	const trigger = getByTestId("trigger");
	return { trigger, user, ...returned };
}

async function open(props: PopoverTestProps = {}, openWith: "click" | (string & {}) = "click") {
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

describe("popover", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(PopoverTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["trigger", "content", "close", "arrow"];

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

	it("closes on escape keydown by default", async () => {
		const { user, queryByTestId } = await open();
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	it("closes on outside click by default", async () => {
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
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).toBe(document.body);
	});

	it("portals to a custom element if specified", async () => {
		const { content, getByTestId } = await open({ portalProps: { to: "#portal-target" } });
		const portalTarget = getByTestId("portal-target");
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).toBe(portalTarget);
	});

	it("does not portal if `disabled` is passed to the portal ", async () => {
		const { content, getByTestId } = await open({
			portalProps: {
				disabled: true,
			},
		});
		const main = getByTestId("main");
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).toBe(main);
	});

	it("allows ignoring the escapeKeydownBehavior ", async () => {
		const { user, queryByTestId } = await open({
			contentProps: {
				escapeKeydownBehavior: "ignore",
			},
		});
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("allows ignoring the interactOutsideBehavior", async () => {
		const { user, queryByTestId, getByTestId } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it("respects binding the `open` prop", async () => {
		const { queryByTestId, getByTestId, user } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
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
