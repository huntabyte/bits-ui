import type { CreateTabsProps, TabsTriggerProps } from "@melt-ui/svelte";
import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	ObjectVariation,
	OmitValue,
	OnChangeFn
} from "$internal/index.js";
import type { ButtonEventHandler } from "$lib/index.js";

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

type TriggerProps = Expand<ObjectVariation<TabsTriggerProps> & AsChild> & HTMLDivAttributes;

type ListProps = AsChild & HTMLDivAttributes;

type TriggerEvents = {
	"m-click": ButtonEventHandler<MouseEvent>;
	"m-keydown": ButtonEventHandler<KeyboardEvent>;
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
