/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreatePinInputProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, OmitIds, OmitValue, OnChangeFn } from "$lib/internal/index.js";

type Props = Expand<
	OmitIds<
		OmitValue<CreatePinInputProps> & {
			/**
			 * The value pin-input, which is an array of strings.
			 *
			 * You can bind to this to programmatically control the value.
			 */
			value?: CreatePinInputProps["defaultValue"];

			/**
			 * A callback function called when the value changes.
			 */
			onValueChange?: OnChangeFn<CreatePinInputProps["defaultValue"]>;
		} & DOMElement
	>
>;

type InputProps = DOMElement<HTMLInputElement>;

type HiddenInputProps = DOMElement<HTMLInputElement>;

export type { Props, InputProps, HiddenInputProps };
