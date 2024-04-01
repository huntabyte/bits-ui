import type { CreateScrollAreaProps } from "@melt-ui/svelte";
import type { DOMElement, Expand } from "$lib/internal/types.js";

type Props = Expand<Omit<CreateScrollAreaProps, "ids">> & DOMElement<HTMLDivElement>;

type BaseDivProps = DOMElement<HTMLDivElement>;

type ScrollbarProps = BaseDivProps & {
	orientation: "horizontal" | "vertical";
};

type ThumbProps = BaseDivProps;

type ViewportProps = BaseDivProps;
type ContentProps = BaseDivProps;
type CornerProps = BaseDivProps;

export type { Props, ViewportProps, ContentProps, ScrollbarProps, ThumbProps, CornerProps };
