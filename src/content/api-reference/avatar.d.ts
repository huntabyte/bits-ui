import type { APISchema } from "@/types";
import type * as Avatar from "$lib/bits/avatar/_types";
export declare const root: APISchema<Avatar.Props>;
export declare const image: APISchema<Avatar.ImageProps>;
export declare const fallback: APISchema<Avatar.FallbackProps>;
export declare const avatar: APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLImageElement | undefined;
}>[];
