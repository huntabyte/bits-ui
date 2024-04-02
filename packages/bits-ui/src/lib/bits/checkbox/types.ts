import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type { CreateCheckboxProps as MeltCheckboxProps } from "@melt-ui/svelte";
import type { CustomEventHandler } from "$lib/index.js";
import type {
	DOMEl,
	DOMElement,
	Expand,
	HTMLDivAttributes,
	OmitChecked,
	OnChangeFn,
} from "$lib/internal/index.js";

export type CheckboxPropsWithoutHTML = Expand<
	OmitChecked<MeltCheckboxProps> & {
		/**
		 * The state of the checkbox.
		 * You can bind this to a boolean value to programmatically control the checked state.
		 *
		 * @defaultValue false
		 */
		checked?: boolean | "indeterminate";

		/**
		 * A callback function called when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean | "indeterminate">;
	} & DOMElement<HTMLButtonElement>
>;

export type CheckboxIndicatorPropsWithoutHTML = DOMElement;

export type CheckboxProps = CheckboxPropsWithoutHTML & HTMLButtonAttributes;

export type CheckboxIndicatorProps = CheckboxIndicatorPropsWithoutHTML & HTMLDivAttributes;

export type CheckboxInputProps = Omit<HTMLInputAttributes, "value"> & DOMEl<HTMLInputElement>;

export type CheckboxEvents = {
	click: CustomEventHandler<MouseEvent, HTMLButtonElement>;
	keydown: CustomEventHandler<KeyboardEvent, HTMLButtonElement>;
};
