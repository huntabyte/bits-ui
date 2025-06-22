import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Progress } from "bits-ui";
import ProgressTest from "./progress-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils.js";

function setup(props: Progress.RootProps = {}) {
	const user = setupBrowserUserEvents();
	const t = render(ProgressTest, { ...props });
	const root = t.getByTestId("root").element() as HTMLElement;
	return { root, user, ...t };
}

it("should have bits data attrs", async () => {
	const t = setup();
	expect(t.root).toHaveAttribute("data-progress-root");
});

it("should have role='progressbar'", async () => {
	const t = setup();
	expect(t.root).toHaveAttribute("role", "progressbar");
});

it("should forward `aria-labelledby` and `aria-valuetext`", async () => {
	const t = setup({ "aria-labelledby": "label", "aria-valuetext": "value" });
	expect(t.root).toHaveAttribute("aria-labelledby", "label");
	expect(t.root).toHaveAttribute("aria-valuetext", "value");
});

it("should respect the value prop", async () => {
	const t = setup({ value: 50 });
	expect(t.root).toHaveAttribute("aria-valuenow", "50");
});

it("should respect the max prop", async () => {
	const t = setup({ max: 20 });
	expect(t.root).toHaveAttribute("aria-valuemax", "20");
});

it("should respect the min prop", async () => {
	const t = setup({ min: 10 });
	expect(t.root).toHaveAttribute("aria-valuemin", "10");
});

it("should react to updates to the value prop", async () => {
	const t = setup();
	const binding = t.getByTestId("binding");
	expect(t.root).toHaveAttribute("aria-valuenow", "0");
	expect(binding).toHaveTextContent("0");
	await t.user.click(binding);
	expect(binding).toHaveTextContent("50");
	expect(t.root).toHaveAttribute("aria-valuenow", "50");
});

it("should not have an `aria-valuenow` attribute when the `value` is `null`", async () => {
	const t = setup({ value: null });
	expect(t.root).not.toHaveAttribute("aria-valuenow");
});

it("should apply the `data-indeterminate` attribute when the `value` is `null`", async () => {
	const t = setup({ value: null });
	expect(t.root).toHaveAttribute("data-indeterminate");
});

it("should have a default value of 0", async () => {
	const t = setup();
	expect(t.root).toHaveAttribute("aria-valuenow", "0");
});

it("should have a default max of 100", async () => {
	const t = setup();
	expect(t.root).toHaveAttribute("aria-valuemax", "100");
});
