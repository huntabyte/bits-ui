import { describe, expect, it, vi } from "vitest";
import { mergeProps as mergePropsToolbelt } from "svelte-toolbelt";
import { mergeProps } from "./merge-props.js";

/**
 * The internal `mergeProps` is a performance-tuned rewrite of svelte-toolbelt's.
 * These tests assert parity with the original for every merge behavior.
 */

function expectParity(...args: (Record<string, unknown> | null | undefined)[]) {
	const ours = mergeProps(...args) as Record<string, unknown>;
	const theirs = mergePropsToolbelt(...args) as Record<string, unknown>;
	// compare non-function values structurally
	expect(Object.keys(ours).sort()).toEqual(Object.keys(theirs).sort());
	for (const key of Object.keys(theirs)) {
		if (typeof theirs[key] === "function") {
			expect(typeof ours[key]).toBe("function");
		} else {
			expect(ours[key]).toEqual(theirs[key]);
		}
	}
}

describe("mergeProps parity with svelte-toolbelt", () => {
	it("merges plain values with last-wins", () => {
		expectParity({ a: 1, b: "x" }, { b: "y", c: true });
		expectParity({ a: 1 }, { a: undefined });
		expectParity({}, { a: null });
		expectParity(null, { a: 1 }, undefined, { b: 2 });
	});

	it("merges string classes", () => {
		expectParity({ class: "a" }, { class: "b" });
		expectParity({ class: "" }, { class: "b" });
		expectParity({ class: "a" }, { class: "" });
		expectParity({}, { class: "b" });
		expectParity({ class: "a" }, {});
		expectParity({ class: "a" }, { class: undefined });
	});

	it("merges clsx-style class values", () => {
		expectParity({ class: ["a", { b: true, c: false }] }, { class: "d" });
		expectParity({ class: "a" }, { class: { b: true } });
		expectParity({ class: 5 }, { class: ["x", ["y"]] });
		expectParity({ class: null }, { class: [null, undefined, "z"] });
		expectParity({ class: new Date() }, { class: "b" });
		expectParity({ class: "a" }, { class: new Date() });
	});

	it("merges styles", () => {
		expectParity({ style: "color: red" }, { style: "background: blue" });
		expectParity({ style: { color: "red" } }, { style: "background: blue" });
		expectParity({ style: "color: red" }, { style: { background: "blue" } });
		expectParity({ style: { color: "red" } }, { style: { background: "blue" } });
		expectParity({ style: "color: red; --x: 1" }, {});
		expectParity({}, { style: { "--x": "1", paddingLeft: "2px" } });
		expectParity({ style: "-webkit-line-clamp: 2" }, { style: "color: red" });
	});

	it("composes event handlers with defaultPrevented short-circuit", () => {
		const aCalls: string[] = [];
		const makeHandlers = () => ({
			first: vi.fn((e: Event) => {
				aCalls.push("first");
				e.preventDefault();
			}),
			second: vi.fn(() => aCalls.push("second")),
		});

		const h1 = makeHandlers();
		const ours = mergeProps({ onclick: h1.first }, { onclick: h1.second }) as {
			onclick: (e: Event) => void;
		};
		const event = new Event("click", { cancelable: true });
		ours.onclick(event);
		expect(h1.first).toHaveBeenCalledOnce();
		expect(h1.second).not.toHaveBeenCalled();

		const h2 = makeHandlers();
		const theirs = mergePropsToolbelt({ onclick: h2.first }, { onclick: h2.second }) as {
			onclick: (e: Event) => void;
		};
		theirs.onclick(new Event("click", { cancelable: true }));
		expect(h2.first).toHaveBeenCalledOnce();
		expect(h2.second).not.toHaveBeenCalled();
	});

	it("chains non-event functions", () => {
		const calls: string[] = [];
		const merged = mergeProps(
			{ onCustomThing: () => calls.push("a") },
			{ onCustomThing: () => calls.push("b") }
		) as { onCustomThing: (...args: unknown[]) => void };
		merged.onCustomThing();
		expect(calls).toEqual(["a", "b"]);
	});

	it("keeps a handler when only one side provides it", () => {
		const fn = vi.fn();
		const merged = mergeProps({ onclick: fn }, { id: "x" }) as {
			onclick: () => void;
		};
		merged.onclick();
		expect(fn).toHaveBeenCalledOnce();
	});

	it("removes hidden/disabled when false", () => {
		expectParity({ hidden: true }, { hidden: false });
		expectParity({ disabled: true }, { disabled: false });
		expectParity({}, { hidden: false, disabled: false });
		expectParity({ hidden: false }, { hidden: true });
	});

	it("carries symbol keys (attachments)", () => {
		const sym = Symbol("attachment");
		const fn = () => {};
		const ours = mergeProps({}, { [sym]: fn }) as Record<symbol, unknown>;
		const theirs = mergePropsToolbelt({}, { [sym]: fn }) as Record<symbol, unknown>;
		expect(ours[sym]).toBe(fn);
		expect(theirs[sym]).toBe(fn);
	});

	it("converts merged style objects to strings", () => {
		const ours = mergeProps({}, { style: { color: "red", "--x": "1" } });
		const theirs = mergePropsToolbelt({}, { style: { color: "red", "--x": "1" } });
		expect(ours.style).toBe(theirs.style);
		expect(typeof ours.style).toBe("string");
	});
});
