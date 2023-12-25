import type { DOMEl, HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type { HTMLImgAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props & HTMLDivAttributes & DOMEl<HTMLDivElement>;

type ImageProps = I.ImageProps & HTMLImgAttributes & DOMEl<HTMLImageElement>;

type FallbackProps = I.FallbackProps & HTMLSpanAttributes & DOMEl<HTMLSpanElement>;

export type { Props, ImageProps, FallbackProps };
