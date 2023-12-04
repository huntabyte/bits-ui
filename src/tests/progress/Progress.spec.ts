import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import ProgressTest from "./ProgressTest.svelte";
import type { Progress } from "$lib";

function setup(props: Progress.Props = {}) {
	const user = userEvent.setup();
	const returned = render(ProgressTest, { ...props });
	const { getByTestId } = returned;
	const root = getByTestId("root");
	return { root, user, ...returned };
}

describe("Progress", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(ProgressTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { root } = setup();
		expect(root).toHaveAttribute("data-progress-root");
	});

	it("respects the value prop", async () => {
		const { root } = setup({ value: 50 });
		expect(root).toHaveAttribute("aria-valuenow", "50");
	});

	it("respects the max prop", async () => {
		const { root } = setup({ max: 20 });
		expect(root).toHaveAttribute("aria-valuemax", "20");
	});

	it("respects binding the value prop", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(ProgressTest);
		const root = getByTestId("root");
		const binding = getByTestId("binding");
		expect(root).toHaveAttribute("aria-valuenow", "0");
		expect(binding).toHaveTextContent("0");
		await user.click(binding);
		expect(binding).toHaveTextContent("50");
		expect(root).toHaveAttribute("aria-valuenow", "50");
	});
});
