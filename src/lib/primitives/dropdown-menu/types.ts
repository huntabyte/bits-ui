import type {
	Expand,
	HTMLDivAttributes,
	KeydownClickEvents,
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
		asChild?: boolean;
	}
> &
	HTMLDivAttributes;

type RadioGroupProps = Expand<
	OmitValue<CreateDropdownMenuRadioGroupProps> & {
		value?: CreateDropdownMenuRadioGroupProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateDropdownMenuRadioGroupProps["defaultValue"]>;
	}
> &
	HTMLDivAttributes;

type RadioItemProps = Expand<
	DropdownMenuRadioItemProps & {
		asChild?: boolean;
	}
> &
	HTMLDivAttributes;

type ContentProps<T extends Transition = Transition> = {
	sideOffset?: number;
	transition?: T;
	transitionConfig?: TransitionParams<T>;
} & HTMLDivAttributes;

type GroupProps = HTMLDivAttributes;
type ItemProps = {
	asChild?: boolean;
} & HTMLDivAttributes;
type CheckboxItemIndicatorProps = HTMLDivAttributes;
type LabelProps = HTMLDivAttributes;
type SeparatorProps = HTMLDivAttributes;
type SubProps = Expand<CreateDropdownSubmenuProps>;
type SubContentProps<T extends Transition = Transition> = {
	sideOffset?: number;
	transition?: T;
	transitionConfig?: TransitionParams<T>;
} & HTMLDivAttributes;

type SubTriggerProps = HTMLDivAttributes;
type TriggerProps = {
	asChild?: boolean;
} & HTMLButtonAttributes;

type TriggerEvents = DropdownMenuComponentEvents["trigger"] & KeydownClickEvents;
type CheckboxItemEvents = DropdownMenuComponentEvents["checkboxItem"] & KeydownClickEvents;
type ContentEvents = DropdownMenuComponentEvents["menu"] & KeydownClickEvents;
type RadioItemEvents = DropdownMenuComponentEvents["radioItem"] & KeydownClickEvents;
type SubContentEvents = DropdownMenuComponentEvents["submenu"] & KeydownClickEvents;
type SubTriggerEvents = DropdownMenuComponentEvents["subTrigger"] & KeydownClickEvents;
type ItemEvents = DropdownMenuComponentEvents["item"] & KeydownClickEvents;

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
