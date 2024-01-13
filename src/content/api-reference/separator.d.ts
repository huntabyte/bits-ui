import type { APISchema } from "@/types/index.js";
import type * as Separator from "$lib/bits/separator/_types.js";
export declare const root: APISchema<Separator.Props>;
export declare const separator: APISchema<{
    orientation?: import("@melt-ui/svelte/internal/types").Orientation | undefined;
    decorative?: boolean | undefined;
    asChild?: boolean | undefined;
    el?: HTMLDivElement | undefined;
}>[];
