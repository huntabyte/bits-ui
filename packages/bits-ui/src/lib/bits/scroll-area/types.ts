import type { CreateScrollAreaProps as MeltScrollAreaProps } from "@melt-ui/svelte";
import type { DOMElement, Expand, HTMLDivAttributes } from "$lib/internal/types.js";

export type ScrollAreaPropsWithoutHTML = Expand<Omit<MeltScrollAreaProps, "ids">> &
	DOMElement<HTMLDivElement>;

type BaseDivProps = DOMElement<HTMLDivElement>;

export type ScrollAreaScrollbarPropsWithoutHTML = BaseDivProps & {
	orientation: "horizontal" | "vertical";
};

export type ScrollAreaThumbPropsWithoutHTML = BaseDivProps;

export type ScrollAreaViewportPropsWithoutHTML = BaseDivProps;
export type ScrollAreaContentPropsWithoutHTML = BaseDivProps;
export type ScrollAreaCornerPropsWithoutHTML = BaseDivProps;

//

export type ScrollAreaProps = ScrollAreaPropsWithoutHTML & HTMLDivAttributes;
export type ScrollAreaViewportProps = ScrollAreaViewportPropsWithoutHTML & HTMLDivAttributes;
export type ScrollAreaContentProps = ScrollAreaContentPropsWithoutHTML & HTMLDivAttributes;
export type ScrollAreaScrollbarProps = ScrollAreaScrollbarPropsWithoutHTML & HTMLDivAttributes;
export type ScrollAreaThumbProps = ScrollAreaThumbPropsWithoutHTML & HTMLDivAttributes;
export type ScrollAreaCornerProps = ScrollAreaCornerPropsWithoutHTML & HTMLDivAttributes;
