/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { Expand, OmitChecked, OnChangeFn, DOMElement } from "$lib/internal/index.js";
import type { CreateCheckboxProps } from "@melt-ui/svelte";

type Props = Expand<
	OmitChecked<CreateCheckboxProps> & {
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

type IndicatorProps = DOMElement;

export type {
	Props,
	IndicatorProps,
	//
	Props as CheckboxProps,
	IndicatorProps as CheckboxIndicatorProps
};
