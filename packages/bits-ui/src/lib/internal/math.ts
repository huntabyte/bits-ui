export function linearScale(
	domain: [number, number],
	range: [number, number],
	clamp: boolean = true
): (x: number) => number {
	const [d0, d1] = domain;
	const [r0, r1] = range;

	const slope = (r1 - r0) / (d1 - d0);

	return (x: number) => {
		const result = r0 + slope * (x - d0);
		if (!clamp) return result;
		if (result > Math.max(r0, r1)) return Math.max(r0, r1);
		if (result < Math.min(r0, r1)) return Math.min(r0, r1);
		return result;
	};
}
