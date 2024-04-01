/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateProgressProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, OmitValue, OnChangeFn } from "$lib/internal/index.js";

type Props = Expand<
	OmitValue<CreateProgressProps> & {
		/**
		 * The value of the progress bar.
		 * You can bind this to a number value to programmatically control the value.
		 */
		value?: CreateProgressProps["defaultValue"];

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<number | null>;
	} & DOMElement
>;

export type { Props };