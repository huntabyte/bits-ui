import { afterTick, onDestroyEffect, type ReadableBoxedValues } from "svelte-toolbelt";

interface AnimationsCompleteOpts
	extends ReadableBoxedValues<{
		ref: HTMLElement | null;
		waitForNextTick: boolean;
	}> {}

export class AnimationsComplete {
	#opts: AnimationsCompleteOpts;
	#currentFrame: number | undefined = undefined;

	constructor(opts: AnimationsCompleteOpts) {
		this.#opts = opts;
		onDestroyEffect(() => this.#cleanup());
	}

	#cleanup() {
		if (this.#currentFrame) {
			window.cancelAnimationFrame(this.#currentFrame);
			this.#currentFrame = undefined;
		}
	}

	run(fn: () => void, signal: AbortSignal | null = null) {
		this.#cleanup();

		const node = this.#opts.ref.current;
		if (!node) return;

		if (typeof node.getAnimations !== "function") {
			fn();
		} else {
			this.#currentFrame = window.requestAnimationFrame(() => {
				function run() {
					if (!node) return;

					Promise.allSettled(
						node.getAnimations().map((animation) => animation.finished)
					).then(() => {
						if (signal != null && signal.aborted) return;
						fn();
					});
				}

				if (this.#opts.waitForNextTick) {
					afterTick(() => run());
				} else {
					run();
				}
			});
		}
	}
}
