import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Switch } from "bits-ui";
import { getTestKbd } from "../utils.js";
import SwitchTest from "./switch-test.svelte";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

function setup(props: Switch.RootProps = {}) {
	const t = render(SwitchTest, { name: "switch-input", ...props });
	const root = page.getByTestId("root");
	const thumb = page.getByTestId("thumb");
	const input = t.container.querySelector("input") as HTMLInputElement;
	return {
		root,
		thumb,
		input,
		...t,
	};
}

it("should have bits data attrs", async () => {
	const t = setup();
	await expect.element(t.root).toHaveAttribute("data-switch-root");
	await expect.element(t.thumb).toHaveAttribute("data-switch-thumb");
});

it('should default the value to "on", when no value prop is passed', async () => {
	const t = setup();
	expect(t.input).toHaveAttribute("value", "on");
});

it("should toggle when clicked", async () => {
	const t = setup();
	await expect.element(t.root).toHaveAttribute("data-state", "unchecked");
	await expect.element(t.root).not.toHaveAttribute("data-checked");
	expect(t.input.checked).toBe(false);
	await t.root.click();
	await expect.element(t.root).toHaveAttribute("data-state", "checked");
	await expect.element(t.root).toHaveAttribute("aria-checked", "true");
	expect(t.input.checked).toBe(true);
});

it.each([kbd.ENTER, kbd.SPACE])("should toggle when the `%s` key is pressed", async (key) => {
	const t = setup();
	await expect.element(t.root).toHaveAttribute("data-state", "unchecked");
	await expect.element(t.root).toHaveAttribute("aria-checked", "false");
	expect(t.input.checked).toBe(false);
	(t.root.element() as HTMLElement).focus();
	await userEvent.keyboard(key);
	await expect.element(t.root).toHaveAttribute("data-state", "checked");
	await expect.element(t.root).toHaveAttribute("aria-checked", "true");
	expect(t.input.checked).toBe(true);
});

it("should be disabled then the `disabled` prop is set to true", async () => {
	const t = setup({ disabled: true });
	await expect.element(t.root).toHaveAttribute("data-disabled");
	await expect.element(t.root).toBeDisabled();
	expect(t.input.disabled).toBe(true);
});

it("should be required then the `required` prop is set to true", async () => {
	const t = setup({ required: true });
	await expect.element(t.root).toHaveAttribute("aria-required", "true");
	expect(t.input.required).toBe(true);
});

it("should fire the `onChange` callback when changing", async () => {
	let newValue = false;
	function onCheckedChange(next: boolean) {
		newValue = next;
	}

	const t = setup({ onCheckedChange });
	expect(newValue).toBe(false);
	await t.root.click();
	expect(newValue).toBe(true);
});

it("should respect binding to the `checked` prop", async () => {
	const t = setup();
	const binding = page.getByTestId("binding");
	await expect.element(binding).toHaveTextContent("false");
	await binding.click();
	await expect.element(binding).toHaveTextContent("true");
	await expect.element(t.root).toHaveAttribute("data-state", "checked");
	expect(t.input.checked).toBe(true);
});

it("should not include the input when the `name` prop isn't passed/undefined", async () => {
	const t = setup({ name: undefined });
	expect(t.input).not.toBeInTheDocument();
});

it("should render the input when the `name` prop is passed", async () => {
	const t = setup();
	expect(t.input).toBeInTheDocument();
});

it("should not focus the hidden input", async () => {
	const t = setup();
	(t.root.element() as HTMLElement).focus();
	await expect.element(t.root).toHaveFocus();
	await userEvent.keyboard(kbd.TAB);
	await expect.element(t.input).not.toHaveFocus();
	await expect.element(t.input).toHaveAttribute("tabindex", "-1");
});
