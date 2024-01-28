import type { APISchema } from "@/types";
import type * as LinkPreview from "$lib/bits/link-preview/_types";
export declare const root: APISchema<LinkPreview.Props>;
export declare const trigger: APISchema<LinkPreview.TriggerProps>;
export declare const content: APISchema<LinkPreview.ContentProps>;
export declare const arrow: APISchema<LinkPreview.ArrowProps>;
export declare const linkPreview: (APISchema<{
    closeOnEscape?: boolean | undefined;
    closeOnOutsideClick?: boolean | undefined;
    onOutsideClick?: ((event: PointerEvent) => void) | undefined;
    portal?: string | HTMLElement | null | undefined;
    openDelay?: number | undefined;
    closeDelay?: number | undefined;
    open?: boolean | undefined;
    onOpenChange?: import("../../lib/internal/types.js").OnChangeFn<boolean> | undefined;
}> | APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLAnchorElement | undefined;
}>)[];
