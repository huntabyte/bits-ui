import { enums } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root = {
	title: "Root",
	description: "The root component which contains the pin-input.",
	props: {},
	dataAttributes: [],
};

const input = {
	title: "Input",
	description: "The input component which contains the pin-input.",
	props: {},
	dataAttributes: [
		{
			name: "pin-input-input",
			description: "Present on the input element.",
		},
		{
			name: "complete",
			description: "Present if the pin-input is complete.",
		},
	],
};

export const pinInput = [root, input];
