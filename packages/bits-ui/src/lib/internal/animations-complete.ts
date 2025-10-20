import { afterTick, onDestroyEffect, type ReadableBoxedValues } from "svelte-toolbelt";

interface AnimationsCompleteOpts
	extends ReadableBoxedValues<{
		ref: HTMLElement | null;
		afterTick: boolean;
	}> {}

export class AnimationsComplete {
	#opts: AnimationsCompleteOpts;
	#currentFrame: number | null = null;

	constructor(opts: AnimationsCompleteOpts) {
		this.#opts = opts;
		onDestroyEffect(() => this.#cleanup());
	}

	#cleanup() {
		if (!this.#currentFrame) return;
		window.cancelAnimationFrame(this.#currentFrame);
		this.#currentFrame = null;
	}

	run(fn: () => void | Promise<void>) {
		// if already running, cleanup and restart
		this.#cleanup();

		const node = this.#opts.ref.current;
		if (!node) return;

		if (typeof node.getAnimations !== "function") {
			this.#executeCallback(fn);
			return;
		}

		this.#currentFrame = window.requestAnimationFrame(() => {
			const animations = node.getAnimations();

			if (animations.length === 0) {
				this.#executeCallback(fn);
				return;
			}

			Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
				this.#executeCallback(fn);
			});
		});
	}

	#executeCallback(fn: () => void | Promise<void>) {
		const execute = () => {
			fn();
		};

		if (this.#opts.afterTick) {
			afterTick(execute);
		} else {
			execute();
		}
	}
}
