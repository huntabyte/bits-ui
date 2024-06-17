import { render } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { setupUserEvents } from "../utils.js";
import CollapsibleTest from "./CollapsibleTest.svelte";
import type { Collapsible } from "$lib/index.js";

function setup(props?: Collapsible.RootProps) {
	const user = setupUserEvents();
	const returned = render(CollapsibleTest, props);
	const root = returned.getByTestId("root");
	const trigger = returned.getByTestId("trigger");
	const content = returned.queryByTestId("content");
	const binding = returned.getByTestId("binding");
	return {
		...returned,
		root,
		trigger,
		content,
		binding,
		user,
	};
}

describe("collapsible", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(CollapsibleTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = setup();
		const root = getByTestId("root");
		const trigger = getByTestId("trigger");
		const content = getByTestId("content");
		expect(root).toHaveAttribute("data-collapsible-root");
		expect(trigger).toHaveAttribute("data-collapsible-trigger");
		expect(content).toHaveAttribute("data-collapsible-content");
	});

	it("content is hidden when `open` is false", async () => {
		const { root, trigger, content } = setup();
		expect(root).not.toBeNull();
		expect(trigger).not.toBeNull();
		expect(content).not.toBeVisible();
	});

	it("toggles the `open` state when clicked", async () => {
		const { user, trigger, content } = setup();
		expect(content).not.toBeVisible();
		await user.click(trigger);
		expect(content).toBeVisible();
		await user.click(trigger);
		expect(content).not.toBeVisible();
	});

	it("respects binds to the `open` prop", async () => {
		const { getByTestId, user, trigger, binding } = setup({ open: false });
		expect(binding).toHaveTextContent("false");
		await user.click(trigger);
		expect(binding).toHaveTextContent("true");
		const altTrigger = getByTestId("alt-trigger");
		await user.click(altTrigger);
		expect(binding).toHaveTextContent("false");
	});
});
