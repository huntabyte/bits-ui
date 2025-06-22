import { type ReadableBox, type ReadableBoxedValues, executeCallbacks } from "svelte-toolbelt";
import { Previous, watch } from "runed";
import { on } from "svelte/events";
import { StateMachine } from "$lib/internal/state-machine.js";

export interface PresenceOptions
	extends ReadableBoxedValues<{
		open: boolean;
		ref: HTMLElement | null;
	}> {}

type PresenceStatus = "unmounted" | "mounted" | "unmountSuspended";

const presenceMachine = {
	mounted: {
		UNMOUNT: "unmounted",
		ANIMATION_OUT: "unmountSuspended",
	},
	unmountSuspended: {
		MOUNT: "mounted",
		ANIMATION_END: "unmounted",
	},
	unmounted: {
		MOUNT: "mounted",
	},
} as const;

type PresenceMachine = StateMachine<typeof presenceMachine>;

export class Presence {
	readonly opts: PresenceOptions;
	prevAnimationNameState = $state("none");
	styles = $state({}) as CSSStyleDeclaration;
	initialStatus: PresenceStatus;
	previousPresent: Previous<boolean>;
	machine: PresenceMachine;
	present: ReadableBox<boolean>;

	constructor(opts: PresenceOptions) {
		this.opts = opts;
		this.present = this.opts.open;

		this.initialStatus = opts.open.current ? "mounted" : "unmounted";
		this.previousPresent = new Previous(() => this.present.current);
		this.machine = new StateMachine(this.initialStatus, presenceMachine);

		this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
		this.handleAnimationStart = this.handleAnimationStart.bind(this);

		watchPresenceChange(this);
		watchStatusChange(this);
		watchRefChange(this);
	}

	/**
	 * Triggering an ANIMATION_OUT during an ANIMATION_IN will fire an `animationcancel`
	 * event for ANIMATION_IN after we have entered `unmountSuspended` state. So, we
	 * make sure we only trigger ANIMATION_END for the currently active animation.
	 */
	handleAnimationEnd(event: AnimationEvent) {
		if (!this.opts.ref.current) return;
		const currAnimationName = getAnimationName(this.opts.ref.current);
		const isCurrentAnimation =
			currAnimationName.includes(event.animationName) || currAnimationName === "none";

		if (event.target === this.opts.ref.current && isCurrentAnimation) {
			this.machine.dispatch("ANIMATION_END");
		}
	}

	handleAnimationStart(event: AnimationEvent) {
		if (!this.opts.ref.current) return;
		if (event.target === this.opts.ref.current) {
			this.prevAnimationNameState = getAnimationName(this.opts.ref.current);
		}
	}

	isPresent = $derived.by(() => {
		return ["mounted", "unmountSuspended"].includes(this.machine.state.current);
	});
}

function watchPresenceChange(state: Presence) {
	watch(
		() => state.present.current,
		() => {
			if (!state.opts.ref.current) return;
			const hasPresentChanged = state.present.current !== state.previousPresent.current;
			if (!hasPresentChanged) return;

			const prevAnimationName = state.prevAnimationNameState;
			const currAnimationName = getAnimationName(state.opts.ref.current);

			if (state.present.current) {
				state.machine.dispatch("MOUNT");
			} else if (currAnimationName === "none" || state.styles.display === "none") {
				// If there is no exit animation or the element is hidden, animations won't run
				// so we unmount instantly
				state.machine.dispatch("UNMOUNT");
			} else {
				/**
				 * When `present` changes to `false`, we check changes to animation-name to
				 * determine whether an animation has started. We chose this approach (reading
				 * computed styles) because there is no `animationrun` event and `animationstart`
				 * fires after `animation-delay` has expired which would be too late.
				 */
				const isAnimating = prevAnimationName !== currAnimationName;

				if (state.previousPresent.current && isAnimating) {
					state.machine.dispatch("ANIMATION_OUT");
				} else {
					state.machine.dispatch("UNMOUNT");
				}
			}
		}
	);
}

function watchStatusChange(state: Presence) {
	watch(
		() => state.machine.state.current,
		() => {
			if (!state.opts.ref.current) return;
			const currAnimationName = getAnimationName(state.opts.ref.current);
			state.prevAnimationNameState =
				state.machine.state.current === "mounted" ? currAnimationName : "none";
		}
	);
}

function watchRefChange(state: Presence) {
	watch(
		() => state.opts.ref.current,
		() => {
			if (!state.opts.ref.current) return;
			state.styles = getComputedStyle(state.opts.ref.current);

			return executeCallbacks(
				on(state.opts.ref.current, "animationstart", state.handleAnimationStart),
				on(state.opts.ref.current, "animationcancel", state.handleAnimationEnd),
				on(state.opts.ref.current, "animationend", state.handleAnimationEnd)
			);
		}
	);
}

function getAnimationName(node?: HTMLElement) {
	return node ? getComputedStyle(node).animationName || "none" : "none";
}
