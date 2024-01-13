import type { APISchema } from "@/types/index.js";
export declare const bits: readonly ["accordion", "alert-dialog", "aspect-ratio", "avatar", "button", "calendar", "checkbox", "collapsible", "context-menu", "date-field", "date-picker", "date-range-field", "date-range-picker", "dialog", "dropdown-menu", "label", "link-preview", "menubar", "pagination", "pin-input", "popover", "progress", "radio-group", "range-calendar", "select", "separator", "slider", "switch", "tabs", "toggle", "toggle-group", "toolbar", "tooltip"];
export declare const bitsSet: Set<"popover" | "dialog" | "label" | "tooltip" | "accordion" | "alert-dialog" | "aspect-ratio" | "avatar" | "button" | "calendar" | "checkbox" | "collapsible" | "context-menu" | "date-field" | "date-picker" | "date-range-field" | "date-range-picker" | "dropdown-menu" | "link-preview" | "menubar" | "pagination" | "pin-input" | "progress" | "radio-group" | "range-calendar" | "select" | "separator" | "slider" | "switch" | "tabs" | "toggle" | "toggle-group" | "toolbar">;
export declare function isBit(value: string): value is (typeof bits)[number];
export type Bit = (typeof bits)[number];
export declare const apiSchemas: Record<Bit, APISchema[]>;
export declare function getAPISchemas(bit: Bit): APISchema[];
export * from "./helpers.js";
