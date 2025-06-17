import { onDestroyEffect, type ReadableBoxedValues } from "svelte-toolbelt";
import { FocusScopeManager } from "./focus-scope-manager.js";
import { focusable, isFocusable, tabbable } from "tabbable";
import { on } from "svelte/events";
import { watch } from "runed";

interface FocusScopeOpts
	extends ReadableBoxedValues<{
		onOpenAutoFocus: (event: Event) => void;
		onCloseAutoFocus: (event: Event) => void;
		trap: boolean;
	}> {
	loop: boolean;
}

interface FocusScopeUseOpts
	extends FocusScopeOpts,
		ReadableBoxedValues<{
			enabled: boolean;
			ref: HTMLElement | null;
		}> {}

export class FocusScope {
	#paused = false;
	#container: HTMLElement | null = null;
	#manager = FocusScopeManager.getInstance();
	#cleanupFns: Array<() => void> = [];
	#opts: FocusScopeOpts;

	constructor(opts: FocusScopeOpts) {
		this.#opts = opts;
	}

	get paused() {
		return this.#paused;
	}

	pause() {
		this.#paused = true;
	}

	resume() {
		this.#paused = false;
	}

	#cleanup() {
		for (const fn of this.#cleanupFns) {
			fn();
		}
		this.#cleanupFns = [];
	}

	mount(container: HTMLElement) {
		if (this.#container) {
			this.unmount();
		}

		this.#container = container;
		this.#manager.register(this);

		this.#setupEventListeners();
		this.#handleOpenAutoFocus();
	}

	unmount() {
		if (!this.#container) return;

		this.#cleanup();

		// handle close auto-focus
		this.#handleCloseAutoFocus();

		this.#manager.unregister(this);
		this.#container = null;
	}

	#handleOpenAutoFocus() {
		if (!this.#container) return;

		const event = new CustomEvent("focusScope.onOpenAutoFocus", {
			bubbles: false,
			cancelable: true,
		});
		this.#opts.onOpenAutoFocus.current(event);

		if (!event.defaultPrevented) {
			requestAnimationFrame(() => {
				if (!this.#container) return;
				const firstTabbable = this.#getFirstTabbable();
				if (firstTabbable) {
					firstTabbable.focus();
					this.#manager.setFocusMemory(this, firstTabbable);
				} else {
					this.#container.focus();
				}
			});
		}
	}

	#handleCloseAutoFocus() {
		const event = new CustomEvent("focusScope.onCloseAutoFocus", {
			bubbles: false,
			cancelable: true,
		});

		this.#opts.onCloseAutoFocus.current(event);

		if (!event.defaultPrevented) {
			// return focus to previously focused element
			const prevFocused = document.activeElement as HTMLElement;
			if (prevFocused && prevFocused !== document.body) {
				prevFocused.focus();
			}
		}
	}

	#setupEventListeners() {
		if (!this.#container || !this.#opts.trap.current) return;

		const container = this.#container;
		const doc = container.ownerDocument;

		const handleFocus = (e: FocusEvent) => {
			if (this.#paused || !this.#manager.isActiveScope(this)) return;

			const target = e.target as HTMLElement;
			if (!target) return;

			const isInside = container.contains(target);

			if (isInside) {
				// store last focused element
				this.#manager.setFocusMemory(this, target);
			} else {
				// focus escaped - bring it back
				const lastFocused = this.#manager.getFocusMemory(this);
				if (lastFocused && container.contains(lastFocused) && isFocusable(lastFocused)) {
					e.preventDefault();
					lastFocused.focus();
				} else {
					// fallback to first tabbable or first focusable or container
					const firstTabbable = this.#getFirstTabbable();
					const firstFocusable = this.#getAllFocusables()[0];
					(firstTabbable || firstFocusable || container).focus();
				}
			}
		};

		const handleKeydown = (e: KeyboardEvent) => {
			if (!this.#opts.loop || this.#paused || e.key !== "Tab") return;
			if (!this.#manager.isActiveScope(this)) return;

			const tabbables = this.#getTabbables();
			if (tabbables.length < 2) return;

			const first = tabbables[0];
			const last = tabbables[tabbables.length - 1];

			if (!e.shiftKey && doc.activeElement === last) {
				e.preventDefault();
				first!.focus();
			} else if (e.shiftKey && doc.activeElement === first) {
				e.preventDefault();
				last!.focus();
			}
		};

		this.#cleanupFns.push(
			on(doc, "focusin", handleFocus, { capture: true }),
			on(container, "keydown", handleKeydown)
		);

		const observer = new MutationObserver(() => {
			const lastFocused = this.#manager.getFocusMemory(this);
			if (lastFocused && !container.contains(lastFocused)) {
				// last focused element was removed
				const firstTabbable = this.#getFirstTabbable();
				const firstFocusable = this.#getAllFocusables()[0];
				const elementToFocus = firstTabbable || firstFocusable;

				if (elementToFocus) {
					elementToFocus.focus();
					this.#manager.setFocusMemory(this, elementToFocus);
				} else {
					// no focusable elements left, focus container
					container.focus();
				}
			}
		});

		observer.observe(container, {
			childList: true,
			subtree: true,
		});

		this.#cleanupFns.push(() => observer.disconnect());
	}

	#getTabbables(): HTMLElement[] {
		if (!this.#container) return [];

		return tabbable(this.#container, {
			includeContainer: false,
			getShadowRoot: true,
		}) as HTMLElement[];
	}

	#getFirstTabbable(): HTMLElement | null {
		const tabbables = this.#getTabbables();
		return tabbables[0] || null;
	}

	#getAllFocusables(): HTMLElement[] {
		if (!this.#container) return [];

		return focusable(this.#container, {
			includeContainer: false,
			getShadowRoot: true,
		}) as HTMLElement[];
	}

	static use(opts: FocusScopeUseOpts) {
		let scope: FocusScope | null = null;

		watch([() => opts.ref.current, () => opts.enabled.current], ([ref, enabled]) => {
			if (ref && enabled) {
				if (!scope) {
					scope = new FocusScope(opts);
				}
				scope.mount(ref);
			} else if (scope) {
				scope.unmount();
				scope = null;
			}
		});

		onDestroyEffect(() => {
			scope?.unmount();
		});

		return {
			get props() {
				return {
					tabindex: -1,
				};
			},
		};
	}
}
