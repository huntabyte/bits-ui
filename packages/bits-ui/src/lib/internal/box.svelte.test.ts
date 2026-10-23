import { flushSync } from "svelte";
import {
	attachRef,
	boxFlatten,
	boxWith as toolbeltBoxWith,
	isBox,
	isWritableBox,
	simpleBox as toolbeltSimpleBox,
	toReadonlyBox,
} from "svelte-toolbelt";
import { describe, expect, it } from "vitest";
import { boxWith, simpleBox } from "./box.svelte.js";

describe("internal boxes", () => {
	it("are recognised by svelte-toolbelt like its own boxes", () => {
		const cases = [
			[boxWith(() => 1), toolbeltBoxWith(() => 1)],
			[boxWith(() => 1, () => {}), toolbeltBoxWith(() => 1, () => {})],
			[simpleBox(1), toolbeltSimpleBox(1)],
		] as const;
		for (const [ours, theirs] of cases) {
			expect(isBox(ours)).toBe(isBox(theirs));
			expect(isWritableBox(ours)).toBe(isWritableBox(theirs));
		}
		expect(isWritableBox(toReadonlyBox(boxWith(() => 1, () => {})))).toBe(false);
	});

	it("read through the getter and write through the setter", () => {
		let value = $state(1);
		const readonly = boxWith(() => value * 2);
		const writable = boxWith(
			() => value,
			(v) => (value = v)
		);
		const state = simpleBox("a");
		expect(readonly.current).toBe(2);
		writable.current = 5;
		expect(value).toBe(5);
		expect(writable.current).toBe(5);
		expect(readonly.current).toBe(10);
		state.current = "b";
		expect(state.current).toBe("b");
		const flat = boxFlatten({ writable, readonly });
		flat.writable = 7;
		expect(flat.readonly).toBe(14);
	});

	it("caches writable reads like toolbelt (a derived) and tracks dependencies", () => {
		let value = $state(1);
		let ourCalls = 0;
		let theirCalls = 0;
		const seen: number[] = [];
		const cleanup = $effect.root(() => {
			const ours = boxWith(
				() => (ourCalls++, value),
				() => {}
			);
			const theirs = toolbeltBoxWith(
				() => (theirCalls++, value),
				() => {}
			);
			$effect(() => {
				seen.push(ours.current + ours.current + theirs.current + theirs.current);
			});
		});
		flushSync();
		value = 2;
		flushSync();
		expect(seen).toEqual([4, 8]);
		expect(ourCalls).toBe(theirCalls);
		cleanup();
	});

	it("work as attachRef targets", () => {
		const ref = simpleBox<HTMLElement | null>(null);
		const attachment = attachRef(ref);
		const node = document.createElement("div");
		const key = Object.getOwnPropertySymbols(attachment)[0]!;
		const detach = (attachment as Record<symbol, (n: HTMLElement) => () => void>)[key]!(node);
		expect(ref.current).toBe(node);
		detach();
		expect(ref.current).toBe(null);
	});
});
