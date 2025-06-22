import type { AnyFn } from "./types.js";

export class SharedState<T extends AnyFn> {
	#factory: T;
	#subscribers = 0;
	#state: ReturnType<T> | undefined = $state();
	#scope: (() => void) | undefined;

	constructor(factory: T) {
		this.#factory = factory;
	}

	#dispose() {
		this.#subscribers -= 1;
		if (this.#scope && this.#subscribers <= 0) {
			this.#scope();
			this.#state = undefined;
			this.#scope = undefined;
		}
	}

	get(...args: Parameters<T>): ReturnType<T> {
		this.#subscribers += 1;
		if (this.#state === undefined) {
			this.#scope = $effect.root(() => {
				this.#state = this.#factory(...args);
			});
		}

		$effect(() => {
			return () => {
				this.#dispose();
			};
		});

		return this.#state!;
	}
}
