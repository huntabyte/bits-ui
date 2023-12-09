import type { HTMLDivAttributes, Transition, TransitionParams } from "$lib/internal/index.js";
import type { Snippet } from "svelte";
import type { AccordionMultiValue, AccordionValue } from "./state.svelte.js";
import type { HTMLButtonAttributes } from "svelte/elements";

type BaseAccordionProps = {
	asChild?: boolean;
	disabled?: boolean;
	forceVisible?: boolean;
	el?: HTMLElement | null;
	children?: Snippet;
};

type SingleAccordionProps = BaseAccordionProps & {
	value?: AccordionValue;
	type: "single";
};

type MultipleAccordionProps = BaseAccordionProps & {
	value?: AccordionMultiValue;
	type: "multiple";
};

export type AccordionRootProps = (SingleAccordionProps | MultipleAccordionProps) &
	HTMLDivAttributes;

export type AccordionRootWithoutHTML = Omit<AccordionRootProps, keyof HTMLDivAttributes>;

export type AccordionRootContext = {
	value: AccordionValue | AccordionMultiValue;
	disabled: boolean;
	forceVisible: boolean;
	el: HTMLElement | null;
};

export type AccordionTriggerProps = {
	asChild?: boolean;
	disabled?: boolean;
	onclick?: (e: MouseEvent) => void;
	onkeydown?: (e: KeyboardEvent) => void;
	el?: HTMLElement | null;
	children?: Snippet;
} & Omit<HTMLButtonAttributes, "disabled">;

export type AccordionTriggerWithoutHTML = Omit<
	AccordionTriggerProps,
	Exclude<keyof HTMLButtonAttributes, "disabled">
>;

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
