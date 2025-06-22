import { afterTick, onDestroyEffect, type ReadableBoxedValues } from "svelte-toolbelt";

interface AnimationsCompleteOpts
	extends ReadableBoxedValues<{
		ref: HTMLElement | null;
		afterTick: boolean;
	}> {}

export class AnimationsComplete {
	#opts: AnimationsCompleteOpts;
	#currentFrame: number | undefined = undefined;
	#isRunning = false;

	constructor(opts: AnimationsCompleteOpts) {
		this.#opts = opts;
		onDestroyEffect(() => this.#cleanup());
	}

	#cleanup() {
		if (this.#currentFrame) {
			window.cancelAnimationFrame(this.#currentFrame);
			this.#currentFrame = undefined;
		}
		this.#isRunning = false;
	}

	run(fn: () => void | Promise<void>) {
		// prevent multiple concurrent runs
		if (this.#isRunning) return;

		this.#cleanup();
		this.#isRunning = true;

		const node = this.#opts.ref.current;
		if (!node) {
			this.#isRunning = false;
			return;
		}

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
			this.#isRunning = false;
		};

		if (this.#opts.afterTick) {
			afterTick(execute);
		} else {
			execute();
		}
	}
}
