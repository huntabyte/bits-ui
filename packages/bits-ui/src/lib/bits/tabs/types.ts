import type {
	EventCallback,
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveDivAttributes,
	WithAsChild,
} from "$lib/internal/index.js";
import type { Orientation } from "$lib/index.js";

export type TabsActivationMode = "manual" | "automatic";

export type TabsRootPropsWithoutHTML = WithAsChild<{
	/**
	 * The value of the selected tab.
	 */
	value?: string;

	/**
	 * A callback function called when the selected tab changes.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The orientation of the tabs.
	 *
	 * @defaultValue "horizontal"
	 */
	orientation?: Orientation;

	/**
	 * Whether to loop through the tabs when reaching the end
	 * when using the keyboard.
	 *
	 * @defaultValue false
	 */
	loop?: boolean;

	/**
	 * How the tabs should be activated. If set to `'automatic'`, the tabs
	 * will be activated when the trigger is focused. If set to `'manual'`,
	 * the tabs will be activated when the trigger is pressed.
	 *
	 * @defaultValue true
	 */
	activationMode?: TabsActivationMode;

	/**
	 * Whether the tabs are disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;
}>;

export type TabsRootProps = TabsRootPropsWithoutHTML & PrimitiveDivAttributes;

export type TabsListPropsWithoutHTML = WithAsChild<object>;

export type TabsListProps = TabsListPropsWithoutHTML & PrimitiveDivAttributes;

export type TabsTriggerPropsWithoutHTML = WithAsChild<{
	/**
	 * The value of the tab associated with this trigger.
	 */
	value: string;

	/**
	 * Whether the trigger is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	onclick?: EventCallback<MouseEvent>;
	onkeydown?: EventCallback<KeyboardEvent>;
	onfocus?: EventCallback<FocusEvent>;
}>;

export type TabsTriggerProps = TabsTriggerPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "disabled" | "value" | "onclick" | "onkeydown" | "onfocus">;

export type TabsContentPropsWithoutHTML = WithAsChild<{
	/**
	 * The value of the tab associated with this content.
	 */
	value: string;
}>;

export type TabsContentProps = TabsContentPropsWithoutHTML & PrimitiveDivAttributes;
