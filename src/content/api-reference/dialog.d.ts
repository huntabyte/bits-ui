import type { APISchema } from "@/types/index.js";
import type * as Dialog from "$lib/bits/dialog/_types.js";
export declare const root: APISchema<Dialog.Props>;
export declare const close: APISchema<Dialog.CloseProps>;
export declare const content: APISchema<Dialog.ContentProps>;
export declare const title: APISchema<Dialog.TitleProps>;
export declare const description: APISchema<Dialog.DescriptionProps>;
export declare const trigger: APISchema<Dialog.TriggerProps>;
export declare const overlay: APISchema<Dialog.OverlayProps>;
export declare const portal: APISchema<Dialog.PortalProps>;
export declare const dialog: (APISchema<{
    preventScroll?: boolean | undefined;
    closeOnEscape?: boolean | undefined;
    closeOnOutsideClick?: boolean | undefined;
    onOutsideClick?: ((event: PointerEvent) => void) | undefined;
    portal?: string | HTMLElement | null | undefined;
    open?: boolean | undefined;
    onOpenChange?: import("../../lib/internal/types.js").OnChangeFn<boolean> | undefined;
    openFocus?: import("../../lib/index.js").FocusProp | undefined;
    closeFocus?: import("../../lib/index.js").FocusProp | undefined;
}> | APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLButtonElement | undefined;
}>)[];
