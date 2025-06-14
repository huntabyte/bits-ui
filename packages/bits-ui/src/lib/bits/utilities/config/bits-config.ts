import { Context } from "runed";
import { box, type ReadableBox, type ReadableBoxedValues } from "svelte-toolbelt";
import type { BitsConfigPropsWithoutChildren } from "$lib/bits/utilities/config/types.js";

type BitsConfigStateProps = ReadableBoxedValues<BitsConfigPropsWithoutChildren>;

export const BitsConfigContext = new Context<BitsConfigState>("BitsConfig");

/**
 * Gets the current Bits UI configuration state from the context.
 *
 * Returns a default configuration (where all values are `undefined`) if no configuration is found.
 */
export function getBitsConfig() {
	const fallback = new BitsConfigState(null, {});
	return BitsConfigContext.getOr(fallback).opts;
}

/**
 * Creates and sets a new Bits UI configuration state that inherits from parent configs.
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
 * Configuration state that inherits from parent configurations.
 *
 * @example
 * Config resolution:
 * ```
 * Level 1: { defaultPortalTo: "#some-element", theme: "dark" }
 * Level 2: { spacing: "large" } // inherits defaultPortalTo="#some-element", theme="dark"
 * Level 3: { theme: "light" }   // inherits defaultPortalTo="#some-element", spacing="large", overrides theme="light"
 * ```
 */
export class BitsConfigState {
	readonly opts: Required<BitsConfigStateProps>;

	constructor(parent: BitsConfigState | null, opts: BitsConfigStateProps) {
		const resolveConfigOption = createConfigResolver(parent, opts);
		this.opts = {
			defaultPortalTo: resolveConfigOption((config) => config.defaultPortalTo),
			defaultLocale: resolveConfigOption((config) => config.defaultLocale),
		};
	}
}

type ConfigOptionGetter<T> = (config: BitsConfigStateProps) => ReadableBox<T> | undefined;
type ConfigOptionResolver = <T>(getter: ConfigOptionGetter<T>) => ReadableBox<T | undefined>;

/**
 * Returns a config resolver that resolves a given config option's value.
 *
 * The resolver creates reactive boxes that resolve config option values using this priority:
 * 1. Current level's value (if defined)
 * 2. Parent level's value (if defined and current is undefined)
 * 3. `undefined` (if no value is found in either parent or child)
 *
 * @param parent - Parent configuration state (null if this is root level)
 * @param currentOpts - Current level's configuration options
 *
 * @example
 * ```typescript
 * // Given this hierarchy:
 * // Root: { defaultPortalTo: "#some-element" }
 * // Child: { someOtherProp: "value" } // no defaultPortalTo specified
 *
 * const resolveConfigOption = createConfigResolver(parent, opts);
 * const portalTo = resolveConfigOption(config => config.defaultPortalTo);
 *
 * // portalTo.current === "#some-element" (inherited from parent)
 * // even when child didn't specify `defaultPortalTo`
 * ```
 */
function createConfigResolver(
	parent: BitsConfigState | null,
	currentOpts: BitsConfigStateProps
): ConfigOptionResolver {
	return <T>(getter: ConfigOptionGetter<T>) => {
		const configOption = box.with(() => {
			// try current opts first
			const value = getter(currentOpts)?.current;
			if (value !== undefined) return value;
			// if no parent, return undefined
			if (parent === null) return undefined;
			// get value from parent (which already has its own chain resolved)
			return getter(parent.opts)?.current;
		});
		return configOption;
	};
}
