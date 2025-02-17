import type { WithChild, Without } from "$lib/internal/types.js";
import type { BitsPrimitiveDivAttributes } from "$lib/shared/attributes.js";

export type MeterRootPropsWithoutHTML = WithChild<{
	/**
	 * The current value of the meter.
	 *
	 * @default 0
	 */
	value?: number;

	/**
	 * The maximum value of the meter.
	 *
	 * @default 100
	 */
	max?: number;

	/**
	 * The minimum value of the meter.
	 *
	 * @default 0
	 */
	min?: number;
}>;

export type MeterRootProps = MeterRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, MeterRootPropsWithoutHTML>;
