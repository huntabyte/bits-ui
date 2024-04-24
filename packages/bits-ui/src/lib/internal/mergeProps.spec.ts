import { describe, expect, it, vi } from "vitest";
import { mergeProps } from "./mergeProps.js";

describe("mergeProps", () => {
	it("should merge objects", () => {
		const props1 = { a: 1, b: 2 };
		const props2 = { c: 3 };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ a: 1, b: 2, c: 3 });
	});

	it("should override values with the last one", () => {
		const props1 = { a: 1 };
		const props2 = { a: 2 };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ a: 2 });
	});

	it("should compose event handlers", () => {
		const handler1 = vi.fn();
		const handler2 = vi.fn();
		const props1 = { onclick: handler1 };
		const props2 = { onclick: handler2 };
		const result = mergeProps(props1, props2);

		result.onclick(new Event("click"));

		expect(handler1).toHaveBeenCalled();
		expect(handler2).toHaveBeenCalled();
	});

	it("should chain non-event handler functions", () => {
		const handler1 = vi.fn();
		const handler2 = vi.fn();
		const props1 = { foo: handler1 };
		const props2 = { foo: handler2 };
		const result = mergeProps(props1, props2);

		result.foo();

		expect(handler1).toHaveBeenCalled();
		expect(handler2).toHaveBeenCalled();
	});

	it("should handle chaining with one property being undefined", () => {
		const handler1 = vi.fn();
		const props1 = { foo: handler1 };
		const props2 = { foo: undefined };
		const result = mergeProps(props1, props2);

		// @ts-expect-error - we're testing to see if the undefined value is handled
		result.foo();

		expect(handler1).toHaveBeenCalled();
	});

	it("should merge class strings", () => {
		const props1 = { class: "foo" };
		const props2 = { class: "bar" };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ class: "foo bar" });
	});

	it("should merge style objects", () => {
		const props1 = { style: { color: "red" } };
		const props2 = { style: { fontSize: "16px" } };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ style: "color: red; font-size: 16px;" });
	});

	it("should merge style strings", () => {
		const props1 = { style: "color: red;" };
		const props2 = { style: "font-size: 16px;" };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ style: "color: red; font-size: 16px;" });
	});

	it("should handle sparse arrays", () => {
		const props1 = { a: 1 };
		const props2 = { b: 2 };
		const result = mergeProps(undefined, props1, null, props2);
		expect(result).toEqual({ a: 1, b: 2 });
	});

	it("should handle nested objects", () => {
		const props1 = { obj: { a: 1 } };
		const props2 = { obj: { b: 2 } };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ obj: { b: 2 } });
	});

	it("should handle the hidden attribute", () => {
		const props1 = { hidden: true };
		const props2 = { hidden: false };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ hidden: undefined });
	});

	it("should chain non-function event handlers", () => {
		const handler1 = vi.fn();
		const handler2 = vi.fn();
		const props1 = { onValueChange: handler1 };
		const props2 = { onValueChange: handler2 };
		const result = mergeProps(props1, props2);

		result.onValueChange();

		expect(handler1).toHaveBeenCalled();
		expect(handler2).toHaveBeenCalled();
	});
});
