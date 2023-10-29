// Credit to @paoloricciuti for this code via melt :)
import { render } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, it } from "vitest";
import SliderTest from "./SliderTest.svelte";
import SliderRangeTest from "./SliderRangeTest.svelte";
import type { Slider } from "$lib";
import { testKbd as kbd } from "../utils";

function renderSlider(props: Slider.Props = {}) {
	return render(SliderTest, { ...props });
}
function renderSliderRange(props: Slider.Props = {}) {
	return render(SliderRangeTest, { ...props });
}

function setup(props: Slider.Props = {}, kind: "default" | "range" = "default") {
	const user = userEvent.setup();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let returned: any;
	if (kind === "default") {
		returned = renderSlider(props);
	} else {
		returned = renderSliderRange(props);
	}
	const { getByTestId } = returned;
	const root = getByTestId("root");
	return { root, user, ...returned };
}

describe("Slider (Default)", () => {
	it("No accessibility violations", async () => {
		const { container } = render(SliderTest);

		expect(await axe(container)).toHaveNoViolations();
	});

	it("Has a thumb positioned at 30% of the container", async () => {
		const { getByTestId } = setup();

		const thumb = getByTestId("thumb");
		expect(thumb).toBeInTheDocument();

		expect(isCloseEnough(30, thumb.style.left)).toBeTruthy();
	});
	it("Has a range that covers from 0 to 30%", async () => {
		const { getByTestId } = setup();

		const range = getByTestId("range");
		expect(range).toBeInTheDocument();

		expect(isCloseEnough(0, range.style.left)).toBeTruthy();
		expect(isCloseEnough(70, range.style.right)).toBeTruthy();
	});

	test.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])("Change by 1% when pressing %s", async (key) => {
		const { getByTestId } = setup();
		const user = userEvent.setup();

		const thumb = getByTestId("thumb");
		const range = getByTestId("range");

		thumb.focus();
		await user.keyboard(key);

		expectPercentage({ percentage: 31, thumb, range });
	});

	test.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])("Change by 1% when pressing %s", async (key) => {
		const { getByTestId } = setup();
		const user = userEvent.setup();

		const thumb = getByTestId("thumb");
		const range = getByTestId("range");
		thumb.focus();

		await user.keyboard(key);

		expectPercentage({ percentage: 29, thumb, range });
	});

	it("Goes to minimum when pressing Home", async () => {
		const { getByTestId } = setup();
		const user = userEvent.setup();

		const thumb = getByTestId("thumb");
		const range = getByTestId("range");

		thumb.focus();
		await user.keyboard(kbd.HOME);

		expectPercentage({ percentage: 0, thumb, range });
	});

	it("Goes to maximum when pressing End", async () => {
		const { getByTestId } = setup();
		const user = userEvent.setup();
		const thumb = getByTestId("thumb");
		const range = getByTestId("range");

		thumb.focus();
		await user.keyboard(kbd.END);

		expectPercentage({ percentage: 100, thumb, range });
	});
});

describe("Slider (Range)", () => {
	it("No accessibility violations", async () => {
		const { container } = setup({}, "range");

		expect(await axe(container)).toHaveNoViolations();
	});

	it("Has a thumb positioned at 20% of the container and one at 80%", async () => {
		const { getByTestId } = setup({}, "range");

		const thumb0 = getByTestId("thumb-0");
		expect(thumb0).toBeInTheDocument();
		const thumb1 = getByTestId("thumb-1");
		expect(thumb1).toBeInTheDocument();

		expect(isCloseEnough(20, thumb0.style.left)).toBeTruthy();
		expect(isCloseEnough(80, thumb1.style.left)).toBeTruthy();
	});
	it("Has a range that covers from 20% to 80%", async () => {
		const { getByTestId } = setup({}, "range");

		const range = getByTestId("range");
		expect(range).toBeInTheDocument();

		expect(isCloseEnough(20, range.style.left)).toBeTruthy();
		expect(isCloseEnough(20, range.style.right)).toBeTruthy();
	});

	test.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"Change by 1% when pressing %s (pressing on the first thumb)",
		async (key) => {
			const { getByTestId } = setup({}, "range");
			const user = userEvent.setup();

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb0.focus();
			await user.keyboard(key);

			expectPercentages({ percentages: [21, 80], thumbs: [thumb0, thumb1], range });
		}
	);

	test.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"Change by 1% when pressing %s (pressing on the last thumb)",
		async (key) => {
			const { getByTestId } = setup({}, "range");
			const user = userEvent.setup();

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb1.focus();
			await user.keyboard(key);

			expectPercentages({ percentages: [20, 81], thumbs: [thumb0, thumb1], range });
		}
	);

	test.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"Change by 1% when pressing %s (pressing on the first thumb)",
		async (key) => {
			const { getByTestId } = setup({}, "range");
			const user = userEvent.setup();

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb0.focus();
			await user.keyboard(key);

			expectPercentages({ percentages: [19, 80], thumbs: [thumb0, thumb1], range });
		}
	);

	test.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"Change by 1% when pressing %s (pressing on the last thumb)",
		async (key) => {
			const { getByTestId } = setup({}, "range");
			const user = userEvent.setup();

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb1.focus();
			await user.keyboard(key);

			expectPercentages({ percentages: [20, 79], thumbs: [thumb0, thumb1], range });
		}
	);

	test.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])(
		"The handlers swap places when they overlap pressing %s (going up)",
		async (key) => {
			const { getByTestId } = setup(
				{
					value: [49, 51]
				},
				"range"
			);
			const user = userEvent.setup();

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb0.focus();
			await user.keyboard(key);
			await user.keyboard(key);
			await user.keyboard(key);

			expectPercentages({ percentages: [51, 52], thumbs: [thumb0, thumb1], range });
			expect(thumb1).toHaveFocus();
		}
	);

	test.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])(
		"The handlers swap places when they overlap pressing %s (going down)",
		async (key) => {
			const { getByTestId } = setup(
				{
					value: [49, 51]
				},
				"range"
			);
			const user = userEvent.setup();

			const thumb0 = getByTestId("thumb-0");
			const thumb1 = getByTestId("thumb-1");
			const range = getByTestId("range");

			thumb1.focus();
			await user.keyboard(key);
			await user.keyboard(key);
			await user.keyboard(key);

			expectPercentages({ percentages: [48, 49], thumbs: [thumb0, thumb1], range });
			expect(thumb0).toHaveFocus();
		}
	);

	it("Thumb 0 goes to minimum when pressing Home", async () => {
		const { getByTestId } = setup({}, "range");
		const user = userEvent.setup();

		const thumb0 = getByTestId("thumb-0");
		const thumb1 = getByTestId("thumb-1");
		const range = getByTestId("range");

		thumb0.focus();
		await user.keyboard(kbd.HOME);

		expectPercentages({ percentages: [0, 80], thumbs: [thumb0, thumb1], range });
	});

	it("Thumb 1 goes to maximum when pressing End", async () => {
		const { getByTestId } = setup({}, "range");
		const user = userEvent.setup();

		const thumb0 = getByTestId("thumb-0");
		const thumb1 = getByTestId("thumb-1");
		const range = getByTestId("range");

		thumb1.focus();
		await user.keyboard(kbd.END);

		expectPercentages({ percentages: [20, 100], thumbs: [thumb0, thumb1], range });
	});

	it("Thumb 1 goes to minimum when pressing Home (thumbs swap places)", async () => {
		const { getByTestId } = setup({}, "range");
		const user = userEvent.setup();

		const thumb0 = getByTestId("thumb-0");
		const thumb1 = getByTestId("thumb-1");
		const range = getByTestId("range");

		thumb1.focus();
		await user.keyboard(kbd.HOME);

		expectPercentages({ percentages: [0, 20], thumbs: [thumb0, thumb1], range });
		expect(thumb0).toHaveFocus();
	});

	it("Thumb 0 goes to maximum when pressing End (thumbs swap places)", async () => {
		const { getByTestId } = setup({}, "range");
		const user = userEvent.setup();

		const thumb0 = getByTestId("thumb-0");
		const thumb1 = getByTestId("thumb-1");
		const range = getByTestId("range");

		thumb0.focus();
		await user.keyboard(kbd.END);

		expectPercentages({ percentages: [80, 100], thumbs: [thumb0, thumb1], range });
		expect(thumb1).toHaveFocus();
	});
});

describe("Slider (Small min, max, step)", () => {
	it("Has a thumb positioned at 50% of the container", async () => {
		const { getByTestId } = setup({
			value: [0.5],
			min: 0,
			max: 1,
			step: 0.01
		});

		const thumb = getByTestId("thumb");
		expect(thumb).toBeInTheDocument();

		expect(isCloseEnough(50, thumb.style.left)).toBeTruthy();
	});

	test.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])("Change by 1% when pressing %s", async (key) => {
		const { getByTestId } = setup({
			value: [0.5],
			min: 0,
			max: 1,
			step: 0.01
		});

		const user = userEvent.setup();

		const thumb = getByTestId("thumb");
		const range = getByTestId("range");

		thumb.focus();
		await user.keyboard(key);

		expectPercentage({ percentage: 51, thumb, range });
	});

	test.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])("Change by 10% when pressing %s", async (key) => {
		const { getByTestId } = setup({
			value: [0.5],
			min: 0,
			max: 1,
			step: 0.01
		});
		const user = userEvent.setup();

		const thumb = getByTestId("thumb");
		const range = getByTestId("range");

		thumb.focus();
		await user.keyboard(key);

		expectPercentage({ percentage: 49, thumb, range });
	});
});

describe("Slider (negative min)", () => {
	it("Has a thumb positioned at 50% of the container", async () => {
		const { getByTestId } = setup({
			value: [0],
			min: -50,
			max: 50,
			step: 1
		});

		const thumb = getByTestId("thumb");
		expect(thumb).toBeInTheDocument();

		expect(isCloseEnough(50, thumb.style.left)).toBeTruthy();
	});

	test.each([kbd.ARROW_RIGHT, kbd.ARROW_UP])("Change by 1% when pressing %s", async (key) => {
		const { getByTestId } = setup({
			value: [0],
			min: -50,
			max: 50,
			step: 1
		});

		const user = userEvent.setup();

		const thumb = getByTestId("thumb");
		const range = getByTestId("range");

		thumb.focus();
		await user.keyboard(key);

		expectPercentage({ percentage: 51, thumb, range });
	});

	test.each([kbd.ARROW_LEFT, kbd.ARROW_DOWN])("Change by 10% when pressing %s", async (key) => {
		const { getByTestId } = setup({
			value: [0],
			min: -50,
			max: 50,
			step: 1
		});
		const user = userEvent.setup();

		const thumb = getByTestId("thumb");
		const range = getByTestId("range");

		thumb.focus();
		await user.keyboard(key);

		expectPercentage({ percentage: 49, thumb, range });
	});
});

describe("Slider (value=[5], min=0, max=10, step=1)", () => {
	const props = {
		value: [5],
		min: 0,
		max: 10,
		step: 1
	};

	it("11 ticks are rendered", () => {
		const { getAllByTestId } = setup(props);

		expect(getAllByTestId("tick")).toHaveLength(11);
	});

	it("ticks 0-5 have a data-bounded attribute", () => {
		const { getAllByTestId } = setup(props);

		const ticks = getAllByTestId("tick");
		for (let i = 0; i <= 5; ++i) {
			expect(ticks[i]).toHaveAttribute("data-bounded");
		}
	});

	it("ticks 6-10 have no data-bounded attribute", () => {
		const { getAllByTestId } = setup(props);

		const ticks = getAllByTestId("tick");
		for (let i = 6; i <= 10; ++i) {
			expect(ticks[i]).not.toHaveAttribute("data-bounded");
		}
	});
});

describe("Slider (min=0, max=8, step=3)", () => {
	it("3 ticks are rendered", () => {
		const { getAllByTestId } = setup({
			min: 0,
			max: 8,
			step: 3
		});

		expect(getAllByTestId("tick")).toHaveLength(3);
	});
});

describe("Slider (min=0, max=9, step=3)", () => {
	it("4 ticks are rendered", () => {
		const { getAllByTestId } = setup({
			min: 0,
			max: 9,
			step: 3
		});

		expect(getAllByTestId("tick")).toHaveLength(4);
	});
});

describe("Slider (value=[3,6], min=0, max=10, step=3)", () => {
	const props = {
		value: [3, 6],
		min: 0,
		max: 10,
		step: 3
	};

	it("4 ticks are rendered", () => {
		const { getAllByTestId } = setup(props);

		expect(getAllByTestId("tick")).toHaveLength(4);
	});

	it("ticks 1,2 have a data-bounded attribute", () => {
		const { getAllByTestId } = setup(props);

		const ticks = getAllByTestId("tick");
		for (const i of [1, 2]) {
			expect(ticks[i]).toHaveAttribute("data-bounded");
		}
	});

	it("ticks 0,3 have no data-bounded attribute", () => {
		const { getAllByTestId } = setup(props);

		const ticks = getAllByTestId("tick");
		for (const i of [0, 3]) {
			expect(ticks[i]).not.toHaveAttribute("data-bounded");
		}
	});
});

describe("Slider changing options after building", () => {
	const props = {
		value: [5],
		min: 0,
		max: 10,
		step: 1
	};

	it("Changing min", async () => {
		const { getAllByTestId, rerender } = setup(props);

		expect(getAllByTestId("tick")).toHaveLength(11);

		await rerender({ ...props, resetMin: 2 });

		expect(getAllByTestId("tick")).toHaveLength(9);
	});

	it("Changing max", async () => {
		const { getAllByTestId, rerender } = setup(props);

		expect(getAllByTestId("tick")).toHaveLength(11);

		await rerender({ ...props, resetMax: 8 });

		expect(getAllByTestId("tick")).toHaveLength(9);
	});

	it("Changing step", async () => {
		const { getAllByTestId, rerender } = setup(props);

		expect(getAllByTestId("tick")).toHaveLength(11);

		await rerender({ ...props, resetStep: 2 });

		expect(getAllByTestId("tick")).toHaveLength(6);
	});
});

const IS_ENOUGH_CLOSE = 0.0001;

/**
 * Unfortunately sometimes floating point arithmetic still strikes
 * so we need to check that we are close enough rather than precisely
 */
function isCloseEnough(value: number, style: string) {
	const numStyle = parseFloat(style.replace("%", ""));
	return Math.abs(numStyle - value) < IS_ENOUGH_CLOSE;
}

function expectPercentage({
	percentage,
	thumb,
	range
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
	range
}: {
	percentages: number[];
	thumbs: HTMLElement[];
	range: HTMLElement;
}) {
	let lesserPercentage = Infinity;
	let higherPercentage = -Infinity;
	for (let i = 0; i < percentages.length; i++) {
		const thumb = thumbs[i];
		const percentage = percentages[i];
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
