import type { HTMLImgAttributes } from "svelte/elements";
import type { CreateAvatarProps as MeltAvatarProps } from "@melt-ui/svelte";
import type {
	DOMElement,
	Expand,
	HTMLDivAttributes,
	HTMLSpanAttributes,
	OnChangeFn,
} from "$lib/internal/index.js";

export type AvatarPropsWithoutHTML = Expand<
	Omit<MeltAvatarProps, "onLoadingStatusChange" | "loadingStatus" | "src"> & {
		/**
		 * The loading state of the image.
		 * You can bind this to a boolean value to programmatically control the loading state.
		 */
		loadingStatus?: "loading" | "loaded" | "error" | undefined;

		/**
		 * A callback function called when the loading state changes.
		 */
		onLoadingStatusChange?: OnChangeFn<"loading" | "loaded" | "error"> | undefined;
	} & DOMElement
>;

export type AvatarImagePropsWithoutHTML = DOMElement<HTMLImageElement>;

export type AvatarFallbackPropsWithoutHTML = DOMElement<HTMLSpanElement>;

export type AvatarProps = AvatarPropsWithoutHTML & HTMLDivAttributes;

export type AvatarImageProps = AvatarImagePropsWithoutHTML & HTMLImgAttributes;

export type AvatarFallbackProps = AvatarFallbackPropsWithoutHTML & HTMLSpanAttributes;
