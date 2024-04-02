import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type { CreateSwitchProps as MeltSwitchProps } from "@melt-ui/svelte";
import type {
	DOMEl,
	DOMElement,
	Expand,
	HTMLSpanAttributes,
	OmitChecked,
	OnChangeFn,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

export type SwitchPropsWithoutHTML = Expand<
	OmitChecked<MeltSwitchProps> & {
		/**
		 * The checked state of the switch.
		 * You can bind this to a boolean value to programmatically control the checked state.
		 *
		 * @defaultValue false
		 */
		checked?: boolean;

		/**
		 * A callback function called when the checked state changes.
		 */
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
	} & DOMElement<HTMLButtonElement>
>;

export type SwitchThumbPropsWithoutHTML = DOMElement<HTMLSpanElement>;

//

export type SwitchProps = SwitchPropsWithoutHTML & HTMLButtonAttributes;

export type SwitchThumbProps = SwitchThumbPropsWithoutHTML & HTMLSpanAttributes;

export type SwitchInputProps = HTMLInputAttributes & DOMEl<HTMLInputElement>;

export type SwitchEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};
