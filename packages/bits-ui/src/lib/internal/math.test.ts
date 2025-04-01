import { describe, expect, it } from "vitest";
import { linearScale, snapValueToStep } from "./math.js";

describe("snapValueToStep", () => {
	it("should snap value to nearest step", () => {
		expect(snapValueToStep(3.7, 0, 10, 1)).toBe(4);
		expect(snapValueToStep(3.2, 0, 10, 1)).toBe(3);
	});

	it("should handle decimal steps", () => {
		expect(snapValueToStep(3.7, 0, 10, 0.5)).toBe(3.5);
		expect(snapValueToStep(3.8, 0, 10, 0.5)).toBe(4);
	});

	it("should respect min value", () => {
		expect(snapValueToStep(1.2, 2, 10, 1)).toBe(2);
	});

	it("should respect max value", () => {
		expect(snapValueToStep(9.8, 0, 9, 1)).toBe(9);
	});

	it("should handle NaN min value", () => {
		expect(snapValueToStep(3.7, Number.NaN, 10, 1)).toBe(4);
	});

	it("should handle NaN max value", () => {
		expect(snapValueToStep(3.7, 0, Number.NaN, 1)).toBe(4);
	});

	it("should handle both NaN min and max values", () => {
		expect(snapValueToStep(3.7, Number.NaN, Number.NaN, 1)).toBe(4);
	});

	it("should handle values outside the range", () => {
		expect(snapValueToStep(12, 0, 10, 1)).toBe(10);
		expect(snapValueToStep(-2, 0, 10, 1)).toBe(0);
	});

	it("should handle large steps", () => {
		expect(snapValueToStep(17, 0, 100, 20)).toBe(20);
	});

	it("should maintain precision for decimal steps", () => {
		expect(snapValueToStep(3.14159, 0, 10, 0.01)).toBe(3.14);
		expect(snapValueToStep(3.14159, 0, 10, 0.001)).toBe(3.142);
	});
});

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
