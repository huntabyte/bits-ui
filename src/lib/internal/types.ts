import type { Action } from "svelte/action";
import type { HTMLAttributes } from "svelte/elements";
import type { Writable } from "svelte/store";
import type { TransitionConfig } from "svelte/transition";
import type { CreateDispatcher } from ".";

export type ObjectVariation<T> = T extends object ? T : never;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Transition = (node: Element, params?: any) => TransitionConfig;
export type TransitionParams<T extends Transition> = Parameters<T>[1];

export type HTMLDivAttributes = HTMLAttributes<HTMLDivElement>;
export type HTMLSpanAttributes = HTMLAttributes<HTMLSpanElement>;
export type HTMLHeadingAttributes = HTMLAttributes<HTMLHeadingElement>;

export type OmitOpen<T> = Omit<T, "open" | "defaultOpen" | "onOpenChange">;
export type OmitValue<T> = Omit<T, "value" | "defaultValue" | "onValueChange">;
export type OmitChecked<T> = Omit<T, "checked" | "defaultChecked" | "onCheckedChange">;
export type OmitPressed<T> = Omit<T, "pressed" | "defaultPressed" | "onPressedChange">;
export type OmitForceVisible<T> = Omit<T, "forceVisible">;

export type OnChangeFn<T> = (value: T) => void;

export type Expand<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: O[K] }
		: never
	: T;

export type ExpandDeep<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: ExpandDeep<O[K]> }
		: never
	: T;

export type Prettify<T> = {
	[K in keyof T]: T[K];
	// eslint-disable-next-line @typescript-eslint/ban-types
} & {};

export type Builder = {
	[x: PropertyKey]: unknown;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	action: Action<HTMLElement, any, any>;
};

export type KeydownClickEvents = {
	click: MouseEvent;
	keydown: KeyboardEvent;
};

export type AsChild = Expand<{
	asChild?: boolean;
}>;

export type TransitionProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<{
	transition?: T;
	transitionConfig?: TransitionParams<T>;
	inTransition?: In;
	inTransitionConfig?: TransitionParams<In>;
	outTransition?: Out;
	outTransitionConfig?: TransitionParams<Out>;
}>;

export type TransitionTimes = {
	in?: number;
	out?: number;
};

export type TransitionTimesStore = Writable<Expand<TransitionTimes>>;

export type TransitionTimesProp = {
	transitionTimes: TransitionTimesStore;
};

export type TOpen = {
	tOpen: Writable<boolean>;
};

export type WithDispatcher<T> = T & CreateDispatcher;

export type Side = "left" | "right" | "top" | "bottom";
export type Align = "start" | "center" | "end";

export type SideAndAlign = {
	side?: Side;
	sideOffset?: number;
	align?: Align;
	alignOffset?: number;
};
