import type { APISchema } from "@/types/index.js";
import type * as Tooltip from "$lib/bits/tooltip/_types.js";
export declare const root: APISchema<Tooltip.Props>;
export declare const trigger: APISchema<Tooltip.TriggerProps>;
export declare const content: APISchema<Tooltip.ContentProps>;
export declare const arrow: APISchema<Tooltip.ArrowProps>;
export declare const tooltip: (APISchema<Tooltip.Props> | APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLButtonElement | undefined;
}>)[];
