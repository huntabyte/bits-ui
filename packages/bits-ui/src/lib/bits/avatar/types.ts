import type { HTMLImgAttributes } from "svelte/elements";
import type {
	DOMElement,
	HTMLDivAttributes,
	HTMLSpanAttributes,
	OnChangeFn,
	WithAsChild,
} from "$lib/internal/index.js";

export type AvatarImageLoadingStatus = "loading" | "loaded" | "error";

export type AvatarRootPropsWithoutHTML = WithAsChild<{
	/**
	 * The delay in milliseconds to wait before showing the avatar once
	 * the image has loaded. This can be used to prevent sudden flickering
	 * of the image if it loads quickly.
	 *
	 * @default 0
	 */
	delayMs?: number;

	/**
	 * The loading status of the image.
	 */
	loadingStatus?: AvatarImageLoadingStatus;

	/**
	 * A callback invoked when the loading status of the image changes.
	 */
	onLoadingStatusChange?: OnChangeFn<AvatarImageLoadingStatus>;
}>;

export type AvatarRootProps = AvatarRootPropsWithoutHTML & HTMLDivAttributes;

export type AvatarImagePropsWithoutHTML = WithAsChild<object>;
export type AvatarImageProps = AvatarImagePropsWithoutHTML & HTMLImgAttributes;

export type AvatarFallbackPropsWithoutHTML = WithAsChild<object>;
export type AvatarFallbackProps = AvatarFallbackPropsWithoutHTML & HTMLSpanAttributes;
