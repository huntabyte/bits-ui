import { watch } from "runed";
import type { ReadableBoxedValues } from "svelte-toolbelt";
import { AnimationsComplete } from "./animations-complete.js";
import type { TransitionState } from "./attrs.js";

interface PresenceManagerOpts extends ReadableBoxedValues<{
	open: boolean;
	ref: HTMLElement | null;
}> {
	onComplete?: () => void;
	enabled?: boolean;
	shouldSkipExitAnimation?: () => boolean;
}

export class PresenceManager {
	#opts: PresenceManagerOpts;
	#enabled: boolean;
	#afterAnimations: AnimationsComplete;
	#shouldRender = $state(false);
	#transitionStatus = $state<TransitionState>(undefined);
	#hasMounted = false;
	#transitionFrame: number | null = null;

	constructor(opts: PresenceManagerOpts) {
		this.#opts = opts;
		this.#shouldRender = opts.open.current;
		this.#enabled = opts.enabled ?? true;
		this.#afterAnimations = new AnimationsComplete({
			ref: this.#opts.ref,
			afterTick: this.#opts.open,
			manualCleanup: true,
		});

		// Pending work is cancelled by the watcher's cleanup, which runs on destroy and
		// before every re-run (each run cancels the previous one's work anyway), instead of
		// by separate destroy effects.
		const cleanup = () => {
			this.#clearTransitionFrame();
			this.#afterAnimations.cancel();
		};

		watch(
			() => this.#opts.open.current,
			(isOpen) => {
				if (!this.#hasMounted) {
					this.#hasMounted = true;
					// `open` can change between construction and this first run (e.g. a root
					// mounted and opened in one flush); only skip when it still matches.
					if (isOpen === this.#shouldRender) return cleanup;
				}

				this.#clearTransitionFrame();

				if (!isOpen && this.#opts.shouldSkipExitAnimation?.()) {
					this.#shouldRender = false;
					this.#transitionStatus = undefined;
					this.#opts.onComplete?.();
					return cleanup;
				}

				if (isOpen) this.#shouldRender = true;
				this.#transitionStatus = isOpen ? "starting" : "ending";
				if (isOpen) {
					this.#transitionFrame = window.requestAnimationFrame(() => {
						this.#transitionFrame = null;
						if (this.#opts.open.current) {
							this.#transitionStatus = undefined;
						}
					});
				}

				if (!this.#enabled) {
					if (!isOpen) {
						this.#shouldRender = false;
					}
					this.#transitionStatus = undefined;
					this.#opts.onComplete?.();
					return cleanup;
				}

				this.#afterAnimations.run(() => {
					if (isOpen === this.#opts.open.current) {
						if (!this.#opts.open.current) {
							this.#shouldRender = false;
						}
						this.#transitionStatus = undefined;
						this.#opts.onComplete?.();
					}
				});
				return cleanup;
			}
		);
	}

	get shouldRender() {
		return this.#shouldRender;
	}

	get transitionStatus(): TransitionState {
		return this.#transitionStatus;
	}

	#clearTransitionFrame(): void {
		if (this.#transitionFrame === null) return;
		window.cancelAnimationFrame(this.#transitionFrame);
		this.#transitionFrame = null;
	}
}
