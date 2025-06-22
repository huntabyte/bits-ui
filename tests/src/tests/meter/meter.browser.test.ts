import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Meter } from "bits-ui";
import MeterTest from "./meter-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";

function setup(props: Meter.RootProps = {}) {
	const user = setupBrowserUserEvents();
	const returned = render(MeterTest, { ...props });
	const { getByTestId } = returned;
	const root = getByTestId("root");
	return { root, user, ...returned };
}

it("should have bits data attrs", async () => {
	const { root } = setup();
	expect(root).toHaveAttribute("data-meter-root");
});

it("should have role='meter'", async () => {
	const { root } = setup();
	expect(root).toHaveAttribute("role", "meter");
});

it("should forward `aria-labelledby` and `aria-valuetext`", async () => {
	const { root } = setup({ "aria-labelledby": "label", "aria-valuetext": "value" });
	expect(root).toHaveAttribute("aria-labelledby", "label");
	expect(root).toHaveAttribute("aria-valuetext", "value");
});

it("should respect the value prop", async () => {
	const { root } = setup({ value: 50 });
	expect(root).toHaveAttribute("aria-valuenow", "50");
});

it("should respect the max prop", async () => {
	const { root } = setup({ max: 20 });
	expect(root).toHaveAttribute("aria-valuemax", "20");
});

it("should respect the min prop", async () => {
	const { root } = setup({ min: 10 });
	expect(root).toHaveAttribute("aria-valuemin", "10");
});

it("should react to updates to the value prop", async () => {
	const t = setup();
	const root = t.getByTestId("root");
	const binding = t.getByTestId("binding");
	expect(root).toHaveAttribute("aria-valuenow", "0");
	expect(binding).toHaveTextContent("0");
	await t.user.click(binding);
	expect(binding).toHaveTextContent("50");
	expect(root).toHaveAttribute("aria-valuenow", "50");
});

it("should have a default value of 0", async () => {
	const t = setup();
	expect(t.getByTestId("root")).toHaveAttribute("aria-valuenow", "0");
});

it("should have a default max of 100", async () => {
	const t = setup();
	expect(t.getByTestId("root")).toHaveAttribute("aria-valuemax", "100");
});
