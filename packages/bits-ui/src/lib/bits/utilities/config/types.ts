import type { WithChildren } from "$lib/internal/types.js";
import type { PortalTarget } from "$lib/bits/utilities/portal/types.js";

export type BitsConfigPropsWithoutChildren = {
	defaultPortalTo?: PortalTarget;
};
export type BitsConfigProps = WithChildren<BitsConfigPropsWithoutChildren>;
