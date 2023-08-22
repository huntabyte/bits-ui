import type { StoresValues } from "svelte/store";
import { nanoid } from "nanoid/non-secure";
import type { Writable } from "svelte/store";
import type { ActionReturn } from "svelte/action";
import type { Builder, Transition, TransitionParams, TransitionTimesStore } from "./types.js";
import { isBrowser } from "./is.js";

export function noop() {
	// do nothing
}

export function generateId() {
	return nanoid(10);
}

export function removeUndefined<T extends object>(obj: T): T {
	const result = {} as T;
	for (const key in obj) {
		const value = obj[key];
		if (value !== undefined) {
			result[key] = value;
		}
	}
	return result;
}

type Options = Record<string, Writable<unknown>>;

export function getOptionUpdater(options: Options) {
	return function <
		K extends keyof typeof options,
		V extends StoresValues<(typeof options)[keyof typeof options]>
	>(key: K, value: V | undefined) {
		if (value === undefined) return;
		const store = options[key];
		store.set(value as never);
	};
}

type BuilderActionsParams = {
	builders: Builder[];
};

type BuilderActionsReturn = {
	destroy: () => void;
};

export function builderActions(
	node: HTMLElement,
	params: BuilderActionsParams
): BuilderActionsReturn {
	const unsubs: ActionReturn[] = [];
	params.builders.forEach((builder) => {
		const act = builder.action(node);
		if (act) {
			unsubs.push(act);
		}
	});
	return {
		destroy: () => {
			unsubs.forEach((unsub) => {
				if (unsub.destroy) {
					unsub.destroy();
				}
			});
		}
	};
}

export function getAttrs(builders: Builder[]) {
	const attrs: Record<string, unknown | undefined> = {};
	builders.forEach((builder) => {
		Object.keys(builder).forEach((key) => {
			if (key !== "action") {
				attrs[key] = builder[key];
			}
		});
	});
	return attrs;
}

export function disabledAttrs(disabled: boolean) {
	return disabled ? { "aria-disabled": true, "data-disabled": "" } : {};
}

export function bitWrap<T extends object>(storeValues: T, bit: string): T {
	return {
		...storeValues,
		[`data-bits-${bit}`]: ""
	};
}

export function sleep(ms: number) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

export function styleToString(style: Record<string, number | string | undefined>): string {
	return Object.keys(style).reduce((str, key) => {
		if (style[key] === undefined) return str;
		return str + `${key}:${style[key]};`;
	}, "");
}

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
