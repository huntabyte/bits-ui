import type { APISchema } from "@/types";
import type * as Collapsible from "$lib/bits/collapsible/_types";
export declare const root: APISchema<Collapsible.Props>;
export declare const trigger: APISchema<Collapsible.TriggerProps>;
export declare const content: APISchema<Collapsible.ContentProps>;
export declare const collapsible: APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLButtonElement | undefined;
}>[];
