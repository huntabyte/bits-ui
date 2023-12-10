import type { HTMLDivAttributes, Transition, TransitionParams } from "$lib/internal/index.js";
import type { Snippet } from "svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type BaseAccordionProps = {
	asChild?: boolean;
	disabled?: boolean;
	forceVisible?: boolean;
	el?: HTMLElement | null;
	children?: Snippet;
};

type SingleAccordionProps = BaseAccordionProps & {
	type: "single";
	value?: string;
};

type MultipleAccordionProps = BaseAccordionProps & {
	type: "multiple";
	value?: string[];
};

export type AccordionRootProps = (SingleAccordionProps | MultipleAccordionProps) &
	HTMLDivAttributes;

export type AccordionRootWithoutHTML = Omit<AccordionRootProps, keyof HTMLDivAttributes>;

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

export type AccordionHeaderProps = {
	asChild?: boolean;
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	children?: Snippet;
};
