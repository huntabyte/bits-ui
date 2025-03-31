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

/** Returns a function that allows you to get a point on the second range relative to the first range
 *
 * @param param0
 * @param param1
 */
export function linearScale([min1, max1]: [number, number], [min2, max2]: [number, number]) {
	return function (value: number) {
		const distance1 = max1 - min1;

		const percentDistance = value / distance1;

		const distance2 = max2 - min2;

		const newDistance = distance2 * percentDistance + min2;

		return newDistance;
	};
}
