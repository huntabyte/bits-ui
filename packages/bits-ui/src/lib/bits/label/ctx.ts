import { createBitAttrs } from "$lib/internal/index.js";

export function getLabelData() {
	const NAME = "label";
	const PARTS = ["root"];

	const getAttrs = createBitAttrs(NAME, PARTS);

	return {
		NAME,
		getAttrs,
	};
}
