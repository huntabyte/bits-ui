import type { Direction } from "#lib/shared/index.js";
import type { WithChildren } from "#lib/internal/types.js";
import type { PortalTarget } from "#lib/bits/utilities/portal/types.js";

export type BitsConfigPropsWithoutChildren = {
	/**
	 * The default reading direction for components that support the `dir` prop.
	 */
	dir?: Direction;

	/**
	 * The default portal `to`/target to use for the `Portal` components throughout the app.
	 */
	defaultPortalTo?: PortalTarget;

	/**
	 * The default locale to use for the components that support localization.
	 */
	defaultLocale?: string;
};
export type BitsConfigProps = WithChildren<BitsConfigPropsWithoutChildren>;
