import type { Getter } from "svelte-toolbelt";
import { isBrowser } from "./is.js";

export function useFormControl(id: Getter<string>) {
	const isInForm = $derived.by(() => {
		if (!isBrowser) return false;
		const node = document.getElementById(id());
		if (!node) return false;
		return Boolean(node.closest("form"));
	});

	return {
		get value() {
			return isInForm;
		},
	};
}
