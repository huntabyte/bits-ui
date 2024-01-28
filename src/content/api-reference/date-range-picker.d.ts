import type { APISchema } from "@/types";
export declare const dateRangePicker: (APISchema<{
    asChild?: boolean | undefined;
    el?: HTMLButtonElement | undefined;
}> | APISchema<{
    disabled?: boolean | undefined;
    preventScroll?: boolean | undefined;
    closeOnEscape?: boolean | undefined;
    closeOnOutsideClick?: boolean | undefined;
    onOutsideClick?: ((event: PointerEvent) => void) | undefined;
    portal?: string | HTMLElement | null | undefined;
    openFocus?: import("@melt-ui/svelte").FocusProp | undefined;
    closeFocus?: import("@melt-ui/svelte").FocusProp | undefined;
    preventDeselect?: boolean | undefined;
    minValue?: import("@internationalized/date").DateValue | undefined;
    maxValue?: import("@internationalized/date").DateValue | undefined;
    pagedNavigation?: boolean | undefined;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | undefined;
    weekdayFormat?: "narrow" | "short" | "long" | undefined;
    isDateDisabled?: import("@melt-ui/svelte").Matcher | undefined;
    isDateUnavailable?: import("@melt-ui/svelte").Matcher | undefined;
    fixedWeeks?: boolean | undefined;
    numberOfMonths?: number | undefined;
    calendarLabel?: string | undefined;
    locale?: string | undefined;
    readonly?: boolean | undefined;
    hourCycle?: 12 | 24 | undefined;
    granularity?: import("@melt-ui/svelte").Granularity | undefined;
    hideTimeZone?: boolean | undefined;
    disableFocusTrap?: boolean | undefined;
    open?: boolean | undefined;
    onOpenChange?: import("../../lib/internal").OnChangeFn<boolean> | undefined;
    value?: import("../../lib").DateRange | undefined;
    onValueChange?: import("../../lib/internal").OnChangeFn<import("../../lib").DateRange | undefined> | undefined;
    placeholder?: import("@internationalized/date").DateValue | undefined;
    onPlaceholderChange?: import("../../lib/internal").OnChangeFn<import("@internationalized/date").DateValue> | undefined;
    validationId?: string | undefined;
    descriptionId?: string | undefined;
    startValue?: import("@internationalized/date").DateValue | undefined;
}>)[];
