import type { APISchema } from "@/types";
export declare const toggle: APISchema<{
    disabled?: boolean | undefined;
    pressed?: boolean | undefined;
    onPressedChange?: import("../../lib/internal").OnChangeFn<boolean> | undefined;
    asChild?: boolean | undefined;
    el?: HTMLButtonElement | undefined;
}>[];
