import type { APISchema } from "@/types";
import type * as RadioGroup from "$lib/bits/radio-group/_types";
export declare const root: APISchema<RadioGroup.Props>;
export declare const item: APISchema<RadioGroup.ItemProps>;
export declare const input: APISchema<RadioGroup.InputProps>;
export declare const indicator: APISchema;
export declare const radioGroup: (APISchema | APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLInputElement | undefined;
}>)[];
