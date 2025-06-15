import { watch } from "runed";
import { box, type ReadableBoxedValues } from "svelte-toolbelt";
import { AnimationsComplete } from "./animations-complete.svelte.js";

interface OpenChangeCompleteOpts
	extends ReadableBoxedValues<{
		enabled: boolean;
		open: boolean;
		ref: HTMLElement | null;
	}> {
	onComplete: () => void;
}

export class OpenChangeComplete {
	#opts: OpenChangeCompleteOpts;
	#afterAnimations: AnimationsComplete;
	constructor(opts: OpenChangeCompleteOpts) {
		this.#opts = opts;
		this.#afterAnimations = new AnimationsComplete({
			ref: this.#opts.ref,
			waitForNextTick: box.with(() => this.#opts.open.current),
		});

		watch(
			[() => this.#opts.open.current, () => this.#opts.enabled.current],
			([open, enabled]) => {
				if (!enabled) return;

				this.#afterAnimations.run(() => {
					if (open === this.#opts.open.current) {
						this.#opts.onComplete();
					}
				});
			}
		);
	}
}
