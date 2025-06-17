import { render } from "vitest-browser-svelte";
import { describe, expect, it } from "vitest";
import type { Separator } from "bits-ui";
import SeparatorTest from "./separator-test.svelte";

function setup(props: Separator.RootProps = {}) {
	const t = render(SeparatorTest, { ...props });
	const root = t.getByTestId("root").element() as HTMLElement;
	return { root, ...t };
}

describe("Separator", () => {
	it("should have bits data attrs", async () => {
		const t = setup();
		expect(t.root).toHaveAttribute("data-separator-root");
	});
});
