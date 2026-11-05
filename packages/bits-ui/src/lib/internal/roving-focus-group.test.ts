import { describe, expect, it } from "vitest";
import { box } from "svelte-toolbelt";
import { RovingFocusGroup } from "./roving-focus-group.js";
import { kbd } from "./kbd.js";

function rng(seed: number) {
	return () => {
		seed = (seed * 1664525 + 1013904223) % 4294967296;
		return seed / 4294967296;
	};
}

/**
 * The original algorithm: index into the full candidate list.
 */
function reference(
	items: HTMLElement[],
	node: HTMLElement,
	key: string,
	loop: boolean,
	both: boolean
): { prevented: boolean; target: HTMLElement | undefined } {
	if (!items.length) return { prevented: false, target: undefined };
	const currentIndex = items.indexOf(node);
	const keyToIndex: Record<string, number> = {
		[kbd.ARROW_DOWN]: currentIndex + 1,
		[kbd.ARROW_UP]: currentIndex - 1,
		[kbd.HOME]: 0,
		[kbd.END]: items.length - 1,
	};
	if (both) {
		keyToIndex[kbd.ARROW_RIGHT] = currentIndex + 1;
		keyToIndex[kbd.ARROW_LEFT] = currentIndex - 1;
	}
	let itemIndex = keyToIndex[key];
	if (itemIndex === undefined) return { prevented: false, target: undefined };
	if (itemIndex < 0 && loop) itemIndex = items.length - 1;
	else if (itemIndex === items.length && loop) itemIndex = 0;
	return { prevented: true, target: items[itemIndex] };
}

/** Random tree of groups, candidates (some disabled) and nested roots. */
function buildTree(rand: () => number) {
	const root = document.createElement("div");
	root.setAttribute("data-root", "");
	let id = 0;
	const fill = (parent: HTMLElement, depth: number) => {
		const count = Math.floor(rand() * 6);
		for (let i = 0; i < count; i++) {
			const r = rand();
			const el = document.createElement("div");
			el.id = `n${id++}`;
			el.tabIndex = -1;
			if (r < 0.55) {
				el.setAttribute("data-item", "");
				if (rand() < 0.25) el.setAttribute("data-disabled", "");
				if (rand() < 0.3) el.appendChild(document.createElement("span"));
			} else if (r < 0.65 && depth < 3) {
				el.setAttribute("data-root", "");
				fill(el, depth + 1);
			} else if (depth < 3) {
				fill(el, depth + 1);
			}
			parent.appendChild(el);
		}
	};
	fill(root, 0);
	return root;
}

describe("RovingFocusGroup.handleKeydown", () => {
	it("matches indexing into the full candidate list", () => {
		const keys = [
			kbd.ARROW_DOWN,
			kbd.ARROW_UP,
			kbd.ARROW_LEFT,
			kbd.ARROW_RIGHT,
			kbd.HOME,
			kbd.END,
			"a",
			kbd.ENTER,
		];
		let checked = 0;
		for (let seed = 1; seed <= 120; seed++) {
			const rand = rng(seed);
			const root = buildTree(rand);
			document.body.appendChild(root);
			for (const withRootAttr of [false, true]) {
				for (const loop of [false, true]) {
					const group = new RovingFocusGroup({
						rootNode: box(root),
						candidateAttr: "data-item",
						rootAttr: withRootAttr ? "data-root" : undefined,
						loop: box(loop),
						orientation: box("vertical"),
					});
					const items = group.getCandidateNodes();
					// every element (candidates and not) as the keydown target
					for (const node of [root, ...root.querySelectorAll<HTMLElement>("*")]) {
						for (const key of keys) {
							for (const both of [false, true]) {
								const expected = reference(items, node, key, loop, both);
								(document.activeElement as HTMLElement | null)?.blur();
								const e = new KeyboardEvent("keydown", { key, cancelable: true });
								const target = group.handleKeydown(node, e, both);
								const label = `seed ${seed} root ${withRootAttr} loop ${loop} node ${node.id} key ${key} both ${both}`;
								expect(e.defaultPrevented, label).toBe(expected.prevented);
								expect(target?.id, label).toBe(expected.target?.id);
								if (expected.target) {
									expect(document.activeElement?.id, label).toBe(
										expected.target.id
									);
								}
								checked++;
							}
						}
					}
				}
			}
			root.remove();
		}
		expect(checked).toBeGreaterThan(10000);
	}, 60_000);
});
