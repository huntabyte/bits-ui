import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { PopperLayerProps, PopperLayerStaticProps } from "../utilities/popper-layer/types.js";
import type {
	OnChangeFn,
	WithChild,
	WithChildNoChildrenSnippetProps,
	WithChildren,
	Without,
} from "$lib/internal/types.js";
import type { PrimitiveButtonAttributes, PrimitiveDivAttributes } from "$lib/shared/attributes.js";

export type PopoverRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the popover.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the popover's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * Whether or not the open state is controlled or not. If `true`, the component will not update
	 * the open state internally, instead it will call `onOpenChange` when it would have
	 * otherwise, and it is up to you to update the `open` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledOpen?: boolean;
}>;

export type PopoverRootProps = PopoverRootPropsWithoutHTML;

export type PopoverContentSnippetProps = {
	/**
	 * Whether the content is open or closed. Used alongside the `forceMount` prop to
	 * conditionally render the content using Svelte transitions.
	 */
	open: boolean;
};

export type PopoverContentPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Omit<PopperLayerProps, "content" | "loop">,
	PopoverContentSnippetProps
>;

export type PopoverContentProps = PopoverContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, PopoverContentPropsWithoutHTML>;

export type PopoverContentStaticPropsWithoutHTML = WithChildNoChildrenSnippetProps<
	Omit<PopperLayerStaticProps, "content" | "loop">,
	PopoverContentSnippetProps
>;

export type PopoverContentStaticProps = PopoverContentStaticPropsWithoutHTML &
	Without<PrimitiveDivAttributes, PopoverContentStaticPropsWithoutHTML>;

export type PopoverTriggerPropsWithoutHTML = WithChild;

export type PopoverTriggerProps = PopoverTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, PopoverTriggerPropsWithoutHTML>;

export type PopoverClosePropsWithoutHTML = WithChild;

export type PopoverCloseProps = PopoverClosePropsWithoutHTML &
	Without<PrimitiveButtonAttributes, PopoverClosePropsWithoutHTML>;

export type PopoverArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type PopoverArrowProps = ArrowProps;
