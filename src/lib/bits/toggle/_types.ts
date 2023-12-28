/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */
import type { CreateToggleProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, OmitPressed, OnChangeFn } from "$lib/internal/index.js";

type Props = Expand<
	OmitPressed<CreateToggleProps> & {
		/**
		 * The pressed state of the toggle.
		 * You can bind this to a boolean value to programmatically control the pressed state.
		 *
		 * @defaultValue false
		 */
		pressed?: boolean;

		/**
		 * A callback function called when the pressed state changes.
		 */
		onPressedChange?: OnChangeFn<boolean>;
	} & DOMElement<HTMLButtonElement>
>;

export type {
	Props,
	//
	Props as ToggleProps
};
