import { SvelteMap } from "svelte/reactivity";
import {
	type Getter,
	type ReadableBox,
	afterSleep,
	afterTick,
	box,
	onDestroyEffect,
} from "svelte-toolbelt";
import type { Fn } from "./types.js";
import { isBrowser, isIOS } from "./is.js";
import { addEventListener } from "./events.js";
import { useId } from "./use-id.js";
import { watch } from "runed";
import { SharedState } from "./shared-state.svelte.js";

export interface ScrollBodyOption {
	padding?: boolean | number;
	margin?: boolean | number;
}

const bodyLockStackCount = new SharedState(() => {
	const map = new SvelteMap<string, boolean>();

	const locked = $derived.by(() => {
		for (const value of map.values()) {
			if (value) return true;
		}
		return false;
	});

	let initialBodyStyle: string | null = $state<string | null>(null);

	let stopTouchMoveListener: Fn | null = null;

	function resetBodyStyle() {
		if (!isBrowser) return;
		document.body.setAttribute("style", initialBodyStyle ?? "");
		document.body.style.removeProperty("--scrollbar-width");
		isIOS && stopTouchMoveListener?.();
	}

	watch(
		() => locked,
		() => {
			if (!locked) return;

			initialBodyStyle = document.body.getAttribute("style");
			const bodyStyle = getComputedStyle(document.body);

			// TODO: account for RTL direction, etc.
			const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			const paddingRight = Number.parseInt(bodyStyle.paddingRight ?? "0", 10);

			const config = {
				padding: paddingRight + verticalScrollbarWidth,
				margin: Number.parseInt(bodyStyle.marginRight ?? "0", 10),
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

	onDestroyEffect(() => {
		return () => {
			stopTouchMoveListener?.();
		};
	});

	return {
		get map() {
			return map;
		},
		resetBodyStyle,
	};
});

export class BodyScrollLock {
	readonly #id = useId();
	readonly #initialState: boolean | undefined;
	readonly #restoreScrollDelay: Getter<number | null> = () => null;
	readonly #countState: ReturnType<typeof bodyLockStackCount.get>;
	readonly locked: ReadableBox<boolean> | undefined;

	constructor(
		initialState?: boolean | undefined,
		restoreScrollDelay: Getter<number | null> = () => null
	) {
		this.#initialState = initialState;
		this.#restoreScrollDelay = restoreScrollDelay;
		this.#countState = bodyLockStackCount.get();

		if (!this.#countState) return;

		this.#countState.map.set(this.#id, this.#initialState ?? false);

		this.locked = box.with(
			() => this.#countState.map.get(this.#id) ?? false,
			(v) => this.#countState.map.set(this.#id, v)
		);

		onDestroyEffect(() => {
			this.#countState.map.delete(this.#id);
			// if any locks are still active, we don't reset the body style
			if (isAnyLocked(this.#countState.map)) return;

			const restoreScrollDelay = this.#restoreScrollDelay();

			// if no locks are active (meaning this was the last lock), we reset the body style
			if (restoreScrollDelay === null) {
				requestAnimationFrame(() => this.#countState.resetBodyStyle());
			} else {
				afterSleep(restoreScrollDelay, () => this.#countState.resetBodyStyle());
			}
		});
	}
}

function isAnyLocked(map: Map<string, boolean>) {
	for (const [_, value] of map) {
		if (value) return true;
	}
	return false;
}
