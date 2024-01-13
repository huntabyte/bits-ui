import type { APISchema } from "@/types/index.js";
import type * as Label from "$lib/bits/label/_types.js";
export declare const root: APISchema<Label.Props>;
export declare const label: APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLLabelElement | undefined;
}>[];
