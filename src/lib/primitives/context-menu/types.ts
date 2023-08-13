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
		asChild?: boolean;
	}
> &
	HTMLDivAttributes;

type RadioGroupProps = Expand<
	OmitValue<CreateContextMenuRadioGroupProps> & {
		value?: CreateContextMenuRadioGroupProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateContextMenuRadioGroupProps["defaultValue"]>;
	}
> &
	HTMLDivAttributes;

type RadioItemProps = Expand<
	ContextMenuRadioItemProps & {
		asChild?: boolean;
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
type SeparatorProps = HTMLDivAttributes;
type SubProps = Expand<CreateContextSubmenuProps>;
type SubContentProps = HTMLDivAttributes;
type SubTriggerProps = {
	disabled?: boolean;
} & HTMLDivAttributes;
type TriggerProps = {
	asChild?: boolean;
} & HTMLDivAttributes;

type CheckboxItemEvents = ContextMenuComponentEvents["checkboxItem"] & KeydownClickEvents;
type ItemEvents = ContextMenuComponentEvents["item"] & KeydownClickEvents;
type RadioItemEvents = ContextMenuComponentEvents["radioItem"] & KeydownClickEvents;
type SubTriggerEvents = ContextMenuComponentEvents["subTrigger"] & KeydownClickEvents;
type TriggerEvents = ContextMenuComponentEvents["trigger"] & KeydownClickEvents;
type SubContentEvents = ContextMenuComponentEvents["submenu"] & KeydownClickEvents;
type ContentEvents = ContextMenuComponentEvents["menu"] & KeydownClickEvents;

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
	Props as ContextMenuProps,
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
