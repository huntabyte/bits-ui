import type { APISchema } from "@/types";
import { asChild } from "./helpers";
import type * as Label from "$lib/bits/label/_types";

export const root: APISchema<Label.Props> = {
	title: "Root",
	description: "An enhanced label component that can be used with any input.",
	props: { asChild }
};

export const label = [root];
