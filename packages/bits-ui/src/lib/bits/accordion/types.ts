import type {
	EventCallback,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	Transition,
	TransitionParams,
	WithAsChild,
} from "$lib/internal/index.js";

interface BaseAccordionProps {
	disabled?: boolean;
	id?: string;
}

interface SingleAccordionProps extends BaseAccordionProps {
	type: "single";
	value?: string;
	onValueChange?: (value: string) => void;
}

interface MultipleAccordionProps extends BaseAccordionProps {
	type: "multiple";
	value?: string[];
	onValueChange?: (value: string[]) => void;
}

export type AccordionRootPropsWithoutHTML =
	| WithAsChild<SingleAccordionProps>
	| WithAsChild<MultipleAccordionProps>;

export type AccordionRootProps = AccordionRootPropsWithoutHTML & Omit<PrimitiveDivAttributes, "id">;

export type AccordionTriggerPropsWithoutHTML = WithAsChild<{
	id?: string;
	disabled?: boolean;
	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
}>;

export type AccordionTriggerProps = AccordionTriggerPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "disabled" | "id" | "onclick" | "onkeydown">;

export type AccordionItemContext = {
	value: string;
	disabled: boolean;
};

export type AccordionItemPropsWithoutHTML = WithAsChild<{
	value: string;
	disabled?: boolean;
}>;

export type AccordionItemProps = AccordionItemPropsWithoutHTML & PrimitiveDivAttributes;

export type AccordionContentPropsWithoutHTML<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = WithAsChild<{
	transition?: T;
	transitionConfig?: TransitionParams<T>;
	inTransition?: In;
	inTransitionConfig?: TransitionParams<In>;
	outTransition?: Out;
	outTransitionConfig?: TransitionParams<Out>;
}>;

export type AccordionContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition,
> = AccordionContentPropsWithoutHTML<T, In, Out> & PrimitiveDivAttributes;

export type AccordionHeaderPropsWithoutHTML = WithAsChild<{
	asChild?: boolean;
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}>;

export type AccordionHeaderProps = AccordionHeaderPropsWithoutHTML & PrimitiveDivAttributes;
