import { SvelteMap } from "svelte/reactivity";
import {
	type Getter,
	type ReadableBox,
	afterTick,
	boxWith,
	onDestroyEffect,
} from "svelte-toolbelt";
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

const MANAGED_PROPERTIES = [
	"padding-right",
	"margin-right",
	"overflow",
	"pointer-events",
	"--scrollbar-width",
] as const;

type ManagedProperty = (typeof MANAGED_PROPERTIES)[number];

interface StylePropertySnapshot {
	value: string;
	priority: string;
}

let initialProperties: Map<ManagedProperty, StylePropertySnapshot> | null = null;
let hadInitialStyleAttribute = false;
const modifiedProperties = new Set<ManagedProperty>();
let stopTouchMoveListener: Fn | null = null;
let cleanupTimeoutId: number | null = null;
let isInCleanupTransition = false;

function setManagedProperty(style: CSSStyleDeclaration, property: ManagedProperty, value: string) {
	style.setProperty(property, value);
	modifiedProperties.add(property);
}

const anyLocked = boxWith(() => {
	for (const value of lockMap.values()) {
		if (value) return true;
	}
	return false;
});

/**
 * We track the time we scheduled the cleanup to prevent race conditions
 * when multiple locks are created/destroyed in the same tick, ensuring
 * only the last one to schedule the cleanup will run.
 *
 * reference: https://github.com/huntabyte/bits-ui/issues/1639
 */
let cleanupScheduledAt: number | null = null;

const bodyLockStackCount = new SharedState(() => {
	function resetBodyStyle(documentObj: Document) {
		if (!BROWSER) return;
		if (initialProperties) {
			for (const prop of modifiedProperties) {
				const initial = initialProperties.get(prop);
				if (initial?.value) {
					documentObj.body.style.setProperty(prop, initial.value, initial.priority);
				} else {
					documentObj.body.style.removeProperty(prop);
				}
			}
			if (!hadInitialStyleAttribute && documentObj.body.style.length === 0) {
				documentObj.body.removeAttribute("style");
			}
			initialProperties = null;
		}
		modifiedProperties.clear();
		isIOS && stopTouchMoveListener?.();
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
		if (initialProperties === null && lockMap.size === 0 && !isInCleanupTransition) {
			hadInitialStyleAttribute = document.body.hasAttribute("style");
			initialProperties = new Map();
			for (const prop of MANAGED_PROPERTIES) {
				initialProperties.set(prop, {
					value: document.body.style.getPropertyValue(prop),
					priority: document.body.style.getPropertyPriority(prop),
				});
			}
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
				setManagedProperty(document.body.style, "padding-right", `${config.padding}px`);
				setManagedProperty(document.body.style, "margin-right", `${config.margin}px`);
				setManagedProperty(
					document.body.style,
					"--scrollbar-width",
					`${verticalScrollbarWidth}px`
				);
			}
			setManagedProperty(document.body.style, "overflow", "hidden");

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
			 */
			afterTick(() => {
				setManagedProperty(document.body.style, "pointer-events", "none");
				setManagedProperty(document.body.style, "overflow", "hidden");
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
		restoreScrollDelay: Getter<number | null> = () => null
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

		this.locked = boxWith(
			() => this.#countState.lockMap.get(this.#id) ?? false,
			(v) => this.#countState.lockMap.set(this.#id, v)
		);

		onDestroyEffect(() => {
			this.#countState.lockMap.delete(this.#id);

			// if not the last lock, we don't need to do anything
			if (isAnyLocked(this.#countState.lockMap)) return;

			const restoreScrollDelay = this.#restoreScrollDelay();
			const documentObj = document;

			/**
			 * We schedule the cleanup to run after a delay to handle same-tick
			 * destroy/create scenarios.
			 *
			 * reference: https://github.com/huntabyte/bits-ui/issues/1639
			 */
			this.#countState.scheduleCleanupIfNoNewLocks(restoreScrollDelay, () => {
				this.#countState.resetBodyStyle(documentObj);
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
