import type { HTMLButtonAttributes, HTMLInputAttributes } from "svelte/elements";
import type { CreateSwitchProps as MeltSwitchProps } from "@melt-ui/svelte";
import type {
	DOMEl,
	DOMElement,
	EventCallback,
	Expand,
	HTMLSpanAttributes,
	OmitChecked,
	OnChangeFn,
	PrimitiveButtonAttributes,
	PrimitiveSpanAttributes,
	WithAsChild,
} from "$lib/internal/index.js";
import type { CustomEventHandler } from "$lib/index.js";

export type SwitchRootPropsWithoutHTML = WithAsChild<
	{
		/**
		 * Whether the switch is disabled.
		 *
		 * @defaultValue false
		 */
		disabled?: boolean;

		/**
		 * Whether the switch is required (for form validation).
		 *
		 * @defaultValue false
		 */
		required?: boolean;

		/**
		 * The name of the switch used in form submission.
		 * If not provided, the hidden input will not be rendered.
		 *
		 * @defaultValue undefined
		 */
		name?: string;

		/**
		 * The value of the switch used in form submission.
		 *
		 * @defaultValue undefined
		 */
		value?: string;

		/**
		 * The checked state of the switch.
		 *
		 * @defaultValue false
		 */
		checked?: boolean;

		/**
		 * A callback function called when the checked state changes.
		 */
		onCheckedChange?: OnChangeFn<boolean>;

		onclick?: EventCallback<MouseEvent>;

		onkeydown?: EventCallback<KeyboardEvent>;
	},
	{
		/**
		 * The checked state of the switch.
		 */
		checked: boolean;
	}
>;

export type SwitchRootProps = SwitchRootPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "value" | "disabled" | "onclick" | "onkeydown">;

export type SwitchThumbPropsWithoutHTML = WithAsChild<object, { checked: boolean }>;

export type SwitchThumbProps = SwitchThumbPropsWithoutHTML & PrimitiveSpanAttributes;
