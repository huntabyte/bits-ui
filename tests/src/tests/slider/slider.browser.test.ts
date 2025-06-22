// Credit to @paoloricciuti for this code via melt :)
import { expect, it, vi, describe } from "vitest";
import { render } from "vitest-browser-svelte";
import { getTestKbd } from "../utils.js";
import SliderMultiTest, { type SliderMultiTestProps } from "./slider-test-multi.svelte";
import SliderRangeTest, { type SliderMultiRangeTestProps } from "./slider-range-test.svelte";
import SliderWithLabelsTest, {
	type SliderWithLabelsTestProps,
} from "./slider-test-with-labels.svelte";
import { setupBrowserUserEvents } from "../browser-utils";
import type { Locator } from "@vitest/browser/context";

const kbd = getTestKbd();

function renderSlider(props: SliderMultiTestProps = {}) {
	return render(SliderMultiTest, { ...props });
}
function renderSliderRange(props: SliderMultiRangeTestProps = {}) {
	return render(SliderRangeTest, { ...props });
}
function renderSliderWithLabels(props: SliderWithLabelsTestProps = {}) {
	return render(SliderWithLabelsTest, { ...props });
}

function setup(
	props: SliderMultiTestProps | SliderWithLabelsTestProps = {},
	kind: "default" | "range" | "labels" = "default"
) {
	const user = setupBrowserUserEvents();
	let t: ReturnType<typeof render>;
	if (kind === "default") {
		t = renderSlider(props as SliderMultiTestProps);
	} else if (kind === "range") {
		t = renderSliderRange(props as SliderMultiRangeTestProps);
	} else {
		t = renderSliderWithLabels(props as SliderWithLabelsTestProps);
	}

	const root = t.getByTestId("root").element() as HTMLElement;

	function getAllByTestId(testId: Parameters<typeof t.getByTestId>[0]) {
		return t.getByTestId(testId).all();
	}
	return { root, user, getAllByTestId, ...t };
}

it("should have a thumb positioned at 30% of the container", async () => {
	const t = setup();

	const thumb = t.getByTestId("thumb").element() as HTMLElement;
	expect(thumb).toBeInTheDocument();

	expect(isCloseEnough(30, thumb.style.left)).toBeTruthy();
});
it("should have a range that covers from 0 to 30%", async () => {
	const t = setup();

	const range = t.getByTestId("range").element() as HTMLElement;
	expect(range).toBeInTheDocument();

	expect(isCloseEnough(0, range.style.left)).toBeTruthy();
	expect(isCloseEnough(70, range.style.right)).toBeTruthy();
});

it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])("should change by 1% when pressing %s", async (key) => {
	const t = setup();

	const thumb = t.getByTestId("thumb").element() as HTMLElement;
	const range = t.getByTestId("range").element() as HTMLElement;

	thumb.focus();
	await t.user.keyboard(key);

	expectPercentage({ percentage: 31, thumb, range });
});

it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])("should change by 1% when pressing %s", async (key) => {
	const t = setup();

	const thumb = t.getByTestId("thumb").element() as HTMLElement;
	const range = t.getByTestId("range").element() as HTMLElement;
	thumb.focus();

	await t.user.keyboard(key);

	expectPercentage({ percentage: 29, thumb, range });
});

it("should go to minimum when pressing Home", async () => {
	const t = setup();

	const thumb = t.getByTestId("thumb").element() as HTMLElement;
	const range = t.getByTestId("range").element() as HTMLElement;

	thumb.focus();
	await t.user.keyboard(kbd.HOME);

	expectPercentage({ percentage: 0, thumb, range });
});

it("should go to maximum when pressing End", async () => {
	const t = setup();
	const thumb = t.getByTestId("thumb").element() as HTMLElement;
	const range = t.getByTestId("range").element() as HTMLElement;

	thumb.focus();
	await t.user.keyboard(kbd.END);

	expectPercentage({ percentage: 100, thumb, range });
});

it("should call onValueChange when the value changes", async () => {
	const mock = vi.fn();
	const t = setup({
		onValueChange: mock,
	});

	const thumb = t.getByTestId("thumb").element() as HTMLElement;
	thumb.focus();

	await t.user.keyboard(kbd.ARROW_RIGHT);
	expect(mock).toHaveBeenCalledWith([31]);
});

it("should not allow the value to change when the `disabled` prop is set to true", async () => {
	const t = setup({ disabled: true });

	const thumb = t.getByTestId("thumb").element() as HTMLElement;
	const range = t.getByTestId("range").element() as HTMLElement;

	thumb.focus();
	await t.user.keyboard(kbd.HOME);
	expectPercentage({ percentage: 30, thumb, range });
});

describe("range", () => {
	it("should have a thumb positioned at 20% of the container and one at 80%", async () => {
		const t = setup({}, "range");

		const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
		expect(thumb0).toBeInTheDocument();
		const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
		expect(thumb1).toBeInTheDocument();

		expect(isCloseEnough(20, thumb0.style.left)).toBeTruthy();
		expect(isCloseEnough(80, thumb1.style.left)).toBeTruthy();
	});

	it("should have a range that covers from 20% to 80%", async () => {
		const t = setup({}, "range");

		const range = t.getByTestId("range").element() as HTMLElement;
		expect(range).toBeInTheDocument();

		expect(isCloseEnough(20, range.style.left)).toBeTruthy();
		expect(isCloseEnough(20, range.style.right)).toBeTruthy();
	});

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should change by 1% when pressing %s (pressing on the first thumb)",
		async (key) => {
			const t = setup({}, "range");

			const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
			const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb0.focus();
			await t.user.keyboard(key);

			expectPercentages({ percentages: [21, 80], thumbs: [thumb0, thumb1], range });
		}
	);

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should change by 1% when pressing %s (pressing on the last thumb)",
		async (key) => {
			const t = setup({}, "range");

			const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
			const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb1.focus();
			await t.user.keyboard(key);

			expectPercentages({ percentages: [20, 81], thumbs: [thumb0, thumb1], range });
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should change by 1% when pressing %s (pressing on the first thumb)",
		async (key) => {
			const t = setup({}, "range");

			const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
			const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb0.focus();
			await t.user.keyboard(key);

			expectPercentages({ percentages: [19, 80], thumbs: [thumb0, thumb1], range });
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should change by 1% when pressing %s (pressing on the last thumb)",
		async (key) => {
			const t = setup({}, "range");

			const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
			const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb1.focus();
			await t.user.keyboard(key);

			expectPercentages({ percentages: [20, 79], thumbs: [thumb0, thumb1], range });
		}
	);

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should swap handler places when they overlap pressing %s (going up)",
		async (key) => {
			const t = setup(
				{
					value: [49, 51],
				},
				"range"
			);

			const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
			const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb0.focus();
			await t.user.keyboard(key);
			await t.user.keyboard(key);
			await t.user.keyboard(key);

			expectPercentages({ percentages: [51, 52], thumbs: [thumb0, thumb1], range });
			expect(thumb1).toHaveFocus();
		}
	);

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should call onValueChange when handlers swap places when they overlap pressing %s (going up)",
		async (key) => {
			const mock = vi.fn();
			const t = setup(
				{
					value: [49, 51],
					onValueChange: mock,
				},
				"range"
			);

			const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
			const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb0.focus();
			await t.user.keyboard(key);
			expect(mock).toHaveBeenCalledWith([50, 51]);
			await t.user.keyboard(key);
			expect(mock).toHaveBeenCalledWith([51, 51]);
			await t.user.keyboard(key);
			expect(mock).toHaveBeenCalledWith([51, 52]);

			expectPercentages({ percentages: [51, 52], thumbs: [thumb0, thumb1], range });
			expect(thumb1).toHaveFocus();
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should swap handler places when they overlap pressing %s (going down)",
		async (key) => {
			const t = setup(
				{
					value: [49, 51],
				},
				"range"
			);

			const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
			const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb1.focus();
			await t.user.keyboard(key);
			await t.user.keyboard(key);
			await t.user.keyboard(key);

			expectPercentages({ percentages: [48, 49], thumbs: [thumb0, thumb1], range });
			expect(thumb0).toHaveFocus();
		}
	);

	it("should bring thumb to 0  to minimum when pressing Home", async () => {
		const t = setup({}, "range");

		const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
		const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
		const range = t.getByTestId("range").element() as HTMLElement;

		thumb0.focus();
		await t.user.keyboard(kbd.HOME);

		expectPercentages({ percentages: [0, 80], thumbs: [thumb0, thumb1], range });
	});

	it("should bring thumb 1  to maximum when pressing End", async () => {
		const t = setup({}, "range");

		const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
		const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
		const range = t.getByTestId("range").element() as HTMLElement;

		thumb1.focus();
		await t.user.keyboard(kbd.END);

		expectPercentages({ percentages: [20, 100], thumbs: [thumb0, thumb1], range });
	});

	it("should bring thumb 1  to minimum when pressing Home (thumbs swap places)", async () => {
		const t = setup({}, "range");

		const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
		const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
		const range = t.getByTestId("range").element() as HTMLElement;

		thumb1.focus();
		await t.user.keyboard(kbd.HOME);

		expectPercentages({ percentages: [0, 20], thumbs: [thumb0, thumb1], range });
		expect(thumb0).toHaveFocus();
	});

	it("should bring thumb 0 to maximum when pressing End (thumbs swap places)", async () => {
		const t = setup({}, "range");

		const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
		const thumb1 = t.getByTestId("thumb-1").element() as HTMLElement;
		const range = t.getByTestId("range").element() as HTMLElement;

		thumb0.focus();
		await t.user.keyboard(kbd.END);

		expectPercentages({ percentages: [80, 100], thumbs: [thumb0, thumb1], range });
		expect(thumb1).toHaveFocus();
	});
});

describe("small min, max, step", () => {
	it("should have a thumb positioned at 50% of the container", async () => {
		const t = setup({
			value: [0.5],
			min: 0,
			max: 1,
			step: 0.01,
		});

		const thumb = t.getByTestId("thumb").element() as HTMLElement;
		expect(thumb).toBeInTheDocument();

		expect(isCloseEnough(50, thumb.style.left)).toBeTruthy();
	});

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should change by 1% when pressing %s",
		async (key) => {
			const t = setup({
				value: [0.5],
				min: 0,
				max: 1,
				step: 0.01,
			});

			const thumb = t.getByTestId("thumb").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb.focus();
			await t.user.keyboard(key);

			expectPercentage({ percentage: 51, thumb, range });
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should change by 10% when pressing %s",
		async (key) => {
			const t = setup({
				value: [0.5],
				min: 0,
				max: 1,
				step: 0.01,
			});

			const thumb = t.getByTestId("thumb").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb.focus();
			await t.user.keyboard(key);

			expectPercentage({ percentage: 49, thumb, range });
		}
	);
});

describe("slider (negative min)", () => {
	it("should have a thumb positioned at 50% of the container", async () => {
		const t = setup({
			value: [0],
			min: -50,
			max: 50,
			step: 1,
		});

		const thumb = t.getByTestId("thumb").element() as HTMLElement;
		expect(thumb).toBeInTheDocument();

		expect(isCloseEnough(50, thumb.style.left)).toBeTruthy();
	});

	it.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"should change by 1% when pressing %s",
		async (key) => {
			const t = setup({
				value: [0],
				min: -50,
				max: 50,
				step: 1,
			});

			const thumb = t.getByTestId("thumb").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb.focus();
			await t.user.keyboard(key);

			expectPercentage({ percentage: 51, thumb, range });
		}
	);

	it.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"should change by 10% when pressing %s",
		async (key) => {
			const t = setup({
				value: [0],
				min: -50,
				max: 50,
				step: 1,
			});

			const thumb = t.getByTestId("thumb").element() as HTMLElement;
			const range = t.getByTestId("range").element() as HTMLElement;

			thumb.focus();
			await t.user.keyboard(key);

			expectPercentage({ percentage: 49, thumb, range });
		}
	);
});

describe("slider (value=[5], min=0, max=10, step=1)", () => {
	const props = {
		value: [5],
		min: 0,
		max: 10,
		step: 1,
	};

	it("should render 11 ticks", () => {
		const t = setup(props);

		expect(t.getAllByTestId("tick")).toHaveLength(11);
	});

	it("should have a data-bounded attribute on ticks 0-5", () => {
		const t = setup(props);

		const ticks = t.getAllByTestId("tick");
		for (let i = 0; i <= 5; ++i) {
			expect(ticks[i]).toHaveAttribute("data-bounded");
		}
	});

	it("should not have a data-bounded attribute on ticks 6-10", () => {
		const t = setup(props);

		const ticks = t.getAllByTestId("tick");
		for (let i = 6; i <= 10; ++i) {
			expect(ticks[i]).not.toHaveAttribute("data-bounded");
		}
	});
});

describe("slider (min=0, max=8, step=3)", () => {
	it("should render 3 ticks", () => {
		const t = setup({
			min: 0,
			max: 8,
			step: 3,
		});

		expect(t.getAllByTestId("tick")).toHaveLength(3);
	});
});

describe("slider (min=0, max=9, step=3)", () => {
	it("should render 4 ticks", () => {
		const t = setup({
			min: 0,
			max: 9,
			step: 3,
		});

		expect(t.getAllByTestId("tick")).toHaveLength(4);
	});
});

describe("slider (value=[3,6], min=0, max=10, step=3)", () => {
	const props = {
		value: [3, 6],
		min: 0,
		max: 10,
		step: 3,
	};

	it("should render 4 ticks", () => {
		const t = setup(props);

		expect(t.getAllByTestId("tick")).toHaveLength(4);
	});

	it("should have a data-bounded attribute on ticks 1,2", () => {
		const t = setup(props);

		const ticks = t.getAllByTestId("tick");
		for (const i of [1, 2]) {
			expect(ticks[i]).toHaveAttribute("data-bounded");
		}
	});

	it("should not have a data-bounded attribute on ticks 0,3", () => {
		const t = setup(props);

		const ticks = t.getAllByTestId("tick");
		for (const i of [0, 3]) {
			expect(ticks[i]).not.toHaveAttribute("data-bounded");
		}
	});
});

describe("slider changing options after building", () => {
	const props = {
		value: [5],
		min: 0,
		max: 10,
		step: 1,
	};

	it("should change the min", async () => {
		const t = setup(props);

		expect(t.getAllByTestId("tick")).toHaveLength(11);

		await t.rerender({ ...props, resetMin: 2 });

		expect(t.getAllByTestId("tick")).toHaveLength(9);
	});

	it("should change the max", async () => {
		const t = setup(props);

		expect(t.getAllByTestId("tick")).toHaveLength(11);

		await t.rerender({ ...props, resetMax: 8 });

		expect(t.getAllByTestId("tick")).toHaveLength(9);
	});

	it("should change the  step", async () => {
		const t = setup(props);

		expect(t.getAllByTestId("tick")).toHaveLength(11);

		await t.rerender({ ...props, resetStep: 2 });

		expect(t.getAllByTestId("tick")).toHaveLength(6);
	});
});

describe("floating point precision", () => {
	it("should handle decimal steps without floating point precision errors", async () => {
		const mock = vi.fn();
		const t = setup({
			value: [1.1],
			min: 0,
			max: 2,
			step: 0.1,
			onValueChange: mock,
		});

		const thumb = t.getByTestId("thumb").element() as HTMLElement;
		thumb.focus();

		// move right by one step (from 1.1 to 1.2)
		await t.user.keyboard(kbd.ARROW_RIGHT);

		// check that the value is exactly 1.2, not 1.2000000000000002
		expect(mock).toHaveBeenCalledWith([1.2]);

		// check the aria-valuenow attribute for precision
		expect(thumb).toHaveAttribute("aria-valuenow", "1.2");
		expect(thumb).toHaveAttribute("data-value", "1.2");
	});

	it("should handle smaller decimal steps (0.01) without precision errors", async () => {
		const mock = vi.fn();
		const t = setup({
			value: [0.11],
			min: 0,
			max: 1,
			step: 0.01,
			onValueChange: mock,
		});

		const thumb = t.getByTestId("thumb").element() as HTMLElement;
		thumb.focus();

		// move right by one step (from 0.11 to 0.12)
		await t.user.keyboard(kbd.ARROW_RIGHT);

		// check that the value is exactly 0.12
		expect(mock).toHaveBeenCalledWith([0.12]);
		expect(thumb).toHaveAttribute("aria-valuenow", "0.12");
		expect(thumb).toHaveAttribute("data-value", "0.12");
	});

	it("should generate correct step values for decimal steps", async () => {
		const t = setup({
			value: [1.2],
			min: 1,
			max: 1.5,
			step: 0.1,
		});

		const ticks = t.getAllByTestId("tick");
		expect(ticks).toHaveLength(6); // 1.0, 1.1, 1.2, 1.3, 1.4, 1.5

		// check that tick values are precise
		expect(ticks[0]).toHaveAttribute("data-value", "1");
		expect(ticks[1]).toHaveAttribute("data-value", "1.1");
		expect(ticks[2]).toHaveAttribute("data-value", "1.2");
		expect(ticks[3]).toHaveAttribute("data-value", "1.3");
		expect(ticks[4]).toHaveAttribute("data-value", "1.4");
		expect(ticks[5]).toHaveAttribute("data-value", "1.5");
	});
});

const IS_ENOUGH_CLOSE = 0.0001;

/**
 * Unfortunately sometimes floating point arithmetic still strikes
 * so we need to check that we are close enough rather than precisely
 */
function isCloseEnough(value: number, style: string) {
	const numStyle = Number.parseFloat(style.replace("%", ""));
	return Math.abs(numStyle - value) < IS_ENOUGH_CLOSE;
}

function expectPercentage({
	percentage,
	thumb,
	range,
}: {
	percentage: number;
	thumb: HTMLElement;
	range: HTMLElement;
}) {
	expect(isCloseEnough(percentage, thumb.style.left)).toBeTruthy();
	expect(isCloseEnough(0, range.style.left)).toBeTruthy();
	expect(isCloseEnough(100 - percentage, range.style.right)).toBeTruthy();
}

function expectPercentages({
	percentages,
	thumbs,
	range,
}: {
	percentages: number[];
	thumbs: HTMLElement[];
	range: HTMLElement;
}) {
	let lesserPercentage = Number.POSITIVE_INFINITY;
	let higherPercentage = Number.NEGATIVE_INFINITY;
	for (let i = 0; i < percentages.length; i++) {
		const thumb = thumbs[i] as HTMLElement;
		const percentage = percentages[i] as number;
		if (percentage > higherPercentage) {
			higherPercentage = percentage;
		}
		if (percentage < lesserPercentage) {
			lesserPercentage = percentage;
		}
		expect(isCloseEnough(percentage, thumb.style.left)).toBeTruthy();
	}
	expect(isCloseEnough(lesserPercentage, range.style.left)).toBeTruthy();
	expect(isCloseEnough(100 - higherPercentage, range.style.right)).toBeTruthy();
}

describe("labels", () => {
	describe("tick labels", () => {
		it("should render tick labels with correct data attributes", async () => {
			const t = setup({ value: [50], min: 0, max: 100, step: 25 }, "labels");

			const tickLabels = t.getAllByTestId(/^tick-label-/);
			expect(tickLabels).toHaveLength(5);

			const firstTickLabel = t.getAllByTestId("tick-label-0")[0];
			expect(firstTickLabel).toHaveAttribute("data-value", "0");
			expect(firstTickLabel).toHaveAttribute("data-orientation", "horizontal");
			expect(firstTickLabel).toHaveAttribute("data-bounded");
			expect(firstTickLabel).toHaveAttribute("data-slider-tick-label");
			expect(firstTickLabel).toHaveAttribute("data-position", "top");

			const selectedTickLabel = t.getAllByTestId("tick-label-2")[0];
			expect(selectedTickLabel).toHaveAttribute("data-value", "50");
			expect(selectedTickLabel).toHaveAttribute("data-selected");
			expect(selectedTickLabel).toHaveAttribute("data-bounded");

			const unboundedTickLabel = t.getAllByTestId("tick-label-3")[0];
			expect(unboundedTickLabel).toHaveAttribute("data-value", "75");
			expect(unboundedTickLabel).not.toHaveAttribute("data-bounded");
			expect(unboundedTickLabel).not.toHaveAttribute("data-selected");
		});

		it("should render tick labels with correct content", async () => {
			const t = setup({ value: [50], min: 0, max: 100, step: 25 }, "labels");

			const tickLabels = t.getAllByTestId(/^tick-label-/);
			const expectedValues = ["0", "25", "50", "75", "100"];

			tickLabels.forEach((label: Locator, index: number) => {
				expect(label.element().textContent).toBe(expectedValues[index]);
			});
		});

		it("should position tick labels correctly with different positions", async () => {
			const t = setup(
				{
					value: [50],
					min: 0,
					max: 100,
					step: 50,
					tickLabelPosition: "bottom",
				},
				"labels"
			);

			const tickLabels = t.getAllByTestId(/^tick-label-/);
			tickLabels.forEach((label: Locator) => {
				expect(label).toHaveAttribute("data-position", "bottom");
				expect((label.element() as HTMLElement).style.top).toBe("100%");
			});
		});

		it("should handle disabled state correctly", async () => {
			const t = setup(
				{
					value: [50],
					min: 0,
					max: 100,
					step: 50,
					disabled: true,
				},
				"labels"
			);

			const tickLabels = t.getAllByTestId(/^tick-label-/);
			tickLabels.forEach((label: Locator) => {
				expect(label.element()).toHaveAttribute("data-disabled");
			});
		});

		it("should handle vertical orientation correctly", async () => {
			const t = setup(
				{
					value: [50],
					min: 0,
					max: 100,
					step: 50,
					orientation: "vertical",
				},
				"labels"
			);

			const tickLabels = t.getAllByTestId(/^tick-label-/);
			tickLabels.forEach((label: Locator) => {
				expect(label.element()).toHaveAttribute("data-orientation", "vertical");
				expect(label.element()).toHaveAttribute("data-position", "left");
			});
		});

		it("should update bounded state when value changes", async () => {
			const t = setup(
				{
					value: [25],
					min: 0,
					max: 100,
					step: 25,
				},
				"labels"
			);

			// initially, ticks 0 and 1 should be bounded
			let tickLabels = t.getAllByTestId(/^tick-label-/);
			expect(tickLabels[0]).toHaveAttribute("data-bounded");
			expect(tickLabels[1]).toHaveAttribute("data-bounded");
			expect(tickLabels[2]).not.toHaveAttribute("data-bounded");

			// change value to 75
			await t.rerender({ value: [75], min: 0, max: 100, step: 25 });

			tickLabels = t.getAllByTestId(/^tick-label-/);
			expect(tickLabels[0]).toHaveAttribute("data-bounded");
			expect(tickLabels[1]).toHaveAttribute("data-bounded");
			expect(tickLabels[2]).toHaveAttribute("data-bounded");
			expect(tickLabels[3]).toHaveAttribute("data-bounded");
			expect(tickLabels[4]).not.toHaveAttribute("data-bounded");
		});
	});

	describe("thumb labels", () => {
		it("should render thumb labels with correct data attributes", async () => {
			const t = setup({ value: [50] }, "labels");

			const thumbLabel = t.getByTestId("thumb-label-0");
			expect(thumbLabel).toHaveAttribute("data-value", "50");
			expect(thumbLabel).toHaveAttribute("data-orientation", "horizontal");
			expect(thumbLabel).toHaveAttribute("data-slider-thumb-label");
			expect(thumbLabel).toHaveAttribute("data-position", "top");
			expect(thumbLabel).not.toHaveAttribute("data-disabled");
			expect(thumbLabel).not.toHaveAttribute("data-active");
		});

		it("should render thumb labels with correct content", async () => {
			const t = setup({ value: [75] }, "labels");

			const thumbLabel = t.getByTestId("thumb-label-0");
			expect(thumbLabel.element().textContent).toBe("75");
		});

		it("should handle disabled state correctly", async () => {
			const t = setup(
				{
					value: [50],
					disabled: true,
				},
				"labels"
			);

			const thumbLabel = t.getByTestId("thumb-label-0");
			expect(thumbLabel).toHaveAttribute("data-disabled");
		});

		it("should position thumb labels correctly with different positions", async () => {
			const t = setup(
				{
					value: [50],
					thumbLabelPosition: "bottom",
				},
				"labels"
			);

			const thumbLabel = t.getByTestId("thumb-label-0");
			expect(thumbLabel).toHaveAttribute("data-position", "bottom");
			expect((thumbLabel.element() as HTMLElement).style.top).toBe("100%");
		});

		it("should handle vertical orientation correctly", async () => {
			const t = setup(
				{
					value: [50],
					orientation: "vertical",
				},
				"labels"
			);

			const thumbLabel = t.getByTestId("thumb-label-0");
			expect(thumbLabel).toHaveAttribute("data-orientation", "vertical");
			expect(thumbLabel).toHaveAttribute("data-position", "left");
		});

		it("should update value when thumb moves", async () => {
			const t = setup({ value: [50] }, "labels");

			const thumb = t.getByTestId("thumb-0").element() as HTMLElement;
			const thumbLabel = t.getByTestId("thumb-label-0").element() as HTMLElement;

			thumb.focus();
			await t.user.keyboard(kbd.ARROW_RIGHT);

			expect(thumbLabel).toHaveAttribute("data-value", "51");
			expect(thumbLabel.textContent).toBe("51");
		});

		it("should handle multiple thumb labels correctly", async () => {
			const t = setup(
				{
					value: [20, 80],
				},
				"labels"
			);

			const thumbLabels = t.getAllByTestId(/^thumb-label-/);
			expect(thumbLabels).toHaveLength(2);

			const thumbLabel0 = t.getByTestId("thumb-label-0").element() as HTMLElement;
			const thumbLabel1 = t.getByTestId("thumb-label-1").element() as HTMLElement;

			expect(thumbLabel0).toHaveAttribute("data-value", "20");
			expect(thumbLabel0.textContent).toBe("20");

			expect(thumbLabel1).toHaveAttribute("data-value", "80");
			expect(thumbLabel1.textContent).toBe("80");
		});

		it("should maintain correct labels when thumbs swap positions (autoSort=true)", async () => {
			const t = setup(
				{
					value: [49, 51],
				},
				"labels"
			);

			const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
			const thumbLabel0 = t.getByTestId("thumb-label-0").element() as HTMLElement;
			const thumbLabel1 = t.getByTestId("thumb-label-1").element() as HTMLElement;

			thumb0.focus();
			await t.user.keyboard(kbd.ARROW_RIGHT);
			await t.user.keyboard(kbd.ARROW_RIGHT);
			await t.user.keyboard(kbd.ARROW_RIGHT);

			expect(thumbLabel0).toHaveAttribute("data-value", "51");
			expect(thumbLabel1).toHaveAttribute("data-value", "52");
		});

		it("should maintain correct labels when thumbs swap positions (autoSort=false)", async () => {
			const t = setup(
				{
					value: [49, 51],
					autoSort: false,
				},
				"labels"
			);

			const thumb0 = t.getByTestId("thumb-0").element() as HTMLElement;
			const thumbLabel0 = t.getByTestId("thumb-label-0").element() as HTMLElement;
			const thumbLabel1 = t.getByTestId("thumb-label-1").element() as HTMLElement;

			thumb0.focus();
			await t.user.keyboard(kbd.ARROW_RIGHT);
			await t.user.keyboard(kbd.ARROW_RIGHT);
			await t.user.keyboard(kbd.ARROW_RIGHT);

			expect(thumbLabel0).toHaveAttribute("data-value", "52");
			expect(thumbLabel1).toHaveAttribute("data-value", "51");
		});
	});

	describe("labels with custom steps", () => {
		it("should render correct tick labels for custom step values", async () => {
			const t = setup(
				{
					value: [6],
					min: 0,
					max: 9,
					step: 3,
				},
				"labels"
			);

			const tickLabels = t.getAllByTestId(/^tick-label-/);
			expect(tickLabels).toHaveLength(4); // 0, 3, 6, 9

			const expectedValues = ["0", "3", "6", "9"];
			tickLabels.forEach((label: Locator, index: number) => {
				expect(label.element().textContent).toBe(expectedValues[index]);
			});

			// Check bounded state
			expect(tickLabels[0]).toHaveAttribute("data-bounded");
			expect(tickLabels[1]).toHaveAttribute("data-bounded");
			expect(tickLabels[2]).toHaveAttribute("data-bounded");
			expect(tickLabels[2]).toHaveAttribute("data-selected");
			expect(tickLabels[3]).not.toHaveAttribute("data-bounded");
		});

		it("should handle fractional step values correctly", async () => {
			const t = setup(
				{
					value: [0.5],
					min: 0,
					max: 1,
					step: 0.25,
				},
				"labels"
			);

			const tickLabels = t.getAllByTestId(/^tick-label-/);
			expect(tickLabels).toHaveLength(5); // 0, 0.25, 0.5, 0.75, 1

			const expectedValues = ["0", "0.25", "0.5", "0.75", "1"];
			tickLabels.forEach((label: Locator, index: number) => {
				expect(label.element().textContent).toBe(expectedValues[index]);
			});
		});
	});

	describe("labels visibility", () => {
		it("should render both types of labels when both are enabled", async () => {
			const t = setup(
				{
					value: [50],
					min: 0,
					max: 100,
					step: 50,
					showTickLabels: true,
					showThumbLabels: true,
				},
				"labels"
			);

			const tickLabels = t.getAllByTestId(/^tick-label-/);
			const thumbLabels = t.getAllByTestId(/^thumb-label-/);

			expect(tickLabels.length).toBeGreaterThan(0);
			expect(thumbLabels.length).toBeGreaterThan(0);
		});
	});
});
