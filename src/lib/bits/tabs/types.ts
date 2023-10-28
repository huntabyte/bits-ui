import type { CreateTabsProps, TabsTriggerProps } from "@melt-ui/svelte";
import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	ObjectVariation,
	OmitValue,
	OnChangeFn
} from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitValue<CreateTabsProps> & {
		orientation?: CreateTabsProps["orientation"] & {};
		value?: CreateTabsProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateTabsProps["defaultValue"]>;
	} & AsChild
> &
	HTMLDivAttributes;

type ContentProps = Expand<
	{
		value: string;
	} & AsChild
> &
	HTMLDivAttributes;

type TriggerProps = Expand<ObjectVariation<TabsTriggerProps> & AsChild> & HTMLButtonAttributes;

type ListProps = AsChild & HTMLDivAttributes;

type TriggerEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
	focus: CustomEventHandler<FocusEvent, T>;
};

export type {
	Props,
	ContentProps,
	TriggerProps,
	ListProps,
	//
	Props as TabsProps,
	ContentProps as TabsContentProps,
	TriggerProps as TabsTriggerProps,
	ListProps as TabsListProps,
	//
	TriggerEvents,
	//
	TriggerEvents as TabsTriggerEvents
};
