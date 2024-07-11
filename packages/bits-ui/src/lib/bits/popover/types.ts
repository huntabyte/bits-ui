import type { Snippet } from "svelte";
import type { ArrowProps, ArrowPropsWithoutHTML } from "../utilities/arrow/types.js";
import type { PopperLayerProps } from "../utilities/popper-layer/types.js";
import type {
	EventCallback,
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
	WithChild,
	Without,
} from "$lib/internal/index.js";

export type PopoverRootPropsWithoutHTML = {
	/**
	 * The open state of the popover.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the popover's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * The children content of the popover.
	 */
	children?: Snippet;
};

export type PopoverRootProps = PopoverRootPropsWithoutHTML;

export type PopoverContentPropsWithoutHTML = WithChild<PopperLayerProps>;

export type PopoverContentProps = PopoverContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, PopoverContentPropsWithoutHTML>;

export type PopoverTriggerPropsWithoutHTML = WithChild;

export type PopoverTriggerProps = PopoverTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, PopoverTriggerPropsWithoutHTML>;

export type PopoverClosePropsWithoutHTML = WithChild;

export type PopoverCloseProps = PopoverClosePropsWithoutHTML &
	Without<PrimitiveButtonAttributes, PopoverClosePropsWithoutHTML>;

export type PopoverArrowPropsWithoutHTML = ArrowPropsWithoutHTML;

export type PopoverArrowProps = ArrowProps;
