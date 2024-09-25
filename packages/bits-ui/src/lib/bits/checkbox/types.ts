import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { PrimitiveButtonAttributes } from "$lib/shared/attributes.js";

export type CheckboxRootSnippetProps = { checked: boolean | "indeterminate" };

export type CheckboxRootPropsWithoutHTML = WithChild<
	{
		/**
		 * Whether the checkbox is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean | null | undefined;

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
		// eslint-disable-next-line ts/no-explicit-any
		name?: any;

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
		checked?: boolean | "indeterminate" | undefined;

		/**
		 * A callback function called when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean | "indeterminate">;

		/**
		 * Whether or not the checkbox is controlled or not. If `true`, the checkbox will not update
		 * the checked state internally, instead it will call `onCheckedChange` when it would have
		 * otherwise, and it is up to you to update the `checked` prop that is passed to the
		 * component.
		 *
		 * @defaultValue false
		 */
		controlledChecked?: boolean;
	},
	CheckboxRootSnippetProps
>;

export type CheckboxRootProps = CheckboxRootPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, CheckboxRootPropsWithoutHTML>;
