/**
 * Hierarchical configuration system that provides inheritance and fallback behavior
 * for nested BitsConfig components.
 *
 * @example
 * ```svelte
 * <BitsConfig defaultPortalTo="#some-element">
 *   <BitsConfig someOtherProp="value">
 *     <SomeComponent /> <!-- inherits defaultPortalTo="#some-element" -->
 *   </BitsConfig>
 * </BitsConfig>
 */

import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { BitsConfigPropsWithoutChildren } from "$lib/bits/utilities/config/types.js";
import { Context } from "runed";
import { box, type ReadableBox } from "svelte-toolbelt";

type BitsConfigStateProps = ReadableBoxedValues<BitsConfigPropsWithoutChildren>;

export const BitsConfigContext = new Context<BitsConfigState>("BitsConfig");

/**
 * Gets the current Bits UI configuration from context.
 * Returns a default configuration (where all values are undefined) if no configuration is found.
 */
export function getBitsConfig() {
	return BitsConfigContext.getOr(new BitsConfigState(null, {}));
}

/**
 * Creates and sets a new bits configuration state with inheritance from parent configs.
 *
 * @param opts - Configuration options for this level
 * @returns The configuration state instance
 *
 * @example
 * ```typescript
 * // In a component that wants to set a default portal target
 * const config = useBitsConfig({ defaultPortalTo: box("#some-element") });
 *
 * // Child components will inherit this config and can override specific values
 * const childConfig = useBitsConfig({ someOtherProp: box("value") });
 * // childConfig still has defaultPortalTo="#some-element" from parent
 * ```
 */
export function useBitsConfig(opts: BitsConfigStateProps) {
	return BitsConfigContext.set(new BitsConfigState(BitsConfigContext.getOr(null), opts));
}

/**
 * Configuration state that handles inheritance from parent configurations.
 * Each property uses a fallback factory to resolve values from the inheritance chain.
 *
 * @example
 * Inheritance chain resolution:
 * ```
 * Level 1: { defaultPortalTo: "#some-element", theme: "dark" }
 * Level 2: { spacing: "large" }              // inherits defaultPortalTo="#some-element", theme="dark"
 * Level 3: { theme: "light" }                // inherits defaultPortalTo="#some-element", spacing="large", overrides theme="light"
 * ```
 */
class BitsConfigState {
	readonly opts: BitsConfigStateProps;

	constructor(parent: BitsConfigState | null, opts: BitsConfigStateProps) {
		const fallback = fallbackFactory(parent, opts);
		this.opts = {
			defaultPortalTo: fallback.of((config) => config.defaultPortalTo),
		};
	}
}

type FallbackFactory = {
	of<T>(
		getter: (config: BitsConfigStateProps) => ReadableBox<T> | undefined
	): ReadableBox<T | undefined>;
};

/**
 * Creates a fallback factory that handles configuration inheritance.
 * The factory creates reactive boxes that resolve values using this priority:
 * 1. Current level's value (if defined)
 * 2. Parent level's value (if defined and current is undefined)
 * 3. undefined (if no value found in chain)
 *
 * @param parent - Parent configuration state (null if this is root level)
 * @param opts - Current level's configuration options
 *
 * @example
 * ```typescript
 * // Given this hierarchy:
 * // Root: { defaultPortalTo: "#some-element" }
 * // Child: { someOtherProp: "value" } // no defaultPortalTo specified
 *
 * const fallback = fallbackFactory(parent, opts);
 * const portalTo = fallback.of(config => config.defaultPortalTo);
 *
 * // portalTo.current === "#some-element" (inherited from parent)
 * // even though child didn't specify defaultPortalTo
 * ```
 */
function fallbackFactory(
	parent: BitsConfigState | null,
	opts: BitsConfigStateProps
): FallbackFactory {
	return {
		of<T>(
			getter: (config: BitsConfigStateProps) => ReadableBox<T> | undefined
		): ReadableBox<T | undefined> {
			return box.with(() => {
				// try current opts first
				const value = getter(opts)?.current;
				if (value !== undefined) return value;

				// if no parent, return undefined
				if (parent === null) return undefined;

				// get value from parent (which already has its own fallback chain resolved)
				return getter(parent.opts)?.current;
			});
		},
	};
}
