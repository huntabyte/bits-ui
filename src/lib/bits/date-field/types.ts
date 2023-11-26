import type { HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type { HTMLInputAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props;

type LabelProps = I.Props & HTMLSpanAttributes;

type FieldProps = I.FieldProps & HTMLDivAttributes;

type SegmentProps = I.SegmentProps & HTMLDivAttributes;

type InputProps = I.InputProps & HTMLInputAttributes;

export type { Props, FieldProps, LabelProps, InputProps, SegmentProps };
