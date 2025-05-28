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
	return { user, input, ...returned };
}

describe("Accessibility", () => {
	it("should have no accessibility violations", async () => {
		const { container } = render(RatingGroupTest);
		expect(await axe(container)).toHaveNoViolations();
	});

	it("should have proper ARIA attributes for slider role", async () => {
		const { getByTestId } = setup({ value: 3, max: 5 });
		const root = getByTestId("root");

		expect(root).toHaveAttribute("role", "slider");
		expect(root).toHaveAttribute("aria-valuenow", "3");
		expect(root).toHaveAttribute("aria-valuemin", "0");
		expect(root).toHaveAttribute("aria-valuemax", "5");
		expect(root).toHaveAttribute("aria-valuetext", "3 out of 5");
		expect(root).toHaveAttribute("aria-orientation", "horizontal");
		expect(root).toHaveAttribute("aria-label", "Rating");
		expect(root).toHaveAttribute("tabindex", "0");
	});

	it("should have proper ARIA attributes when disabled", async () => {
		const { getByTestId } = setup({ disabled: true });
		const root = getByTestId("root");

		expect(root).toHaveAttribute("aria-disabled", "true");
		expect(root).toHaveAttribute("tabindex", "-1");
	});

	it("should have proper ARIA attributes when required", async () => {
		const { getByTestId } = setup({ required: true });
		const root = getByTestId("root");

		expect(root).toHaveAttribute("aria-required", "true");
	});

	it("should have items with presentation role", async () => {
		const { getByTestId } = setup({ max: 3 });

		for (let i = 0; i <= 2; i++) {
			const item = getByTestId(`item-${i}`);
			expect(item).toHaveAttribute("role", "presentation");
			expect(item).not.toHaveAttribute("aria-label");
			expect(item).not.toHaveAttribute("tabindex");
		}
	});
});

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		const { getByTestId } = setup({ max: 3 });
		const root = getByTestId("root");
		const item = getByTestId("item-1");

		expect(root).toHaveAttribute("data-rating-group-root");
		expect(item).toHaveAttribute("data-rating-group-item");
	});

	it("should have correct data attributes on root", async () => {
		const { getByTestId } = setup({
			value: 2.5,
			max: 5,
			disabled: true,
			readonly: true,
			orientation: "vertical",
		});
		const root = getByTestId("root");

		expect(root).toHaveAttribute("data-value", "2.5");
		expect(root).toHaveAttribute("data-max", "5");
		expect(root).toHaveAttribute("data-disabled", "");
		expect(root).toHaveAttribute("data-readonly", "");
		expect(root).toHaveAttribute("data-orientation", "vertical");
	});

	it("should have correct data attributes on items", async () => {
		const { getByTestId } = setup({ value: 2.5, max: 3, allowHalf: true });

		// should be active
		const item1 = getByTestId("item-0");
		expect(item1).toHaveAttribute("data-state", "active");
		expect(item1).toHaveAttribute("data-value", "1");

		// should be active
		const item2 = getByTestId("item-1");
		expect(item2).toHaveAttribute("data-state", "active");

		// should be partial
		const item3 = getByTestId("item-2");
		expect(item3).toHaveAttribute("data-state", "partial");
	});
});

describe("Value Changes", () => {
	it("should change the value when an item is clicked", async () => {
		const { getByTestId, user } = setup();
		const valueDisplay = getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("0");

		const item3 = getByTestId("item-2");
		await user.click(item3);

		expect(valueDisplay).toHaveTextContent("3");
	});

	it("should handle half ratings when allowHalf is true", async () => {
		const { getByTestId, user } = setup({ allowHalf: true });
		const valueDisplay = getByTestId("value-display");

		// click the set half button to test half values
		const setHalfButton = getByTestId("set-half-button");
		await user.click(setHalfButton);

		expect(valueDisplay).toHaveTextContent("2.5");

		// check that item states are correct
		expect(getByTestId("state-0")).toHaveTextContent("active");
		expect(getByTestId("state-1")).toHaveTextContent("active");
		expect(getByTestId("state-2")).toHaveTextContent("partial");
		expect(getByTestId("state-3")).toHaveTextContent("inactive");
		expect(getByTestId("state-4")).toHaveTextContent("inactive");
	});

	it("should not change value when disabled", async () => {
		const { getByTestId, user } = setup({ disabled: true });
		const valueDisplay = getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("0");

		const item3 = getByTestId("item-3"); // Index 2, rating value 3
		await user.click(item3);

		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should not change value when readonly", async () => {
		const { getByTestId, user } = setup({ readonly: true });
		const valueDisplay = getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("0");

		const item3 = getByTestId("item-3"); // Index 2, rating value 3
		await user.click(item3);

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
		const { getByTestId, user } = setup();
		const root = getByTestId("root");
		const item3 = getByTestId("item-3"); // Index 2, rating value 3

		await user.click(item3);

		expect(root).toHaveFocus();
	});
});

describe("Keyboard Navigation", () => {
	it("should increment value with arrow right/up keys", async () => {
		const { getByTestId, user } = setup({ value: 2 });
		const root = getByTestId("root");
		const valueDisplay = getByTestId("value-display");

		root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("3");

		await user.keyboard(kbd.ARROW_UP);
		expect(valueDisplay).toHaveTextContent("4");
	});

	it("should decrement value with arrow left/down keys", async () => {
		const { getByTestId, user } = setup({ value: 3 });
		const root = getByTestId("root");
		const valueDisplay = getByTestId("value-display");

		root.focus();
		expect(valueDisplay).toHaveTextContent("3");

		await user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("2");

		await user.keyboard(kbd.ARROW_DOWN);
		expect(valueDisplay).toHaveTextContent("1");
	});

	it("should handle half steps when allowHalf is true", async () => {
		const { getByTestId, user } = setup({ value: 2, allowHalf: true });
		const root = getByTestId("root");
		const valueDisplay = getByTestId("value-display");

		root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("2.5");

		await user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("3");

		await user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("2.5");
	});

	it("should go to minimum with Home key", async () => {
		const { getByTestId, user } = setup({ value: 3 });
		const root = getByTestId("root");
		const valueDisplay = getByTestId("value-display");

		root.focus();
		expect(valueDisplay).toHaveTextContent("3");

		await user.keyboard(kbd.HOME);
		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should go to maximum with End key", async () => {
		const { getByTestId, user } = setup({ value: 2, max: 5 });
		const root = getByTestId("root");
		const valueDisplay = getByTestId("value-display");

		root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await user.keyboard(kbd.END);
		expect(valueDisplay).toHaveTextContent("5");
	});

	it("should handle Page Up/Down keys", async () => {
		const { getByTestId, user } = setup({ value: 2 });
		const root = getByTestId("root");
		const valueDisplay = getByTestId("value-display");

		root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await user.keyboard(kbd.PAGE_UP);
		expect(valueDisplay).toHaveTextContent("3");

		await user.keyboard(kbd.PAGE_DOWN);
		expect(valueDisplay).toHaveTextContent("2");
	});

	it("should handle number keys for direct rating", async () => {
		const { getByTestId, user } = setup({ max: 5 });
		const root = getByTestId("root");
		const valueDisplay = getByTestId("value-display");

		root.focus();
		expect(valueDisplay).toHaveTextContent("0");

		await user.keyboard("4");
		expect(valueDisplay).toHaveTextContent("4");

		await user.keyboard("0");
		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should not respond to keyboard when disabled", async () => {
		const { getByTestId, user } = setup({ value: 2, disabled: true });
		const root = getByTestId("root");
		const valueDisplay = getByTestId("value-display");

		root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("2");
	});

	it("should not respond to keyboard when readonly", async () => {
		const { getByTestId, user } = setup({ value: 2, readonly: true });
		const root = getByTestId("root");
		const valueDisplay = getByTestId("value-display");

		root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		await user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("2");
	});

	it("should clamp values to min/max bounds", async () => {
		const { getByTestId, user } = setup({ value: 0, max: 3 });
		const root = getByTestId("root");
		const valueDisplay = getByTestId("value-display");

		root.focus();

		// try to go below minimum
		await user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("0");

		// go to maximum
		await user.keyboard(kbd.END);
		expect(valueDisplay).toHaveTextContent("3");

		// try to go above maximum
		await user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("3");
	});
});

describe("Input Behavior", () => {
	it("should not render an input if the `name` prop isn't passed", async () => {
		const { input } = setup();
		expect(input).not.toBeInTheDocument();
	});

	it("should render an input if the `name` prop is passed", async () => {
		const { input } = setup({ name: "rating" });
		expect(input).toBeInTheDocument();
	});

	it("should sync the input's value with the rating group value", async () => {
		const { getByTestId, user, input } = setup({ name: "rating" });

		const item2 = getByTestId("item-2");
		await user.click(item2);

		expect(input).toHaveValue("3");
	});

	it("should make the input required if the rating group is required", async () => {
		const { input } = setup({ required: true, name: "rating" });
		expect(input).toHaveAttribute("required");
	});

	it("should make the input disabled if the rating group is disabled", async () => {
		const { input } = setup({ disabled: true, name: "rating" });
		expect(input).toHaveAttribute("disabled");
	});

	it("should handle half values in input", async () => {
		const { getByTestId, user, input } = setup({ name: "rating", allowHalf: true });

		const setHalfButton = getByTestId("set-half-button");
		await user.click(setHalfButton);

		expect(input).toHaveValue("2.5");
	});
});

describe("Orientation", () => {
	it("should have correct aria-orientation for vertical", async () => {
		const { getByTestId } = setup({ orientation: "vertical" });
		const root = getByTestId("root");

		expect(root).toHaveAttribute("aria-orientation", "vertical");
		expect(root).toHaveAttribute("data-orientation", "vertical");
	});

	it("should have correct aria-orientation for horizontal (default)", async () => {
		const { getByTestId } = setup();
		const root = getByTestId("root");

		expect(root).toHaveAttribute("aria-orientation", "horizontal");
		expect(root).toHaveAttribute("data-orientation", "horizontal");
	});
});

describe("Max Value", () => {
	it("should render correct number of items based on max", async () => {
		const { getByTestId } = setup({ max: 3 });

		expect(getByTestId("item-0")).toBeInTheDocument();
		expect(getByTestId("item-1")).toBeInTheDocument();
		expect(getByTestId("item-2")).toBeInTheDocument();
		expect(() => getByTestId("item-3")).toThrow();
	});

	it("should update aria-valuemax when max changes", async () => {
		const { getByTestId, rerender } = setup({ max: 5 });
		const root = getByTestId("root");

		expect(root).toHaveAttribute("aria-valuemax", "5");

		await rerender({ max: 10 });
		expect(root).toHaveAttribute("aria-valuemax", "10");
	});
});

describe("Value Display", () => {
	it("should update aria-valuenow and aria-valuetext when value changes", async () => {
		const { getByTestId, user } = setup({ max: 5 });
		const root = getByTestId("root");

		expect(root).toHaveAttribute("aria-valuenow", "0");
		expect(root).toHaveAttribute("aria-valuetext", "0 out of 5");

		const item2 = getByTestId("item-2");
		await user.click(item2);

		expect(root).toHaveAttribute("aria-valuenow", "3");
		expect(root).toHaveAttribute("aria-valuetext", "3 out of 5");
	});

	it("should handle decimal values in aria attributes", async () => {
		const { getByTestId, user } = setup({ allowHalf: true, max: 5 });
		const root = getByTestId("root");

		const setHalfButton = getByTestId("set-half-button");
		await user.click(setHalfButton);

		expect(root).toHaveAttribute("aria-valuenow", "2.5");
		expect(root).toHaveAttribute("aria-valuetext", "2.5 out of 5");
	});

	it("should provide correct state in item snippets", async () => {
		const { getByTestId, user } = setup({ allowHalf: true, max: 5 });

		// set a half rating of 2.5
		const setHalfButton = getByTestId("set-half-button");
		await user.click(setHalfButton);

		expect(getByTestId("state-0")).toHaveTextContent("active");
		expect(getByTestId("state-1")).toHaveTextContent("active");
		expect(getByTestId("state-2")).toHaveTextContent("partial");
		expect(getByTestId("state-3")).toHaveTextContent("inactive");
		expect(getByTestId("state-4")).toHaveTextContent("inactive");
	});
});
