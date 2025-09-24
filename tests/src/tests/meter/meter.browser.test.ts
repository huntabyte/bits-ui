import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Meter } from "bits-ui";
import MeterTest from "./meter-test.svelte";
import { page } from "@vitest/browser/context";

function setup(props: Meter.RootProps = {}) {
	render(MeterTest, { ...props });
	const root = page.getByTestId("root");
	return { root };
}

it("should have bits data attrs", async () => {
	const t = setup();
	await expect.element(t.root).toHaveAttribute("data-meter-root");
});

it("should have role='meter'", async () => {
	const t = setup();
	await expect.element(t.root).toHaveAttribute("role", "meter");
});

it("should forward `aria-labelledby` and `aria-valuetext`", async () => {
	const t = setup({ "aria-labelledby": "label", "aria-valuetext": "value" });
	await expect.element(t.root).toHaveAttribute("aria-labelledby", "label");
	await expect.element(t.root).toHaveAttribute("aria-valuetext", "value");
});

it("should respect the value prop", async () => {
	const t = setup({ value: 50 });
	await expect.element(t.root).toHaveAttribute("aria-valuenow", "50");
});

it("should respect the max prop", async () => {
	const t = setup({ max: 20 });
	await expect.element(t.root).toHaveAttribute("aria-valuemax", "20");
});

it("should respect the min prop", async () => {
	const t = setup({ min: 10 });
	await expect.element(t.root).toHaveAttribute("aria-valuemin", "10");
});

it("should react to updates to the value prop", async () => {
	const t = setup();
	const binding = page.getByTestId("binding");
	await expect.element(t.root).toHaveAttribute("aria-valuenow", "0");
	await expect.element(binding).toHaveTextContent("0");
	await binding.click();
	await expect.element(binding).toHaveTextContent("50");
	await expect.element(t.root).toHaveAttribute("aria-valuenow", "50");
});

it("should have a default value of 0", async () => {
	const t = setup();
	await expect.element(t.root).toHaveAttribute("aria-valuenow", "0");
});

it("should have a default max of 100", async () => {
	const t = setup();
	await expect.element(t.root).toHaveAttribute("aria-valuemax", "100");
});
