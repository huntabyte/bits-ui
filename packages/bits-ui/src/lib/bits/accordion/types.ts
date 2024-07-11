import type {
	EventCallback,
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithChild,
	Without,
} from "$lib/internal/index.js";
import type { Orientation } from "$lib/shared/index.js";

export type BaseAccordionRootPropsWithoutHTML = {
	/**
	 * Whether the accordion is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Whether to loop through the accordion items when navigating
	 * with the arrow keys.
	 *
	 * @defaultValue true
	 */
	loop?: boolean;

	/**
	 * The orienation of the accordion.
	 *
	 * @defaultValue "vertical"
	 */
	orientation?: Orientation;
};

export type AccordionRootSinglePropsWithoutHTML = BaseAccordionRootPropsWithoutHTML & {
	/**
	 * The type of accordion. If set to `'multiple'`, the accordion will
	 * allow multiple items to be open at the same time. If set to
	 * `'single'`, the accordion will only allow a single item to be open.
	 *
	 * @required
	 */
	type: "single";

	/**
	 * The value of the currently open accordion item.
	 *
	 * @bindable
	 */
	value?: string;

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string>;
};

export type AccordionRootMultiplePropsWithoutHTML = BaseAccordionRootPropsWithoutHTML & {
	/**
	 * The type of accordion. If set to `'multiple'`, the accordion will
	 * allow multiple items to be open at the same time. If set to
	 * `'single'`, the accordion will only allow a single item to be open.
	 *
	 * @required
	 */
	type: "multiple";

	/**
	 * The value of the currently open accordion item.
	 *
	 * @bindable
	 */
	value?: string[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string[]>;
};

export type AccordionRootPropsWithoutHTML =
	| WithChild<AccordionRootSinglePropsWithoutHTML>
	| WithChild<AccordionRootMultiplePropsWithoutHTML>;

export type AccordionRootProps = AccordionRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, AccordionRootPropsWithoutHTML>;

export type AccordionTriggerPropsWithoutHTML = WithChild<{
	/**
	 * Whether the trigger for the accordion item is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;
	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
}>;

export type AccordionTriggerProps = AccordionTriggerPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "disabled" | "onclick" | "onkeydown">;

export type AccordionItemContext = {
	value: string;
	disabled: boolean;
};

export type AccordionContentPropsWithoutHTML = WithChild<{
	/**
	 * Whether to forcefully mount the content, regardless of the open state.
	 * This is useful if you want to use Svelte transitions for the content.
	 */
	forceMount?: boolean;
}>;

export type AccordionContentProps = AccordionContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, AccordionContentPropsWithoutHTML>;

export type AccordionItemPropsWithoutHTML = WithChild<{
	value: string;
	disabled?: boolean;
}>;

export type AccordionItemProps = AccordionItemPropsWithoutHTML & PrimitiveDivAttributes;

export type AccordionHeaderPropsWithoutHTML = WithChild<{
	level?: 1 | 2 | 3 | 4 | 5 | 6;
}>;

export type AccordionHeaderProps = AccordionHeaderPropsWithoutHTML & PrimitiveDivAttributes;
