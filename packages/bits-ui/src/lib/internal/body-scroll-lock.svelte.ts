import { SvelteMap } from "svelte/reactivity";
import { type Getter, type ReadableBox, afterTick, onDestroyEffect } from "svelte-toolbelt";
import { boxWith } from "./box.svelte.js";
import type { Fn } from "./types.js";
import { isIOS } from "./is.js";
import { useId } from "./use-id.js";
import { watch } from "runed";
import { SharedState } from "./shared-state.svelte.js";
import { BROWSER } from "esm-env";
import { on } from "svelte/events";

export interface ScrollBodyOption {
	padding?: boolean | number;
	margin?: boolean | number;
}
/** A map of lock ids to their `locked` state. */
const lockMap = new SvelteMap<string, boolean>();

/**
 * A map of lock ids to a predicate deciding whether that lock needs
 * `pointer-events: none` applied to the body while it is active.
 *
 * Setting `pointer-events` on the body is by far the most expensive part of
 * locking (it's an inherited property, so the browser must recalculate style
 * for every element in the body's subtree — twice, once on lock and once on
 * unlock). Components that already block pointer interaction another way
 * (e.g. a dialog rendering a full-viewport overlay) can skip it.
 */
const pointerEventsMap = new SvelteMap<string, () => boolean>();

let initialBodyStyle: string | null = $state<string | null>(null);
let stopTouchMoveListener: Fn | null = null;
let cleanupTimeoutId: number | null = null;
let isInCleanupTransition = false;

const anyLocked = boxWith(() => {
	for (const value of lockMap.values()) {
		if (value) return true;
	}
	return false;
});

const anyPointerEventsNoneWanted = boxWith(() => {
	if (!anyLocked.current) return false;
	for (const [id, wantsPointerEventsNone] of pointerEventsMap) {
		if (lockMap.get(id) && wantsPointerEventsNone()) return true;
	}
	return false;
});

function anyActiveLockWantsPointerEventsNone() {
	for (const [id, wantsPointerEventsNone] of pointerEventsMap) {
		if (lockMap.get(id) && wantsPointerEventsNone()) return true;
	}
	return false;
}

/**
 * We track the time we scheduled the cleanup to prevent race conditions
 * when multiple locks are created/destroyed in the same tick, ensuring
 * only the last one to schedule the cleanup will run.
 *
 * reference: https://github.com/huntabyte/bits-ui/issues/1639
 */
let cleanupScheduledAt: number | null = null;

const bodyLockStackCount = new SharedState(() => {
	function resetBodyStyle() {
		if (!BROWSER) return;
		document.body.setAttribute("style", initialBodyStyle ?? "");
		document.body.style.removeProperty("--scrollbar-width");
		isIOS && stopTouchMoveListener?.();
		// reset initialBodyStyle so next locker captures the correct styles
		initialBodyStyle = null;
	}

	function cancelPendingCleanup() {
		if (cleanupTimeoutId === null) return;
		window.clearTimeout(cleanupTimeoutId);
		cleanupTimeoutId = null;
	}

	function scheduleCleanupIfNoNewLocks(delay: number | null, callback: () => void) {
		cancelPendingCleanup();
		isInCleanupTransition = true;

		cleanupScheduledAt = Date.now();
		const currentCleanupId = cleanupScheduledAt;

		/**
		 * We schedule the cleanup to run after a delay to allow new locks to register
		 * that might have been added in the same tick as the current cleanup.
		 *
		 * If a new lock is added in the same tick, the cleanup will be cancelled and
		 * a new cleanup will be scheduled.
		 *
		 * This is to prevent the cleanup from running too early and resetting the body
		 * style before the new lock has had a chance to apply its styles.
		 */
		const cleanupFn = () => {
			cleanupTimeoutId = null;

			// check if this cleanup is still valid (no newer cleanups scheduled)
			if (cleanupScheduledAt !== currentCleanupId) return;

			// ensure no new locks were added during the delay
			if (!isAnyLocked(lockMap)) {
				isInCleanupTransition = false;
				callback();
			} else {
				isInCleanupTransition = false;
			}
		};

		const actualDelay = delay === null ? 24 : delay;
		cleanupTimeoutId = window.setTimeout(cleanupFn, actualDelay);
	}

	function ensureInitialStyleCaptured() {
		// only capture initial style once, when no locks exist and no cleanup is in progress
		if (initialBodyStyle === null && lockMap.size === 0 && !isInCleanupTransition) {
			initialBodyStyle = document.body.getAttribute("style");
		}
	}

	watch(
		() => anyLocked.current,
		() => {
			if (!anyLocked.current) return;

			// ensure we've captured the initial style before applying any lock styles
			ensureInitialStyleCaptured();

			// if we're applying lock styles, we're no longer in a cleanup transition
			isInCleanupTransition = false;

			const htmlStyle = getComputedStyle(document.documentElement);
			const bodyStyle = getComputedStyle(document.body);

			// check if scrollbar-gutter: stable is already handling scrollbar space
			const hasStableGutter =
				htmlStyle.scrollbarGutter?.includes("stable") ||
				bodyStyle.scrollbarGutter?.includes("stable");

			// TODO: account for RTL direction, etc.
			const verticalScrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
			const paddingRight = Number.parseInt(bodyStyle.paddingRight ?? "0", 10);

			const config = {
				padding: paddingRight + verticalScrollbarWidth,
				margin: Number.parseInt(bodyStyle.marginRight ?? "0", 10),
			};

			// only add padding compensation if stable gutter isn't handling it
			if (verticalScrollbarWidth > 0 && !hasStableGutter) {
				document.body.style.paddingRight = `${config.padding}px`;
				document.body.style.marginRight = `${config.margin}px`;
				document.body.style.setProperty("--scrollbar-width", `${verticalScrollbarWidth}px`);
			}
			document.body.style.overflow = "hidden";

			if (isIOS) {
				// IOS devices are special and require a touchmove listener to prevent scrolling
				stopTouchMoveListener = on(
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

			/**
			 * We ensure pointer-events: none is applied _after_ DOM updates, so that any focus/
			 * interaction changes from opening overlays/menus complete _before_ we block pointer
			 * events.
			 *
			 * this avoids race conditions where pointer-events could be set too early and break
			 * focus/interaction.
			 *
			 * The check runs inside `afterTick` (not when the lock is created) so that lock
			 * owners can base their decision on refs that only settle once the open content
			 * has mounted (e.g. a dialog's overlay node).
			 */
			afterTick(() => {
				if (anyActiveLockWantsPointerEventsNone()) {
					document.body.style.pointerEvents = "none";
				}
				document.body.style.overflow = "hidden";
			});
		}
	);

	/**
	 * Handles locks that begin wanting `pointer-events: none` while the body is
	 * already locked (e.g. an overlay-less dialog opening on top of an already
	 * open popup that skipped the write) — the `anyLocked` watch above only fires
	 * on the first lock. Once applied, `pointer-events` is only restored when the
	 * last lock releases (via `resetBodyStyle`), matching the previous behavior.
	 */
	watch(
		() => anyPointerEventsNoneWanted.current,
		() => {
			if (!anyPointerEventsNoneWanted.current) return;
			ensureInitialStyleCaptured();
			afterTick(() => {
				if (anyActiveLockWantsPointerEventsNone()) {
					document.body.style.pointerEvents = "none";
				}
			});
		}
	);

	onDestroyEffect(() => {
		return () => {
			stopTouchMoveListener?.();
		};
	});

	return {
		get lockMap() {
			return lockMap;
		},
		resetBodyStyle,
		scheduleCleanupIfNoNewLocks,
		cancelPendingCleanup,
		ensureInitialStyleCaptured,
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
		restoreScrollDelay: Getter<number | null> = () => null,
		shouldBlockPointerEvents: () => boolean = () => true
	) {
		this.#initialState = initialState;
		this.#restoreScrollDelay = restoreScrollDelay;
		this.#countState = bodyLockStackCount.get();

		if (!this.#countState) return;

		/**
		 * Since a new lock is being created, we cancel any pending cleanup to
		 * prevent the cleanup from running too early and resetting the body style
		 * before the new lock has had a chance to apply its styles.
		 *
		 * reference: https://github.com/huntabyte/bits-ui/issues/1639
		 */
		this.#countState.cancelPendingCleanup();

		// capture initial style before this lock is registered
		this.#countState.ensureInitialStyleCaptured();

		this.#countState.lockMap.set(this.#id, this.#initialState ?? false);
		pointerEventsMap.set(this.#id, shouldBlockPointerEvents);

		this.locked = boxWith(
			() => this.#countState.lockMap.get(this.#id) ?? false,
			(v) => this.#countState.lockMap.set(this.#id, v)
		);

		onDestroyEffect(() => {
			this.#countState.lockMap.delete(this.#id);
			pointerEventsMap.delete(this.#id);

			// if not the last lock, we don't need to do anything
			if (isAnyLocked(this.#countState.lockMap)) return;

			const restoreScrollDelay = this.#restoreScrollDelay();

			/**
			 * We schedule the cleanup to run after a delay to handle same-tick
			 * destroy/create scenarios.
			 *
			 * reference: https://github.com/huntabyte/bits-ui/issues/1639
			 */
			this.#countState.scheduleCleanupIfNoNewLocks(restoreScrollDelay, () => {
				this.#countState.resetBodyStyle();
			});
		});
	}
}

function isAnyLocked(map: Map<string, boolean>) {
	for (const [_, value] of map) {
		if (value) return true;
	}
	return false;
}
