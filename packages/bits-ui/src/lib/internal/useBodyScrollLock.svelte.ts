import { Map } from "svelte/reactivity";
import { box } from "svelte-toolbelt";
import type { Fn } from "./types.js";
import { isBrowser, isIOS } from "./is.js";
import { addEventListener } from "./events.js";
import { afterTick } from "./afterTick.js";
import { useId } from "./useId.svelte.js";
import { createSharedHook } from "./createSharedHook.svelte.js";
import { watch } from "$lib/internal/box.svelte.js";

export type ScrollBodyOption = {
	padding?: boolean | number;
	margin?: boolean | number;
};

const useBodyLockStackCount = createSharedHook(() => {
	const map = new Map<string, boolean>();

	const locked = $derived.by(() => {
		for (const value of map.values()) {
			if (value) {
				return true;
			}
		}
		return false;
	});

	let initialBodyStyle: Partial<CSSStyleDeclaration> = $state<Partial<CSSStyleDeclaration>>({});

	let stopTouchMoveListener: Fn | null = null;

	function resetBodyStyle() {
		if (!isBrowser) return;
		document.body.style.paddingRight = initialBodyStyle.paddingRight ?? "";
		document.body.style.marginRight = initialBodyStyle.marginRight ?? "";
		document.body.style.pointerEvents = initialBodyStyle.pointerEvents ?? "";
		document.body.style.removeProperty("--scrollbar-width");
		document.body.style.overflow = initialBodyStyle.overflow ?? "";
		isIOS && stopTouchMoveListener?.();
	}

	watch(
		box.with(() => locked),
		(curr, prev) => {
			if (!curr) {
				if (prev) {
					resetBodyStyle();
				}
				return;
			}

			const bodyStyle = getComputedStyle(document.body);
			initialBodyStyle.overflow = bodyStyle.overflow;
			initialBodyStyle.paddingRight = bodyStyle.paddingRight;
			initialBodyStyle.marginRight = bodyStyle.marginRight;
			initialBodyStyle.pointerEvents = bodyStyle.pointerEvents;

			// TODO: account for RTL direction, etc.
			const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			const paddingRight = Number.parseInt(initialBodyStyle.paddingRight ?? "0", 10);

			const config = {
				padding: paddingRight + verticalScrollbarWidth,
				margin: Number.parseInt(initialBodyStyle.marginRight ?? "0", 10),
			};

			if (verticalScrollbarWidth > 0) {
				document.body.style.paddingRight = `${config.padding}px`;
				document.body.style.marginRight = `${config.margin}px`;
				document.body.style.setProperty("--scrollbar-width", `${verticalScrollbarWidth}px`);
				document.body.style.overflow = "hidden";
			}

			if (isIOS) {
				stopTouchMoveListener = addEventListener(
					document,
					"touchmove",
					(e) => {
						if (e.target !== document.documentElement) return;

						if (e.touches.length > 1) return;
						e.preventDefault();
					},
					{ passive: false }
				);
			}

			afterTick(() => {
				document.body.style.pointerEvents = "none";
				document.body.style.overflow = "hidden";
			});
		}
	);

	$effect(() => {
		return () => {
			stopTouchMoveListener?.();
		};
	});

	return map;
});

export function useBodyScrollLock(initialState?: boolean | undefined) {
	const id = useId();
	const map = useBodyLockStackCount();

	map.set(id, initialState ?? false);

	const locked = box.with(
		() => map.get(id) ?? false,
		(v) => map.set(id, v)
	);

	$effect(() => {
		return () => {
			map.delete(id);
		};
	});

	return locked;
}
