import type { DOMEl, HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type * as I from "./_types.js";
import type { SegmentEvents } from "../date-field/types.js";

type Props = I.Props;
type LabelProps = I.LabelProps & HTMLSpanAttributes & DOMEl<HTMLSpanElement>;
type SegmentProps = I.SegmentProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;
type InputProps = I.InputProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;

export type { Props, LabelProps, InputProps, SegmentProps, SegmentEvents };
