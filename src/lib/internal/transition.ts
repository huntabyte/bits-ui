import { isBrowser } from "./index.js";
import type { Transition, TransitionParams, TransitionTimesStore } from "./index.js";

type TransitionsObj<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
	inTransition?: In;
	inTransitionConfig?: TransitionParams<In>;
	outTransition?: Out;
	outTransitionConfig?: TransitionParams<Out>;
};

export function setTransitionTimes(
	transitionTimes: TransitionTimesStore,
	transitionsObj: TransitionsObj
) {
	if (!isBrowser) return;

	const {
		transition,
		transitionConfig,
		inTransition,
		inTransitionConfig,
		outTransition,
		outTransitionConfig
	} = transitionsObj;

	if (transition) {
		if (transitionConfig) {
			const { delay, duration } = transition(document.body, transitionConfig);
			const time = calcTime(delay, duration);
			transitionTimes.set({
				in: time,
				out: time
			});
			return;
		}
		const { delay, duration } = transition(document.body);
		const time = calcTime(delay, duration);
		transitionTimes.set({
			in: time,
			out: time
		});
		return;
	}
	let inTime = 0;
	let outTime = 0;

	if (inTransition) {
		if (inTransitionConfig) {
			const { delay, duration } = inTransition(document.body, inTransitionConfig);
			inTime = calcTime(delay, duration);
		} else {
			const { delay, duration } = inTransition(document.body);
			inTime = calcTime(delay, duration);
		}
	}

	if (outTransition) {
		if (outTransitionConfig) {
			const { delay, duration } = outTransition(document.body, outTransitionConfig);
			outTime = calcTime(delay, duration);
		} else {
			const { delay, duration } = outTransition(document.body);
			outTime = calcTime(delay, duration);
		}
	}

	transitionTimes.set({
		in: inTime,
		out: outTime
	});
}

function calcTime(delay: number | undefined, duration: number | undefined) {
	const numDelay = delay ?? 0;
	const numDuration = duration ?? 0;

	return numDelay + numDuration;
}
