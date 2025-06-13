import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { Orientation } from "$lib/index.js";
import type {
	BitsPrimitiveButtonAttributes,
	BitsPrimitiveDivAttributes,
} from "$lib/shared/attributes.js";

export type RadioGroupRootPropsWithoutHTML = WithChild<{
	/**
	 * The orientation of the radio group. Used to determine
	 * how keyboard navigation should work.
	 *
	 * @default "vertical"
	 */
	orientation?: Orientation;

	/**
	 * Whether to loop around the radio items when navigating
	 * with the keyboard.
	 *
	 * @default true
	 */
	loop?: boolean;

	/**
	 * The value of the selected radio item.
	 *
	 * @default ""
	 */
	value?: string;

	/**
	 * The callback to call when the selected radio item changes.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The name to apply to the radio group's input element for
	 * form submission. If not provided, a hidden input will not
	 * be rendered and the radio group will not be part of a form.
	 *
	 * @default undefined
	 */
	name?: string;

	/**
	 * Whether the radio group is disabled.
	 *
	 * @default false
	 */
	disabled?: boolean;

	/**
	 * Whether the radio group is required for form submission.
	 * If `true`, ensure you provide a `name` prop so the hidden
	 * input is rendered.
	 */
	required?: boolean;

	/**
	 * Whether the radio group is readonly. When readonly, users can
	 * focus and navigate through items but cannot change the value.
	 *
	 * @default false
	 */
	readonly?: boolean;
}>;

export type RadioGroupRootProps = RadioGroupRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, RadioGroupRootPropsWithoutHTML>;

export type RadioGroupItemSnippetProps = { checked: boolean };

export type RadioGroupItemPropsWithoutHTML = WithChild<
	{
		/**
		 * The value of the radio item.
		 */
		value: string;

		/**
		 * Whether the radio item is disabled.
		 *
		 * @default false
		 */
		disabled?: boolean | null | undefined;
	},
	RadioGroupItemSnippetProps
>;

export type RadioGroupItemProps = RadioGroupItemPropsWithoutHTML &
	Without<BitsPrimitiveButtonAttributes, RadioGroupItemPropsWithoutHTML>;
