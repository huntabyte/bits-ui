import type { HTMLButtonAttributes } from "svelte/elements";
import type { Snippet } from "svelte";
import type {
	EventCallback,
	HTMLDivAttributes,
	OnChangeFn,
	PrimitiveButtonAttributes,
	WithAsChild,
} from "$lib/internal/index.js";

export type CheckboxRootPropsWithoutHTML = WithAsChild<
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

		indicator?: Snippet<[{ checked: boolean | "indeterminate" }]>;
	},
	{ checked: boolean | "indeterminate" }
>;

export type CheckboxRootProps = CheckboxRootPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "value" | "disabled" | "name" | "onclick" | "onkeydown"> & {
		onclick?: EventCallback<MouseEvent>;
		onkeydown?: EventCallback<KeyboardEvent>;
	};

export type CheckboxIndicatorPropsWithoutHTML = WithAsChild<{ checked: boolean | "indeterminate" }>;
