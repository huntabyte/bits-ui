import type { WithChild, Without } from "$lib/internal/types.js";
import type { BitsPrimitiveDivAttributes } from "$lib/shared/attributes.js";

export type ProgressRootPropsWithoutHTML = WithChild<{
	/**
	 * The current value of the progress bar.
	 * If `null`, the progress bar will be in an indeterminate state.
	 *
	 * @default 0
	 */
	value?: number | null;

	/**
	 * The maximum value of the progress bar.
	 *
	 * @default 100
	 */
	max?: number;

	/**
	 * The minimum value of the progress bar.
	 *
	 * @default 0
	 */
	min?: number;
}>;

export type ProgressRootProps = ProgressRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, ProgressRootPropsWithoutHTML>;
