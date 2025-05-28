import { render } from "@testing-library/svelte/svelte5";
import { axe } from "jest-axe";
import { describe, it, vi } from "vitest";
import { getTestKbd } from "../utils.js";
import RatingGroupTest from "./rating-group-test.svelte";
import type { RatingGroupTestProps } from "./rating-group-test.svelte";
import { setupUserEvents } from "../utils";

const kbd = getTestKbd();

function setup(props: Partial<RatingGroupTestProps> = {}) {
	const user = setupUserEvents();
	const returned = render(RatingGroupTest, { ...props });
	const input = returned.container.querySelector("input") as HTMLInputElement;
	const root = returned.getByTestId("root");
	return { user, input, root, ...returned };
}

describe("Accessibility", () => {
	it("should have no accessibility violations", async () => {
		const t = render(RatingGroupTest);
		expect(await axe(t.container)).toHaveNoViolations();
	});

	it("should have proper ARIA attributes for slider role", async () => {
		const t = setup({ value: 3, max: 5 });

		expect(t.root).toHaveAttribute("role", "slider");
		expect(t.root).toHaveAttribute("aria-valuenow", "3");
		expect(t.root).toHaveAttribute("aria-valuemin", "0");
		expect(t.root).toHaveAttribute("aria-valuemax", "5");
		expect(t.root).toHaveAttribute("aria-valuetext", "3 out of 5");
		expect(t.root).toHaveAttribute("aria-orientation", "horizontal");
		expect(t.root).toHaveAttribute("aria-label", "Rating");
		expect(t.root).toHaveAttribute("tabindex", "0");
	});

	it("should have proper ARIA attributes when disabled", async () => {
		const t = setup({ disabled: true });

		expect(t.root).toHaveAttribute("aria-disabled", "true");
		expect(t.root).toHaveAttribute("tabindex", "-1");
	});

	it("should have proper ARIA attributes when required", async () => {
		const t = setup({ required: true });

		expect(t.root).toHaveAttribute("aria-required", "true");
	});

	it("should have items with presentation role", async () => {
		const t = setup({ max: 3 });

		for (let i = 0; i <= 2; i++) {
			const item = t.getByTestId(`item-${i}`);
			expect(item).toHaveAttribute("role", "presentation");
			expect(item).not.toHaveAttribute("aria-label");
			expect(item).not.toHaveAttribute("tabindex");
		}
	});
});

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		const t = setup({ max: 3 });
		const item = t.getByTestId("item-1");

		expect(t.root).toHaveAttribute("data-rating-group-root");
		expect(item).toHaveAttribute("data-rating-group-item");
	});

	it("should have correct data attributes on root", async () => {
		const t = setup({
			value: 2.5,
			max: 5,
			disabled: true,
			readonly: true,
			orientation: "vertical",
		});

		expect(t.root).toHaveAttribute("data-value", "2.5");
		expect(t.root).toHaveAttribute("data-max", "5");
		expect(t.root).toHaveAttribute("data-disabled", "");
		expect(t.root).toHaveAttribute("data-readonly", "");
		expect(t.root).toHaveAttribute("data-orientation", "vertical");
	});

	it("should have correct data attributes on items", async () => {
		const t = setup({ value: 2.5, max: 3, allowHalf: true });

		// should be active
		const item1 = t.getByTestId("item-0");
		expect(item1).toHaveAttribute("data-state", "active");
		expect(item1).toHaveAttribute("data-value", "1");

		// should be active
		const item2 = t.getByTestId("item-1");
		expect(item2).toHaveAttribute("data-state", "active");

		// should be partial
		const item3 = t.getByTestId("item-2");
		expect(item3).toHaveAttribute("data-state", "partial");
	});
});

describe("Value Changes", () => {
	it("should change the value when an item is clicked", async () => {
		const t = setup();
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("0");

		const item3 = t.getByTestId("item-2");
		await t.user.click(item3);

		expect(valueDisplay).toHaveTextContent("3");
	});

	it("should handle half ratings when allowHalf is true", async () => {
		const t = setup({ allowHalf: true });
		const valueDisplay = t.getByTestId("value-display");

		// click the set half button to test half values
		const setHalfButton = t.getByTestId("set-half-button");
		await t.user.click(setHalfButton);

		expect(valueDisplay).toHaveTextContent("2.5");

		// check that item states are correct
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("active");
		expect(t.getByTestId("state-2")).toHaveTextContent("partial");
		expect(t.getByTestId("state-3")).toHaveTextContent("inactive");
		expect(t.getByTestId("state-4")).toHaveTextContent("inactive");
	});

	it("should not change value when disabled", async () => {
		const t = setup({ disabled: true });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("0");

		const item3 = t.getByTestId("item-3");
		await t.user.click(item3);

		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should not change value when readonly", async () => {
		const t = setup({ readonly: true });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("0");

		const item3 = t.getByTestId("item-3");
		await t.user.click(item3);

		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should call onValueChange when value changes", async () => {
		const onValueChange = vi.fn();
		const { getByTestId, user } = setup({ onValueChange });

		const item2 = getByTestId("item-2");
		await user.click(item2);

		expect(onValueChange).toHaveBeenCalledWith(3);
	});

	it("should focus the root after clicking an item", async () => {
		const t = setup();
		const item3 = t.getByTestId("item-3");

		await t.user.click(item3);

		expect(t.root).toHaveFocus();
	});
});

describe("Keyboard Navigation", () => {
	it("should increment value with arrow right/up keys", async () => {
		const t = setup({ value: 2 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("3");

		await t.user.keyboard(kbd.ARROW_UP);
		expect(valueDisplay).toHaveTextContent("4");
	});

	it("should decrement value with arrow left/down keys", async () => {
		const t = setup({ value: 3 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("3");

		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("2");

		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(valueDisplay).toHaveTextContent("1");
	});

	it("should handle half steps when allowHalf is true", async () => {
		const t = setup({ value: 2, allowHalf: true });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("2.5");

		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("3");

		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("2.5");
	});

	it("should go to minimum with Home key", async () => {
		const t = setup({ value: 3 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("3");

		await t.user.keyboard(kbd.HOME);
		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should go to maximum with End key", async () => {
		const t = setup({ value: 2, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await t.user.keyboard(kbd.END);
		expect(valueDisplay).toHaveTextContent("5");
	});

	it("should handle Page Up/Down keys", async () => {
		const t = setup({ value: 2 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await t.user.keyboard(kbd.PAGE_UP);
		expect(valueDisplay).toHaveTextContent("3");

		await t.user.keyboard(kbd.PAGE_DOWN);
		expect(valueDisplay).toHaveTextContent("2");
	});

	it("should handle number keys for direct rating", async () => {
		const t = setup({ max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("0");

		await t.user.keyboard("4");
		expect(valueDisplay).toHaveTextContent("4");

		await t.user.keyboard("0");
		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should not respond to keyboard when disabled", async () => {
		const t = setup({ value: 2, disabled: true });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("2");
	});

	it("should not respond to keyboard when readonly", async () => {
		const t = setup({ value: 2, readonly: true });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("2");
	});

	it("should clamp values to min/max bounds", async () => {
		const t = setup({ value: 1, min: 0, max: 3 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();

		// try to go below minimum
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("0");

		// go to maximum
		await t.user.keyboard(kbd.END);
		expect(valueDisplay).toHaveTextContent("3");

		// try to go above maximum
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("3");
	});
});

describe("Input Behavior", () => {
	it("should not render an input if the `name` prop isn't passed", async () => {
		const t = setup();
		expect(t.input).not.toBeInTheDocument();
	});

	it("should render an input if the `name` prop is passed", async () => {
		const t = setup({ name: "rating" });
		expect(t.input).toBeInTheDocument();
	});

	it("should sync the input's value with the rating group value", async () => {
		const t = setup({ name: "rating" });

		const item2 = t.getByTestId("item-2");
		await t.user.click(item2);

		expect(t.input).toHaveValue("3");
	});

	it("should make the input required if the rating group is required", async () => {
		const t = setup({ required: true, name: "rating" });
		expect(t.input).toHaveAttribute("required");
	});

	it("should make the input disabled if the rating group is disabled", async () => {
		const t = setup({ disabled: true, name: "rating" });
		expect(t.input).toHaveAttribute("disabled");
	});

	it("should handle half values in input", async () => {
		const t = setup({ name: "rating", allowHalf: true });

		const setHalfButton = t.getByTestId("set-half-button");
		await t.user.click(setHalfButton);

		expect(t.input).toHaveValue("2.5");
	});
});

describe("Orientation", () => {
	it("should have correct aria-orientation for vertical", async () => {
		const t = setup({ orientation: "vertical" });

		expect(t.root).toHaveAttribute("aria-orientation", "vertical");
		expect(t.root).toHaveAttribute("data-orientation", "vertical");
	});

	it("should have correct aria-orientation for horizontal (default)", async () => {
		const t = setup();

		expect(t.root).toHaveAttribute("aria-orientation", "horizontal");
		expect(t.root).toHaveAttribute("data-orientation", "horizontal");
	});
});

describe("Max Value", () => {
	it("should render correct number of items based on max", async () => {
		const t = setup({ max: 3 });

		expect(t.getByTestId("item-0")).toBeInTheDocument();
		expect(t.getByTestId("item-1")).toBeInTheDocument();
		expect(t.getByTestId("item-2")).toBeInTheDocument();
		expect(() => t.getByTestId("item-3")).toThrow();
	});

	it("should update aria-valuemax when max changes", async () => {
		const t = setup({ max: 5 });

		expect(t.root).toHaveAttribute("aria-valuemax", "5");

		await t.rerender({ max: 10 });
		expect(t.root).toHaveAttribute("aria-valuemax", "10");
	});
});

describe("Value Display", () => {
	it("should update aria-valuenow and aria-valuetext when value changes", async () => {
		const t = setup({ max: 5 });

		expect(t.root).toHaveAttribute("aria-valuenow", "0");
		expect(t.root).toHaveAttribute("aria-valuetext", "0 out of 5");

		const item2 = t.getByTestId("item-2");
		await t.user.click(item2);

		expect(t.root).toHaveAttribute("aria-valuenow", "3");
		expect(t.root).toHaveAttribute("aria-valuetext", "3 out of 5");
	});

	it("should handle decimal values in aria attributes", async () => {
		const t = setup({ allowHalf: true, max: 5 });

		const setHalfButton = t.getByTestId("set-half-button");
		await t.user.click(setHalfButton);

		expect(t.root).toHaveAttribute("aria-valuenow", "2.5");
		expect(t.root).toHaveAttribute("aria-valuetext", "2.5 out of 5");
	});

	it("should provide correct state in item snippets", async () => {
		const t = setup({ allowHalf: true, max: 5 });

		// set a half rating of 2.5
		const setHalfButton = t.getByTestId("set-half-button");
		await t.user.click(setHalfButton);

		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("active");
		expect(t.getByTestId("state-2")).toHaveTextContent("partial");
		expect(t.getByTestId("state-3")).toHaveTextContent("inactive");
		expect(t.getByTestId("state-4")).toHaveTextContent("inactive");
	});
});

describe("Min Value", () => {
	it("should use min value for aria-valuemin", async () => {
		const t = setup({ min: 1, max: 5 });

		expect(t.root).toHaveAttribute("aria-valuemin", "1");
		expect(t.root).toHaveAttribute("aria-valuemax", "5");
	});

	it("should clamp values to min bound", async () => {
		const t = setup({ min: 1, max: 5, value: 0 });
		const valueDisplay = t.getByTestId("value-display");

		// value should be clamped to min
		expect(valueDisplay).toHaveTextContent("1");
	});

	it("should go to minimum with Home key", async () => {
		const t = setup({ min: 1, max: 5, value: 3 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("3");

		await t.user.keyboard(kbd.HOME);
		expect(valueDisplay).toHaveTextContent("1");
	});

	it("should not allow values below min with keyboard", async () => {
		const t = setup({ min: 1, max: 5, value: 1 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("1");

		// try to go below minimum
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("1");
	});

	it("should only accept number keys within min-max range", async () => {
		const t = setup({ min: 2, max: 4 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();

		// try number below min (should be ignored)
		await t.user.keyboard("1");
		expect(valueDisplay).toHaveTextContent("2");

		// try number within range
		await t.user.keyboard("3");
		expect(valueDisplay).toHaveTextContent("3");

		// try number above max (should be ignored)
		await t.user.keyboard("5");
		expect(valueDisplay).toHaveTextContent("3");
	});
});
