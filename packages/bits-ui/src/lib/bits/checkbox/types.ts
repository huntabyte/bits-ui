import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
	BitsPrimitiveSpanAttributes,
} from "$lib/shared/attributes.js";

export type CheckboxRootSnippetProps = { checked: boolean; indeterminate: boolean };

export type CheckboxRootPropsWithoutHTML = WithChild<
	{
		/**
		 * Whether the checkbox is disabled.
		 *
		 * @default false
		 */
		disabled?: boolean | null | undefined;

		/**
		 * Whether the checkbox is required (for form validation).
		 *
		 * @default false
		 */
		required?: boolean;

		/**
		 * Whether the checkbox is read only.
		 *
		 * If readonly, the checkbox will be focusable by the user,
		 * but will not be able to be checked/unchecked.
		 *
		 * @default false
		 */
		readonly?: boolean | null | undefined;

		/**
		 * The name of the checkbox used in form submission.
		 * If not provided, the hidden input will not be rendered.
		 *
		 * @default undefined
		 */
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		name?: any;

		/**
		 * The value of the checkbox used in form submission and to identify
		 * the checkbox when in a `Checkbox.Group`. If not provided while in a
		 * `Checkbox.Group`, the checkbox will use a random identifier.
		 *
		 * @default undefined
		 */
		value?: string;

		/**
		 * The checked state of the checkbox. It can be one of:
		 * - `true` for checked
		 * - `false` for unchecked
		 *
		 * @default false
		 */
		checked?: boolean;

		/**
		 * A callback function called when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean>;

		/**
		 * Whether the checkbox is in an indeterminate state or not.
		 *
		 * @default false
		 */
		indeterminate?: boolean;

		/**
		 * A callback function called when the indeterminate state changes.
		 */
		onIndeterminateChange?: OnChangeFn<boolean>;
	},
	CheckboxRootSnippetProps
>;

export type CheckboxRootProps = CheckboxRootPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, CheckboxRootPropsWithoutHTML>;

export type CheckboxGroupPropsWithoutHTML = WithChild<{
	/**
	 * Whether the checkbox group is disabled.
	 * This will disable all checkboxes in the group.
	 *
	 * @default false
	 */
	disabled?: boolean | null | undefined;

	/**
	 * Whether the checkbox group is read only.
	 *
	 * If readonly, the group will be focusable by the user,
	 * but the checkboxes not be able to be checked/unchecked.
	 *
	 * @default false
	 */
	readonly?: boolean | null | undefined;

	/**
	 * Whether the checkbox group is required (for form validation).
	 * This will mark all checkboxes in the group as required.
	 *
	 * @default false
	 */
	required?: boolean;

	/**
	 * The name of the checkbox used in form submission.
	 * If not provided, the hidden input will not be rendered.
	 * This will be used as the name for all checkboxes in the group.
	 *
	 * @default undefined
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	name?: any;

	/**
	 * The value of the checkbox group, indicating which
	 * of the checkboxes in the group are checked.
	 *
	 * @bindable
	 * @default []
	 */
	value?: string[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string[]>;
}>;

export type CheckboxGroupProps = CheckboxGroupPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CheckboxGroupPropsWithoutHTML>;

export type CheckboxGroupLabelPropsWithoutHTML = WithChild;

export type CheckboxGroupLabelProps = CheckboxGroupLabelPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, CheckboxGroupLabelPropsWithoutHTML>;
