import { createApiSchema, portalProps } from "./helpers.js";
import type { PortalProps } from "bits-ui";

export const portal = createApiSchema<PortalProps>({
	title: "Portal",
	type: "utility",
	description: "Renders the children to a different location in the DOM.",
	props: portalProps,
});
