import { srOnlyStylesString } from "svelte-toolbelt";

export const hiddenInputBaseProps = {
	"aria-hidden": "true",
	style: srOnlyStylesString,
	tabindex: -1,
};
