import type { OnChangeFn, WithChildren } from "$lib/internal/types.js";
import type { Direction } from "$lib/shared/index.js";

export type SelectRootPropsWithoutHTML = WithChildren<{
	/**
	 * The open state of the select.
	 */
	open?: boolean;

	/**
	 * A callback that is called when the select's open state changes.
	 */
	onOpenChange?: OnChangeFn<boolean>;

	/**
	 * The value of the select.
	 */
	value?: string;

	/**
	 * A callback that is called when the select's value changes.
	 */
	onValueChange?: OnChangeFn<string>;

	/**
	 * The reading direction of the select.
	 */
	dir?: Direction;

	/**
	 * The name of the select used in form submission.
	 */
	name?: string;

	/**
	 * The native HTML select autocomplete attribute.
	 */
	autocomplete?: string;

	/**
	 * Whether the select is disabled.
	 */
	disabled?: boolean;

	/**
	 * Whether the select is required.
	 */
	required?: boolean;
}>;

export type SelectRootProps = SelectRootPropsWithoutHTML;
