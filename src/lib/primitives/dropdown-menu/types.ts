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
	CreateDropdownMenuProps,
	CreateDropdownMenuCheckboxItemProps,
	CreateDropdownMenuRadioGroupProps,
	DropdownMenuRadioItemProps,
	CreateDropdownSubmenuProps,
	DropdownMenuComponentEvents
} from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<
	OmitOpen<CreateDropdownMenuProps> & {
		open?: CreateDropdownMenuProps["defaultOpen"] & {};
		onOpenChange?: OnChangeFn<CreateDropdownMenuProps["defaultOpen"]>;
	}
>;

type CheckboxItemProps = Expand<
	OmitChecked<CreateDropdownMenuCheckboxItemProps> & {
		checked?: CreateDropdownMenuCheckboxItemProps["defaultChecked"] & {};
		onCheckedChange?: OnChangeFn<CreateDropdownMenuCheckboxItemProps["defaultChecked"]>;
	}
> &
	AsChild &
	HTMLDivAttributes;

type RadioGroupProps = Expand<
	OmitValue<CreateDropdownMenuRadioGroupProps> & {
		value?: CreateDropdownMenuRadioGroupProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateDropdownMenuRadioGroupProps["defaultValue"]>;
	}
> &
	AsChild &
	HTMLDivAttributes;

type RadioItemProps = DropdownMenuRadioItemProps & AsChild & HTMLDivAttributes;

type ContentProps<T extends Transition = Transition> = {
	sideOffset?: number;
	transition?: T;
	transitionConfig?: TransitionParams<T>;
} & AsChild &
	HTMLDivAttributes;

type GroupProps = AsChild & HTMLDivAttributes;

type ItemProps = {
	disabled?: boolean;
} & AsChild &
	HTMLDivAttributes;

type CheckboxItemIndicatorProps = HTMLDivAttributes;
type LabelProps = AsChild & HTMLDivAttributes;
type SeparatorProps = AsChild & HTMLDivAttributes;
type SubProps = Expand<CreateDropdownSubmenuProps>;
type SubContentProps<T extends Transition = Transition> = {
	sideOffset?: number;
	transition?: T;
	transitionConfig?: TransitionParams<T>;
} & AsChild &
	HTMLDivAttributes;

type SubTriggerProps = {
	disabled?: boolean;
} & AsChild &
	HTMLDivAttributes;

type TriggerProps = AsChild & HTMLButtonAttributes;

type TriggerEvents = DropdownMenuComponentEvents["trigger"];
type CheckboxItemEvents = DropdownMenuComponentEvents["checkboxItem"];
type ContentEvents = DropdownMenuComponentEvents["menu"];
type RadioItemEvents = DropdownMenuComponentEvents["radioItem"];
type SubContentEvents = DropdownMenuComponentEvents["submenu"];
type SubTriggerEvents = DropdownMenuComponentEvents["subTrigger"];
type ItemEvents = DropdownMenuComponentEvents["item"];

export type {
	Props,
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
	Props as DropdownMenuProps,
	CheckboxItemProps as DropdownMenuCheckboxItemProps,
	ContentProps as DropdownMenuContentProps,
	GroupProps as DropdownMenuGroupProps,
	ItemProps as DropdownMenuItemProps,
	CheckboxItemIndicatorProps as DropdownMenuCheckboxItemIndicatorProps,
	LabelProps as DropdownMenuLabelProps,
	RadioGroupProps as DropdownMenuRadioGroupProps,
	RadioItemProps as DropdownMenuRadioItemProps,
	SeparatorProps as DropdownMenuSeparatorProps,
	SubProps as DropdownMenuSubProps,
	SubContentProps as DropdownMenuSubContentProps,
	SubTriggerProps as DropdownMenuSubTriggerProps,
	TriggerProps as DropdownMenuTriggerProps,
	//
	TriggerEvents,
	CheckboxItemEvents,
	ContentEvents,
	RadioItemEvents,
	SubContentEvents,
	SubTriggerEvents,
	ItemEvents,
	//,
	TriggerEvents as DropdownMenuTriggerEvents,
	CheckboxItemEvents as DropdownMenuCheckboxItemEvents,
	ContentEvents as DropdownMenuContentEvents,
	RadioItemEvents as DropdownMenuRadioItemEvents,
	SubContentEvents as DropdownMenuSubContentEvents,
	SubTriggerEvents as DropdownMenuSubTriggerEvents,
	ItemEvents as DropdownMenuItemEvents
};
