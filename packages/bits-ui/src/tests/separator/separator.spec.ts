import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import SeparatorTest from "./separator-test.svelte";
import type { Separator } from "$lib/index.js";

function setup(props: Separator.RootProps = {}) {
	const user = userEvent.setup();
	const returned = render(SeparatorTest, { ...props });
	const { getByTestId } = returned;
	const root = getByTestId("root");
	return { root, user, ...returned };
}

describe("separator", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(SeparatorTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have bits data attrs", async () => {
		const { root } = setup();
		expect(root).toHaveAttribute("data-separator-root");
	});
});
