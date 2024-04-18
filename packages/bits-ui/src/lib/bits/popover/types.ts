import type { Snippet } from "svelte";
import type {
	EventCallback,
	HTMLDivAttributes,
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type * as Floating from "$lib/bits/utilities/floating/index.js";

export type PopoverRootPropsWithoutHTML = {
	/**
	 * The open state of the popover.
	 */
	open: boolean;

	/**
	 * A callback that is called when the popover's open state changes.
	 */
	onChange?: OnChangeFn<boolean>;

	/**
	 * The children content of the popover.
	 */
	children?: Snippet;
};

export type PopoverRootProps = PopoverRootPropsWithoutHTML & PrimitiveDivAttributes;

export type PopoverContentPropsWithoutHTML = WithAsChild<Floating.ContentProps>;

export type PopoverContentProps = PopoverContentPropsWithoutHTML & PrimitiveDivAttributes;

export type PopoverTriggerPropsWithoutHTML = WithAsChild<{
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
}>;

export type PopoverTriggerProps = PopoverTriggerPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "onclick" | "onkeydown">;

export type PopoverClosePropsWithoutHTML = WithAsChild<{
	onclick: EventCallback<MouseEvent>;
	onkeydown: EventCallback<KeyboardEvent>;
}>;

export type PopoverCloseProps = PopoverClosePropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "onclick" | "onkeydown">;

export type PopoverArrowPropsWithoutHTML = WithAsChild<object>;

export type PopoverArrowProps = PopoverArrowPropsWithoutHTML & HTMLDivAttributes;

export type PopoverTriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type PopoverCloseEvents = PopoverTriggerEvents;
