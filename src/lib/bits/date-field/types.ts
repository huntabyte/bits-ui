import type { CustomEventHandler } from "$lib";
import type { DOMEl, HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type * as I from "./_types.js";

type Props = I.Props;

type LabelProps = I.LabelProps & HTMLSpanAttributes & DOMEl<HTMLSpanElement>;

type SegmentProps = I.SegmentProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type InputProps = I.InputProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type DescriptionProps = I.DescriptionProps & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type SegmentEvents = {
	click: CustomEventHandler<MouseEvent, HTMLDivElement>;
	focusout: CustomEventHandler<FocusEvent, HTMLDivElement>;
	keydown: CustomEventHandler<KeyboardEvent, HTMLDivElement>;
};

export type {
	Props,
	LabelProps,
	DescriptionProps,
	InputProps,
	SegmentProps,
	//
	SegmentEvents
};
