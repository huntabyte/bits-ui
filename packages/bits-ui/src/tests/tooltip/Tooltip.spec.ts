import { render, waitFor } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { getTestKbd } from "../utils.js";
import TooltipTest, { type TooltipTestProps } from "./TooltipTest.svelte";
import { sleep } from "$lib/internal/sleep.js";

const kbd = getTestKbd();

function setup(props: Partial<TooltipTestProps> = {}) {
	const user = userEvent.setup({ pointerEventsCheck: 0 });
	const returned = render(TooltipTest, { ...props });
	const trigger = returned.getByTestId("trigger");
	return { ...returned, trigger, user };
}

async function open(props: Partial<TooltipTestProps> = {}) {
	const returned = setup(props);
	expect(returned.queryByTestId("content")).toBeNull();
	returned.user.hover(returned.trigger);
	await waitFor(() => expect(returned.queryByTestId("content")).not.toBeNull());
	const content = returned.getByTestId("content");
	return { ...returned, content };
}

describe("tooltip", () => {
	it.only("has no accessibility violations", async () => {
		const { container } = setup();
		expect(await axe(container)).toHaveNoViolations();
	});

	it.only("has bits data attrs", async () => {
		const { getByTestId } = await open();
		const parts = ["trigger", "content"];

		for (const part of parts) {
			const el = getByTestId(part);
			expect(el).toHaveAttribute(`data-tooltip-${part}`);
		}
	});

	it.only("opens on hover", async () => {
		const { user, content } = await open();
		await user.click(content);
		expect(content).toBeVisible();
	});

	it.only("closes on escape keydown", async () => {
		const { user, content, queryByTestId } = await open();
		await user.click(content);
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).toBeNull();
	});

	it.only("closes when pointer moves outside the trigger and content", async () => {
		const { user, getByTestId, queryByTestId, content } = await open();

		const outside = getByTestId("outside") as HTMLElement;

		await user.pointer([
			// touch the screen at element1
			{ keys: "[TouchA>]", target: content },
			// move the touch pointer to element2
			{ pointerName: "TouchA", target: outside },
			// release the touch pointer at the last position (element2)
			{ keys: "[/TouchA]" },
		]);
		await sleep(200);
		await waitFor(() => expect(queryByTestId("content")).toBeNull());
	});

	it.only("portals to the body by default", async () => {
		const { content } = await open();
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).toBe(document.body);
	});

	it.only("portals to a custom element if specified", async () => {
		const { content, getByTestId } = await open({ portalProps: { to: "#portal-target" } });
		const portalTarget = getByTestId("portal-target");
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).toBe(portalTarget);
	});

	it.only("does not portal if `disabled` is passed to the portal", async () => {
		const { content, getByTestId } = await open({ portalProps: { disabled: true } });
		const main = getByTestId("main");
		const contentWrapper = content.parentElement;
		expect(contentWrapper?.parentElement).toBe(main);
	});

	it.only("allows ignoring escapeKeydownBehavior ", async () => {
		const { content, user, queryByTestId } = await open({
			contentProps: {
				escapeKeydownBehavior: "ignore",
			},
		});
		await user.click(content);
		await user.keyboard(kbd.ESCAPE);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it.only("allows ignoring interactOutsideBehavior", async () => {
		const { content, user, queryByTestId, getByTestId } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		await user.click(content);
		const outside = getByTestId("outside");
		await user.click(outside);
		expect(queryByTestId("content")).not.toBeNull();
	});

	it.only("respects binding the open prop", async () => {
		const { queryByTestId, getByTestId, user } = await open({
			contentProps: {
				interactOutsideBehavior: "ignore",
			},
		});
		const binding = getByTestId("binding");
		await waitFor(() => expect(binding).toHaveTextContent("true"));
		await user.click(binding);
		await waitFor(() => expect(binding).toHaveTextContent("false"));
		expect(queryByTestId("content")).toBeNull();
		await user.click(binding);
		await waitFor(() => expect(binding).toHaveTextContent("true"));
		expect(queryByTestId("content")).not.toBeNull();
	});
});
