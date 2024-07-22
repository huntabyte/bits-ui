import type { OnChangeFn, WithChild, Without } from "$lib/internal/index.js";
import type { PrimitiveButtonAttributes } from "$lib/shared/attributes.js";

export type CheckboxRootSnippetProps = { checked: boolean | "indeterminate" };

export type CheckboxRootPropsWithoutHTML = WithChild<
	{
		/**
		 * Whether the checkbox is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;

		/**
		 * Whether the checkbox is required (for form validation).
		 *
		 * @defaultValue false
		 */
		required?: boolean;

		/**
		 * The name of the checkbox used in form submission.
		 * If not provided, the hidden input will not be rendered.
		 *
		 * @defaultValue undefined
		 */
		name?: string;

		/**
		 * The value of the checkbox used in form submission.
		 *
		 * @defaultValue undefined
		 */
		value?: string;

		/**
		 * The checked state of the checkbox. It can be one of:
		 * - `true` for checked
		 * - `false` for unchecked
		 * - `"indeterminate"` for indeterminate
		 *
		 * @defaultValue false
		 */
		checked?: boolean | "indeterminate";

		/**
		 * A callback function called when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean | "indeterminate">;
	},
	CheckboxRootSnippetProps
>;

export type CheckboxRootProps = CheckboxRootPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, CheckboxRootPropsWithoutHTML>;
