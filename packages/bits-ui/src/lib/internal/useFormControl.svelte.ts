import type { Box } from "./box.svelte.js";

export function useFormControl(node: Box<HTMLElement | null>) {
	const isInForm = $derived.by(() => {
		if (!node.value) return false;
		return Boolean(node.value.closest("form"));
	});

	return {
		get value() {
			return isInForm;
		},
	};
}
