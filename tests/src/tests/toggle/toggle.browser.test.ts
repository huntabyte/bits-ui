import { expect, it, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import type { Toggle } from "bits-ui";
import { getTestKbd } from "../utils.js";
import ToggleTest from "./toggle-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

function setup(props: Toggle.RootProps = {}) {
	const user = setupBrowserUserEvents();
	const returned = render(ToggleTest, { ...props });
	const root = returned.getByTestId("root").element() as HTMLElement;
	return {
		root,
		user,
		...returned,
	};
}

describe("toggle", () => {
	it("should have bits data attrs", async () => {
		const t = setup();
		expect(t.root).toHaveAttribute("data-toggle-root");
	});

	it("should toggle when clicked", async () => {
		const t = setup();
		expect(t.root).toHaveAttribute("data-state", "off");
		expect(t.root).toHaveAttribute("aria-pressed", "false");
		await t.user.click(t.root);
		expect(t.root).toHaveAttribute("data-state", "on");
		expect(t.root).toHaveAttribute("aria-pressed", "true");
	});

	it.each([kbd.ENTER, kbd.SPACE])("should toggle when the `%s` key is pressed", async (key) => {
		const t = setup();
		expect(t.root).toHaveAttribute("data-state", "off");
		expect(t.root).toHaveAttribute("aria-pressed", "false");
		t.root.focus();
		await t.user.keyboard(key);
		expect(t.root).toHaveAttribute("data-state", "on");
		expect(t.root).toHaveAttribute("aria-pressed", "true");
	});

	it("should be disabled then the `disabled` prop is set to true", async () => {
		const t = setup({ disabled: true });
		expect(t.root).toHaveAttribute("data-disabled");
		expect(t.root).toBeDisabled();
	});

	it("should fire the `onChange` callback when changing", async () => {
		let newValue = false;
		function onPressedChange(next: boolean) {
			newValue = next;
		}

		const t = setup({ onPressedChange });
		expect(newValue).toBe(false);
		await t.user.click(t.root);
		expect(newValue).toBe(true);
	});

	it("should respect binding to the `pressed` prop", async () => {
		const t = setup();
		const binding = t.getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await t.user.click(binding);
		expect(binding).toHaveTextContent("true");
		expect(t.root).toHaveAttribute("data-state", "on");
	});
});
