import { describe, expect, it } from "vitest";
import { arraysAreEqual, chunk, isValidIndex } from "./arrays.js";

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

describe("chunk", () => {
	it("should return an empty array when given an empty array", () => {
		expect(chunk([], 2)).toEqual([]);
	});

	it("should return an array with one chunk when size is greater than or equal to array length", () => {
		expect(chunk([1, 2, 3], 3)).toEqual([[1, 2, 3]]);
		expect(chunk([1, 2, 3], 4)).toEqual([[1, 2, 3]]);
	});

	it("should chunk the array into arrays of the specified size", () => {
		expect(chunk([1, 2, 3, 4], 2)).toEqual([
			[1, 2],
			[3, 4],
		]);
		expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
	});

	it("should work with arrays containing different types", () => {
		expect(chunk(["a", "b", "c", "d"], 2)).toEqual([
			["a", "b"],
			["c", "d"],
		]);
		expect(chunk([1, "b", true, null], 2)).toEqual([
			[1, "b"],
			[true, null],
		]);
	});

	it("should handle negative or zero size", () => {
		expect(chunk([1, 2, 3, 4], 0)).toEqual([]);
		expect(chunk([1, 2, 3, 4], -1)).toEqual([]);
	});
});

describe("isValidIndex", () => {
	it("should return true for valid indices", () => {
		const arr = [1, 2, 3, 4, 5];
		expect(isValidIndex(0, arr)).toBe(true);
		expect(isValidIndex(2, arr)).toBe(true);
		expect(isValidIndex(4, arr)).toBe(true);
	});

	it("should return false for indices outside the array bounds", () => {
		const arr = [1, 2, 3, 4, 5];
		expect(isValidIndex(-1, arr)).toBe(false);
		expect(isValidIndex(5, arr)).toBe(false);
		expect(isValidIndex(10, arr)).toBe(false);
	});

	it("should return false for negative indices", () => {
		const arr = [1, 2, 3, 4, 5];
		expect(isValidIndex(-1, arr)).toBe(false);
		expect(isValidIndex(-5, arr)).toBe(false);
	});

	it("should return true for an empty array and index 0", () => {
		const arr: unknown[] = [];
		expect(isValidIndex(0, arr)).toBe(false);
	});

	it("should work with arrays of different types", () => {
		const arr = ["a", "b", "c", "d"];
		expect(isValidIndex(0, arr)).toBe(true);
		expect(isValidIndex(3, arr)).toBe(true);
		expect(isValidIndex(4, arr)).toBe(false);
	});
});
