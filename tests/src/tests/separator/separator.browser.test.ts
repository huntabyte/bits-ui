import { render } from "vitest-browser-svelte";
import { describe, expect, it } from "vitest";
import type { Separator } from "bits-ui";
import SeparatorTest from "./separator-test.svelte";
import { page } from "@vitest/browser/context";

function setup(props: Separator.RootProps = {}) {
	render(SeparatorTest, { ...props });
	const root = page.getByTestId("root").element() as HTMLElement;
	return { root };
}

describe("Separator", () => {
	it("should have bits data attrs", async () => {
		const t = setup();
		await expect.element(t.root).toHaveAttribute("data-separator-root");
	});
});
