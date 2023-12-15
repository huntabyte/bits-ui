import { render, waitFor } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import { testKbd as kbd } from "../utils.js";
import type { PinInput } from "$lib";
import PinInputTest from "./PinInputTest.svelte";

function setup(props: PinInput.Props = {}) {
	const user = userEvent.setup();
	const returned = render(PinInputTest, { ...props });
	const root = returned.getByTestId("root");
	const input1 = returned.getByTestId("input-1");
	const input2 = returned.getByTestId("input-2");
	const input3 = returned.getByTestId("input-3");
	const input4 = returned.getByTestId("input-4");
	const input5 = returned.getByTestId("input-5");
	const hiddenInput = returned.getByTestId("hidden-input");
	const binding = returned.getByTestId("binding");
	return {
		user,
		root,
		input1,
		input2,
		input3,
		input4,
		input5,
		hiddenInput,
		binding,
		...returned
	};
}

describe("PIN Input", () => {
	it("has no accessibility violations", async () => {
		const { container } = render(PinInputTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("has bits data attrs", async () => {
		const { root, input1, input2, input3, input4, input5, hiddenInput } = setup();
		expect(root).toHaveAttribute("data-pin-input-root");
		expect(input1).toHaveAttribute("data-pin-input-input");
		expect(input2).toHaveAttribute("data-pin-input-input");
		expect(input3).toHaveAttribute("data-pin-input-input");
		expect(input4).toHaveAttribute("data-pin-input-input");
		expect(input5).toHaveAttribute("data-pin-input-input");
		expect(hiddenInput).toHaveAttribute("data-pin-input-hidden-input");
	});

	it("doesn't display the hidden input", async () => {
		const { hiddenInput } = setup();
		expect(hiddenInput).not.toBeVisible();
	});

	it("syncs the `name` prop to the hidden input", async () => {
		const { hiddenInput } = setup({ name: "test" });
		expect(hiddenInput).toHaveAttribute("name", "test");
	});

	it("syncs the `value` prop to the hidden input", async () => {
		const value = ["1", "2", "3", "4", "5"];
		const valueStr = value.join("");
		const { hiddenInput } = setup({ value });
		expect(hiddenInput).toHaveValue(valueStr);
	});

	it("syncs the `disabled` prop to the hidden input", async () => {
		const { hiddenInput } = setup({ disabled: true });
		await waitFor(() => expect(hiddenInput).toHaveAttribute("disabled", ""));
	});

	it("respects binding to the `value` prop", async () => {
		const { hiddenInput, binding, user } = setup({
			value: ["1", "2", "3", "4", "5"]
		});
		expect(hiddenInput).toHaveValue("12345");
		expect(binding).toHaveTextContent("1,2,3,4,5");
		await user.click(binding);
		expect(hiddenInput).toHaveValue("01134");
		expect(binding).toHaveTextContent("0,1,1,3,4");
	});

	it("inputs should fire the `onChange` callback when changing", async () => {
		let newValue = undefined;
		function onValueChange(next: string[] | undefined) {
			newValue = next;
		}

		const { user, input3 } = setup({
			value: ["1", "2", "3", "4", "5"],
			onValueChange: onValueChange
		});

		input3.focus();
		await user.type(input3, "6");
		expect(newValue).toStrictEqual(["1", "2", "6", "4", "5"]);
	});

	it("inputs should be disabled when the `disabled` prop is set to true", async () => {
		const { input1, input2, input3, input4, input5 } = setup({ disabled: true });
		expect(input1).toBeDisabled();
		expect(input2).toBeDisabled();
		expect(input3).toBeDisabled();
		expect(input4).toBeDisabled();
		expect(input5).toBeDisabled();
	});

	it("navigates between the inputs using the arrow keys", async () => {
		const { user, input1, input2, input3, input4, input5 } = setup();
		input1.focus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(input2).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(input3).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(input4).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(input5).toHaveFocus();
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(input5).toHaveFocus();
		await user.keyboard(kbd.ARROW_LEFT);
		expect(input4).toHaveFocus();
	});

	it("navigates to the next input when typing", async () => {
		const { user, input1, input2, input3, input4, input5, hiddenInput } = setup();
		input1.focus();
		await user.type(input1, "1");
		expect(input2).toHaveFocus();
		await user.type(input2, "2");
		expect(input3).toHaveFocus();
		await user.type(input3, "3");
		expect(input4).toHaveFocus();
		await user.type(input4, "4");
		expect(input5).toHaveFocus();
		await user.type(input5, "5");
		expect(input5).toHaveFocus();
		await user.type(input5, "5");
		expect(input5).toHaveFocus();
		expect(hiddenInput).toHaveValue("12345");
	});

	it("deletes current input when pressing delete", async () => {
		const { user, input1, input2, input3, input4, input5, hiddenInput } = setup({
			value: ["1", "2", "3", "4", "5"]
		});
		expect(hiddenInput).toHaveValue("12345");
		input1.focus();
		expect(input1).toHaveValue("1");
		await user.keyboard(kbd.DELETE);
		expect(input1).toHaveValue("");
		expect(input1).toHaveFocus();
		expect(hiddenInput).toHaveValue("2345");
		input2.focus();
		expect(input2).toHaveValue("2");
		await user.keyboard(kbd.DELETE);
		expect(input2).toHaveValue("");
		expect(input2).toHaveFocus();
		expect(hiddenInput).toHaveValue("345");
		input3.focus();
		expect(input3).toHaveValue("3");
		await user.keyboard(kbd.DELETE);
		expect(input3).toHaveValue("");
		expect(input3).toHaveFocus();
		expect(hiddenInput).toHaveValue("45");
		input4.focus();
		expect(input4).toHaveValue("4");
		await user.keyboard(kbd.DELETE);
		expect(input4).toHaveValue("");
		expect(input4).toHaveFocus();
		expect(hiddenInput).toHaveValue("5");
		input5.focus();
		expect(input5).toHaveValue("5");
		await user.keyboard(kbd.DELETE);
		expect(input5).toHaveValue("");
		expect(input5).toHaveFocus();
		expect(hiddenInput).toHaveValue("");
	});

	it("deletes current input when pressing backspace, if empty moves to previous input and deletes that value as well.", async () => {
		const { user, input1, input2, input3, input4, input5, hiddenInput } = setup({
			value: ["1", "2", "3", "4", "5"]
		});
		expect(hiddenInput).toHaveValue("12345");
		input5.focus();
		expect(input5).toHaveValue("5");
		await user.keyboard(kbd.BACKSPACE);
		expect(input5).toHaveValue("");
		expect(input5).toHaveFocus();
		expect(input4).toHaveValue("4");
		await user.keyboard(kbd.BACKSPACE);
		expect(input4).toHaveValue("");
		expect(input4).toHaveFocus();
		expect(input3).toHaveValue("3");
		await user.keyboard(kbd.BACKSPACE);
		expect(input3).toHaveValue("");
		expect(input3).toHaveFocus();
		expect(input2).toHaveValue("2");
		await user.keyboard(kbd.BACKSPACE);
		expect(input2).toHaveValue("");
		expect(input2).toHaveFocus();
		expect(input1).toHaveValue("1");
		await user.keyboard(kbd.BACKSPACE);
		expect(input1).toHaveValue("");
		expect(input1).toHaveFocus();
		expect(hiddenInput).toHaveValue("");
	});

	it.todo("`asChild` behavior");
});
