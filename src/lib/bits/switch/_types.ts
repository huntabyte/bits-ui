/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateSwitchProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, OmitChecked, OnChangeFn } from "$lib/internal/index.js";
import type { HTMLInputAttributes } from "svelte/elements";

type Props = Expand<
	OmitChecked<CreateSwitchProps> & {
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

type ThumbProps = DOMElement<HTMLSpanElement>;

export type { Props, ThumbProps };
