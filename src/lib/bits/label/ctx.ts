import { createBitAttrs } from "$lib/internal";
import { createLabel } from "@melt-ui/svelte";

const NAME = "label";
const PARTS = ["root"];
const getAttrs = createBitAttrs(NAME, PARTS);

export const ctx = {
	get: () => createLabel(),
	getAttrs
};
