import { page, userEvent, type Locator } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { type ComponentProps, tick } from "svelte";
import { getTestKbd } from "../utils.js";
import CheckboxTest from "./checkbox-test.svelte";
import CheckboxGroupTest from "./checkbox-group-test.svelte";
import { expectExists, expectNotExists } from "../browser-utils";

const kbd = getTestKbd();

const groupItems = ["a", "b", "c", "d"];

function setup(props?: ComponentProps<typeof CheckboxTest>) {
	const returned = render(CheckboxTest, props);
	const root = page.getByTestId("root");
	return { ...returned, root };
}

function setupGroup(props: ComponentProps<typeof CheckboxGroupTest> = {}) {
	const items = props.items ?? groupItems;
	const returned = render(CheckboxGroupTest, { ...props, items });
	const group = page.getByTestId("group");
	const groupLabel = page.getByTestId("group-label");
	const submit = page.getByTestId("submit");
	const binding = page.getByTestId("binding");
	const updateBtn = page.getByTestId("update");

	const getCheckbox = (v: string) => page.getByTestId(`${v}-checkbox`);
	const getIndicator = (v: string) => page.getByTestId(`${v}-indicator`);
	const checkboxes = items.map((v) => getCheckbox(v));
	const indicators = items.map((v) => getIndicator(v));

	return {
		...returned,
		group,
		groupLabel,
		getCheckbox,
		getIndicator,
		checkboxes,
		indicators,
		submit,
		binding,
		updateBtn,
	};
}

async function expectChecked(...locs: Locator[]) {
	for (const n of locs) {
		await expect.element(n).toHaveAttribute("data-state", "checked");
		await expect.element(n).toHaveAttribute("aria-checked", "true");
	}
}

async function expectUnchecked(...locs: Locator[]) {
	for (const n of locs) {
		await expect.element(n).toHaveAttribute("data-state", "unchecked");
		await expect.element(n).toHaveAttribute("aria-checked", "false");
	}
}

function getHiddenInput() {
	return page.getByRole("checkbox", { includeHidden: true }).nth(1);
}

describe("Single Checkbox", () => {
	describe("Accessibility and Structure", () => {
		it("should have bits data attrs", async () => {
			const t = setup();
			await expect.element(t.root).toHaveAttribute("data-checkbox-root");
		});

		it("should not render the checkbox input if a name prop isn't passed", async () => {
			setup({ name: "" });
			await expectNotExists(getHiddenInput());
		});

		it("should render the checkbox input if a name prop is passed", async () => {
			setup({ name: "checkbox" });
			await expectExists(getHiddenInput());
			await expect.element(getHiddenInput()).toHaveAttribute("type", "checkbox");
		});

		it("should not have input as part of tab order", async () => {
			setup({ name: "abc" });
			await expect.element(getHiddenInput()).toHaveAttribute("tabindex", "-1");
		});

		it('should default the value to "on" when no value prop is passed', async () => {
			setup({ name: "hello" });

			await expect.element(getHiddenInput()).toHaveAttribute("value");
		});
	});

	describe("State and Interaction", () => {
		it("should be able to be indeterminate", async () => {
			const t = setup({ indeterminate: true });
			const indicator = page.getByTestId("indicator");
			await expect.element(t.root).toHaveAttribute("data-state", "indeterminate");
			await expect.element(t.root).toHaveAttribute("aria-checked", "mixed");
			await expect.element(page.getByRole("checkbox")).not.toBeChecked();
			await expect.element(indicator).toHaveTextContent("indeterminate");
			await expect.element(indicator).not.toHaveTextContent("true");
			await expect.element(indicator).not.toHaveTextContent("false");
		});

		it("should toggle when clicked", async () => {
			const t = setup();
			const indicator = page.getByTestId("indicator");
			await expectUnchecked(t.root);
			await expect.element(page.getByRole("checkbox")).not.toBeChecked();
			await expect.element(indicator).toHaveTextContent("false");
			await expect.element(indicator).not.toHaveTextContent("true");
			await expect.element(indicator).not.toHaveTextContent("indeterminate");
			await t.root.click();
			await expectChecked(t.root);
			await expect.element(page.getByRole("checkbox")).toBeChecked();
			await expect.element(indicator).toHaveTextContent("true");
			await expect.element(indicator).not.toHaveTextContent("false");
			await expect.element(indicator).not.toHaveTextContent("indeterminate");
		});

		it("should toggle when the `Space` key is pressed", async () => {
			const t = setup();
			await expectUnchecked(t.root);
			await expect.element(page.getByRole("checkbox")).not.toBeChecked();
			(t.root.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.SPACE);
			await expectChecked(t.root);
			await expect.element(page.getByRole("checkbox")).toBeChecked();
		});

		it("should not toggle when the `Enter` key is pressed", async () => {
			const t = setup();
			const indicator = page.getByTestId("indicator");
			await expectUnchecked(t.root);
			await expect.element(page.getByRole("checkbox")).not.toBeChecked();
			await expect.element(indicator).toHaveTextContent("false");
			await expect.element(indicator).not.toHaveTextContent("true");
			await expect.element(indicator).not.toHaveTextContent("indeterminate");
			(t.root.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ENTER);
			await expectUnchecked(t.root);
			await expect.element(indicator).toHaveTextContent("false");
			await expect.element(indicator).not.toHaveTextContent("true");
			await expect.element(indicator).not.toHaveTextContent("indeterminate");
			await expect.element(page.getByRole("checkbox")).not.toBeChecked();
		});

		it("should submit the form when the `Enter` key is pressed with type='submit'", async () => {
			let submittedValues: FormDataEntryValue[] | undefined;
			const t = setup({
				type: "submit",
				onFormSubmit: (fd: FormData) => {
					submittedValues = fd.getAll("terms");
				},
			});
			await t.root.click();
			await expectChecked(t.root);
			(t.root.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ENTER);
			expect(submittedValues).toEqual(["on"]);
			await expectChecked(t.root);
		});

		it("should not toggle or submit the form when `Enter` is pressed on a checkbox with type='button'", async () => {
			let submittedValues: FormDataEntryValue[] | undefined;
			const t = setup({
				type: "button",
				onFormSubmit: (fd: FormData) => {
					submittedValues = fd.getAll("terms");
				},
			});
			await t.root.click();
			await expectChecked(t.root);
			(t.root.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ENTER);
			expect(submittedValues).toBeUndefined();
			await expectChecked(t.root);
		});
	});

	describe("Props and Events", () => {
		it("should be disabled when the `disabled` prop is passed", async () => {
			const t = setup({ disabled: true });
			await expectUnchecked(t.root);
			await expect.element(page.getByRole("checkbox")).toBeDisabled();
			await userEvent.click(t.root, { force: true });
			await expectUnchecked(t.root);
			await expect.element(t.root).toBeDisabled();
			await expect.element(page.getByRole("checkbox")).toBeDisabled();
		});

		it("should be required when the `required` prop is passed", async () => {
			const t = setup({ required: true, name: "checkbox" });
			await expect.element(t.root).toHaveAttribute("aria-required", "true");
			await expect.element(page.getByRole("checkbox")).toBeRequired();
		});

		it('should fire the "onCheckedChange" callback when changing', async () => {
			const mock = vi.fn();
			const t = setup({ onCheckedChange: mock });
			await t.root.click();
			expect(mock).toHaveBeenCalledWith(true);
			await t.root.click();
			expect(mock).toHaveBeenCalledWith(false);
		});

		it("should fire the 'onIndeterminateChange' callback when changing from indeterminate", async () => {
			const mock = vi.fn();
			const t = setup({ onIndeterminateChange: mock, indeterminate: true });
			await t.root.click();
			expect(mock).toHaveBeenCalledWith(false);
		});

		it("should respect binding the `checked` prop", async () => {
			const t = setup();
			const binding = page.getByTestId("binding");
			await expect.element(binding).toHaveTextContent("false");
			await t.root.click();
			await expect.element(binding).toHaveTextContent("true");
		});

		it("should be readonly when the `readonly` prop is passed", async () => {
			const t = setup({ readonly: true, name: "checkbox" });
			const indicator = page.getByTestId("indicator");

			// Should have proper attributes
			await expect.element(t.root).toHaveAttribute("aria-readonly", "true");
			await expect.element(t.root).toHaveAttribute("data-readonly", "");
			await expect.element(getHiddenInput()).toHaveAttribute("readonly");

			// Should not toggle when clicked
			await expectUnchecked(t.root);
			await expect.element(indicator).toHaveTextContent("false");
			await t.root.click();
			await expectUnchecked(t.root);
			await expect.element(indicator).toHaveTextContent("false");
			await expect.element(page.getByRole("checkbox")).not.toBeChecked();
		});

		it("should not toggle when readonly and `Space` key is pressed", async () => {
			const t = setup({ readonly: true });
			const indicator = page.getByTestId("indicator");

			await expectUnchecked(t.root);
			await expect.element(indicator).toHaveTextContent("false");
			(t.root.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.SPACE);
			await expectUnchecked(t.root);
			await expect.element(indicator).toHaveTextContent("false");
			await expect.element(page.getByRole("checkbox")).not.toBeChecked();
		});

		it("should still be focusable when readonly", async () => {
			const t = setup({ readonly: true });
			(t.root.element() as HTMLElement).focus();
			await expect.element(t.root).toHaveFocus();
		});

		it("should not fire onCheckedChange callback when readonly", async () => {
			const mock = vi.fn();
			const t = setup({ readonly: true, onCheckedChange: mock });
			await t.root.click();
			expect(mock).not.toHaveBeenCalled();

			(t.root.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.SPACE);
			expect(mock).not.toHaveBeenCalled();
		});
	});
});

describe("Checkbox Group", () => {
	describe("Accessibility and Structure", () => {
		it("should have bits data attrs", async () => {
			const t = setupGroup();
			await expect.element(t.group).toHaveAttribute("data-checkbox-group");
			await expect.element(t.groupLabel).toHaveAttribute("data-checkbox-group-label");
		});
	});

	describe("Value Handling", () => {
		it("should handle default values appropriately", async () => {
			const t = setupGroup({ value: ["a", "b"] });
			const [a, b, c, d] = t.checkboxes;
			await expectChecked(a, b);
			await expectUnchecked(c, d);
			await a.click();
			await expectUnchecked(a);
			await d.click();
			await expectChecked(d);
		});

		it("should submit the form data correctly using the checkbox values and group name", async () => {
			let submittedValues: string[] | undefined;
			const t = setupGroup({
				name: "myGroup",
				onFormSubmit: (fd: FormData) => {
					submittedValues = fd.getAll("myGroup") as string[];
				},
			});
			const [a, b] = t.checkboxes;
			await a.click();
			await expectChecked(a);
			await t.submit.click();
			expect(submittedValues).toEqual(["a"]);
			await b.click();
			await t.submit.click();
			expect(submittedValues).toEqual(["a", "b"]);
		});

		it("should submit the form when `Enter` is pressed on a checkbox with type='submit'", async () => {
			let submittedValues: string[] | undefined;
			const t = setupGroup({
				name: "myGroup",
				type: "submit",
				onFormSubmit: (fd: FormData) => {
					submittedValues = fd.getAll("myGroup") as string[];
				},
			});
			const [a] = t.checkboxes;
			await a.click();
			await expectChecked(a);
			(a.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ENTER);
			expect(submittedValues).toEqual(["a"]);
			await expectChecked(a);
		});

		it("should not toggle or submit the form when `Enter` is pressed on a checkbox with default type", async () => {
			let submittedValues: string[] | undefined;
			const t = setupGroup({
				name: "myGroup",
				onFormSubmit: (fd: FormData) => {
					submittedValues = fd.getAll("myGroup") as string[];
				},
			});
			const [a] = t.checkboxes;
			await a.click();
			await expectChecked(a);
			(a.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.ENTER);
			expect(submittedValues).toBeUndefined();
			await expectChecked(a);
		});

		it("should handle binding value", async () => {
			const t = setupGroup();
			const [a, b, _, d] = t.checkboxes;
			await expect.element(t.binding).toHaveTextContent("");
			await a.click();
			await expect.element(t.binding).toHaveTextContent("a");
			await b.click();
			await expect.element(t.binding).toHaveTextContent("a,b");
			await a.click();
			await expect.element(t.binding).toHaveTextContent("b");
			await d.click();
			await expect.element(t.binding).toHaveTextContent("b,d");
		});

		it("should handle function binding", async () => {
			const setMock = vi.fn();
			const getMock = vi.fn();
			const t = setupGroup({ getValue: getMock, setValue: setMock, value: [] });
			const [a, b, _, d] = t.checkboxes;
			await a.click();
			expect(setMock).toHaveBeenCalledWith(["a"]);
			setMock.mockClear();
			await b.click();
			expect(setMock).toHaveBeenCalledWith(["a", "b"]);
			setMock.mockClear();
			await d.click();
			expect(setMock).toHaveBeenCalledWith(["a", "b", "d"]);
			setMock.mockClear();
			await a.click();
			expect(setMock).toHaveBeenCalledWith(["b", "d"]);
		});

		it("should handle programmatic value changes", async () => {
			const t = setupGroup({ value: ["a", "b"] });
			const [a, b, c, d] = t.checkboxes;
			await tick();
			await expectChecked(a, b);
			await t.updateBtn.click();
			await expectUnchecked(a, b);
			await expectChecked(c, d);
		});

		it("should call the `onValueChange` callback when the value changes", async () => {
			const mock = vi.fn();
			const t = setupGroup({ onValueChange: mock });
			const [a, b] = t.checkboxes;
			await a.click();
			expect(mock).toHaveBeenCalledWith(["a"]);
			await b.click();
			expect(mock).toHaveBeenCalledWith(["a", "b"]);
			await a.click();
			expect(mock).toHaveBeenCalledWith(["b"]);
			await b.click();
			expect(mock).toHaveBeenCalledWith([]);
		});

		it("should only call the `onValueChange` callback once when the value changes", async () => {
			const mock = vi.fn();
			const t = setupGroup({ onValueChange: mock });
			const [a, b] = t.checkboxes;
			await a.click();
			expect(mock).toHaveBeenCalledExactlyOnceWith(["a"]);
			mock.mockClear();
			await b.click();
			expect(mock).toHaveBeenCalledExactlyOnceWith(["a", "b"]);
			mock.mockClear();
			await a.click();
			expect(mock).toHaveBeenCalledExactlyOnceWith(["b"]);
		});
	});

	describe("Props and State Propagation", () => {
		it("should propagate disabled state to children checkboxes", async () => {
			const t = setupGroup({ disabled: true, required: true });
			for (const checkbox of t.checkboxes) {
				await expect.element(checkbox).toBeDisabled();
				await expect.element(checkbox).toHaveAttribute("aria-required", "true");
			}
		});

		it("should allow disabling a single item in the group", async () => {
			const t = setupGroup({ disabledItems: ["a"] });
			const [a, ...rest] = t.checkboxes;
			await expect.element(a).toBeDisabled();
			for (const checkbox of rest) {
				await expect.element(checkbox).not.toBeDisabled();
			}
		});
	});

	describe("Readonly Behavior", () => {
		it("should propagate readonly state to children checkboxes", async () => {
			const t = setupGroup({ readonly: true });
			for (const checkbox of t.checkboxes) {
				await expect.element(checkbox).toHaveAttribute("aria-readonly", "true");
				await expect.element(checkbox).toHaveAttribute("data-readonly", "");
			}
		});

		it("should prevent interaction with all checkboxes when group is readonly", async () => {
			const t = setupGroup({ readonly: true, value: [] });
			const [a, b] = t.checkboxes;

			// Should not toggle when clicked
			await expectUnchecked(a, b);
			await a.click();
			await expectUnchecked(a);
			await b.click();
			await expectUnchecked(b);

			// Should not change value binding
			await expect.element(t.binding).toHaveTextContent("");
		});

		it("should prevent keyboard interaction when group is readonly", async () => {
			const t = setupGroup({ readonly: true, value: [] });
			const [a, b] = t.checkboxes;

			await expectUnchecked(a, b);
			(a.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.SPACE);
			await expectUnchecked(a);

			(b.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.SPACE);
			await expectUnchecked(b);

			await expect.element(t.binding).toHaveTextContent("");
		});

		it("should not call onValueChange callback when group is readonly", async () => {
			const mock = vi.fn();
			const t = setupGroup({ readonly: true, onValueChange: mock });
			const [a, b] = t.checkboxes;

			await a.click();
			await b.click();
			(a.element() as HTMLElement).focus();
			await userEvent.keyboard(kbd.SPACE);

			expect(mock).not.toHaveBeenCalled();
		});

		it("should still allow checkboxes to be focusable when group is readonly", async () => {
			const t = setupGroup({ readonly: true });
			const [a, b] = t.checkboxes;

			(a.element() as HTMLElement).focus();
			await expect.element(a).toHaveFocus();
			(b.element() as HTMLElement).focus();
			await expect.element(b).toHaveFocus();
		});

		it("should handle individual checkbox readonly with non-readonly group", async () => {
			const t = setupGroup({ readonlyItems: ["a"] });
			const [a, b, c] = t.checkboxes;

			// Only 'a' should be readonly
			await expect.element(a).toHaveAttribute("aria-readonly", "true");
			await expect.element(a).toHaveAttribute("data-readonly", "");
			await expect.element(b).not.toHaveAttribute("aria-readonly", "true");
			await expect.element(c).not.toHaveAttribute("aria-readonly", "true");

			// 'a' should not be interactive
			await a.click();
			await expectUnchecked(a);

			// 'b' and 'c' should be interactive
			await b.click();
			await expectChecked(b);
			await c.click();
			await expectChecked(c);
		});

		it("should preserve existing checked state when becoming readonly", async () => {
			const t = setupGroup({ value: ["a", "b"] });
			const [a, b, c] = t.checkboxes;

			// Initially some items are checked
			await expectChecked(a, b);
			await expectUnchecked(c);

			// Re-render with readonly
			t.rerender({ readonly: true, value: ["a", "b"] });
			await tick();

			// Should maintain checked state but be readonly
			await expectChecked(a, b);
			await expectUnchecked(c);

			for (const checkbox of t.checkboxes) {
				await expect.element(checkbox).toHaveAttribute("aria-readonly", "true");
			}

			// Should not be able to toggle
			await a.click();
			await expectChecked(a);
			await c.click();
			await expectUnchecked(c);
		});
	});
});
