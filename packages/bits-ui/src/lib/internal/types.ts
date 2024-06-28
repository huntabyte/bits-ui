import type { Action } from "svelte/action";
import type { HTMLAttributes } from "svelte/elements";
import type { TransitionConfig } from "svelte/transition";

export type ObjectVariation<T> = T extends object ? T : never;
// eslint-disable-next-line ts/no-explicit-any
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
export type OmitIds<T> = Omit<T, "ids">;
export type OmitDates<T> = Omit<
	T,
	| "value"
	| "defaultValue"
	| "placeholder"
	| "defaultPlaceholder"
	| "onPlaceholderChange"
	| "onValueChange"
	| "ids"
>;

export type OmitFloating<T> = OmitOpen<
	Omit<T, "forceVisible" | "ids" | "arrowSize" | "positioning">
>;

export type OnChangeFn<T> = (value: T) => void;

export type Expand<T> = T extends object
	? T extends infer O
		? { [K in keyof O]: O[K] }
		: never
	: T;

export type Prettify<T> = {
	[K in keyof T]: T[K];
} & {};

export type Builder = {
	[x: PropertyKey]: unknown;
	// eslint-disable-next-line ts/no-explicit-any
	action: Action<HTMLElement, any, any>;
};

export type DOMEl<T extends Element = HTMLDivElement> = Expand<{
	/**
	 * Whether to expose the underlying DOM element.
	 */
	el?: T;
}>;

export type DOMElement<T extends Element = HTMLDivElement> = Expand<{
	/**
	 * Whether to delegate rendering the element to your own
	 * custom element.
	 *
	 * @see https://www.bits-ui.com/docs/delegation
	 */
	asChild?: boolean;

	/**
	 * Bind to the underlying DOM element of the component.
	 */
	el?: T;
}>;

export type TransitionProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = Expand<{
	/**
	 * A transition function to use during both the in and out transitions.
	 */
	transition?: T;

	/**
	 * The configuration to pass to the `transition` function.
	 */
	transitionConfig?: TransitionParams<T>;

	/**
	 * A transition function to use during the in transition.
	 *
	 * If provided, this will override the `transition` function.
	 */
	inTransition?: In;

	/**
	 * The configuration to pass to the `inTransition` function.
	 */
	inTransitionConfig?: TransitionParams<In>;

	/**
	 * A transition function to use during the out transition.
	 *
	 * If provided, this will override the `transition` function.
	 */
	outTransition?: Out;

	/**
	 * The configuration to pass to the `outTransition` function.
	 */
	outTransitionConfig?: TransitionParams<Out>;
}>;
