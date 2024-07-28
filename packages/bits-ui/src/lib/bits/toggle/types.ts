import type { HTMLButtonAttributes } from "svelte/elements";
import type { CreateToggleProps as MeltToggleProps } from "@melt-ui/svelte";
import type { CustomEventHandler } from "$lib/index.js";
import type { DOMElement, Expand, OmitPressed, OnChangeFn } from "$lib/internal/index.js";

export type TogglePropsWithoutHTML = Expand<
	OmitPressed<MeltToggleProps> & {
		/**
		 * The pressed state of the toggle.
		 * You can bind this to a boolean value to programmatically control the pressed state.
		 *
		 * @defaultValue false
		 */
		pressed?: boolean | undefined;

		/**
		 * A callback function called when the pressed state changes.
		 */
		onPressedChange?: OnChangeFn<boolean> | undefined;
	} & DOMElement<HTMLButtonElement>
>;

//

export type ToggleProps = TogglePropsWithoutHTML & HTMLButtonAttributes;

export type ToggleEvents<T extends Element = HTMLButtonElement> = {
	click: CustomEventHandler<MouseEvent, T>;
	keydown: CustomEventHandler<KeyboardEvent, T>;
};
