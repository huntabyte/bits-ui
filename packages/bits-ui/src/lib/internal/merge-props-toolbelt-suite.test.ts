/**
 * Vendored verbatim from svelte-toolbelt's merge-props test suite so the
 * internal performance-tuned `mergeProps` is held to the exact same contract:
 * https://github.com/huntabyte/svelte-toolbelt/blob/main/src/lib/utils/merge-props.test.ts
 * Only the import specifier differs.
 */
import { describe, expect, it, vi } from "vitest";
import { mergeProps } from "./merge-props.js";

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

	it("should merge class strings with style objects", () => {
		const props1 = { style: { fontSize: "16px", pointerEvents: "auto", color: "red" } };
		const props2 = { style: "pointer-events: none; font-size: 48px;" };
		const props3 = { style: { backgroundColor: "blue" } };
		const props4 = { style: "background-color: red;" };
		const result = mergeProps(props1, props2, props3, props4);
		expect(result).toEqual({
			style: "font-size: 48px; pointer-events: none; color: red; background-color: red;"
		});
	});

	it("should merge multiple css variables", () => {
		const props1 = {
			style: {
				"--foo": "red",
				"--bar": "blue"
			}
		};

		const props2 = {
			style: {
				"--foo": "green",
				"--baz": "yellow"
			}
		};

		const result = mergeProps(props1, props2);

		expect(result.style).toEqual("--foo: green; --bar: blue; --baz: yellow;");
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
		const props3 = { hidden: "until-found" };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ hidden: undefined });

		const result2 = mergeProps(props2, props1);
		expect(result2).toEqual({ hidden: true });

		const result3 = mergeProps(props1, props3);
		expect(result3).toEqual({ hidden: "until-found" });
	});

	it("should handle the disabled attribute", () => {
		const props1 = { disabled: true };
		const props2 = { disabled: false };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ disabled: undefined });

		const result2 = mergeProps(props2, props1);
		expect(result2).toEqual({ disabled: true });
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

	it("should handle merging of styles if styles only provided in props2", () => {
		const props1 = {};

		const props2 = {
			style: "color: blue;"
		};
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ style: "color: blue;" });
	});

	it("should merge classnames via clsx", () => {
		const props1 = { class: "text-lg font-bold" };
		const props2 = { class: ["bg-blue-500", "hover:bg-blue-600"] };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ class: "text-lg font-bold bg-blue-500 hover:bg-blue-600" });
	});

	it("should handle symbol as keys", () => {
		const symbol = Symbol("foo");
		const symbol2 = Symbol("foo2");
		const props1 = { [symbol]: "bar" };
		const props2 = { [symbol]: "baz", [symbol2]: "qux" };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ [symbol]: "baz", [symbol2]: "qux" });
	});

	it("should handle multiple symbols with same description", () => {
		const symbol1 = Symbol("foo");
		const symbol2 = Symbol("foo"); // same description, different symbol
		const props1 = { [symbol1]: "bar" };
		const props2 = { [symbol2]: "baz" };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ [symbol1]: "bar", [symbol2]: "baz" });
	});

	it("should handle mixed string and symbol keys", () => {
		const symbol = Symbol("foo");
		const props1 = { [symbol]: "bar", a: 1 };
		const props2 = { [symbol]: "baz", b: 2 };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ [symbol]: "baz", a: 1, b: 2 });
	});

	it("should handle undefined symbol values", () => {
		const symbol = Symbol("foo");
		const props1 = { [symbol]: "bar" };
		const props2 = { [symbol]: undefined };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ [symbol]: "bar" });
	});

	it("should handle null symbol values", () => {
		const symbol = Symbol("foo");
		const props1 = { [symbol]: "bar" };
		const props2 = { [symbol]: null };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ [symbol]: null });
	});

	it("should handle complex nested objects with symbols", () => {
		const symbol = Symbol("foo");
		const props1 = {
			[symbol]: { nested: { value: 1 } },
			obj: { a: 1 }
		};
		const props2 = {
			[symbol]: { nested: { value: 2 } },
			obj: { b: 2 }
		};
		const result = mergeProps(props1, props2);
		expect(result).toEqual({
			[symbol]: { nested: { value: 2 } },
			obj: { b: 2 }
		});
	});

	it("should handle symbols with function values", () => {
		const symbol = Symbol("foo");
		const handler1 = vi.fn();
		const handler2 = vi.fn();
		const props1 = { [symbol]: handler1 };
		const props2 = { [symbol]: handler2 };
		const result = mergeProps(props1, props2);

		(result[symbol] as () => void)();
		expect(handler1).not.toHaveBeenCalled();
		expect(handler2).toHaveBeenCalled();
	});

	it("should handle symbols with style objects", () => {
		const symbol = Symbol("style");
		const props1 = { [symbol]: { color: "red" } };
		const props2 = { [symbol]: { fontSize: "16px" } };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ [symbol]: { fontSize: "16px" } });
	});

	it("should handle symbols with class values", () => {
		const symbol = Symbol("class");
		const props1 = { [symbol]: "foo" };
		const props2 = { [symbol]: "bar" };
		const result = mergeProps(props1, props2);
		expect(result).toEqual({ [symbol]: "bar" });
	});

	it("should handle multiple props with multiple symbols", () => {
		const symbol1 = Symbol("foo");
		const symbol2 = Symbol("bar");
		const symbol3 = Symbol("baz");
		const props1 = { [symbol1]: "a", [symbol2]: "b" };
		const props2 = { [symbol2]: "c", [symbol3]: "d" };
		const props3 = { [symbol1]: "e", [symbol3]: "f" };
		const result = mergeProps(props1, props2, props3);
		expect(result).toEqual({
			[symbol1]: "e",
			[symbol2]: "c",
			[symbol3]: "f"
		});
	});

	it("should handle CSS variables and camelCase in styles", () => {
		const props1 = {
			style: {
				"--custom-color": "red",
				backgroundColor: "blue",
				"--spacing-unit": "8px",
				"--border-radius": "4px"
			}
		};
		const props2 = {
			style: {
				"--custom-color": "green",
				backgroundColor: "yellow",
				"--border-width": "2px"
			}
		};
		const result = mergeProps(props1, props2);
		expect(result.style).toEqual(
			"--custom-color: green; background-color: yellow; --spacing-unit: 8px; --border-radius: 4px; --border-width: 2px;"
		);
	});

	it("should handle complex class combinations with arrays, objects, and conditionals", () => {
		const props1 = {
			class: [
				"base",
				{ "conditional-true": true, "conditional-false": false },
				["nested", "array"],
				undefined,
				null
			]
		};
		const props2 = {
			class: {
				"override-true": true,
				"override-false": false
			}
		};
		const result = mergeProps(props1, props2);
		expect(result.class).toEqual("base conditional-true nested array override-true");
	});

	it("should handle multiple event handlers with different event types", () => {
		const clickHandler1 = vi.fn();
		const clickHandler2 = vi.fn();
		const inputHandler1 = vi.fn();
		const inputHandler2 = vi.fn();
		const keydownHandler1 = vi.fn();
		const keydownHandler2 = vi.fn();

		const props1 = {
			onclick: clickHandler1,
			oninput: inputHandler1,
			onkeydown: keydownHandler1
		};
		const props2 = {
			onclick: clickHandler2,
			oninput: inputHandler2,
			onkeydown: keydownHandler2
		};

		const result = mergeProps(props1, props2);

		result.onclick(new Event("click"));
		result.oninput(new Event("input"));
		result.onkeydown(new Event("keydown"));

		expect(clickHandler1).toHaveBeenCalled();
		expect(clickHandler2).toHaveBeenCalled();
		expect(inputHandler1).toHaveBeenCalled();
		expect(inputHandler2).toHaveBeenCalled();
		expect(keydownHandler1).toHaveBeenCalled();
		expect(keydownHandler2).toHaveBeenCalled();
	});

	it("should handle complex function chaining with different return types", () => {
		const fn1 = vi.fn().mockReturnValue(1);
		const fn2 = vi.fn().mockReturnValue("string");
		const fn3 = vi.fn().mockReturnValue({ obj: true });

		const props1 = { complexFn: fn1 };
		const props2 = { complexFn: fn2 };
		const props3 = { complexFn: fn3 };

		const result = mergeProps(props1, props2, props3);
		result.complexFn();

		expect(fn1).toHaveBeenCalled();
		expect(fn2).toHaveBeenCalled();
		expect(fn3).toHaveBeenCalled();
		expect(fn3).toHaveReturnedWith({ obj: true });
	});

	it("should handle style merging with !important and vendor prefixes", () => {
		const props1 = {
			style: {
				color: "red !important",
				WebkitTransition: "all 0.3s",
				MozTransition: "all 0.3s",
				msTransition: "all 0.3s"
			}
		};
		const props2 = {
			style: {
				color: "blue",
				WebkitTransform: "scale(1.1)",
				MozTransform: "scale(1.1)",
				msTransform: "scale(1.1)"
			}
		};
		const result = mergeProps(props1, props2);
		expect(result.style).toEqual(
			"color: blue; -webkit-transition: all 0.3s; -moz-transition: all 0.3s; ms-transition: all 0.3s; -webkit-transform: scale(1.1); -moz-transform: scale(1.1); ms-transform: scale(1.1);"
		);
	});

	it("should handle merging of custom event handlers with different parameter types", () => {
		const handler1 = vi.fn();
		const handler2 = vi.fn();
		const handler3 = vi.fn();

		const props1 = { onCustomEvent: handler1 };
		const props2 = { onCustomEvent: handler2 };
		const props3 = { onCustomEvent: handler3 };

		const result = mergeProps(props1, props2, props3);

		// Test with different parameter types
		result.onCustomEvent("string");
		result.onCustomEvent(123);
		result.onCustomEvent({ complex: "object" });
		result.onCustomEvent(new Event("custom"));

		expect(handler1).toHaveBeenCalledTimes(4);
		expect(handler2).toHaveBeenCalledTimes(4);
		expect(handler3).toHaveBeenCalledTimes(4);
	});

	it("should handle merging of style with calc() and var() functions", () => {
		const props1 = {
			style: {
				width: "calc(100% - 20px)",
				"--custom-width": "50px",
				height: "var(--custom-height, 100px)"
			}
		};
		const props2 = {
			style: {
				"--custom-width": "75px",
				"--custom-height": "200px",
				margin: "calc(var(--custom-width) / 2)"
			}
		};
		const result = mergeProps(props1, props2);
		expect(result.style).toEqual(
			"width: calc(100% - 20px); --custom-width: 75px; height: var(--custom-height, 100px); --custom-height: 200px; margin: calc(var(--custom-width) / 2);"
		);
	});

	it("should handle style merging with complex units and values", () => {
		const props1 = {
			style: {
				width: "100vw",
				height: "calc(100vh - 60px)",
				transform: "translate3d(0, 0, 0) rotate(45deg)",
				background: "linear-gradient(45deg, #ff0000, #00ff00)",
				boxShadow: "0 0 10px rgba(0,0,0,0.5)",
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
			}
		};
		const props2 = {
			style: {
				transform: "scale(1.1)",
				background: "radial-gradient(circle, #0000ff, #ff00ff)",
				boxShadow: "inset 0 0 5px rgba(255,255,255,0.5)"
			}
		};
		const result = mergeProps(props1, props2);
		expect(result.style).toEqual(
			"width: 100vw; height: calc(100vh - 60px); transform: scale(1.1); background: radial-gradient(circle, #0000ff, #ff00ff); box-shadow: inset 0 0 5px rgba(255,255,255,0.5); transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);"
		);
	});

	it("should handle style merging with empty and invalid values", () => {
		const props1 = {
			style: {
				color: "",
				backgroundColor: null,
				fontSize: undefined,
				border: "1px solid black",
				invalid: 123
			}
		};
		const props2 = {
			style: {
				color: "red",
				backgroundColor: "blue",
				fontSize: "16px",
				invalid: "string"
			}
		};
		const result = mergeProps(props1, props2);
		expect(result.style).toEqual(
			"color: red; background-color: blue; font-size: 16px; border: 1px solid black; invalid: string;"
		);
	});

	it("should handle style merging with shorthand properties", () => {
		const props1 = {
			style: {
				margin: "10px",
				padding: "5px 10px",
				border: "1px solid black",
				background: "red"
			}
		};
		const props2 = {
			style: {
				marginTop: "20px",
				paddingLeft: "15px",
				borderColor: "blue",
				backgroundColor: "green"
			}
		};
		const result = mergeProps(props1, props2);
		expect(result.style).toEqual(
			"margin: 10px; padding: 5px 10px; border: 1px solid black; background: red; margin-top: 20px; padding-left: 15px; border-color: blue; background-color: green;"
		);
	});
});
