import type {
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	Transition,
	TransitionParams,
} from "$lib/internal/index.js";
import type { Snippet } from "svelte";

interface BaseAccordionProps {
	asChild?: boolean;
	disabled?: boolean;
	forceVisible?: boolean;
	el?: HTMLElement | null;
	children?: Snippet;
}

interface SingleAccordionProps extends BaseAccordionProps {
	type: "single";
	value?: string;
}

interface MultipleAccordionProps extends BaseAccordionProps {
	type: "multiple";
	value?: string[];
}

export type AccordionRootProps = (SingleAccordionProps | MultipleAccordionProps) &
	PrimitiveDivAttributes;

export interface AccordionRootWithoutHTML
	extends Omit<AccordionRootProps, keyof PrimitiveDivAttributes> {}

export interface AccordionTriggerProps extends Omit<PrimitiveButtonAttributes, "disabled"> {
	asChild?: boolean;
	disabled?: boolean;
	onclick?: (e: MouseEvent) => void;
	onkeydown?: (e: KeyboardEvent) => void;
	el?: HTMLElement | null;
	children?: Snippet;
}

export interface AccordionTriggerWithoutHTML
	extends Omit<AccordionTriggerProps, keyof Exclude<PrimitiveButtonAttributes, "disabled">> {}

export interface AccordionItemContext {
	value: string;
	disabled: boolean;
}

export interface AccordionItemProps extends PrimitiveDivAttributes {
	asChild?: boolean;
	value: string;
	disabled?: boolean;
	children?: Snippet;
}

export interface AccordionItemWithoutHTML
	extends Omit<AccordionItemProps, keyof PrimitiveDivAttributes> {}

export interface AccordionContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> extends PrimitiveDivAttributes {
	transition?: T;
	transitionConfig?: TransitionParams<T>;
	inTransition?: In;
	inTransitionConfig?: TransitionParams<In>;
	outTransition?: Out;
	outTransitionConfig?: TransitionParams<Out>;
	asChild?: boolean;
	children?: Snippet;
}

export interface AccordionHeaderProps extends PrimitiveDivAttributes {
	asChild?: boolean;
	level?: 1 | 2 | 3 | 4 | 5 | 6;
	children?: Snippet;
}
