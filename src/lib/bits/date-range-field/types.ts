import type { HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type * as I from "./_types.js";
import type { SegmentEvents } from "../date-field/types.js";

type Props = I.Props;
type LabelProps = I.LabelProps & HTMLSpanAttributes;
type SegmentProps = I.SegmentProps & HTMLDivAttributes;
type InputProps = I.InputProps & HTMLDivAttributes;

export type { Props, LabelProps, InputProps, SegmentProps, SegmentEvents };
