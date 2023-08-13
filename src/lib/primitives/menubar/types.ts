import type {
	Expand,
	HTMLDivAttributes,
	KeydownClickEvents,
	OmitChecked,
	OmitOpen,
	OmitValue,
	OnChangeFn
} from "$internal/index.js";
import type {
	CreateMenubarProps,
	CreateMenubarMenuProps,
	CreateMenuCheckboxItemProps,
	CreateMenuRadioGroupProps,
	MenubarRadioItemProps,
	CreateMenubarSubmenuProps,
	MenubarComponentEvents
} from "@melt-ui/svelte";
import type { HTMLButtonAttributes } from "svelte/elements";

type Props = Expand<CreateMenubarProps> & HTMLDivAttributes;

type MenuProps = Expand<
	OmitOpen<CreateMenubarMenuProps> & {
		open?: CreateMenubarMenuProps["defaultOpen"] & {};
		onOpenChange?: OnChangeFn<CreateMenubarMenuProps["defaultOpen"]>;
	}
>;

type CheckboxItemProps = Expand<
	OmitChecked<CreateMenuCheckboxItemProps> & {
		checked?: CreateMenuCheckboxItemProps["defaultChecked"] & {};
		onCheckedChange?: OnChangeFn<CreateMenuCheckboxItemProps["defaultChecked"]>;
		asChild?: boolean;
		disabled?: boolean;
	}
> &
	HTMLDivAttributes;

type RadioGroupProps = Expand<
	OmitValue<CreateMenuRadioGroupProps> & {
		value?: CreateMenuRadioGroupProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateMenuRadioGroupProps["defaultValue"]>;
	}
> &
	HTMLDivAttributes;

type ContentProps = {
	sideOffset?: number;
} & HTMLDivAttributes;

type GroupProps = HTMLDivAttributes;

type ItemProps = {
	asChild?: boolean;
	disabled?: boolean;
} & HTMLDivAttributes;

type CheckboxItemIndicatorProps = HTMLDivAttributes;

type LabelProps = HTMLDivAttributes;

type RadioItemProps = Expand<
	MenubarRadioItemProps & {
		asChild?: boolean;
	}
> &
	HTMLDivAttributes;

type SeparatorProps = HTMLDivAttributes;

type SubProps = Expand<CreateMenubarSubmenuProps>;

type SubContentProps = HTMLDivAttributes;

type SubTriggerProps = {
	disabled?: boolean;
} & HTMLDivAttributes;

type TriggerProps = {
	asChild?: boolean;
} & HTMLButtonAttributes;

type TriggerEvents = MenubarComponentEvents["trigger"] & KeydownClickEvents;
type ItemEvents = MenubarComponentEvents["item"] & KeydownClickEvents;
type SubTriggerEvents = MenubarComponentEvents["subTrigger"] & KeydownClickEvents;
type CheckboxItemEvents = MenubarComponentEvents["checkboxItem"] & KeydownClickEvents;
type RadioItemEvents = MenubarComponentEvents["radioItem"] & KeydownClickEvents;
type ContentEvents = MenubarComponentEvents["menu"] & KeydownClickEvents;
type SubContentEvents = MenubarComponentEvents["submenu"] & KeydownClickEvents;

export type {
	Props,
	SubProps,
	MenuProps,
	ItemProps,
	GroupProps,
	LabelProps,
	TriggerProps,
	ContentProps,
	RadioItemProps,
	SeparatorProps,
	RadioGroupProps,
	SubContentProps,
	SubTriggerProps,
	CheckboxItemProps,
	CheckboxItemIndicatorProps,

	//
	Props as MenubarProps,
	SubProps as MenubarSubProps,
	MenuProps as MenubarMenuProps,
	ItemProps as MenubarItemProps,
	GroupProps as MenubarGroupProps,
	LabelProps as MenubarLabelProps,
	ContentProps as MenubarContentProps,
	TriggerProps as MenubarTriggerProps,
	RadioItemProps as MenubarRadioItemProps,
	SeparatorProps as MenubarSeparatorProps,
	SubContentProps as MenubarSubContentProps,
	SubTriggerProps as MenubarSubTriggerProps,
	RadioGroupProps as MenubarRadioGroupProps,
	CheckboxItemProps as MenubarCheckboxItemProps,
	CheckboxItemIndicatorProps as MenubarCheckboxItemIndicatorProps,
	//
	TriggerEvents,
	ItemEvents,
	SubTriggerEvents,
	CheckboxItemEvents,
	RadioItemEvents,
	ContentEvents,
	SubContentEvents,
	//
	TriggerEvents as MenubarTriggerEvents,
	ItemEvents as MenubarItemEvents,
	SubTriggerEvents as MenubarSubTriggerEvents,
	CheckboxItemEvents as MenubarCheckboxItemEvents,
	RadioItemEvents as MenubarRadioItemEvents,
	ContentEvents as MenubarContentEvents,
	SubContentEvents as MenubarSubContentEvents
};
