import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import SwitchTest from "./SwitchTest.svelte";
import { testKbd as kbd } from "../utils.js";
import type { Switch } from "$lib";

function setup(props: Switch.Props = {}) {
	const user = userEvent.setup();
	const returned = render(SwitchTest, { ...props });
	const root = returned.getByTestId("root");
	const thumb = returned.getByTestId("thumb");
	return {
		root,
		thumb,
		user,
		...returned
	};
}

describe("Switch", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(SwitchTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { root, thumb } = setup();
		expect(root).toHaveAttribute("data-switch-root");
		expect(thumb).toHaveAttribute("data-switch-thumb");
	});

	it('defaults the value to "on", when no value prop is passed', async () => {
		const { getByTestId } = render(SwitchTest);
		const input = getByTestId("input");
		expect(input).toHaveAttribute("value", "on");
	});

	it("toggles when clicked", async () => {
		const { user, root, getByTestId } = setup();
		const input = getByTestId("input") as HTMLInputElement;
		expect(root).toHaveAttribute("data-state", "unchecked");
		expect(root).not.toHaveAttribute("data-checked");
		expect(input.checked).toBe(false);
		await user.click(root);
		expect(root).toHaveAttribute("data-state", "checked");
		expect(root).toHaveAttribute("aria-checked", "true");
		expect(input.checked).toBe(true);
	});

	it.each([kbd.ENTER, kbd.SPACE])("toggles when the `%s` key is pressed", async (key) => {
		const { user, root, getByTestId } = setup();
		const input = getByTestId("input") as HTMLInputElement;
		expect(root).toHaveAttribute("data-state", "unchecked");
		expect(root).toHaveAttribute("aria-checked", "false");
		expect(root).not.toHaveAttribute("data-checked");
		expect(input.checked).toBe(false);
		root.focus();
		await user.keyboard(key);
		expect(root).toHaveAttribute("data-state", "checked");
		expect(root).toHaveAttribute("aria-checked", "true");
		expect(root).toHaveAttribute("data-checked");
		expect(input.checked).toBe(true);
	});

	it("should be disabled then the `disabled` prop is set to true", async () => {
		const { root, getByTestId } = setup({ disabled: true });
		const input = getByTestId("input") as HTMLInputElement;
		expect(root).toHaveAttribute("data-disabled");
		expect(root).toBeDisabled();
		expect(input.disabled).toBe(true);
	});

	it("should be required then the `required` prop is set to true", async () => {
		const { root, getByTestId } = setup({ required: true });
		const input = getByTestId("input") as HTMLInputElement;
		expect(root).toHaveAttribute("aria-required", "true");
		expect(input.required).toBe(true);
	});

	it("should fire the `onChange` callback when changing", async () => {
		let newValue = false;
		function onCheckedChange(next: boolean) {
			newValue = next;
		}

		const { user, root } = setup({ onCheckedChange });
		expect(newValue).toBe(false);
		await user.click(root);
		expect(newValue).toBe(true);
	});

	it("respects binding to the `checked` prop", async () => {
		const { getByTestId, user, root } = setup();
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.click(binding);
		expect(binding).toHaveTextContent("true");
		expect(root).toHaveAttribute("data-state", "checked");
		const input = getByTestId("input") as HTMLInputElement;
		expect(input.checked).toBe(true);
	});

	it("doesnt include the input when `includeInput` prop is set to false", async () => {
		const { getByTestId } = setup({ includeInput: false });
		expect(() => getByTestId("input")).toThrow();
	});

	it.todo("`asChild` behavior");
});
