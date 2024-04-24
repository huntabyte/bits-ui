import { Map } from "svelte/reactivity";
import { onDestroy, untrack } from "svelte";
import type { Fn } from "./types.js";
import { isBrowser, isIOS } from "./is.js";
import { box, boxedState, watch } from "./box.svelte.js";
import { addEventListener } from "./events.js";
import { afterTick } from "./after-tick.js";
import { useId } from "./use-id.svelte.js";

function createBodyLockStackCount() {
	const map = $state(new Map<string, boolean>());
	let initialOverflow = $state<string | undefined>();

	const locked = boxedState<boolean>(false);

	$effect(() => {
		console.log("map values changed, rerunning effect");
		for (const value of map.values()) {
			if (value) {
				untrack(() => (locked.value = true));
				return;
			}
			untrack(() => (locked.value = false));
		}
	});

	let stopTouchMoveListener: Fn | null = null;

	function resetBodyStyle() {
		if (!isBrowser) return;
		document.body.style.paddingRight = "";
		document.body.style.marginRight = "";
		document.body.style.pointerEvents = "";
		document.body.style.removeProperty("--scrollbar-width");
		document.body.style.overflow = initialOverflow ?? "";
		isIOS && stopTouchMoveListener?.();
	}

	watch(locked, (curr, prev) => {
		console.log("curr", curr);
		console.log("prev", prev);
		if (!curr) {
			if (prev) {
				resetBodyStyle();
			}
			return;
		}

		if (initialOverflow === undefined) {
			initialOverflow = document.body.style.overflow;
		}

		const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
		const defaultConfig = {
			padding: verticalScrollbarWidth,
			margin: 0,
		};

		// TODO: give user ability to customize the config via global context
		const config = defaultConfig;

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
	});

	$effect(() => {
		return () => {
			stopTouchMoveListener?.();
		};
	});

	return map;
}

export function useBodyScrollLock(initialState?: boolean | undefined) {
	// const id = useId();
	// const map = useBodyLockStackCount();
	// map.set(id, initialState ?? false);
	// const locked = box(
	// 	() => map.get(id) ?? false,
	// 	(v) => map.set(id, v)
	// );
	// onDestroy(() => {
	// 	map.delete(id);
	// });
	// return locked;
}
