import type { CreateSwitchProps } from "@melt-ui/svelte";
import type {
	AsChild,
	Expand,
	HTMLSpanAttributes,
	OmitChecked,
	OnChangeFn
} from "$lib/internal/index.js";
import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type { CustomEventHandler } from "$lib/index.js";

type Props = Expand<
	OmitChecked<CreateSwitchProps> & {
		checked?: boolean;
		onCheckedChange?: OnChangeFn<boolean>;
		/**
		 * Whether to include the hidden input element in the DOM.
		 */
		includeInput?: boolean;

		/**
		 * Additional input attributes to pass to the hidden input element.
		 * Note, the value, name, type, and checked attributes are derived from the
		 * Switch props and cannot be overridden.
		 */
		inputAttrs?: Partial<Omit<HTMLInputAttributes, "value" | "name" | "type" | "checked">>;
	} & AsChild
> &
	HTMLButtonAttributes;

type ThumbProps = AsChild & HTMLSpanAttributes;

type InputProps = HTMLInputAttributes;

type Events<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};

export type {
	Props,
	ThumbProps,
	InputProps,
	//
	Props as SwitchProps,
	ThumbProps as SwitchThumbProps,
	InputProps as SwitchInputProps,
	//
	Events,
	//
	Events as SwitchEvents
};
