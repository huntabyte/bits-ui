/// <reference types="resize-observer-browser" />

import { tick, untrack } from "svelte";
import type { Box } from "./box.svelte.js";
import { afterTick } from "./after-tick.js";

export function useSize(node: Box<HTMLElement | null>) {
	let size = $state<{ width: number; height: number } | undefined>(undefined);

	$effect(() => {
		const currNode = node.value;
		if (!currNode) {
			size = undefined;
			return;
		}
		afterTick(() => {
			if (!currNode) return;
			size = {
				width: currNode.offsetWidth,
				height: currNode.offsetHeight,
			};
		});

		const resizeObserver = new ResizeObserver((entries) => {
			if (!Array.isArray(entries) || !entries.length) return;

			const entry = entries[0];
			if (!entry) return;

			let width: number;
			let height: number;

			if ("borderBoxSize" in entry) {
				const borderSizeEntry = entry.borderBoxSize;
				const borderSize = Array.isArray(borderSizeEntry)
					? borderSizeEntry[0]
					: borderSizeEntry;
				width = borderSize.inlineSize;
				height = borderSize.blockSize;
			} else {
				width = currNode.offsetWidth;
				height = currNode.offsetHeight;
			}

			untrack(() => (size = { width, height }));
		});

		resizeObserver.observe(currNode, { box: "border-box" });

		return () => {
			if (!currNode) return;
			resizeObserver.unobserve(currNode);
		};
	});

	return {
		get value() {
			return size;
		},
	};
}
