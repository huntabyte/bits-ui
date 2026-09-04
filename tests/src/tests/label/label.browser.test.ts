import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import { page } from "vitest/browser";
import LabelTest from "./label-test.svelte";

it("should have bits data attrs", async () => {
	await render(LabelTest);
	const root = page.getByTestId("label");
	await expect.element(root).toHaveAttribute("data-label-root");
});

it("should render the label text", async () => {
	await render(LabelTest);
	const label = page.getByTestId("label");
	await expect.element(label).toMatchTextContent("Label");
});

it("should focus the associated input on click", async () => {
	await render(LabelTest);
	await page.getByTestId("label").click();
	await expect.element(page.getByTestId("input")).toHaveFocus();
});
