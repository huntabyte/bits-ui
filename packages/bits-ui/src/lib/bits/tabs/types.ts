import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type { Orientation } from "$lib/index.js";
import type { PrimitiveButtonAttributes, PrimitiveDivAttributes } from "$lib/shared/attributes.js";

export type TabsActivationMode = "manual" | "automatic";

export type TabsRootPropsWithoutHTML = WithChild<{
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
	 * @defaultValue "automatic"
	 */
	activationMode?: TabsActivationMode;

	/**
	 * Whether the tabs are disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean;

	/**
	 * Whether or not the value state is controlled or not. If `true`, the component will not update
	 * the value state internally, instead it will call `onValueChange` when it would have
	 * otherwise, and it is up to you to update the `value` prop that is passed to the component.
	 *
	 * @defaultValue false
	 */
	controlledValue?: boolean;
}>;

export type TabsRootProps = TabsRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, TabsRootPropsWithoutHTML>;

export type TabsListPropsWithoutHTML = WithChild;

export type TabsListProps = TabsListPropsWithoutHTML &
	Without<PrimitiveDivAttributes, TabsListPropsWithoutHTML>;

export type TabsTriggerPropsWithoutHTML = WithChild<{
	/**
	 * The value of the tab associated with this trigger.
	 */
	value: string;

	/**
	 * Whether the trigger is disabled or not.
	 *
	 * @defaultValue false
	 */
	disabled?: boolean | null | undefined;
}>;

export type TabsTriggerProps = TabsTriggerPropsWithoutHTML &
	Without<PrimitiveButtonAttributes, TabsTriggerPropsWithoutHTML>;

export type TabsContentPropsWithoutHTML = WithChild<{
	/**
	 * The value of the tab associated with this content.
	 */
	value: string;
}>;

export type TabsContentProps = TabsContentPropsWithoutHTML &
	Without<PrimitiveDivAttributes, TabsContentPropsWithoutHTML>;
