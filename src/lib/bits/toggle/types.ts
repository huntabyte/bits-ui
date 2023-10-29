import type { CreateToggleProps } from "@melt-ui/svelte";
import type { AsChild, Expand, OmitPressed, OnChangeFn } from "$lib/internal/index.js";
import type { HTMLButtonAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitPressed<CreateToggleProps> & {
		pressed?: boolean;
		onPressedChange?: OnChangeFn<boolean>;
	} & AsChild
> &
	HTMLButtonAttributes;

type Events<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type {
	Props,
	//
	Props as ToggleProps,
	//
	Events,
	//
	Events as ToggleEvents
};
