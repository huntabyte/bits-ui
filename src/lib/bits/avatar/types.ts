import type { HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type { HTMLImgAttributes } from "svelte/elements";
import type * as T from "./_types.js";

type Props = T.Props & HTMLDivAttributes;

type ImageProps = T.ImageProps & HTMLImgAttributes;

type FallbackProps = T.FallbackProps & HTMLSpanAttributes;

export type {
	Props,
	ImageProps,
	FallbackProps,
	//
	Props as AvatarProps,
	ImageProps as AvatarImageProps,
	FallbackProps as AvatarFallbackProps
};
