import { expect, it } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Switch } from "bits-ui";
import { getTestKbd } from "../utils.js";
import SwitchTest from "./switch-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

function setup(props: Switch.RootProps = {}) {
	const user = setupBrowserUserEvents();
	const t = render(SwitchTest, { name: "switch-input", ...props });
	const root = t.getByTestId("root").element() as HTMLElement;
	const thumb = t.getByTestId("thumb").element() as HTMLElement;
	const input = t.container.querySelector("input") as HTMLInputElement;
	return {
		root,
		thumb,
		user,
		input,
		...t,
	};
}

it("should have bits data attrs", async () => {
	const t = setup();
	expect(t.root).toHaveAttribute("data-switch-root");
	expect(t.thumb).toHaveAttribute("data-switch-thumb");
});

it('should default the value to "on", when no value prop is passed', async () => {
	const t = setup();
	expect(t.input).toHaveAttribute("value", "on");
});

it("should toggle when clicked", async () => {
	const t = setup();
	expect(t.root).toHaveAttribute("data-state", "unchecked");
	expect(t.root).not.toHaveAttribute("data-checked");
	expect(t.input.checked).toBe(false);
	await t.user.click(t.root);
	expect(t.root).toHaveAttribute("data-state", "checked");
	expect(t.root).toHaveAttribute("aria-checked", "true");
	expect(t.input.checked).toBe(true);
});

it.each([kbd.ENTER, kbd.SPACE])("should toggle when the `%s` key is pressed", async (key) => {
	const t = setup();
	expect(t.root).toHaveAttribute("data-state", "unchecked");
	expect(t.root).toHaveAttribute("aria-checked", "false");
	expect(t.input.checked).toBe(false);
	t.root.focus();
	await t.user.keyboard(key);
	expect(t.root).toHaveAttribute("data-state", "checked");
	expect(t.root).toHaveAttribute("aria-checked", "true");
	expect(t.input.checked).toBe(true);
});

it("should be disabled then the `disabled` prop is set to true", async () => {
	const t = setup({ disabled: true });
	expect(t.root).toHaveAttribute("data-disabled");
	expect(t.root).toBeDisabled();
	expect(t.input.disabled).toBe(true);
});

it("should be required then the `required` prop is set to true", async () => {
	const t = setup({ required: true });
	expect(t.root).toHaveAttribute("aria-required", "true");
	expect(t.input.required).toBe(true);
});

it("should fire the `onChange` callback when changing", async () => {
	let newValue = false;
	function onCheckedChange(next: boolean) {
		newValue = next;
	}

	const t = setup({ onCheckedChange });
	expect(newValue).toBe(false);
	await t.user.click(t.root);
	expect(newValue).toBe(true);
});

it("should respect binding to the `checked` prop", async () => {
	const t = setup();
	const binding = t.getByTestId("binding");
	expect(binding).toHaveTextContent("false");
	await t.user.click(binding);
	expect(binding).toHaveTextContent("true");
	expect(t.root).toHaveAttribute("data-state", "checked");
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
	t.root.focus();
	expect(t.root).toHaveFocus();
	await t.user.keyboard(kbd.TAB);
	expect(t.input).not.toHaveFocus();
	expect(t.input).toHaveAttribute("tabindex", "-1");
});
