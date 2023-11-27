import type { HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type * as I from "./_types.js";

type Props = I.Props;

type LabelProps = I.Props & HTMLSpanAttributes;

type SegmentProps = I.SegmentProps & HTMLDivAttributes;

type InputProps = I.InputProps & HTMLDivAttributes;

type DescriptionProps = I.DescriptionProps & HTMLDivAttributes;

type CalendarProps = I.CalendarProps & HTMLDivAttributes;

export type { Props, CalendarProps, LabelProps, DescriptionProps, InputProps, SegmentProps };