import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import SeparatorTest from "./SeparatorTest.svelte";
import type { Separator } from "$lib";

function setup(props: Separator.Props = {}) {
	const user = userEvent.setup();
	const returned = render(SeparatorTest, { ...props });
	const { getByTestId } = returned;
	const root = getByTestId("root");
	return { root, user, ...returned };
}

describe("Separator", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(SeparatorTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { root } = setup();
		expect(root).toHaveAttribute("data-separator-root");
	});
});
