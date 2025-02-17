import { render } from "@testing-library/svelte/svelte5";
import { userEvent } from "@testing-library/user-event";
import { axe } from "jest-axe";
import { it } from "vitest";
import type { Progress } from "bits-ui";
import ProgressTest from "./progress-test.svelte";

function setup(props: Progress.RootProps = {}) {
	const user = userEvent.setup();
	const returned = render(ProgressTest, { ...props });
	const { getByTestId } = returned;
	const root = getByTestId("root");
	return { root, user, ...returned };
}

it("should have no accessibility violations", async () => {
	const { container } = render(ProgressTest);
	expect(await axe(container)).toHaveNoViolations();
});

it("should have bits data attrs", async () => {
	const { root } = setup();
	expect(root).toHaveAttribute("data-progress-root");
});

it("should have role='progressbar'", async () => {
	const { root } = setup();
	expect(root).toHaveAttribute("role", "progressbar");
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
	const { user, getByTestId } = setup();
	const root = getByTestId("root");
	const binding = getByTestId("binding");
	expect(root).toHaveAttribute("aria-valuenow", "0");
	expect(binding).toHaveTextContent("0");
	await user.click(binding);
	expect(binding).toHaveTextContent("50");
	expect(root).toHaveAttribute("aria-valuenow", "50");
});

it("should not have an `aria-valuenow` attribute when the `value` is `null`", async () => {
	const { root } = setup({ value: null });
	expect(root).not.toHaveAttribute("aria-valuenow");
});

it("should apply the `data-indeterminate` attribute when the `value` is `null`", async () => {
	const { root } = setup({ value: null });
	expect(root).toHaveAttribute("data-indeterminate");
});

it("should have a default value of 0", async () => {
	const { root } = setup();
	expect(root).toHaveAttribute("aria-valuenow", "0");
});

it("should have a default max of 100", async () => {
	const { root } = setup();
	expect(root).toHaveAttribute("aria-valuemax", "100");
});
