import type { APISchema } from "@/types/index.js";
import type * as Menu from "$lib/bits/menu/_types.js";
export declare const root: APISchema<Menu.Props>;
export declare const trigger: APISchema<Menu.TriggerProps>;
export declare const content: APISchema<Menu.ContentProps>;
export declare const item: APISchema<Menu.ItemProps & {
    href: string;
}>;
export declare const separator: APISchema<Menu.SeparatorProps>;
export declare const arrow: APISchema<Menu.ArrowProps>;
export declare const checkboxItem: APISchema<Menu.CheckboxItemProps>;
export declare const checkboxIndicator: APISchema<Menu.CheckboxIndicatorProps>;
export declare const radioGroup: APISchema<Menu.RadioGroupProps>;
export declare const radioItem: APISchema<Menu.RadioItemProps>;
export declare const radioIndicator: APISchema<Menu.RadioIndicatorProps>;
export declare const sub: APISchema<Menu.SubProps>;
export declare const subTrigger: APISchema<Menu.SubTriggerProps>;
export declare const subContent: APISchema<Menu.SubContentProps>;
export declare const group: APISchema<Menu.GroupProps>;
export declare const label: APISchema<Menu.LabelProps>;
export declare const dropdownMenu: (APISchema<{
    preventScroll?: boolean | undefined;
    closeOnEscape?: boolean | undefined;
    closeOnOutsideClick?: boolean | undefined;
    onOutsideClick?: ((event: PointerEvent) => void) | undefined;
    portal?: string | HTMLElement | null | undefined;
    closeFocus?: import("@melt-ui/svelte/index.js").FocusProp | undefined;
    dir?: import("@melt-ui/svelte/internal/types").TextDirection | undefined;
    closeOnItemClick?: boolean | undefined;
    loop?: boolean | undefined;
    typeahead?: boolean | undefined;
    disableFocusFirstItem?: boolean | undefined;
    open?: boolean | undefined;
    onOpenChange?: import("../../lib/internal/types.js").OnChangeFn<boolean> | undefined;
}> | APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLElement | undefined;
}> | APISchema<{
    disabled?: boolean | undefined;
    open?: boolean | undefined;
    onOpenChange?: import("../../lib/internal/types.js").OnChangeFn<boolean> | undefined;
}>)[];
