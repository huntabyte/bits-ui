import type { Snippet } from "svelte";
import type {
	EventCallback,
	OnChangeFn,
	PrimitiveButtonAttributes,
	WithAsChild,
} from "$lib/internal/index.js";

export type CheckboxRootPropsWithoutHTML = Omit<
	WithAsChild<
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
		},
		{ checked: boolean | "indeterminate" }
	>,
	"children"
> & {
	children?: Snippet<[{ checked: boolean | "indeterminate" }]>;
};

export type CheckboxRootProps = CheckboxRootPropsWithoutHTML &
	Omit<PrimitiveButtonAttributes, "value" | "disabled" | "name" | "onclick" | "onkeydown"> & {
		onclick?: EventCallback<MouseEvent>;
		onkeydown?: EventCallback<KeyboardEvent>;
	};

export type CheckboxIndicatorPropsWithoutHTML = WithAsChild<{ checked: boolean | "indeterminate" }>;
