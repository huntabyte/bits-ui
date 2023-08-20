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
} from "$internal/index.js";
import type { DivEventHandler } from "$lib";
import type {
	CreateContextMenuProps,
	CreateContextMenuCheckboxItemProps,
	CreateContextMenuRadioGroupProps,
	ContextMenuRadioItemProps,
	CreateContextSubmenuProps,
	ContextMenuComponentEvents
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

type CheckboxItemEvents = {
	"m-click": DivEventHandler<MouseEvent>;
	"m-keydown": DivEventHandler<KeyboardEvent>;
};

type ItemEvents = {
	"m-click": DivEventHandler<MouseEvent>;
	"m-keydown": DivEventHandler<KeyboardEvent>;
};

type RadioItemEvents = {
	"m-click": DivEventHandler<MouseEvent>;
	"m-keydown": DivEventHandler<KeyboardEvent>;
};

type SubTriggerEvents = {
	"m-click": DivEventHandler<MouseEvent>;
	"m-keydown": DivEventHandler<KeyboardEvent>;
};

type TriggerEvents = {
	"m-pointerdown": DivEventHandler<MouseEvent>;
	"m-contextmenu": DivEventHandler<MouseEvent>;
};

type SubContentEvents = ContextMenuComponentEvents["submenu"];
type ContentEvents = ContextMenuComponentEvents["menu"];

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
