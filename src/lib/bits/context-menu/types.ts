import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	OmitChecked,
	OmitOpen,
	OmitValue,
	OnChangeFn,
	Transition,
	TransitionParams
} from "$internal/index.js";
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

type ContentProps<T extends Transition = Transition> = Expand<
	{
		sideOffset?: number;
		transition?: T;
		transitionConfig?: TransitionParams<T>;
	} & AsChild
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

type SubContentProps<T extends Transition = Transition> = Expand<
	{
		transition?: T;
		transitionConfig?: TransitionParams<T>;
	} & AsChild
> &
	HTMLDivAttributes;

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

type CheckboxItemEvents = ContextMenuComponentEvents["checkboxItem"];
type ItemEvents = ContextMenuComponentEvents["item"];
type RadioItemEvents = ContextMenuComponentEvents["radioItem"];
type SubTriggerEvents = ContextMenuComponentEvents["subTrigger"];
type TriggerEvents = ContextMenuComponentEvents["trigger"];
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
