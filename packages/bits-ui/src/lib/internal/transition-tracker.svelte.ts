import { watch } from "runed";
import { box, type ReadableBox, type ReadableBoxedValues } from "svelte-toolbelt";

export type TransitionStatus = "starting" | "ending" | "idle" | undefined;

interface TransitionTrackerOpts
	extends ReadableBoxedValues<{
		open: boolean;
	}> {
	enableIdleState?: boolean;
}

export class TransitionTracker {
	#open: ReadableBox<boolean>;
	#enableIdleState: boolean = false;
	#transitionStatus = $state<TransitionStatus>();
	mounted = box(false);

	constructor(opts: TransitionTrackerOpts) {
		this.#open = opts.open;
		this.#enableIdleState = opts.enableIdleState ?? false;
		this.mounted.current = this.#open.current;

		if (this.#open.current && this.#enableIdleState) {
			this.#transitionStatus = "idle";
		}

		watch.pre(
			[() => this.#open.current, () => this.mounted.current, () => this.#transitionStatus],
			([open, mounted, transitionStatus]) => {
				if (open && !mounted) {
					this.mounted.current = true;
					this.#transitionStatus = "starting";
				}

				if (!open && mounted && transitionStatus !== "ending") {
					this.#transitionStatus = "ending";
				}

				if (!open && !mounted && transitionStatus === "ending") {
					this.#transitionStatus = undefined;
				}
			}
		);

		watch([() => this.#open.current], ([open]) => {
			if (!open || this.#enableIdleState) return;

			const frame = window.requestAnimationFrame(() => {
				this.#transitionStatus = undefined;
			});

			return () => {
				window.cancelAnimationFrame(frame);
			};
		});

		watch(
			[() => this.#open.current, () => this.mounted.current, () => this.#transitionStatus],
			([open, mounted, transitionStatus]) => {
				if (!open || !this.#enableIdleState) return;

				if (open && mounted && transitionStatus !== "idle") {
					this.#transitionStatus = "starting";
				}

				const frame = window.requestAnimationFrame(() => {
					this.#transitionStatus = "idle";
				});

				return () => {
					window.cancelAnimationFrame(frame);
				};
			}
		);
	}

	get transitionStatus() {
		return this.#transitionStatus;
	}
}
