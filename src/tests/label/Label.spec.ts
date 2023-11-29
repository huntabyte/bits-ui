import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import LabelTest from "./LabelTest.svelte";

describe("Label", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(LabelTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { getByTestId } = render(LabelTest);
		const root = getByTestId("label");
		expect(root).toHaveAttribute("data-label-root");
	});

	it("renders the label text", async () => {
		const { getByTestId } = render(LabelTest);
		const label = getByTestId("label");
		expect(label).toHaveTextContent("Label");
	});

	it("focuses the associated input on click", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(LabelTest);
		await user.click(getByTestId("label"));
		expect(getByTestId("input")).toHaveFocus();
	});
});
