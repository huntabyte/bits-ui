import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Toggle } from "bits-ui";
import { getTestKbd } from "../utils.js";
import ToggleTest from "./toggle-test.svelte";
import { page, userEvent } from "@vitest/browser/context";

const kbd = getTestKbd();

function setup(props: Toggle.RootProps = {}) {
	render(ToggleTest, { ...props });
	const root = page.getByTestId("root");
	return {
		root,
	};
}

describe("toggle", () => {
	it("should have bits data attrs", async () => {
		const t = setup();
		await expect.element(t.root).toHaveAttribute("data-toggle-root");
	});

	it("should toggle when clicked", async () => {
		const t = setup();
		await expect.element(t.root).toHaveAttribute("data-state", "off");
		await expect.element(t.root).toHaveAttribute("aria-pressed", "false");
		await userEvent.click(t.root);
		await expect.element(t.root).toHaveAttribute("data-state", "on");
		await expect.element(t.root).toHaveAttribute("aria-pressed", "true");
	});

	it.each([kbd.ENTER, kbd.SPACE])("should toggle when the `%s` key is pressed", async (key) => {
		const t = setup();
		await expect.element(t.root).toHaveAttribute("data-state", "off");
		await expect.element(t.root).toHaveAttribute("aria-pressed", "false");
		(t.root.element() as HTMLElement).focus();
		await userEvent.keyboard(key);
		await expect.element(t.root).toHaveAttribute("data-state", "on");
		await expect.element(t.root).toHaveAttribute("aria-pressed", "true");
	});

	it("should be disabled then the `disabled` prop is set to true", async () => {
		const t = setup({ disabled: true });
		await expect.element(t.root).toHaveAttribute("data-disabled");
		await expect.element(t.root).toBeDisabled();
	});

	it("should fire the `onChange` callback when changing", async () => {
		let newValue = false;
		function onPressedChange(next: boolean) {
			newValue = next;
		}

		const t = setup({ onPressedChange });
		expect(newValue).toBe(false);
		await t.root.click();
		expect(newValue).toBe(true);
	});

	it("should respect binding to the `pressed` prop", async () => {
		const t = setup();
		const binding = page.getByTestId("binding");
		await expect.element(binding).toHaveTextContent("false");
		await binding.click();
		await expect.element(binding).toHaveTextContent("true");
		await expect.element(t.root).toHaveAttribute("data-state", "on");
	});
});
