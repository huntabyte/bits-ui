import type { CreateProgressProps as MeltProgressProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	OmitValue,
	OnChangeFn,
} from "$lib/internal/index.js";

export type ProgressPropsWithoutHTML = Expand<
	OmitValue<MeltProgressProps> & {
		/**
		 * The value of the progress bar.
		 * You can bind this to a number value to programmatically control the value.
		 */
		value?: MeltProgressProps["defaultValue"];

		/**
		 * A callback function called when the value changes.
		 */
		onValueChange?: OnChangeFn<number | null>;
	} & DOMElement
>;
//

export type ProgressProps = ProgressPropsWithoutHTML & HTMLDivAttributes;
