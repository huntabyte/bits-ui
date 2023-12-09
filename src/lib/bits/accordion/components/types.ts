import type { HTMLDivAttributes, Transition, TransitionParams } from "$lib/internal/index.js";
import type { Snippet } from "svelte";
import type { AccordionValue } from "./state.svelte.js";
import type { HTMLButtonAttributes } from "svelte/elements.js";

export type AccordionRootProps = {
	asChild?: boolean;
	disabled?: boolean;
	forceVisible?: boolean;
	value?: AccordionValue;
	onValueChange?: (value: string) => void;
	el?: HTMLElement | null;
	children?: Snippet;
} & HTMLDivAttributes;

export type AccordionRootWithoutHTML = Omit<AccordionRootProps, keyof HTMLDivAttributes>;

export type AccordionRootContext = {
	value: AccordionValue;
	disabled: boolean;
	forceVisible: boolean;
	onValueChange?: (value: string) => void;
	el: HTMLElement | null;
};

export type AccordionTriggerProps = {
	asChild?: boolean;
	disabled?: boolean;
	onclick?: (e: MouseEvent) => void;
	onkeydown?: (e: KeyboardEvent) => void;
	el?: HTMLElement | null;
	children?: Snippet;
} & HTMLButtonAttributes;

export type AccordionTriggerWithoutHTML = Omit<AccordionTriggerProps, keyof HTMLButtonAttributes>;

export type AccordionItemContext = {
	value: string;
	disabled: boolean;
};

export type AccordionItemProps = {
	asChild?: boolean;
	value: string;
	disabled?: boolean;
	children?: Snippet;
} & HTMLDivAttributes;

export type AccordionItemWithoutHTML = Omit<AccordionItemProps, keyof HTMLDivAttributes>;

export type AccordionContentProps<
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
	asChild?: boolean;
	children?: Snippet;
} & HTMLDivAttributes;
