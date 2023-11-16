/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { Expand, OmitChecked, OnChangeFn, AsChild } from "$lib/internal/index.js";
import type { CreateCheckboxProps } from "@melt-ui/svelte";

type Props = Expand<
	OmitChecked<Omit<CreateCheckboxProps, "value" | "name" | "disabled" | "required">> & {
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

		/**
		 * Whether the checkbox is disabled or not.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;

		/**
		 * The value to be used in the checkbox input.
		 * If no value is provided, the input's value will be the string "on".
		 *
		 */
		value?: string;

		/**
		 * The name to be used in the checkbox input for form submission.
		 *
		 */
		name?: string;

		/**
		 * Whether the checkbox is required or not.
		 *
		 * @defaultValue false
		 */
		required?: boolean;
	} & AsChild
>;

type IndicatorProps = AsChild;

export type {
	Props,
	IndicatorProps,
	//
	Props as CheckboxProps,
	IndicatorProps as CheckboxIndicatorProps
};
