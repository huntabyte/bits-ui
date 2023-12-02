import type { HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type * as I from "./_types.js";

type Props = I.Props;

type LabelProps = I.LabelProps & HTMLSpanAttributes;

type SegmentProps = I.SegmentProps & HTMLDivAttributes;

type InputProps = I.InputProps & HTMLDivAttributes;

type DescriptionProps = I.DescriptionProps & HTMLDivAttributes;

export type { Props, LabelProps, DescriptionProps, InputProps, SegmentProps };
