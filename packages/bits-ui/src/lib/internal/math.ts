/**
 * From https://github.com/melt-ui/melt-ui/blob/main/packages/svelte/src/lib/internal/math.ts
 */
export function snapValueToStep(value: number, min: number, max: number, step: number): number {
	const remainder = (value - (Number.isNaN(min) ? 0 : min)) % step;
	let snappedValue =
		Math.abs(remainder) * 2 >= step
			? value + Math.sign(remainder) * (step - Math.abs(remainder))
			: value - remainder;

	if (!Number.isNaN(min)) {
		if (snappedValue < min) {
			snappedValue = min;
		} else if (!Number.isNaN(max) && snappedValue > max) {
			snappedValue = min + Math.floor((max - min) / step) * step;
		}
	} else if (!Number.isNaN(max) && snappedValue > max) {
		snappedValue = Math.floor(max / step) * step;
	}

	const string = step.toString();
	const index = string.indexOf(".");
	const precision = index >= 0 ? string.length - index : 0;

	if (precision > 0) {
		const pow = 10 ** precision;
		snappedValue = Math.round(snappedValue * pow) / pow;
	}

	return snappedValue;
}

// https://github.com/tmcw-up-for-adoption/simple-linear-scale/blob/master/index.js
export function linearScale(domain: [number, number], range: [number, number], clamp = true) {
	return function (value: number) {
		if (domain[0] === domain[1] || range[0] === range[1]) {
			return range[0];
		}

		const ratio = (range[1] - range[0]) / (domain[1] - domain[0]);

		const result = range[0] + ratio * (value - domain[0]);

		return clamp ? Math.min(range[1], Math.max(range[0], result)) : result;
	};
}
