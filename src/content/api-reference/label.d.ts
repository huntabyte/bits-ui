import type { APISchema } from "@/types";
import type * as Label from "$lib/bits/label/_types";
export declare const root: APISchema<Label.Props>;
export declare const label: APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLLabelElement | undefined;
}>[];
