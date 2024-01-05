import { createBitAttrs } from "$lib/internal";

export function getLabelData() {
	const NAME = "label";
	const PARTS = ["root"];

	const getAttrs = createBitAttrs(NAME, PARTS);

	return {
		NAME,
		getAttrs
	};
}
