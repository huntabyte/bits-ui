import type { APISchema } from "@/types/index.js";
import type * as Popover from "$lib/bits/popover/_types.js";
export declare const root: APISchema<Popover.Props>;
export declare const trigger: APISchema<Popover.TriggerProps>;
export declare const content: APISchema<Popover.ContentProps>;
export declare const close: APISchema<Popover.CloseProps>;
export declare const arrow: APISchema<Popover.ArrowProps>;
export declare const popover: (APISchema<{
    preventScroll?: boolean | undefined;
    closeOnEscape?: boolean | undefined;
    closeOnOutsideClick?: boolean | undefined;
    onOutsideClick?: ((event: PointerEvent) => void) | undefined;
    portal?: string | HTMLElement | null | undefined;
    openFocus?: import("@melt-ui/svelte/index.js").FocusProp | undefined;
    closeFocus?: import("@melt-ui/svelte/index.js").FocusProp | undefined;
    disableFocusTrap?: boolean | undefined;
    open?: boolean | undefined;
    onOpenChange?: import("../../lib/internal/types.js").OnChangeFn<boolean> | undefined;
}> | APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLButtonElement | undefined;
}>)[];
