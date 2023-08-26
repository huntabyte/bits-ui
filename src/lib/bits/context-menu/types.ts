import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	OmitChecked,
	OmitOpen,
	OmitValue,
	OnChangeFn,
	Transition,
	TransitionProps
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib";
import type {
	CreateContextMenuProps,
	CreateContextMenuCheckboxItemProps,
	CreateContextMenuRadioGroupProps,
	ContextMenuRadioItemProps,
	CreateContextSubmenuProps
} from "@melt-ui/svelte";

type Props = Expand<
	OmitOpen<CreateContextMenuProps> & {
		open?: CreateContextMenuProps["defaultOpen"] & {};
		onOpenChange?: OnChangeFn<CreateContextMenuProps["defaultOpen"]>;
	}
>;

type CheckboxItemProps = Expand<
	OmitChecked<CreateContextMenuCheckboxItemProps> & {
		checked?: CreateContextMenuCheckboxItemProps["defaultChecked"] & {};
		onCheckedChange?: OnChangeFn<CreateContextMenuCheckboxItemProps["defaultChecked"]>;
	} & AsChild
> &
	HTMLDivAttributes;

type RadioGroupProps = Expand<
	OmitValue<CreateContextMenuRadioGroupProps> & {
		value?: CreateContextMenuRadioGroupProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateContextMenuRadioGroupProps["defaultValue"]>;
	} & AsChild
> &
	HTMLDivAttributes;

type RadioItemProps = Expand<ContextMenuRadioItemProps & AsChild> & HTMLDivAttributes;

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
	} & AsChild
> &
	HTMLDivAttributes;

type CheckboxItemIndicatorProps = HTMLDivAttributes;
type LabelProps = AsChild & HTMLDivAttributes;
type SeparatorProps = AsChild & HTMLDivAttributes;
type SubProps = Expand<CreateContextSubmenuProps>;

type SubContentProps<
	T extends Transition = Transition,
	In extends Transition = Transition,
	Out extends Transition = Transition
> = Expand<TransitionProps<T, In, Out> & AsChild> & HTMLDivAttributes;

type SubTriggerProps = Expand<
	{
		disabled?: boolean;
	} & AsChild
> &
	HTMLDivAttributes;

type TriggerProps = AsChild & HTMLDivAttributes;

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

type TriggerEvents<T extends Element = HTMLDivElement> = {
	pointerdown: CustomEventHandler<PointerEvent, T>;
	contextmenu: CustomEventHandler<Event, T>;
};

type SubContentEvents<T extends Element = HTMLDivElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focusout: CustomEventHandler<FocusEvent, T>;
	pointermove: CustomEventHandler<PointerEvent, T>;
};

type ContentEvents<T extends Element = HTMLDivElement> = {
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type {
	Props,
	ArrowProps,
	CheckboxItemProps,
	ContentProps,
	GroupProps,
	ItemProps,
	CheckboxItemIndicatorProps,
	LabelProps,
	RadioGroupProps,
	RadioItemProps,
	SeparatorProps,
	SubProps,
	SubContentProps,
	SubTriggerProps,
	TriggerProps,
	//
	Props as ContextMenuProps,
	ArrowProps as ContextMenuArrowProps,
	CheckboxItemProps as ContextMenuCheckboxItemProps,
	ContentProps as ContextMenuContentProps,
	GroupProps as ContextMenuGroupProps,
	ItemProps as ContextMenuItemProps,
	CheckboxItemIndicatorProps as ContextMenuCheckboxItemIndicatorProps,
	LabelProps as ContextMenuLabelProps,
	RadioGroupProps as ContextMenuRadioGroupProps,
	RadioItemProps as ContextMenuRadioItemProps,
	SeparatorProps as ContextMenuSeparatorProps,
	SubProps as ContextMenuSubProps,
	SubContentProps as ContextMenuSubContentProps,
	SubTriggerProps as ContextMenuSubTriggerProps,
	TriggerProps as ContextMenuTriggerProps,
	//
	ContentEvents,
	CheckboxItemEvents,
	ItemEvents,
	RadioItemEvents,
	SubTriggerEvents,
	TriggerEvents,
	SubContentEvents,
	//
	ContentEvents as ContextMenuContentEvents,
	CheckboxItemEvents as ContextMenuCheckboxItemEvents,
	ItemEvents as ContextMenuItemEvents,
	RadioItemEvents as ContextMenuRadioItemEvents,
	SubTriggerEvents as ContextMenuSubTriggerEvents,
	TriggerEvents as ContextMenuTriggerEvents,
	SubContentEvents as ContextMenuSubContentEvents
};
