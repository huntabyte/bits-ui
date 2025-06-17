import { render } from "vitest-browser-svelte";
import { describe, expect, it } from "vitest";
import type { Separator } from "bits-ui";
import SeparatorTest from "./separator-test.svelte";

function setup(props: Separator.RootProps = {}) {
	const returned = render(SeparatorTest, { ...props });
	const { getByTestId } = returned;
	const root = getByTestId("root");
	return { root, ...returned };
}

describe("Separator", () => {
	it("should have bits data attrs", async () => {
		const { root } = setup();
		expect(root).toHaveAttribute("data-separator-root");
	});
});
