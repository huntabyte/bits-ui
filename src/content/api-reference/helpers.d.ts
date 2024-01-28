import type { PropSchema } from "@/types/api.js";
export declare const asChild: {
    type: string;
    default: string;
    description: string;
};
type ElementKind = "HTMLDivElement" | "HTMLButtonElement" | "HTMLSpanElement" | "HTMLAnchorElement" | "HTMLTableCellElement" | "HTMLTableSectionElement" | "HTMLTableRowElement" | "HTMLTableElement" | "HTMLLabelElement" | "HTMLHeadingElement" | "HTMLImageElement" | "HTMLInputElement" | "HTMLElement";
export declare function domElProps(elType: ElementKind): {
    asChild: {
        type: string;
        default: string;
        description: string;
    };
    el: {
        type: ElementKind;
        description: string;
    };
};
export declare const attrsSlotProp: PropSchema;
export declare const builderAndAttrsSlotProps: Record<string, PropSchema>;
export declare const monthsSlotProp: PropSchema;
export declare const weekdaysSlotProp: PropSchema;
export declare const idsSlotProp: PropSchema;
export declare const arrowProps: {
    asChild: {
        type: string;
        default: string;
        description: string;
    };
    el: {
        type: ElementKind;
        description: string;
    };
    size: {
        type: string;
        default: string;
        description: string;
    };
};
export declare const transitionProps: {
    transition: PropSchema;
    transitionConfig: PropSchema;
    inTransition: PropSchema;
    inTransitionConfig: PropSchema;
    outTransition: PropSchema;
    outTransitionConfig: PropSchema;
};
export declare function portalProp(compName?: string): {
    type: {
        type: string;
        definition: string;
    };
    description: string;
};
export declare function union(...types: string[]): string;
export declare function enums(...values: string[]): string;
export declare function seeFloating(content: string, link: string): string;
export declare function escape(str: string): string;
export declare const onOutsideClickProp: PropSchema;
export {};
