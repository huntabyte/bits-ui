import type {
	EventCallback,
	OnChangeFn,
	PrimitiveButtonAttributes,
	WithAsChild,
} from "$lib/internal/index.js";

export type ToggleRootPropsWithoutHTML = WithAsChild<
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

		onclick?: EventCallback<MouseEvent>;
		onkeydown?: EventCallback<KeyboardEvent>;
	},
	{
		/**
		 * The pressed state of the toggle.
		 */
		pressed: boolean;
	}
>;

export type ToggleRootProps = ToggleRootPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "onclick" | "onkeydown" | "disabled">;
