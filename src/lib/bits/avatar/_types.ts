/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { Expand, OnChangeFn, DOMElement } from "$lib/internal/index.js";
import type { CreateAvatarProps } from "@melt-ui/svelte";

type Props = Expand<
	Omit<CreateAvatarProps, "onLoadingStatusChange" | "loadingStatus" | "src"> & {
		/**
		 * The loading state of the image.
		 * You can bind this to a boolean value to programmatically control the loading state.
		 */
		loadingStatus?: "loading" | "loaded" | "error";

		/**
		 * A callback function called when the loading state changes.
		 */
		onLoadingStatusChange?: OnChangeFn<"loading" | "loaded" | "error">;
	} & DOMElement
>;

type ImageProps = DOMElement<HTMLImageElement>;

type FallbackProps = DOMElement<HTMLSpanElement>;

export type { Props, ImageProps, FallbackProps };
