import type { CreateTabsProps, TabsTriggerProps } from "@melt-ui/svelte";
import type {
	Expand,
	HTMLDivAttributes,
	ObjectVariation,
	OmitValue,
	OnChangeFn
} from "$internal/index.js";

type Props = Expand<
	OmitValue<CreateTabsProps> & {
		orientation?: CreateTabsProps["orientation"] & {};
		value?: CreateTabsProps["defaultValue"] & {};
		onValueChange?: OnChangeFn<CreateTabsProps["defaultValue"]>;
	}
> &
	HTMLDivAttributes;

type ContentProps = {
	value: string;
} & HTMLDivAttributes;

type TriggerProps = Expand<
	ObjectVariation<TabsTriggerProps> & {
		asChild?: boolean;
	}
> &
	HTMLDivAttributes;

type ListProps = HTMLDivAttributes;

export type {
	Props,
	ContentProps,
	TriggerProps,
	ListProps,
	//
	Props as TabsProps,
	ContentProps as TabsContentProps,
	TriggerProps as TabsTriggerProps,
	ListProps as TabsListProps
};
