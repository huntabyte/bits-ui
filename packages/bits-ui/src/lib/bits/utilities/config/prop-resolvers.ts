import { box, type Getter, type ReadableBox } from "svelte-toolbelt";
import { BitsConfigState, getBitsConfig } from "./bits-config.svelte.js";

/**
 * Creates a generic prop resolver that follows the standard priority chain:
 * 1. The getter prop value (if defined)
 * 2. The config default value (if no getter prop value is defined)
 * 3. The fallback value (if no config value found)
 */
export function createPropResolver<T>(
	configSelector: (config: BitsConfigState["opts"]) => { current: T | undefined },
	fallback: T
) {
	return (getProp: Getter<T | undefined>): ReadableBox<T> => {
		const config = getBitsConfig();
		return box.with(() => {
			const propValue = getProp();
			if (propValue !== undefined) return propValue;
			return configSelector(config).current ?? fallback;
		});
	};
}

/**
 * Resolves a locale value using the prop, the config default, and a fallback.
 *
 * Default value: "en"
 */
export const resolveLocaleProp = createPropResolver((config) => config.defaultLocale, "en");

/**
 * Resolves a portal to value using the prop, the config default, and a fallback.
 *
 * Default value: "body"
 */
export const resolvePortalToProp = createPropResolver((config) => config.defaultPortalTo, "body");
