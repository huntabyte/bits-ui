import { expect, it, vi, describe, beforeEach, afterEach } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import RatingGroupTest from "./rating-group-test.svelte";
import type { RatingGroupTestProps } from "./rating-group-test.svelte";
import { expectNotExists } from "../browser-utils";
import { page, userEvent } from "vitest/browser";

const kbd = getTestKbd();

async function setup(props: Partial<RatingGroupTestProps> = {}) {
	const t = await render(RatingGroupTest, { ...props });
	const input = t.container.querySelector("input") as HTMLInputElement;
	const root = page.getByTestId("root");
	return { input, root, rerender: t.rerender };
}

describe("Accessibility", () => {
	it("should have proper ARIA attributes for slider role", async () => {
		const t = await setup({ value: 3, max: 5 });

		await expect.element(t.root).toHaveAttribute("role", "slider");
		await expect.element(t.root).toHaveAttribute("aria-valuenow", "3");
		await expect.element(t.root).toHaveAttribute("aria-valuemin", "0");
		await expect.element(t.root).toHaveAttribute("aria-valuemax", "5");
		await expect.element(t.root).toHaveAttribute("aria-valuetext", "3 out of 5");
		await expect.element(t.root).toHaveAttribute("aria-orientation", "horizontal");
		await expect.element(t.root).toHaveAttribute("aria-label", "Rating");
		await expect.element(t.root).toHaveAttribute("tabindex", "0");
	});

	it("should have proper ARIA attributes when disabled", async () => {
		const t = await setup({ disabled: true });

		await expect.element(t.root).toHaveAttribute("aria-disabled", "true");
		await expect.element(t.root).toHaveAttribute("tabindex", "-1");
	});

	it("should have proper ARIA attributes when required", async () => {
		const t = await setup({ required: true });

		await expect.element(t.root).toHaveAttribute("aria-required", "true");
	});

	it("should have items with presentation role", async () => {
		await setup({ max: 3 });

		for (let i = 0; i <= 2; i++) {
			const item = page.getByTestId(`item-${i}`);
			await expect.element(item).toHaveAttribute("role", "presentation");
			await expect.element(item).not.toHaveAttribute("aria-label");
			await expect.element(item).not.toHaveAttribute("tabindex");
		}
	});
});

describe("Data Attributes", () => {
	it("should have bits data attrs", async () => {
		const t = await setup({ max: 3 });
		const item = page.getByTestId("item-1");

		await expect.element(t.root).toHaveAttribute("data-rating-group-root");
		await expect.element(item).toHaveAttribute("data-rating-group-item");
	});

	it("should have correct data attributes on root", async () => {
		const t = await setup({
			value: 2.5,
			max: 5,
			disabled: true,
			readonly: true,
			orientation: "vertical",
		});

		await expect.element(t.root).toHaveAttribute("aria-valuenow", "2.5");
		await expect.element(t.root).toHaveAttribute("aria-valuemax", "5");
		await expect.element(t.root).toHaveAttribute("data-disabled", "");
		await expect.element(t.root).toHaveAttribute("data-readonly", "");
		await expect.element(t.root).toHaveAttribute("data-orientation", "vertical");
	});

	it("should have correct data attributes on items", async () => {
		await setup({ value: 2.5, max: 3, allowHalf: true });

		// should be active
		const item1 = page.getByTestId("item-0");
		await expect.element(item1).toHaveAttribute("data-state", "active");

		// should be active
		const item2 = page.getByTestId("item-1");
		await expect.element(item2).toHaveAttribute("data-state", "active");

		// should be partial
		const item3 = page.getByTestId("item-2");
		await expect.element(item3).toHaveAttribute("data-state", "partial");
	});
});

describe("Value Changes", () => {
	it("should change the value when an item is clicked", async () => {
		await setup();
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("0");

		const item3 = page.getByTestId("item-2");
		await item3.click();

		await expect.element(valueDisplay).toMatchTextContent("3");
	});

	it("should handle half ratings when allowHalf is true", async () => {
		await setup({ allowHalf: true });
		const valueDisplay = page.getByTestId("value-display");

		// click the set half button to test half values
		const setHalfButton = page.getByTestId("set-half-button");
		await setHalfButton.click();

		await expect.element(valueDisplay).toMatchTextContent("2.5");

		// check that item states are correct
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("partial");
		await expect.element(page.getByTestId("state-3")).toMatchTextContent("inactive");
		await expect.element(page.getByTestId("state-4")).toMatchTextContent("inactive");
	});

	it("should handle typing a number to set a value", async () => {
		const t = await setup();
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await userEvent.keyboard("5");

		await expect.element(valueDisplay).toMatchTextContent("5");
	});

	it("should not change value when disabled", async () => {
		await setup({ disabled: true });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("0");

		const item3 = page.getByTestId("item-3");
		await item3.click();

		await expect.element(valueDisplay).toMatchTextContent("0");
	});

	it("should not change value when readonly", async () => {
		await setup({ readonly: true });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("0");

		const item3 = page.getByTestId("item-3");
		await item3.click();

		await expect.element(valueDisplay).toMatchTextContent("0");
	});

	it("should call onValueChange when value changes", async () => {
		const onValueChange = vi.fn();
		await setup({ onValueChange });

		const item2 = page.getByTestId("item-2");
		await item2.click();

		expect(onValueChange).toHaveBeenCalledWith(3);
	});

	it("should focus the root after clicking an item", async () => {
		const t = await setup();
		const item3 = page.getByTestId("item-3");

		await item3.click();

		await expect.element(t.root).toHaveFocus();
	});
});

describe("Keyboard Navigation", () => {
	it("should increment value with arrow right/up keys", async () => {
		const t = await setup({ value: 2 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("2");

		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(valueDisplay).toMatchTextContent("3");

		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(valueDisplay).toMatchTextContent("4");
	});

	it("should decrement value with arrow left/down keys", async () => {
		const t = await setup({ value: 3 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("3");

		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(valueDisplay).toMatchTextContent("2");

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(valueDisplay).toMatchTextContent("1");
	});

	it("should handle half steps when allowHalf is true", async () => {
		const t = await setup({ value: 2, allowHalf: true });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("2");

		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(valueDisplay).toMatchTextContent("2.5");

		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(valueDisplay).toMatchTextContent("3");

		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(valueDisplay).toMatchTextContent("2.5");
	});

	it("should go to minimum with Home key", async () => {
		const t = await setup({ value: 3 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("3");

		await userEvent.keyboard(kbd.HOME);
		await expect.element(valueDisplay).toMatchTextContent("0");
	});

	it("should go to maximum with End key", async () => {
		const t = await setup({ value: 2, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("2");

		await userEvent.keyboard(kbd.END);
		await expect.element(valueDisplay).toMatchTextContent("5");
	});

	it("should handle Page Up/Down keys", async () => {
		const t = await setup({ value: 2 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("2");

		await userEvent.keyboard(kbd.PAGE_UP);
		await expect.element(valueDisplay).toMatchTextContent("3");

		await userEvent.keyboard(kbd.PAGE_DOWN);
		await expect.element(valueDisplay).toMatchTextContent("2");
	});

	it("should handle number keys for direct rating", async () => {
		const t = await setup({ max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("0");

		await userEvent.keyboard("4");
		await expect.element(valueDisplay).toMatchTextContent("4");

		await userEvent.keyboard("0");
		await expect.element(valueDisplay).toMatchTextContent("0");
	});

	it("should not respond to keyboard when disabled", async () => {
		const t = await setup({ value: 2, disabled: true });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("2");

		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(valueDisplay).toMatchTextContent("2");
	});

	it("should not respond to keyboard when readonly", async () => {
		const t = await setup({ value: 2, readonly: true });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("2");

		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(valueDisplay).toMatchTextContent("2");
	});

	it("should clamp values to min/max bounds", async () => {
		const t = await setup({ value: 1, min: 0, max: 3 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();

		// try to go below minimum
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(valueDisplay).toMatchTextContent("0");

		// go to maximum
		await userEvent.keyboard(kbd.END);
		await expect.element(valueDisplay).toMatchTextContent("3");

		// try to go above maximum
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(valueDisplay).toMatchTextContent("3");
	});
});

describe("Input Behavior", () => {
	it("should not render an input if the `name` prop isn't passed", async () => {
		const t = await setup();
		await expect.element(t.input).not.toBeInTheDocument();
	});

	it("should render an input if the `name` prop is passed", async () => {
		const t = await setup({ name: "rating" });
		await expect.element(t.input).toBeInTheDocument();
	});

	it("should sync the input's value with the rating group value", async () => {
		const t = await setup({ name: "rating" });

		const item2 = page.getByTestId("item-2");
		await item2.click();

		await expect.element(t.input).toHaveValue("3");
	});

	it("should make the input required if the rating group is required", async () => {
		const t = await setup({ required: true, name: "rating" });
		await expect.element(t.input).toHaveAttribute("required");
	});

	it("should make the input disabled if the rating group is disabled", async () => {
		const t = await setup({ disabled: true, name: "rating" });
		await expect.element(t.input).toHaveAttribute("disabled");
	});

	it("should handle half values in input", async () => {
		const t = await setup({ name: "rating", allowHalf: true });

		const setHalfButton = page.getByTestId("set-half-button");
		await setHalfButton.click();

		await expect.element(t.input).toHaveValue("2.5");
	});
});

describe("Orientation", () => {
	it("should have correct aria-orientation for vertical", async () => {
		const t = await setup({ orientation: "vertical" });

		await expect.element(t.root).toHaveAttribute("aria-orientation", "vertical");
		await expect.element(t.root).toHaveAttribute("data-orientation", "vertical");
	});

	it("should have correct aria-orientation for horizontal (default)", async () => {
		const t = await setup();

		await expect.element(t.root).toHaveAttribute("aria-orientation", "horizontal");
		await expect.element(t.root).toHaveAttribute("data-orientation", "horizontal");
	});
});

describe("Max Value", () => {
	it("should render correct number of items based on max", async () => {
		await setup({ max: 3 });

		await expect.element(page.getByTestId("item-0")).toBeInTheDocument();
		await expect.element(page.getByTestId("item-1")).toBeInTheDocument();
		await expect.element(page.getByTestId("item-2")).toBeInTheDocument();
		await expectNotExists(page.getByTestId("item-3"));
	});

	it("should update aria-valuemax when max changes", async () => {
		const t = await setup({ max: 5 });

		await expect.element(t.root).toHaveAttribute("aria-valuemax", "5");

		await t.rerender({ max: 10 });
		await expect.element(t.root).toHaveAttribute("aria-valuemax", "10");
	});
});

describe("Value Display", () => {
	it("should update aria-valuenow and aria-valuetext when value changes", async () => {
		const t = await setup({ max: 5 });

		await expect.element(t.root).toHaveAttribute("aria-valuenow", "0");
		await expect.element(t.root).toHaveAttribute("aria-valuetext", "0 out of 5");

		const item2 = page.getByTestId("item-2");
		await item2.click();

		await expect.element(t.root).toHaveAttribute("aria-valuenow", "3");
		await expect.element(t.root).toHaveAttribute("aria-valuetext", "3 out of 5");
	});

	it("should handle decimal values in aria attributes", async () => {
		const t = await setup({ allowHalf: true, max: 5 });

		const setHalfButton = page.getByTestId("set-half-button");
		await setHalfButton.click();

		await expect.element(t.root).toHaveAttribute("aria-valuenow", "2.5");
		await expect.element(t.root).toHaveAttribute("aria-valuetext", "2.5 out of 5");
	});

	it("should provide correct state in item snippets", async () => {
		await setup({ allowHalf: true, max: 5 });

		// set a half rating of 2.5
		const setHalfButton = page.getByTestId("set-half-button");
		await setHalfButton.click();

		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("partial");
		await expect.element(page.getByTestId("state-3")).toMatchTextContent("inactive");
		await expect.element(page.getByTestId("state-4")).toMatchTextContent("inactive");
	});
});

describe("Min Value", () => {
	it("should use min value for aria-valuemin", async () => {
		const t = await setup({ min: 1, max: 5 });

		await expect.element(t.root).toHaveAttribute("aria-valuemin", "1");
		await expect.element(t.root).toHaveAttribute("aria-valuemax", "5");
	});

	it("should clamp values to min bound", async () => {
		await setup({ min: 1, max: 5, value: 0 });
		const valueDisplay = page.getByTestId("value-display");

		// value should be clamped to min
		await expect.element(valueDisplay).toMatchTextContent("1");
	});

	it("should go to minimum with Home key", async () => {
		const t = await setup({ min: 1, max: 5, value: 3 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("3");

		await userEvent.keyboard(kbd.HOME);
		await expect.element(valueDisplay).toMatchTextContent("1");
	});

	it("should not allow values below min with keyboard", async () => {
		const t = await setup({ min: 1, max: 5, value: 1 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("1");

		// try to go below minimum
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(valueDisplay).toMatchTextContent("1");
	});

	it("should only accept number keys within min-max range", async () => {
		const t = await setup({ min: 2, max: 4 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();

		// try number below min (should be ignored)
		await userEvent.keyboard("1");
		await expect.element(valueDisplay).toMatchTextContent("2");

		// try number within range
		await userEvent.keyboard("3");
		await expect.element(valueDisplay).toMatchTextContent("3");

		// try number above max (should be ignored)
		await userEvent.keyboard("5");
		await expect.element(valueDisplay).toMatchTextContent("3");
	});
});

describe("Hover Preview", () => {
	it("should show preview on hover when hoverPreview is enabled", async () => {
		await setup({ value: 1, max: 5, hoverPreview: true });
		const valueDisplay = page.getByTestId("value-display");

		// initial state - only first item should be active
		await expect.element(valueDisplay).toMatchTextContent("1");
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("inactive");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("inactive");

		// hover over third item
		const item3 = page.getByTestId("item-2");
		await item3.hover({ position: { x: 5, y: 5 } });

		// value should remain the same, but states should show preview
		await expect.element(valueDisplay).toMatchTextContent("1");
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-3")).toMatchTextContent("inactive");
	});

	it("should reset preview on pointer leave", async () => {
		const t = await setup({ value: 1, max: 5, hoverPreview: true });

		// hover over third item
		const item3 = page.getByTestId("item-2");
		await item3.hover();

		// preview should be active
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("active");

		// leave the root element
		await t.root.unhover();

		// should return to original state
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("inactive");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("inactive");
	});

	it("should not show preview when hoverPreview is disabled", async () => {
		await setup({ value: 1, max: 5, hoverPreview: false });

		// initial state
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("inactive");

		// hover over third item
		const item3 = page.getByTestId("item-2");
		await item3.hover();

		// states should remain unchanged
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("inactive");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("inactive");
	});

	it("should not show preview when disabled", async () => {
		await setup({ value: 1, max: 5, disabled: true });

		// hover over third item
		const item3 = page.getByTestId("item-2");
		await item3.hover();

		// states should remain unchanged due to disabled state
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("inactive");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("inactive");
	});

	it("should not show preview when readonly", async () => {
		await setup({ value: 1, max: 5, readonly: true });

		// hover over third item
		const item3 = page.getByTestId("item-2");
		await item3.hover();

		// states should remain unchanged due to readonly state
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("inactive");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("inactive");
	});

	it("should show preview with half ratings when allowHalf is enabled", async () => {
		await setup({ value: 1, max: 5, allowHalf: true });

		// use simple hover which should work more reliably
		const item3 = page.getByTestId("item-2");
		await item3.hover({ position: { x: 5, y: 5 } });

		// should show preview up to at least the hovered item (exact half behavior depends on pointer position)
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("partial");
		await expect.element(page.getByTestId("state-3")).toMatchTextContent("inactive");
	});

	it("should ignore touch events for hover preview", async () => {
		await setup({ value: 1, max: 5, hoverPreview: true });

		const item3 = page.getByTestId("item-2");

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
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("inactive");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("inactive");
	});

	it("should work with mouse pointer events for hover preview", async () => {
		await setup({ value: 1, max: 5 });

		// use simple hover which simulates mouse interaction
		const item3 = page.getByTestId("item-2");
		await item3.hover();

		// should show preview for mouse events
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-3")).toMatchTextContent("inactive");
	});

	it("should not show preview below min value", async () => {
		await setup({ value: 3, min: 2, max: 5, hoverPreview: true });

		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-3")).toMatchTextContent("inactive");

		const item1 = page.getByTestId("item-0");
		await item1.hover();

		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("inactive");
		await expect.element(page.getByTestId("state-3")).toMatchTextContent("inactive");
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
		const t = await setup({ allowHalf: true, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("0");

		// type "2.5" sequence
		await userEvent.type(t.root, "2.5");
		vi.runAllTimers();

		await expect.element(valueDisplay).toMatchTextContent("2.5");
	});
});

describe("RTL Behavior", () => {
	async function setupRTL(props: Partial<RatingGroupTestProps> = {}) {
		const returned = await render(RatingGroupTest, { ...props });
		const input = returned.container.querySelector("input") as HTMLInputElement;
		const root = returned.getByTestId("root");

		const el = root.element() as HTMLElement;

		// set RTL direction
		el.style.direction = "rtl";

		return { input, root, ...returned };
	}

	it("should handle click behavior in RTL mode", async () => {
		await setupRTL({ max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		// basic click functionality should work the same in RTL
		await page.getByTestId("item-2").click();

		await expect.element(valueDisplay).toMatchTextContent("3");
	});

	it("should handle keyboard navigation in RTL mode", async () => {
		const t = await setupRTL({ value: 2, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("2");

		// in RTL mode, arrow keys should be flipped
		// ARROW_LEFT should increment (move forward in reading direction)
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(valueDisplay).toMatchTextContent("3");

		// ARROW_RIGHT should decrement (move backward in reading direction)
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(valueDisplay).toMatchTextContent("2");

		// UP and DOWN should work the same regardless of RTL
		await userEvent.keyboard(kbd.ARROW_UP);
		await expect.element(valueDisplay).toMatchTextContent("3");

		await userEvent.keyboard(kbd.ARROW_DOWN);
		await expect.element(valueDisplay).toMatchTextContent("2");
	});

	it("should handle hover preview in RTL mode", async () => {
		await setupRTL({ value: 1, max: 5, hoverPreview: true });

		// hover should still work normally in RTL
		const item3 = page.getByTestId("item-2");
		await item3.hover();

		// should show preview regardless of RTL
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-3")).toMatchTextContent("inactive");
	});

	it("should handle vertical orientation in RTL mode", async () => {
		const t = await setupRTL({ orientation: "vertical", max: 5 });

		await expect.element(t.root).toHaveAttribute("data-orientation", "vertical");
		await expect.element(t.root).toHaveAttribute("aria-orientation", "vertical");

		// clicking should still work in vertical RTL
		const item3 = page.getByTestId("item-2");
		await item3.click();

		const valueDisplay = page.getByTestId("value-display");
		await expect.element(valueDisplay).toMatchTextContent("3");
	});

	it("should have correct data attributes in RTL mode", async () => {
		const t = await setupRTL({ value: 2, max: 5, disabled: true, readonly: true });

		// data attributes should be the same regardless of RTL
		await expect.element(t.root).toHaveAttribute("aria-valuenow", "2");
		await expect.element(t.root).toHaveAttribute("aria-valuemax", "5");
		await expect.element(t.root).toHaveAttribute("data-disabled", "");
		await expect.element(t.root).toHaveAttribute("data-readonly", "");
		await expect.element(t.root).toHaveAttribute("data-orientation", "horizontal");
	});

	it("should handle allowHalf functionality in RTL mode", async () => {
		await setupRTL({ allowHalf: true, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		// test half functionality by setting half value programmatically
		const setHalfButton = page.getByTestId("set-half-button");
		await setHalfButton.click();

		await expect.element(valueDisplay).toMatchTextContent("2.5");

		// check that item states are correct regardless of RTL
		await expect.element(page.getByTestId("state-0")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-1")).toMatchTextContent("active");
		await expect.element(page.getByTestId("state-2")).toMatchTextContent("partial");
		await expect.element(page.getByTestId("state-3")).toMatchTextContent("inactive");
		await expect.element(page.getByTestId("state-4")).toMatchTextContent("inactive");
	});

	it("should handle disabled state in RTL mode", async () => {
		await setupRTL({ disabled: true, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("0");

		// clicking should not work when disabled, regardless of RTL
		const item3 = page.getByTestId("item-2");
		await userEvent.click(item3, { force: true });

		await expect.element(valueDisplay).toMatchTextContent("0");
	});

	it("should handle readonly state in RTL mode", async () => {
		await setupRTL({ readonly: true, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("0");

		// clicking should not work when readonly, regardless of RTL
		const item3 = page.getByTestId("item-2");
		await item3.click();

		await expect.element(valueDisplay).toMatchTextContent("0");
	});

	it("should handle keyboard navigation with half values in RTL mode", async () => {
		const t = await setupRTL({ value: 2, max: 5, allowHalf: true });
		const valueDisplay = page.getByTestId("value-display");

		(t.root.element() as HTMLElement).focus();
		await expect.element(valueDisplay).toMatchTextContent("2");

		// in RTL mode with allowHalf, arrow keys should use 0.5 increments
		// ARROW_LEFT should increment by 0.5
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(valueDisplay).toMatchTextContent("2.5");

		// ARROW_RIGHT should decrement by 0.5
		await userEvent.keyboard(kbd.ARROW_RIGHT);
		await expect.element(valueDisplay).toMatchTextContent("2");

		// another left to increment again
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(valueDisplay).toMatchTextContent("2.5");

		// another left to get to 3
		await userEvent.keyboard(kbd.ARROW_LEFT);
		await expect.element(valueDisplay).toMatchTextContent("3");
	});
});

describe("Clear Functionality", () => {
	it("should clear rating when clicking first item that's already active and min is 0", async () => {
		await setup({ value: 1, min: 0, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("1");

		// click the first item to clear
		const item1 = page.getByTestId("item-0");
		await item1.click();

		await expect.element(valueDisplay).toMatchTextContent("0");
	});

	it("should clear rating when clicking first item with half value and min is 0", async () => {
		await setup({ value: 0.5, min: 0, max: 5, allowHalf: true });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("0.5");

		// click the first item - since testing-library clicks center/right, it likely calculates to 1
		// so it won't clear (1 !== 0.5), it will change to 1
		const item1 = page.getByTestId("item-0");
		await item1.click({ position: { x: 0, y: 0 } });

		await expect.element(valueDisplay).toMatchTextContent("0");
	});

	it("should not clear when clicking first item if min is greater than 0", async () => {
		await setup({ value: 1, min: 1, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("1");

		// click the first item - should not clear because min is 1
		const item1 = page.getByTestId("item-0");
		await item1.click();

		await expect.element(valueDisplay).toMatchTextContent("1");
	});

	it("should not clear when clicking first item if it's not active", async () => {
		await setup({ value: 2, min: 0, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("2");

		// click the first item - should set to 1, not clear
		const item1 = page.getByTestId("item-0");
		await item1.click();

		await expect.element(valueDisplay).toMatchTextContent("1");
	});

	it("should not clear when clicking second item even if active and min is 0", async () => {
		await setup({ value: 2, min: 0, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("2");

		// click the second item - should stay at 2, not clear
		const item2 = page.getByTestId("item-1");
		await item2.click();

		await expect.element(valueDisplay).toMatchTextContent("2");
	});

	it("should not clear when disabled", async () => {
		await setup({ value: 1, min: 0, max: 5, disabled: true });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("1");

		// click should not work when disabled
		const item1 = page.getByTestId("item-0");
		await item1.click();

		await expect.element(valueDisplay).toMatchTextContent("1");
	});

	it("should not clear when readonly", async () => {
		await setup({ value: 1, min: 0, max: 5, readonly: true });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("1");

		// click should not work when readonly
		const item1 = page.getByTestId("item-0");
		await item1.click();

		await expect.element(valueDisplay).toMatchTextContent("1");
	});

	it("should focus root after clearing", async () => {
		const t = await setup({ value: 1, min: 0, max: 5 });

		const item1 = page.getByTestId("item-0");
		await item1.click();

		await expect.element(t.root).toHaveFocus();
	});

	it("should call onValueChange when clearing", async () => {
		const onValueChange = vi.fn();
		await setup({ value: 1, min: 0, max: 5, onValueChange });

		const item1 = page.getByTestId("item-0");
		await item1.click();

		expect(onValueChange).toHaveBeenCalledWith(0);
	});

	it("should update hidden input value when clearing", async () => {
		const t = await setup({ value: 1, min: 0, max: 5, name: "rating" });

		await expect.element(t.input).toHaveValue("1");

		const item1 = page.getByTestId("item-0");
		await item1.click();

		await expect.element(t.input).toHaveValue("0");
	});

	it("should clear with allowHalf when clicking left side of first item", async () => {
		await setup({ value: 1, min: 0, max: 5, allowHalf: true });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("1");

		// when we click the first item with allowHalf, calculateRatingFromPointer
		// could return 0.5 or 1 depending on position, but we're testing the case
		// where current value (1) matches the calculated value
		const item1 = page.getByTestId("item-0");
		await item1.click();

		// should either clear to 0 if clicked in same position, or set to 0.5 if clicked left side
		const newValue = valueDisplay.element().textContent;
		expect(newValue === "0" || newValue === "0.5").toBe(true);
	});

	it("should work in RTL mode", async () => {
		async function setupClearRTL(props: Partial<RatingGroupTestProps> = {}) {
			const returned = await render(RatingGroupTest, { ...props });
			const input = returned.container.querySelector("input") as HTMLInputElement;
			const root = page.getByTestId("root").element() as HTMLElement;

			// set RTL direction
			root.style.direction = "rtl";

			return { input, root, ...returned };
		}

		await setupClearRTL({ value: 1, min: 0, max: 5 });
		const valueDisplay = page.getByTestId("value-display");

		await expect.element(valueDisplay).toMatchTextContent("1");

		// clear should work the same in RTL
		const item1 = page.getByTestId("item-0");
		await item1.click();

		await expect.element(valueDisplay).toMatchTextContent("0");
	});
});
