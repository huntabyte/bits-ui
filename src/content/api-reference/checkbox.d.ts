import type { APISchema } from "@/types/index.js";
import type * as Checkbox from "$lib/bits/checkbox/_types.js";
export declare const root: APISchema<Checkbox.Props>;
export declare const input: APISchema;
export declare const indicator: APISchema<Checkbox.IndicatorProps>;
export declare const checkbox: (APISchema | APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLDivElement | undefined;
}>)[];
