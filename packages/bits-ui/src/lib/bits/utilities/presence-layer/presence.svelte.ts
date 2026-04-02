import { onDestroyEffect, type ReadableBox, type ReadableBoxedValues } from "svelte-toolbelt";
import { watch } from "runed";
import { AnimationsComplete } from "$lib/internal/animations-complete.js";
import type { TransitionState } from "$lib/internal/attrs.js";

export interface PresenceOptions
	extends ReadableBoxedValues<{
		open: boolean;
		ref: HTMLElement | null;
	}> {}

export class Presence {
	readonly opts: PresenceOptions;
	present: ReadableBox<boolean>;
	#afterAnimations: AnimationsComplete;
	#isPresent = $state(false);
	#hasMounted = false;
	#transitionStatus = $state<TransitionState>(undefined);
	#transitionFrame: number | null = null;

	constructor(opts: PresenceOptions) {
		this.opts = opts;
		this.present = this.opts.open;
		this.#isPresent = opts.open.current;
		this.#afterAnimations = new AnimationsComplete({
			ref: this.opts.ref,
			afterTick: this.opts.open,
		});
		onDestroyEffect(() => this.#clearTransitionFrame());

		watch(
			() => this.present.current,
			(isOpen) => {
				if (!this.#hasMounted) {
					this.#hasMounted = true;
					return;
				}

				this.#clearTransitionFrame();

				if (isOpen) {
					this.#isPresent = true;
				}

				this.#transitionStatus = isOpen ? "starting" : "ending";
				if (isOpen) {
					this.#transitionFrame = window.requestAnimationFrame(() => {
						this.#transitionFrame = null;
						if (this.present.current) {
							this.#transitionStatus = undefined;
						}
					});
				}

				this.#afterAnimations.run(() => {
					if (isOpen !== this.present.current) return;
					if (!isOpen) {
						this.#isPresent = false;
					}
					this.#transitionStatus = undefined;
				});
			}
		);
	}

	isPresent = $derived.by(() => {
		return this.#isPresent;
	});

	get transitionStatus(): TransitionState {
		return this.#transitionStatus;
	}

	#clearTransitionFrame(): void {
		if (this.#transitionFrame === null) return;
		window.cancelAnimationFrame(this.#transitionFrame);
		this.#transitionFrame = null;
	}
}
