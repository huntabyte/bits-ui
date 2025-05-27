import { describe, expect, it } from "vitest";
import { linearScale } from "./math.js";

describe("linearScale", () => {
	it("correctly scales the value", () => {
		expect(linearScale([0, 1], [0, 100])(0.5)).toBe(50);
		expect(linearScale([0, 1], [10, 90])(0.5)).toBe(50);
		expect(linearScale([0, 1], [0, 100])(0.33)).toBe(33);
		expect(linearScale([0, 1], [0, 100])(0)).toBe(0);
	});

	it("is minimum when below minimum", () => {
		expect(linearScale([0, 1], [0, 100])(2)).toBe(100);
		expect(linearScale([0, 1], [0, 100])(-5)).toBe(0);
	});

	it("correctly handles negative scales", () => {
		expect(linearScale([-1, 1], [0, 100])(0)).toBe(50);
	});

	it("handles reversed ranges", () => {
		expect(linearScale([0, 1], [100, 0])(0.5)).toBe(50);
		expect(linearScale([0, 1], [100, 0])(0)).toBe(100);
		expect(linearScale([0, 1], [100, 0])(2)).toBe(0); // clamped
	});

	it("works with non-zero based domains", () => {
		expect(linearScale([10, 20], [0, 100])(15)).toBe(50);
		expect(linearScale([100, 200], [0, 1])(150)).toBe(0.5);
	});

	it("handles unclamped values when clamp is false", () => {
		const scale = linearScale([0, 1], [0, 100], false);
		expect(scale(2)).toBe(200);
		expect(scale(-1)).toBe(-100);
	});

	it("maintains precision with small numbers", () => {
		expect(linearScale([0, 0.1], [0, 1])(0.05)).toBeCloseTo(0.5, 6);
		expect(linearScale([0, 1e-6], [0, 1])(5e-7)).toBeCloseTo(0.5, 6);
	});
});
