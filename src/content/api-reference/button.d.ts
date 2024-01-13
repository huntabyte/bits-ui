import type { APISchema } from "@/types/index.js";
import type * as Button from "$lib/bits/button/_types.js";
export declare const root: APISchema<Button.Props & {
    href: string;
}>;
export declare const button: APISchema<{
    builders?: import("../../lib/internal").Builder[] | undefined;
} & {
    href: string;
}>[];
