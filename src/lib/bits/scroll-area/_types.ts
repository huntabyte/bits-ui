import type { Expand, DOMElement } from "$lib/internal/types.js";
import type { CreateScrollAreaProps } from "@melt-ui/svelte";

type Props = Expand<Omit<CreateScrollAreaProps, "ids">> & DOMElement<HTMLDivElement>;

type BaseDivProps = DOMElement<HTMLDivElement>;

type ViewportProps = BaseDivProps;
type ContentProps = BaseDivProps;
type ScrollbarXProps = BaseDivProps;
type ScrollbarYProps = BaseDivProps;
type ThumbXProps = BaseDivProps;
type ThumbYProps = BaseDivProps;
type CornerProps = BaseDivProps;

export type {
	Props,
	ViewportProps,
	ContentProps,
	ScrollbarXProps,
	ScrollbarYProps,
	ThumbXProps,
	ThumbYProps,
	CornerProps,
};
