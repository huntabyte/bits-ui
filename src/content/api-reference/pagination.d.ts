import type { APISchema } from "@/types/index.js";
import type * as Pagination from "$lib/bits/pagination/_types.js";
export declare const root: APISchema<Pagination.Props>;
export declare const page: APISchema<Pagination.PageProps>;
export declare const prevButton: APISchema<Pagination.PrevButtonProps>;
export declare const nextButton: APISchema<Pagination.NextButtonProps>;
export declare const pagination: APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLButtonElement | undefined;
}>[];
