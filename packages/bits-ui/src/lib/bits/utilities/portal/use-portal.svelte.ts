import { untrack } from "svelte";
import { afterTick } from "$lib/internal/after-tick.js";
import type { ReadonlyBox } from "$lib/internal/box.svelte.js";
import { useNodeById } from "$lib/internal/use-node-by-id.svelte.js";

export function usePortal(id: ReadonlyBox<string>, to: ReadonlyBox<HTMLElement | string>) {
	const node = useNodeById(id);

	$effect.pre(() => {
		if (!node.value) return;
		afterTick(() => {
			if (!node.value) return;
			let target: HTMLElement | null = null;
			if (typeof to.value === "string") {
				target = document.querySelector(to.value);
				if (!target) {
					throw new Error(`Could not find target element with selector: ${to.value}`);
				}
				target.appendChild(node.value);
			} else if (to.value instanceof HTMLElement) {
				to.value.appendChild(node.value);
			} else {
				throw new TypeError(
					`Unknown portal target type: ${
						to.value === null ? "null" : typeof to.value
					}. Allowed types: string (CSS selector) or HTMLElement.`
				);
			}
		});
	});

	$effect(() => {
		return () => {
			untrack(() => node.value?.remove());
		};
	});
}
