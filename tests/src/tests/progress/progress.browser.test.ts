import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Progress } from "bits-ui";
import ProgressTest from "./progress-test.svelte";
import { page } from "vitest/browser";

async function setup(props: Progress.RootProps = {}) {
	await render(ProgressTest, { ...props });
	const root = page.getByTestId("root");
	return { root };
}

it("should have bits data attrs", async () => {
	const t = await setup();
	await expect.element(t.root).toHaveAttribute("data-progress-root");
});

it("should have role='progressbar'", async () => {
	const t = await setup();
	await expect.element(t.root).toHaveAttribute("role", "progressbar");
});

it("should forward `aria-labelledby` and `aria-valuetext`", async () => {
	const t = await setup({ "aria-labelledby": "label", "aria-valuetext": "value" });
	await expect.element(t.root).toHaveAttribute("aria-labelledby", "label");
	await expect.element(t.root).toHaveAttribute("aria-valuetext", "value");
});

it("should respect the value prop", async () => {
	const t = await setup({ value: 50 });
	await expect.element(t.root).toHaveAttribute("aria-valuenow", "50");
});

it("should respect the max prop", async () => {
	const t = await setup({ max: 20 });
	await expect.element(t.root).toHaveAttribute("aria-valuemax", "20");
});

it("should respect the min prop", async () => {
	const t = await setup({ min: 10 });
	await expect.element(t.root).toHaveAttribute("aria-valuemin", "10");
});

it("should react to updates to the value prop", async () => {
	const t = await setup();
	const binding = page.getByTestId("binding");
	await expect.element(t.root).toHaveAttribute("aria-valuenow", "0");
	await expect.element(binding).toMatchTextContent("0");
	await binding.click();
	await expect.element(binding).toMatchTextContent("50");
	await expect.element(t.root).toHaveAttribute("aria-valuenow", "50");
});

it("should not have an `aria-valuenow` attribute when the `value` is `null`", async () => {
	const t = await setup({ value: null });
	await expect.element(t.root).not.toHaveAttribute("aria-valuenow");
});

it("should apply the `data-indeterminate` attribute when the `value` is `null`", async () => {
	const t = await setup({ value: null });
	await expect.element(t.root).toHaveAttribute("data-indeterminate");
});

it("should have a default value of 0", async () => {
	const t = await setup();
	await expect.element(t.root).toHaveAttribute("aria-valuenow", "0");
});

it("should have a default max of 100", async () => {
	const t = await setup();
	await expect.element(t.root).toHaveAttribute("aria-valuemax", "100");
});
