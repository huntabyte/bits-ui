import type {
	Expand,
	HTMLDivAttributes,
	OmitChecked,
	OmitOpen,
	OmitValue,
	OnChangeFn
} from "$internal/index.js";
import type {
	CreateDropdownMenuProps,
	CreateDropdownMenuCheckboxItemProps,
	CreateDropdownMenuRadioGroupProps,
	DropdownMenuRadioItemProps,
	CreateDropdownSubmenuProps
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

type ContentProps = {
	sideOffset?: number;
} & HTMLDivAttributes;
type GroupProps = HTMLDivAttributes;
type ItemProps = {
	asChild?: boolean;
} & HTMLDivAttributes;
type CheckboxItemIndicatorProps = HTMLDivAttributes;
type LabelProps = HTMLDivAttributes;
type SeparatorProps = HTMLDivAttributes;
type SubProps = Expand<CreateDropdownSubmenuProps>;
type SubContentProps = HTMLDivAttributes;
type SubTriggerProps = HTMLDivAttributes;
type TriggerProps = {
	asChild?: boolean;
} & HTMLButtonAttributes;

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
	TriggerProps as DropdownMenuTriggerProps
};
