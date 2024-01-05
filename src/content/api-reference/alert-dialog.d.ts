import type { APISchema } from "@/types/api.js";
export declare const alertDialog: (APISchema<{
    preventScroll?: boolean | undefined;
    closeOnEscape?: boolean | undefined;
    closeOnOutsideClick?: boolean | undefined;
    onOutsideClick?: ((event: PointerEvent) => void) | undefined;
    portal?: string | HTMLElement | null | undefined;
    openFocus?: import("@melt-ui/svelte").FocusProp | undefined;
    closeFocus?: import("@melt-ui/svelte").FocusProp | undefined;
    open?: boolean | undefined;
    onOpenChange?: import("../../lib/internal").OnChangeFn<boolean> | undefined;
}> | APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLButtonElement | undefined;
}>)[];
