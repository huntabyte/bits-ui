import type { StyleProperties } from "$lib/shared/index.js";

export function getRangeStyles(direction: "lr" | "rl" | "tb" | "bt", min: number, max: number) {
	const styles: StyleProperties = {
		position: "absolute",
	};
	if (direction === "lr") {
		styles.left = `${min}%`;
		styles.right = `${max}%`;
	} else if (direction === "rl") {
		styles.right = `${min}%`;
		styles.left = `${max}%`;
	} else if (direction === "bt") {
		styles.bottom = `${min}%`;
		styles.top = `${max}%`;
	} else {
		styles.top = `${min}%`;
		styles.bottom = `${max}%`;
	}
	return styles;
}

export function getThumbStyles(direction: "lr" | "rl" | "tb" | "bt", thumbPos: number) {
	const styles: StyleProperties = {
		position: "absolute",
	};
	if (direction === "lr") {
		styles.left = `${thumbPos}%`;
		styles.translate = "-50% 0";
	} else if (direction === "rl") {
		styles.right = `${thumbPos}%`;
		styles.translate = "50% 0";
	} else if (direction === "bt") {
		styles.bottom = `${thumbPos}%`;
		styles.translate = "0 50%";
	} else {
		styles.top = `${thumbPos}%`;
		styles.translate = "0 -50%";
	}
	return styles;
}

export function getTickStyles(
	direction: "lr" | "rl" | "tb" | "bt",
	tickPosition: number,
	offsetPercentage: number
) {
	const style: StyleProperties = {
		position: "absolute",
	};

	if (direction === "lr") {
		style.left = `${tickPosition}%`;
		style.translate = `${offsetPercentage}% 0`;
	} else if (direction === "rl") {
		style.right = `${tickPosition}%`;
		style.translate = `${-offsetPercentage}% 0`;
	} else if (direction === "bt") {
		style.bottom = `${tickPosition}%`;
		style.translate = `0 ${-offsetPercentage}%`;
	} else {
		style.top = `${tickPosition}%`;
		style.translate = `0 ${offsetPercentage}%`;
	}

	return style;
}

export function getTickLabelStyles(
	direction: "lr" | "rl" | "tb" | "bt",
	tickPosition: number,
	labelPosition: "top" | "bottom" | "left" | "right" = "top"
) {
	const style: StyleProperties = {
		position: "absolute",
	};

	if (direction === "lr" || direction === "rl") {
		// Horizontal slider
		style.left = direction === "lr" ? `${tickPosition}%` : undefined;
		style.right = direction === "rl" ? `${tickPosition}%` : undefined;
		style.translate = "-50% 0";

		if (labelPosition === "top") {
			style.bottom = "100%";
		} else if (labelPosition === "bottom") {
			style.top = "100%";
		}
	} else {
		// Vertical slider - use same positioning as ticks
		if (direction === "tb") {
			style.top = `${tickPosition}%`;
		} else {
			style.bottom = `${tickPosition}%`;
		}
		style.translate = "0 50%";

		if (labelPosition === "left") {
			style.right = "100%";
		} else if (labelPosition === "right") {
			style.left = "100%";
		}
	}

	return style;
}

export function getThumbLabelStyles(
	direction: "lr" | "rl" | "tb" | "bt",
	thumbPosition: number,
	labelPosition: "top" | "bottom" | "left" | "right" = "top"
) {
	const style: StyleProperties = {
		position: "absolute",
	};

	if (direction === "lr" || direction === "rl") {
		// Horizontal slider
		style.left = direction === "lr" ? `${thumbPosition}%` : undefined;
		style.right = direction === "rl" ? `${thumbPosition}%` : undefined;
		style.translate = "-50% 0";

		if (labelPosition === "top") {
			style.bottom = "100%";
		} else if (labelPosition === "bottom") {
			style.top = "100%";
		}
	} else {
		// Vertical slider
		if (direction === "tb") {
			style.top = `${thumbPosition}%`;
		} else {
			style.bottom = `${thumbPosition}%`;
		}
		style.translate = "0 -50%";

		if (labelPosition === "left") {
			style.right = "100%";
		} else if (labelPosition === "right") {
			style.left = "100%";
		}
	}

	return style;
}

/**
 * Gets the number of decimal places in a number
 */
function getDecimalPlaces(num: number): number {
	if (Math.floor(num) === num) return 0;
	const str = num.toString();
	if (str.indexOf(".") !== -1 && str.indexOf("e-") === -1) {
		return str.split(".")[1]!.length;
	} else if (str.indexOf("e-") !== -1) {
		const parts = str.split("e-");
		return parseInt(parts[1]!, 10);
	}
	return 0;
}

/**
 * Rounds a number to the specified number of decimal places
 */
function roundToPrecision(num: number, precision: number): number {
	const factor = Math.pow(10, precision);
	return Math.round(num * factor) / factor;
}

/**
 * Normalizes step to always be a sorted array of valid values within min/max range
 */
export function normalizeSteps(step: number | number[], min: number, max: number): number[] {
	if (typeof step === "number") {
		// generate regular steps - match original behavior exactly
		const difference = max - min;
		let count = Math.ceil(difference / step);

		// Get precision from step to avoid floating point errors
		const precision = getDecimalPlaces(step);

		// Check if difference is divisible by step using integer arithmetic to avoid floating point errors
		const factor = Math.pow(10, precision);
		const intDifference = Math.round(difference * factor);
		const intStep = Math.round(step * factor);

		if (intDifference % intStep === 0) {
			count++;
		}

		const steps: number[] = [];
		for (let i = 0; i < count; i++) {
			const value = min + i * step;
			// Round to the precision of the step to avoid floating point errors
			const roundedValue = roundToPrecision(value, precision);
			steps.push(roundedValue);
		}
		return steps;
	}

	return [...new Set(step)].filter((value) => value >= min && value <= max).sort((a, b) => a - b);
}

/**
 * Snaps a value to the nearest step in a custom steps array
 */
export function snapValueToCustomSteps(value: number, steps: number[]): number {
	if (steps.length === 0) return value;

	// Find the closest step
	let closest = steps[0]!;
	let minDistance = Math.abs(value - closest);

	for (const step of steps) {
		const distance = Math.abs(value - step);
		if (distance < minDistance) {
			minDistance = distance;
			closest = step;
		}
	}

	return closest;
}

/**
 * Gets the next/previous step value for keyboard navigation
 */
export function getAdjacentStepValue(
	currentValue: number,
	steps: number[],
	direction: "next" | "prev"
): number {
	const currentIndex = steps.indexOf(currentValue);

	if (currentIndex === -1) {
		// current value is not in steps, snap to nearest
		return snapValueToCustomSteps(currentValue, steps);
	}

	if (direction === "next") {
		return currentIndex < steps.length - 1 ? steps[currentIndex + 1]! : currentValue;
	} else {
		return currentIndex > 0 ? steps[currentIndex - 1]! : currentValue;
	}
}
