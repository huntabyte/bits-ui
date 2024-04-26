import { describe, expect, it, vi } from "vitest";
import { executeCallbacks } from "./callbacks.js";

describe("executeCallbacks", () => {
	it("should execute all callback functions with the same arguments", () => {
		const mockCallback1 = vi.fn();
		const mockCallback2 = vi.fn();
		const mockCallback3 = vi.fn();

		const executeCombinedCallbacks = executeCallbacks(
			mockCallback1,
			mockCallback2,
			mockCallback3
		);

		executeCombinedCallbacks(1, 2, 3);

		expect(mockCallback1).toHaveBeenCalledWith(1, 2, 3);
		expect(mockCallback2).toHaveBeenCalledWith(1, 2, 3);
		expect(mockCallback3).toHaveBeenCalledWith(1, 2, 3);
	});

	it("should handle callback functions with different argument types", () => {
		const mockCallback1 = vi.fn();
		const mockCallback2 = vi.fn();
		const mockCallback3 = vi.fn();

		executeCallbacks(mockCallback1(42), mockCallback2("hello"), mockCallback3(true));

		expect(mockCallback1).toHaveBeenCalledWith(42);
		expect(mockCallback2).toHaveBeenCalledWith("hello");
		expect(mockCallback3).toHaveBeenCalledWith(true);
	});

	it("should handle an empty array of callbacks", () => {
		const executeCombinedCallbacks = executeCallbacks();
		expect(() => executeCombinedCallbacks(1, 2, 3)).not.toThrow();
	});

	it("should handle non-function values in the callbacks array", () => {
		const mockCallback = vi.fn();

		const executeCombinedCallbacks = executeCallbacks(mockCallback, undefined, null);

		executeCombinedCallbacks(1, 2, 3);

		expect(mockCallback).toHaveBeenCalledWith(1, 2, 3);
	});
});
