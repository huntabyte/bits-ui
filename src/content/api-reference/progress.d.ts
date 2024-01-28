import type { APISchema } from "@/types/index.js";
import type * as Progress from "$lib/bits/progress/_types.js";
export declare const root: APISchema<Progress.Props>;
export declare const progress: APISchema<{
    max?: number | undefined;
    value?: number | null | undefined;
    onValueChange?: import("../../lib/internal").OnChangeFn<number | null> | undefined;
    asChild?: boolean | undefined;
    el?: HTMLDivElement | undefined;
}>[];
