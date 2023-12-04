import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import CollapsibleTest from "./CollapsibleTest.svelte";

describe("Collapsible", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(CollapsibleTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = render(CollapsibleTest, { open: true });
		const root = getByTestId("root");
		const trigger = getByTestId("trigger");
		const content = getByTestId("content");
		expect(root).toHaveAttribute("data-collapsible-root");
		expect(trigger).toHaveAttribute("data-collapsible-trigger");
		expect(content).toHaveAttribute("data-collapsible-content");
	});

	it("doesnt render content when `open` is false", async () => {
		const { getByTestId, queryByTestId } = render(CollapsibleTest);
		const root = getByTestId("root");
		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(root).not.toBeNull();
		expect(trigger).not.toBeNull();
		expect(content).toBeNull();
	});

	it("toggles the `open` state when clicked", async () => {
		const user = userEvent.setup();
		const { getByTestId, queryByTestId } = render(CollapsibleTest);
		const trigger = getByTestId("trigger");
		const content = queryByTestId("content");
		expect(content).toBeNull();
		await user.click(trigger);
		const contentAfter = getByTestId("content");
		expect(contentAfter).not.toBeNull();
		await user.click(trigger);
		const contentAfter2 = queryByTestId("content");
		expect(contentAfter2).toBeNull();
	});

	it("respects binds to the `open` prop", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CollapsibleTest);
		const trigger = getByTestId("trigger");
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.click(trigger);
		expect(binding).toHaveTextContent("true");

		const altTrigger = getByTestId("alt-trigger");
		await user.click(altTrigger);
		expect(binding).toHaveTextContent("false");
	});
});
