import type {
	TransitionProps,
	AsChild,
	Expand,
	HTMLDivAttributes,
	OmitChecked,
	OmitOpen,
	OmitValue,
	OnChangeFn,
	Transition
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";
import type {
	CreateDropdownMenuProps,
	CreateDropdownMenuCheckboxItemProps,
	CreateDropdownMenuRadioGroupProps,
	DropdownMenuRadioItemProps,
	CreateDropdownSubmenuProps
} from "@melt-ui/svelte";
import type { HTMLAnchorAttributes, HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreateDropdownMenuProps> & {
		open?: boolean;
		onOpenChange?: OnChangeFn<boolean>;
	}
>;

type CheckboxItemProps = Expand<
	OmitChecked<CreateDropdownMenuCheckboxItemProps> & {
		checked?: boolean | "indeterminate";
		onCheckedChange?: OnChangeFn<boolean | "indeterminate">;
	} & AsChild
> &
	HTMLDivAttributes;

type RadioGroupProps = Expand<
	OmitValue<CreateDropdownMenuRadioGroupProps> & {
		value?: CreateDropdownMenuRadioGroupProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateDropdownMenuRadioGroupProps["defaultValue"]>;
	} & AsChild
> &
	HTMLDivAttributes;

type RadioItemProps = Expand<DropdownMenuRadioItemProps & AsChild> & HTMLDivAttributes;

type ContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<
	{
		sideOffset?: number;
	} & TransitionProps<T, In, Out> &
		AsChild
> &
	HTMLDivAttributes;

type GroupProps = AsChild & HTMLDivAttributes;

type ItemProps = Expand<
	{
		disabled?: boolean;
		href?: HTMLAnchorAttributes["href"];
	} & AsChild
> &
	HTMLDivAttributes;

type CheckboxItemIndicatorProps = HTMLDivAttributes;
type LabelProps = AsChild & HTMLDivAttributes;
type SeparatorProps = AsChild & HTMLDivAttributes;
type SubProps = Expand<CreateDropdownSubmenuProps>;

type SubContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<
	{
		sideOffset?: number;
	} & TransitionProps<T, In, Out> &
		AsChild
> &
	HTMLDivAttributes;

type SubTriggerProps = Expand<
	{
		disabled?: boolean;
	} & AsChild
> &
	HTMLDivAttributes;

type TriggerProps = AsChild & HTMLButtonAttributes;

type ArrowProps = Expand<
	{
		size?: number;
	} & AsChild
> &
	HTMLDivAttributes;

type ItemEvents<T extends Element = HTMLDivElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focusin: CustomEventHandler<FocusEvent, T>;
	focusout: CustomEventHandler<FocusEvent, T>;
	pointerdown: CustomEventHandler<PointerEvent, T>;
	pointerleave: CustomEventHandler<PointerEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
};

type CheckboxItemEvents = ItemEvents;
type RadioItemEvents = ItemEvents;
type SubTriggerEvents = Omit<ItemEvents, "pointerdown">;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type ContentEvents<T extends Element = HTMLDivElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

type SubContentEvents<T extends Element = HTMLDivElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focusout: CustomEventHandler<FocusEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
};

export type {
	ArrowProps,
	CheckboxItemEvents,
	CheckboxItemIndicatorProps,
	CheckboxItemProps,
	ContentEvents,
	ContentProps,
	ArrowProps as DropdownMenuArrowProps,
	CheckboxItemEvents as DropdownMenuCheckboxItemEvents,
	CheckboxItemIndicatorProps as DropdownMenuCheckboxItemIndicatorProps,
	CheckboxItemProps as DropdownMenuCheckboxItemProps,
	ContentEvents as DropdownMenuContentEvents,
	ContentProps as DropdownMenuContentProps,
	GroupProps as DropdownMenuGroupProps,
	ItemEvents as DropdownMenuItemEvents,
	ItemProps as DropdownMenuItemProps,
	LabelProps as DropdownMenuLabelProps,
	//
	Props as DropdownMenuProps,
	RadioGroupProps as DropdownMenuRadioGroupProps,
	RadioItemEvents as DropdownMenuRadioItemEvents,
	RadioItemProps as DropdownMenuRadioItemProps,
	SeparatorProps as DropdownMenuSeparatorProps,
	SubContentEvents as DropdownMenuSubContentEvents,
	SubContentProps as DropdownMenuSubContentProps,
	SubProps as DropdownMenuSubProps,
	SubTriggerEvents as DropdownMenuSubTriggerEvents,
	SubTriggerProps as DropdownMenuSubTriggerProps,
	//,
	TriggerEvents as DropdownMenuTriggerEvents,
	TriggerProps as DropdownMenuTriggerProps,
	GroupProps,
	ItemEvents,
	ItemProps,
	LabelProps,
	Props,
	RadioGroupProps,
	RadioItemEvents,
	RadioItemProps,
	SeparatorProps,
	SubContentEvents,
	SubContentProps,
	SubProps,
	SubTriggerEvents,
	SubTriggerProps,
	//
	TriggerEvents,
	TriggerProps
};
