/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { Builder } from "$lib/internal/index.js";

type Props = Expand<{
	/**
	 * Melt UI builders to apply to the button component.
	 */
	builders?: Builder[];
}>;

export type { Props };
