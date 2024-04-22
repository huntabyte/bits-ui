import { describe, expect, it } from "vitest";
import { arraysAreEqual } from "./arrays.js";

describe("arraysAreEqual", () => {
	it("should return true for two empty arrays", () => {
		expect(arraysAreEqual([], [])).toBe(true);
	});

	it("should return true for two arrays with the same elements in the same order", () => {
		expect(arraysAreEqual([1, 2, 3], [1, 2, 3])).toBe(true);
	});

	it("should return false for two arrays with different lengths", () => {
		expect(arraysAreEqual([1, 2, 3], [1, 2])).toBe(false);
	});

	it("should return false for two arrays with different elements", () => {
		expect(arraysAreEqual([1, 2, 3], [1, 2, 4])).toBe(false);
	});

	it("should return false for two arrays with elements in different orders", () => {
		expect(arraysAreEqual([1, 2, 3], [3, 2, 1])).toBe(false);
	});

	it("should handle arrays with non-primitive values", () => {
		const obj1 = { foo: "bar" };
		const obj2 = { foo: "bar" };
		expect(arraysAreEqual([obj1], [obj2])).toBe(true);
	});

	it("should handle arrays with different non-primitive values", () => {
		const obj1 = { foo: "baz" };
		const obj2 = { foo: "bar" };
		expect(arraysAreEqual([obj1], [obj2])).toBe(false);
	});

	it("should handle nested arrays", () => {
		expect(arraysAreEqual([1, [2, 3]], [1, [2, 3]])).toBe(true);
		expect(arraysAreEqual([1, [2, 3]], [1, [3, 2]])).toBe(false);
	});

	it("should handle arrays with different types of elements", () => {
		expect(arraysAreEqual([1, "2", true], [1, "2", true])).toBe(true);
		expect(arraysAreEqual([1, "2", true], [1, 2, true])).toBe(false);
	});

	it("should handle sparse arrays", () => {
		// eslint-disable-next-line no-sparse-arrays
		const arr1 = [1, , 3];
		const arr2 = [1, undefined, 3];
		expect(arraysAreEqual(arr1, arr2)).toBe(true);
	});

	it("should handle NaN values", () => {
		expect(arraysAreEqual([Number.NaN], [Number.NaN])).toBe(true);
	});
});
