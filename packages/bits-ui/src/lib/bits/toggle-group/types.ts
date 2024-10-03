import type { HTMLButtonAttributes } from "svelte/elements";
import type { CreateToggleGroupProps as MeltToggleGroupProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	OmitValue,
	OnChangeFn,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

export type ToggleGroupPropsWithoutHTML<T extends "single" | "multiple"> = Expand<
	OmitValue<MeltToggleGroupProps<T>> & {
		/**
		 * The value of the toggle group, which is a string or an array of strings,
		 * depending on the type of the toggle group.
		 *
		 * You can bind to this to programmatically control the value.
		 */
		value?: MeltToggleGroupProps<T>["defaultValue"] | undefined;

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<MeltToggleGroupProps<T>["defaultValue"]> | undefined;

		/**
		 * The type of the toggle group.
		 *
		 * If the type is `"single"`, the toggle group allows only one item to be selected
		 * at a time. If the type is `"multiple"`, the toggle group allows multiple items
		 * to be selected at a time.
		 */
		type?: T | undefined;
	} & DOMElement
>;

export type ToggleGroupItemPropsWithoutHTML = Expand<
	{
		/**
		 * The value of the toggle group item. When the toggle group item is selected,
		 * the toggle group's value will be set to this value if in `"single"` mode,
		 * or this value will be pushed to the toggle group's array value if in `"multiple"` mode.
		 *
		 * @required
		 */
		value: string;

		/**
		 * Whether the toggle group item is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean | undefined;
	} & DOMElement<HTMLButtonElement>
>;

//

export type ToggleGroupProps<T extends "single" | "multiple"> = ToggleGroupPropsWithoutHTML<T> &
	HTMLDivAttributes;

export type ToggleGroupItemProps = ToggleGroupItemPropsWithoutHTML & HTMLButtonAttributes;

export type ToggleGroupItemEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};
