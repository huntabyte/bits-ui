import type {
	OnChangeFn,
	PrimitiveButtonAttributes,
	WithChild,
	Without,
} from "$lib/internal/index.js";

export type ToggleRootSnippetProps = {
	pressed: boolean;
};

export type ToggleRootPropsWithoutHTML = WithChild<
	{
		/**
		 * Whether the toggle is pressed or not.
		 *
		 * @defaultValue false
		 */
		pressed?: boolean;

		/**
		 * A callback function called when the toggle is pressed.
		 */
		onPressedChange?: OnChangeFn<boolean>;

		/**
		 * Whether the toggle is disabled or not.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;
	},
	ToggleRootSnippetProps
>;

export type ToggleRootProps = ToggleRootPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, ToggleRootPropsWithoutHTML>;
