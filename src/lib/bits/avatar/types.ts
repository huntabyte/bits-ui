import type { HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal/index.js";
import type { HTMLImgAttributes } from "svelte/elements";
import type * as I from "./_types.js";

type Props = I.Props & HTMLDivAttributes;

type ImageProps = I.ImageProps & HTMLImgAttributes;

type FallbackProps = I.FallbackProps & HTMLSpanAttributes;

export type { Props, ImageProps, FallbackProps };
