import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "@vitest/browser/context";
import LabelTest from "./label-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";

it("should have bits data attrs", async () => {
	render(LabelTest);
	const root = page.getByTestId("label");
	expect(root).toHaveAttribute("data-label-root");
});

it("should render the label text", async () => {
	render(LabelTest);
	const label = page.getByTestId("label");
	expect(label).toHaveTextContent("Label");
});

it("should focus the associated input on click", async () => {
	const user = setupBrowserUserEvents();
	render(LabelTest);
	await user.click(page.getByTestId("label"));
	expect(page.getByTestId("input")).toHaveFocus();
});
