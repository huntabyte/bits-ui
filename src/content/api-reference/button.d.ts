import type { APISchema } from "@/types";
import type * as Button from "$lib/bits/button/_types";
export declare const root: APISchema<Button.Props & {
    href: string;
}>;
export declare const button: APISchema<{
    builders?: import("../../lib/internal").Builder[] | undefined;
} & {
    href: string;
}>[];
