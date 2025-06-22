import { watch } from "runed";
import type { ReadableBoxedValues } from "svelte-toolbelt";
import { AnimationsComplete } from "./animations-complete.js";

interface OpenChangeCompleteOpts
	extends ReadableBoxedValues<{
		open: boolean;
		ref: HTMLElement | null;
	}> {
	onComplete: () => void;
	enabled?: boolean;
}

export class OpenChangeComplete {
	#opts: OpenChangeCompleteOpts;
	#enabled: boolean;
	#afterAnimations: AnimationsComplete;
	constructor(opts: OpenChangeCompleteOpts) {
		this.#opts = opts;
		this.#enabled = opts.enabled ?? true;
		this.#afterAnimations = new AnimationsComplete({
			ref: this.#opts.ref,
			afterTick: this.#opts.open,
		});

		watch([() => this.#opts.open.current], ([open]) => {
			if (!this.#enabled) return;

			this.#afterAnimations.run(() => {
				if (open === this.#opts.open.current) {
					this.#opts.onComplete();
				}
			});
		});
	}
}
