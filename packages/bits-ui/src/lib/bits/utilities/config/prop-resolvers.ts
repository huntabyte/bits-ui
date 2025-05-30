import { box, type Getter, type ReadableBox } from "svelte-toolbelt";
import { type BitsConfigState, getBitsConfig } from "./bits-config.js";

/**
 * Creates a generic prop resolver that follows a standard priority chain:
 * 1. The getter's prop value (if defined)
 * 2. The config default value (if no getter prop value is defined)
 * 3. The fallback value (if no config value found)
 */
function createPropResolver<T>(
	configOption: (config: BitsConfigState["opts"]) => { current: T | undefined },
	fallback: T
) {
	return (getProp: Getter<T | undefined>): ReadableBox<T> => {
		const config = getBitsConfig();
		return box.with(() => {
			// 1. return the prop's value, if provided
			const propValue = getProp();
			if (propValue !== undefined) return propValue;
			// 2. return the resolved config option value, if available
			const option = configOption(config).current;
			if (option !== undefined) return option;
			// 3. return the fallback if no other value is found
			return fallback;
		});
	};
}

/**
 * Resolves a locale value using the prop, the config default, or a fallback.
 *
 * Default value: `"en"`
 */
export const resolveLocaleProp = createPropResolver((config) => config.defaultLocale, "en");

/**
 * Resolves a portal's `to` value using the prop, the config default, or a fallback.
 *
 * Default value: `"body"`
 */
export const resolvePortalToProp = createPropResolver((config) => config.defaultPortalTo, "body");
