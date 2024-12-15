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
		 * The value of the checkbox used in form submission and to identify
		 * the checkbox when in a `Checkbox.Group`. If not provided while in a
		 * `Checkbox.Group`, the checkbox will use a random identifier.
		 *
		 * @defaultValue undefined
		 */
		value?: string;

		/**
		 * The checked state of the checkbox. It can be one of:
		 * - `true` for checked
		 * - `false` for unchecked
		 *
		 * @defaultValue false
		 */
		checked?: boolean;

		/**
		 * A callback function called when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean>;

		/**
		 * Whether or not the checkbox is controlled or not. If `true`, the checkbox will not update
		 * the checked state internally, instead it will call `onCheckedChange` when it would have
		 * otherwise, and it is up to you to update the `checked` prop that is passed to the
		 * component.
		 *
		 * @defaultValue false
		 */
		controlledChecked?: boolean;

		/**
		 * Whether the checkbox is in an indeterminate state or not.
		 *
		 * @defaultValue false
		 */
		indeterminate?: boolean;

		/**
		 * A callback function called when the indeterminate state changes.
		 */
		onIndeterminateChange?: OnChangeFn<boolean>;

		/**
		 * Whether the indeterminate state is controlled or not. If `true`, the checkbox will
		 * not update the indeterminate state internally, instead it will call
		 * `onIndeterminateChange` when it would have otherwise, and it is up to you to update
		 * the `indeterminate` prop that is passed to the component.
		 *
		 * @defaultValue false
		 */
		controlledIndeterminate?: boolean;
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
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;

	/**
	 * Whether the checkbox group is required (for form validation).
	 * This will mark all checkboxes in the group as required.
	 *
	 * @defaultValue false
	 */
	required?: boolean;

	/**
	 * The name of the checkbox used in form submission.
	 * If not provided, the hidden input will not be rendered.
	 * This will be used as the name for all checkboxes in the group.
	 *
	 * @defaultValue undefined
	 */
	// eslint-disable-next-line ts/no-explicit-any
	name?: any;

	/**
	 * The value of the checkbox group, indicating which
	 * of the checkboxes in the group are checked.
	 *
	 * @bindable
	 * @defaultValue []
	 */
	value?: string[];

	/**
	 * A callback function called when the value changes.
	 */
	onValueChange?: OnChangeFn<string[]>;

	/**
	 * Whether or not the checkbox group value is controlled or not. If `true`, the
	 * checkbox group will not update the value internally, instead it will call
	 * `onValueChange` when it would have otherwise, and it is up to you to update
	 * the `value` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledValue?: boolean;
}>;

export type CheckboxGroupProps = CheckboxGroupPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, CheckboxGroupPropsWithoutHTML>;

export type CheckboxGroupLabelPropsWithoutHTML = WithChild;

export type CheckboxGroupLabelProps = CheckboxGroupLabelPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, CheckboxGroupLabelPropsWithoutHTML>;
