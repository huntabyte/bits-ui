import { page } from "@vitest/browser/context";
import { describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-svelte";
import { type ComponentProps, tick } from "svelte";
import type { Checkbox } from "bits-ui";
import { getTestKbd } from "../utils.js";
import CheckboxTest from "./checkbox-test.svelte";
import CheckboxGroupTest from "./checkbox-group-test.svelte";
import { setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

const groupItems = ["a", "b", "c", "d"];

function setup(props?: Checkbox.RootProps) {
	const user = setupBrowserUserEvents();
	const returned = render(CheckboxTest, props);
	const root = page.getByTestId("root").element() as HTMLElement;
	return { ...returned, root, user };
}

function setupGroup(props: ComponentProps<typeof CheckboxGroupTest> = {}) {
	const items = props.items ?? groupItems;
	const user = setupBrowserUserEvents();
	const returned = render(CheckboxGroupTest, { ...props, items });
	const group = page.getByTestId("group").element() as HTMLElement;
	const groupLabel = page.getByTestId("group-label").element() as HTMLElement;
	const submit = page.getByTestId("submit").element() as HTMLButtonElement;
	const binding = page.getByTestId("binding").element() as HTMLParagraphElement;
	const updateBtn = page.getByTestId("update").element() as HTMLButtonElement;

	const getCheckbox = (v: string) => page.getByTestId(`${v}-checkbox`).element() as HTMLElement;
	const getIndicator = (v: string) => page.getByTestId(`${v}-indicator`).element() as HTMLElement;
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
		user,
		submit,
		binding,
		updateBtn,
	};
}

function expectChecked(...nodes: HTMLElement[]) {
	for (const n of nodes) {
		expect(n).toHaveAttribute("data-state", "checked");
		expect(n).toHaveAttribute("aria-checked", "true");
	}
}

function expectUnchecked(...nodes: HTMLElement[]) {
	for (const n of nodes) {
		expect(n).toHaveAttribute("data-state", "unchecked");
		expect(n).toHaveAttribute("aria-checked", "false");
	}
}

function getHiddenInput() {
	return page.getByRole("checkbox", { includeHidden: true }).nth(1);
}

describe("Single Checkbox", () => {
	describe("Accessibility and Structure", () => {
		it("should have bits data attrs", async () => {
			const t = setup();
			expect(t.root).toHaveAttribute("data-checkbox-root");
		});

		it("should not render the checkbox input if a name prop isn't passed", async () => {
			setup({ name: "" });
			expect(() => getHiddenInput().element()).toThrow();
		});

		it("should render the checkbox input if a name prop is passed", async () => {
			setup({ name: "checkbox" });
			expect(getHiddenInput()).toBeInTheDocument();
			expect(getHiddenInput()).toHaveAttribute("type", "checkbox");
		});

		it("should not have input as part of tab order", async () => {
			setup({ name: "abc" });
			expect(getHiddenInput()).toHaveAttribute("tabindex", "-1");
		});

		it('should default the value to "on" when no value prop is passed', async () => {
			setup({ name: "hello" });

			expect(getHiddenInput()).toHaveAttribute("value");
		});
	});

	describe("State and Interaction", () => {
		it("should be able to be indeterminate", async () => {
			const t = setup({ indeterminate: true });
			const indicator = t.getByTestId("indicator");
			expect(t.root).toHaveAttribute("data-state", "indeterminate");
			expect(t.root).toHaveAttribute("aria-checked", "mixed");
			expect(page.getByRole("checkbox")).not.toBeChecked();
			expect(indicator).toHaveTextContent("indeterminate");
			expect(indicator).not.toHaveTextContent("true");
			expect(indicator).not.toHaveTextContent("false");
		});

		it("should toggle when clicked", async () => {
			const t = setup();
			const indicator = t.getByTestId("indicator");
			expectUnchecked(t.root);
			expect(page.getByRole("checkbox")).not.toBeChecked();
			expect(indicator).toHaveTextContent("false");
			expect(indicator).not.toHaveTextContent("true");
			expect(indicator).not.toHaveTextContent("indeterminate");
			await t.user.click(t.root);
			expectChecked(t.root);
			expect(page.getByRole("checkbox")).toBeChecked();
			expect(indicator).toHaveTextContent("true");
			expect(indicator).not.toHaveTextContent("false");
			expect(indicator).not.toHaveTextContent("indeterminate");
		});

		it("should toggle when the `Space` key is pressed", async () => {
			const t = setup();
			expectUnchecked(t.root);
			expect(page.getByRole("checkbox")).not.toBeChecked();
			t.root.focus();
			await t.user.keyboard(kbd.SPACE);
			expectChecked(t.root);
			expect(page.getByRole("checkbox")).toBeChecked();
		});

		it("should not toggle when the `Enter` key is pressed", async () => {
			const t = setup();
			const indicator = t.getByTestId("indicator");
			expectUnchecked(t.root);
			expect(page.getByRole("checkbox")).not.toBeChecked();
			expect(indicator).toHaveTextContent("false");
			expect(indicator).not.toHaveTextContent("true");
			expect(indicator).not.toHaveTextContent("indeterminate");
			t.root.focus();
			await t.user.keyboard(kbd.ENTER);
			expectUnchecked(t.root);
			expect(indicator).toHaveTextContent("false");
			expect(indicator).not.toHaveTextContent("true");
			expect(indicator).not.toHaveTextContent("indeterminate");
			expect(page.getByRole("checkbox")).not.toBeChecked();
		});
	});

	describe("Props and Events", () => {
		it("should be disabled when the `disabled` prop is passed", async () => {
			const t = setup({ disabled: true });
			expectUnchecked(t.root);
			expect(page.getByRole("checkbox").element()).toBeDisabled();
			await t.user.click(t.root);
			expectUnchecked(t.root);
			expect(t.root).toBeDisabled();
			expect(page.getByRole("checkbox").element()).toBeDisabled();
		});

		it("should be required when the `required` prop is passed", async () => {
			const t = setup({ required: true, name: "checkbox" });
			expect(t.root).toHaveAttribute("aria-required", "true");
			expect(page.getByRole("checkbox").element()).toBeRequired();
		});

		it('should fire the "onCheckedChange" callback when changing', async () => {
			const mock = vi.fn();
			const t = setup({ onCheckedChange: mock });
			await t.user.click(t.root);
			expect(mock).toHaveBeenCalledWith(true);
			await t.user.click(t.root);
			expect(mock).toHaveBeenCalledWith(false);
		});

		it("should fire the 'onIndeterminateChange' callback when changing from indeterminate", async () => {
			const mock = vi.fn();
			const t = setup({ onIndeterminateChange: mock, indeterminate: true });
			await t.user.click(t.root);
			expect(mock).toHaveBeenCalledWith(false);
		});

		it("should respect binding the `checked` prop", async () => {
			const t = setup();
			const binding = t.getByTestId("binding");
			expect(binding).toHaveTextContent("false");
			await t.user.click(t.root);
			await tick();
			expect(binding).toHaveTextContent("true");
		});
	});
});

describe("Checkbox Group", () => {
	describe("Accessibility and Structure", () => {
		it("should have bits data attrs", async () => {
			const t = setupGroup();
			expect(t.group).toHaveAttribute("data-checkbox-group");
			expect(t.groupLabel).toHaveAttribute("data-checkbox-group-label");
		});
	});

	describe("Value Handling", () => {
		it("should handle default values appropriately", async () => {
			const t = setupGroup({ value: ["a", "b"] });
			const [a, b, c, d] = t.checkboxes;
			expectChecked(a, b);
			expectUnchecked(c, d);
			await t.user.click(a);
			expectUnchecked(a);
			await t.user.click(d);
			expectChecked(d);
		});

		it("should submit the form data correctly using the checkbox values and group name", async () => {
			let submittedValues: string[] | undefined;
			const t = setupGroup({
				name: "myGroup",
				onFormSubmit: (fd) => {
					submittedValues = fd.getAll("myGroup") as string[];
				},
			});
			const [a, b] = t.checkboxes;
			await t.user.click(a);
			expectChecked(a);
			await t.user.click(t.submit);
			expect(submittedValues).toEqual(["a"]);
			await t.user.click(b);
			await t.user.click(t.submit);
			expect(submittedValues).toEqual(["a", "b"]);
		});

		it("should handle binding value", async () => {
			const t = setupGroup();
			const [a, b, _, d] = t.checkboxes;
			expect(t.binding).toHaveTextContent("");
			await t.user.click(a);
			expect(t.binding).toHaveTextContent("a");
			await t.user.click(b);
			expect(t.binding).toHaveTextContent("a,b");
			await t.user.click(a);
			expect(t.binding).toHaveTextContent("b");
			await t.user.click(d);
			expect(t.binding).toHaveTextContent("b,d");
		});

		it("should handle function binding", async () => {
			const setMock = vi.fn();
			const getMock = vi.fn();
			const t = setupGroup({ getValue: getMock, setValue: setMock, value: [] });
			const [a, b, _, d] = t.checkboxes;
			await t.user.click(a);
			expect(setMock).toHaveBeenCalledWith(["a"]);
			setMock.mockClear();
			await t.user.click(b);
			expect(setMock).toHaveBeenCalledWith(["a", "b"]);
			setMock.mockClear();
			await t.user.click(d);
			expect(setMock).toHaveBeenCalledWith(["a", "b", "d"]);
			setMock.mockClear();
			await t.user.click(a);
			expect(setMock).toHaveBeenCalledWith(["b", "d"]);
		});

		it("should handle programmatic value changes", async () => {
			const t = setupGroup({ value: ["a", "b"] });
			const [a, b, c, d] = t.checkboxes;
			await tick();
			expectChecked(a, b);
			await t.user.click(t.updateBtn);
			expectUnchecked(a, b);
			expectChecked(c, d);
		});

		it("should call the `onValueChange` callback when the value changes", async () => {
			const mock = vi.fn();
			const t = setupGroup({ onValueChange: mock });
			const [a, b] = t.checkboxes;
			await t.user.click(a);
			expect(mock).toHaveBeenCalledWith(["a"]);
			await t.user.click(b);
			expect(mock).toHaveBeenCalledWith(["a", "b"]);
			await t.user.click(a);
			expect(mock).toHaveBeenCalledWith(["b"]);
			await t.user.click(b);
			expect(mock).toHaveBeenCalledWith([]);
		});

		it("should only call the `onValueChange` callback once when the value changes", async () => {
			const mock = vi.fn();
			const t = setupGroup({ onValueChange: mock });
			const [a, b] = t.checkboxes;
			await t.user.click(a);
			expect(mock).toHaveBeenCalledExactlyOnceWith(["a"]);
			mock.mockClear();
			await t.user.click(b);
			expect(mock).toHaveBeenCalledExactlyOnceWith(["a", "b"]);
			mock.mockClear();
			await t.user.click(a);
			expect(mock).toHaveBeenCalledExactlyOnceWith(["b"]);
		});
	});

	describe("Props and State Propagation", () => {
		it("should propagate disabled state to children checkboxes", async () => {
			const t = setupGroup({ disabled: true, required: true });
			for (const checkbox of t.checkboxes) {
				expect(checkbox).toBeDisabled();
				expect(checkbox).toHaveAttribute("aria-required", "true");
			}
		});

		it("should allow disabling a single item in the group", async () => {
			const t = setupGroup({ disabledItems: ["a"] });
			const [a, ...rest] = t.checkboxes;
			expect(a).toBeDisabled();
			for (const checkbox of rest) {
				expect(checkbox).not.toBeDisabled();
			}
		});
	});
});
