import type { CreateToggleGroupProps } from "@melt-ui/svelte";
import type {
	AsChild,
	Expand,
	HTMLDivAttributes,
	OmitValue,
	OnChangeFn
} from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";

type Props<T extends "single" | "multiple"> = Expand<
	OmitValue<CreateToggleGroupProps<T>> & {
		value?: CreateToggleGroupProps<T>["defaultValue"];
		onValueChange?: OnChangeFn<CreateToggleGroupProps<T>["defaultValue"]>;
		type?: T;
	}
> &
	AsChild &
	HTMLDivAttributes;

type ItemProps = {
	value: string;
	disabled?: boolean;
} & AsChild &
	HTMLButtonAttributes;

type ItemEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type {
	Props,
	ItemProps,
	//
	Props as ToggleGroupProps,
	ItemProps as ToggleGroupItemProps,
	//
	ItemEvents,
	//
	ItemEvents as ToggleGroupItemEvents
};
