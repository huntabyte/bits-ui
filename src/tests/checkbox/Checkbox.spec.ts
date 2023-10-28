import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import CheckboxTest from "./CheckboxTest.svelte";
import { testKbd as kbd } from "../utils.js";
import { tick } from "svelte";

describe("Checkbox", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(CheckboxTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it('defaults the value to "on", when no value prop is passed', async () => {
		const { getByTestId } = render(CheckboxTest);
		const input = getByTestId("input");
		expect(input).toHaveAttribute("value", "on");
	});

	it("can be indeterminate", async () => {
		const { getByTestId } = render(CheckboxTest, { checked: "indeterminate" });
		const root = getByTestId("root");
		const input = getByTestId("input") as HTMLInputElement;
		const indicator = getByTestId("indicator");
		expect(root).toHaveAttribute("data-state", "indeterminate");
		expect(root).toHaveAttribute("aria-checked", "mixed");
		expect(input.checked).toBe(false);
		expect(indicator).toHaveTextContent("indeterminate");
		expect(indicator).not.toHaveTextContent("true");
		expect(indicator).not.toHaveTextContent("false");
	});

	it("toggles when clicked", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest);
		const root = getByTestId("root");
		const input = getByTestId("input") as HTMLInputElement;
		const indicator = getByTestId("indicator");
		expect(root).toHaveAttribute("data-state", "unchecked");
		expect(root).toHaveAttribute("aria-checked", "false");
		expect(input.checked).toBe(false);
		expect(indicator).toHaveTextContent("false");
		expect(indicator).not.toHaveTextContent("true");
		expect(indicator).not.toHaveTextContent("indeterminate");
		await user.click(root);
		expect(root).toHaveAttribute("data-state", "checked");
		expect(root).toHaveAttribute("aria-checked", "true");
		expect(input.checked).toBe(true);
		expect(indicator).toHaveTextContent("true");
		expect(indicator).not.toHaveTextContent("false");
		expect(indicator).not.toHaveTextContent("indeterminate");
	});

	it("toggles when the `Space` key is pressed", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest);
		const root = getByTestId("root");
		const input = getByTestId("input") as HTMLInputElement;
		expect(root).toHaveAttribute("data-state", "unchecked");
		expect(root).toHaveAttribute("aria-checked", "false");
		expect(input.checked).toBe(false);
		root.focus();
		await user.keyboard(kbd.SPACE);
		expect(root).toHaveAttribute("data-state", "checked");
		expect(root).toHaveAttribute("aria-checked", "true");
		expect(input.checked).toBe(true);
	});

	it("does not toggle when the `Enter` key is pressed", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest);
		const root = getByTestId("root");
		const input = getByTestId("input") as HTMLInputElement;
		const indicator = getByTestId("indicator");
		expect(root).toHaveAttribute("data-state", "unchecked");
		expect(root).toHaveAttribute("aria-checked", "false");
		expect(input.checked).toBe(false);
		expect(indicator).toHaveTextContent("false");
		expect(indicator).not.toHaveTextContent("true");
		expect(indicator).not.toHaveTextContent("indeterminate");
		root.focus();
		await user.keyboard(kbd.ENTER);
		expect(root).not.toHaveAttribute("data-state", "checked");
		expect(root).not.toHaveAttribute("aria-checked", "true");
		expect(indicator).toHaveTextContent("false");
		expect(indicator).not.toHaveTextContent("true");
		expect(indicator).not.toHaveTextContent("indeterminate");
		expect(input.checked).toBe(false);
	});

	it("should be disabled when the `disabled` prop is passed", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest, { disabled: true });
		const root = getByTestId("root");
		const input = getByTestId("input") as HTMLInputElement;
		expect(root).toHaveAttribute("data-state", "unchecked");
		expect(root).toHaveAttribute("aria-checked", "false");
		expect(input.checked).toBe(false);
		expect(input.disabled).toBe(true);
		await user.click(root);
		expect(root).toHaveAttribute("data-state", "unchecked");
		expect(root).toHaveAttribute("aria-checked", "false");
		expect(input.checked).toBe(false);
	});

	it("should be required when the `required` prop is passed", async () => {
		const { getByTestId } = render(CheckboxTest, { required: true });
		const root = getByTestId("root");
		const input = getByTestId("input") as HTMLInputElement;
		expect(root).toHaveAttribute("aria-required", "true");
		expect(input.required).toBe(true);
	});

	it('should fire the "onChange" callback when changing', async () => {
		let newValue: boolean | "indeterminate" = false;
		function onCheckedChange(next: boolean | "indeterminate") {
			newValue = next;
		}
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest, { onCheckedChange });
		const root = getByTestId("root");
		await user.click(root);
		expect(newValue).toBe(true);
	});

	it("should respect binding the `checked` prop", async () => {
		const user = userEvent.setup();
		const { getByTestId } = render(CheckboxTest);
		const root = getByTestId("root");
		const binding = getByTestId("binding");
		expect(binding).toHaveTextContent("false");
		await user.click(root);
		await tick();
		expect(binding).toHaveTextContent("true");
	});
});
