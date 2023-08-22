import type { APISchema } from "@/types";
import { asChild } from "./helpers";

export const root: APISchema = {
	title: "Root",
	description: "An enhanced label component that can be used with any input.",
	props: [asChild]
};

export const label = [root];
