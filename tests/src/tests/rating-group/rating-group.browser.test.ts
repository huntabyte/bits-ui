import { expect, it, vi, describe, beforeEach, afterEach } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import RatingGroupTest from "./rating-group-test.svelte";
import type { RatingGroupTestProps } from "./rating-group-test.svelte";
import { expectNotExists, setupBrowserUserEvents } from "../browser-utils";

const kbd = getTestKbd();

function setup(props: Partial<RatingGroupTestProps> = {}) {
	const user = setupBrowserUserEvents();
	const t = render(RatingGroupTest, { ...props });
	const input = t.container.querySelector("input") as HTMLInputElement;
	const root = t.getByTestId("root").element() as HTMLElement;
	return { user, input, root, ...t };
}

describe("Accessibility", () => {
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

		expect(t.root).toHaveAttribute("aria-valuenow", "2.5");
		expect(t.root).toHaveAttribute("aria-valuemax", "5");
		expect(t.root).toHaveAttribute("data-disabled", "");
		expect(t.root).toHaveAttribute("data-readonly", "");
		expect(t.root).toHaveAttribute("data-orientation", "vertical");
	});

	it("should have correct data attributes on items", async () => {
		const t = setup({ value: 2.5, max: 3, allowHalf: true });

		// should be active
		const item1 = t.getByTestId("item-0");
		expect(item1).toHaveAttribute("data-state", "active");

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

	it("should handle typing a number to set a value", async () => {
		const t = setup();
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		await t.user.keyboard("5");

		expect(valueDisplay).toHaveTextContent("5");
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
		await expectNotExists(t.getByTestId("item-3"));
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

describe("Hover Preview", () => {
	it("should show preview on hover when hoverPreview is enabled", async () => {
		const t = setup({ value: 1, max: 5, hoverPreview: true });
		const valueDisplay = t.getByTestId("value-display");

		// initial state - only first item should be active
		expect(valueDisplay).toHaveTextContent("1");
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("inactive");
		expect(t.getByTestId("state-2")).toHaveTextContent("inactive");

		// hover over third item
		const item3 = t.getByTestId("item-2");
		await t.user.hover(item3, { position: { x: 5, y: 5 } });

		// value should remain the same, but states should show preview
		expect(valueDisplay).toHaveTextContent("1");
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("active");
		expect(t.getByTestId("state-2")).toHaveTextContent("active");
		expect(t.getByTestId("state-3")).toHaveTextContent("inactive");
	});

	it("should reset preview on pointer leave", async () => {
		const t = setup({ value: 1, max: 5, hoverPreview: true });

		// hover over third item
		const item3 = t.getByTestId("item-2");
		await t.user.hover(item3);

		// preview should be active
		expect(t.getByTestId("state-2")).toHaveTextContent("active");

		// leave the root element
		await t.user.unhover(t.root);

		// should return to original state
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("inactive");
		expect(t.getByTestId("state-2")).toHaveTextContent("inactive");
	});

	it("should not show preview when hoverPreview is disabled", async () => {
		const t = setup({ value: 1, max: 5, hoverPreview: false });

		// initial state
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("inactive");

		// hover over third item
		const item3 = t.getByTestId("item-2");
		await t.user.hover(item3);

		// states should remain unchanged
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("inactive");
		expect(t.getByTestId("state-2")).toHaveTextContent("inactive");
	});

	it("should not show preview when disabled", async () => {
		const t = setup({ value: 1, max: 5, disabled: true });

		// hover over third item
		const item3 = t.getByTestId("item-2");
		await t.user.hover(item3);

		// states should remain unchanged due to disabled state
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("inactive");
		expect(t.getByTestId("state-2")).toHaveTextContent("inactive");
	});

	it("should not show preview when readonly", async () => {
		const t = setup({ value: 1, max: 5, readonly: true });

		// hover over third item
		const item3 = t.getByTestId("item-2");
		await t.user.hover(item3);

		// states should remain unchanged due to readonly state
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("inactive");
		expect(t.getByTestId("state-2")).toHaveTextContent("inactive");
	});

	it("should show preview with half ratings when allowHalf is enabled", async () => {
		const t = setup({ value: 1, max: 5, allowHalf: true });

		// use simple hover which should work more reliably
		const item3 = t.getByTestId("item-2");
		await t.user.hover(item3, { position: { x: 5, y: 5 } });

		// should show preview up to at least the hovered item (exact half behavior depends on pointer position)
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("active");
		expect(t.getByTestId("state-2")).toHaveTextContent("partial");
		expect(t.getByTestId("state-3")).toHaveTextContent("inactive");
	});

	it("should ignore touch events for hover preview", async () => {
		const t = setup({ value: 1, max: 5, hoverPreview: true });

		const item3 = t.getByTestId("item-2");

		// simulate touch by directly dispatching a touch pointer event
		const touchEvent = new PointerEvent("pointermove", {
			pointerType: "touch",
		});

		Object.defineProperty(touchEvent, "currentTarget", {
			value: item3,
			writable: false,
		});

		item3.element().dispatchEvent(touchEvent);

		// states should remain unchanged for touch events
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("inactive");
		expect(t.getByTestId("state-2")).toHaveTextContent("inactive");
	});

	it("should work with mouse pointer events for hover preview", async () => {
		const t = setup({ value: 1, max: 5 });

		// use simple hover which simulates mouse interaction
		const item3 = t.getByTestId("item-2");
		await t.user.hover(item3);

		// should show preview for mouse events
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("active");
		expect(t.getByTestId("state-2")).toHaveTextContent("active");
		expect(t.getByTestId("state-3")).toHaveTextContent("inactive");
	});

	it("should not show preview below min value", async () => {
		const t = setup({ value: 3, min: 2, max: 5, hoverPreview: true });

		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("active");
		expect(t.getByTestId("state-2")).toHaveTextContent("active");
		expect(t.getByTestId("state-3")).toHaveTextContent("inactive");

		const item1 = t.getByTestId("item-0");
		await t.user.hover(item1);

		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("active");
		expect(t.getByTestId("state-2")).toHaveTextContent("inactive");
		expect(t.getByTestId("state-3")).toHaveTextContent("inactive");
	});
});

describe("Decimal Input Sequences", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.clearAllTimers();
		vi.useRealTimers();
	});

	it("should handle typing '2.5' sequence for half ratings", async () => {
		const t = setup({ allowHalf: true, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("0");

		// type "2.5" sequence
		await t.user.type(t.root, "2.5");
		vi.runAllTimers();

		expect(valueDisplay).toHaveTextContent("2.5");
	});
});

describe("RTL Behavior", () => {
	function setupRTL(props: Partial<RatingGroupTestProps> = {}) {
		const user = setupBrowserUserEvents();
		const returned = render(RatingGroupTest, { ...props });
		const input = returned.container.querySelector("input") as HTMLInputElement;
		const root = returned.getByTestId("root").element() as HTMLElement;

		// set RTL direction
		root.style.direction = "rtl";

		return { user, input, root, ...returned };
	}

	it("should handle click behavior in RTL mode", async () => {
		const t = setupRTL({ max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		// basic click functionality should work the same in RTL
		const item3 = t.getByTestId("item-2");
		await t.user.click(item3);

		expect(valueDisplay).toHaveTextContent("3");
	});

	it("should handle keyboard navigation in RTL mode", async () => {
		const t = setupRTL({ value: 2, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		// in RTL mode, arrow keys should be flipped
		// ARROW_LEFT should increment (move forward in reading direction)
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("3");

		// ARROW_RIGHT should decrement (move backward in reading direction)
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("2");

		// UP and DOWN should work the same regardless of RTL
		await t.user.keyboard(kbd.ARROW_UP);
		expect(valueDisplay).toHaveTextContent("3");

		await t.user.keyboard(kbd.ARROW_DOWN);
		expect(valueDisplay).toHaveTextContent("2");
	});

	it("should handle hover preview in RTL mode", async () => {
		const t = setupRTL({ value: 1, max: 5, hoverPreview: true });

		// hover should still work normally in RTL
		const item3 = t.getByTestId("item-2");
		await t.user.hover(item3);

		// should show preview regardless of RTL
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("active");
		expect(t.getByTestId("state-2")).toHaveTextContent("active");
		expect(t.getByTestId("state-3")).toHaveTextContent("inactive");
	});

	it("should handle vertical orientation in RTL mode", async () => {
		const t = setupRTL({ orientation: "vertical", max: 5 });

		expect(t.root).toHaveAttribute("data-orientation", "vertical");
		expect(t.root).toHaveAttribute("aria-orientation", "vertical");

		// clicking should still work in vertical RTL
		const item3 = t.getByTestId("item-2");
		await t.user.click(item3);

		const valueDisplay = t.getByTestId("value-display");
		expect(valueDisplay).toHaveTextContent("3");
	});

	it("should have correct data attributes in RTL mode", async () => {
		const t = setupRTL({ value: 2, max: 5, disabled: true, readonly: true });

		// data attributes should be the same regardless of RTL
		expect(t.root).toHaveAttribute("aria-valuenow", "2");
		expect(t.root).toHaveAttribute("aria-valuemax", "5");
		expect(t.root).toHaveAttribute("data-disabled", "");
		expect(t.root).toHaveAttribute("data-readonly", "");
		expect(t.root).toHaveAttribute("data-orientation", "horizontal");
	});

	it("should handle allowHalf functionality in RTL mode", async () => {
		const t = setupRTL({ allowHalf: true, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		// test half functionality by setting half value programmatically
		const setHalfButton = t.getByTestId("set-half-button");
		await t.user.click(setHalfButton);

		expect(valueDisplay).toHaveTextContent("2.5");

		// check that item states are correct regardless of RTL
		expect(t.getByTestId("state-0")).toHaveTextContent("active");
		expect(t.getByTestId("state-1")).toHaveTextContent("active");
		expect(t.getByTestId("state-2")).toHaveTextContent("partial");
		expect(t.getByTestId("state-3")).toHaveTextContent("inactive");
		expect(t.getByTestId("state-4")).toHaveTextContent("inactive");
	});

	it("should handle disabled state in RTL mode", async () => {
		const t = setupRTL({ disabled: true, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("0");

		// clicking should not work when disabled, regardless of RTL
		const item3 = t.getByTestId("item-2");
		await t.user.click(item3);

		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should handle readonly state in RTL mode", async () => {
		const t = setupRTL({ readonly: true, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("0");

		// clicking should not work when readonly, regardless of RTL
		const item3 = t.getByTestId("item-2");
		await t.user.click(item3);

		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should handle keyboard navigation with half values in RTL mode", async () => {
		const t = setupRTL({ value: 2, max: 5, allowHalf: true });
		const valueDisplay = t.getByTestId("value-display");

		t.root.focus();
		expect(valueDisplay).toHaveTextContent("2");

		// in RTL mode with allowHalf, arrow keys should use 0.5 increments
		// ARROW_LEFT should increment by 0.5
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("2.5");

		// ARROW_RIGHT should decrement by 0.5
		await t.user.keyboard(kbd.ARROW_RIGHT);
		expect(valueDisplay).toHaveTextContent("2");

		// another left to increment again
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("2.5");

		// another left to get to 3
		await t.user.keyboard(kbd.ARROW_LEFT);
		expect(valueDisplay).toHaveTextContent("3");
	});
});

describe("Clear Functionality", () => {
	it("should clear rating when clicking first item that's already active and min is 0", async () => {
		const t = setup({ value: 1, min: 0, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("1");

		// click the first item to clear
		const item1 = t.getByTestId("item-0");
		await t.user.click(item1);

		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should clear rating when clicking first item with half value and min is 0", async () => {
		const t = setup({ value: 0.5, min: 0, max: 5, allowHalf: true });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("0.5");

		// click the first item - since testing-library clicks center/right, it likely calculates to 1
		// so it won't clear (1 !== 0.5), it will change to 1
		const item1 = t.getByTestId("item-0");
		await t.user.click(item1, { position: { x: 0, y: 0 } });

		expect(valueDisplay).toHaveTextContent("0");
	});

	it("should not clear when clicking first item if min is greater than 0", async () => {
		const t = setup({ value: 1, min: 1, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("1");

		// click the first item - should not clear because min is 1
		const item1 = t.getByTestId("item-0");
		await t.user.click(item1);

		expect(valueDisplay).toHaveTextContent("1");
	});

	it("should not clear when clicking first item if it's not active", async () => {
		const t = setup({ value: 2, min: 0, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("2");

		// click the first item - should set to 1, not clear
		const item1 = t.getByTestId("item-0");
		await t.user.click(item1);

		expect(valueDisplay).toHaveTextContent("1");
	});

	it("should not clear when clicking second item even if active and min is 0", async () => {
		const t = setup({ value: 2, min: 0, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("2");

		// click the second item - should stay at 2, not clear
		const item2 = t.getByTestId("item-1");
		await t.user.click(item2);

		expect(valueDisplay).toHaveTextContent("2");
	});

	it("should not clear when disabled", async () => {
		const t = setup({ value: 1, min: 0, max: 5, disabled: true });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("1");

		// click should not work when disabled
		const item1 = t.getByTestId("item-0");
		await t.user.click(item1);

		expect(valueDisplay).toHaveTextContent("1");
	});

	it("should not clear when readonly", async () => {
		const t = setup({ value: 1, min: 0, max: 5, readonly: true });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("1");

		// click should not work when readonly
		const item1 = t.getByTestId("item-0");
		await t.user.click(item1);

		expect(valueDisplay).toHaveTextContent("1");
	});

	it("should focus root after clearing", async () => {
		const t = setup({ value: 1, min: 0, max: 5 });

		const item1 = t.getByTestId("item-0");
		await t.user.click(item1);

		expect(t.root).toHaveFocus();
	});

	it("should call onValueChange when clearing", async () => {
		const onValueChange = vi.fn();
		const { getByTestId, user } = setup({ value: 1, min: 0, max: 5, onValueChange });

		const item1 = getByTestId("item-0");
		await user.click(item1);

		expect(onValueChange).toHaveBeenCalledWith(0);
	});

	it("should update hidden input value when clearing", async () => {
		const t = setup({ value: 1, min: 0, max: 5, name: "rating" });

		expect(t.input).toHaveValue("1");

		const item1 = t.getByTestId("item-0");
		await t.user.click(item1);

		expect(t.input).toHaveValue("0");
	});

	it("should clear with allowHalf when clicking left side of first item", async () => {
		const t = setup({ value: 1, min: 0, max: 5, allowHalf: true });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("1");

		// when we click the first item with allowHalf, calculateRatingFromPointer
		// could return 0.5 or 1 depending on position, but we're testing the case
		// where current value (1) matches the calculated value
		const item1 = t.getByTestId("item-0");
		await t.user.click(item1);

		// should either clear to 0 if clicked in same position, or set to 0.5 if clicked left side
		const newValue = valueDisplay.element().textContent;
		expect(newValue === "0" || newValue === "0.5").toBe(true);
	});

	it("should work in RTL mode", async () => {
		function setupClearRTL(props: Partial<RatingGroupTestProps> = {}) {
			const user = setupBrowserUserEvents();
			const returned = render(RatingGroupTest, { ...props });
			const input = returned.container.querySelector("input") as HTMLInputElement;
			const root = returned.getByTestId("root").element() as HTMLElement;

			// set RTL direction
			root.style.direction = "rtl";

			return { user, input, root, ...returned };
		}

		const t = setupClearRTL({ value: 1, min: 0, max: 5 });
		const valueDisplay = t.getByTestId("value-display");

		expect(valueDisplay).toHaveTextContent("1");

		// clear should work the same in RTL
		const item1 = t.getByTestId("item-0");
		await t.user.click(item1);

		expect(valueDisplay).toHaveTextContent("0");
	});
});
