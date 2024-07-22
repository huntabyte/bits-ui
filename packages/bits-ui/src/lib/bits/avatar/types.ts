import type { OnChangeFn, WithChild, Without } from "$lib/internal/index.js";
import type {
	PrimitiveDivAttributes,
	PrimitiveImgAttributes,
	PrimitiveSpanAttributes,
} from "$lib/shared/attributes.js";

export type AvatarImageLoadingStatus = "loading" | "loaded" | "error";

export type AvatarRootPropsWithoutHTML = WithChild<{
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

export type AvatarRootProps = AvatarRootPropsWithoutHTML &
	Without<PrimitiveDivAttributes, AvatarRootPropsWithoutHTML>;

export type AvatarImagePropsWithoutHTML = WithChild;
export type AvatarImageProps = AvatarImagePropsWithoutHTML &
	Without<PrimitiveImgAttributes, AvatarImagePropsWithoutHTML>;

export type AvatarFallbackPropsWithoutHTML = WithChild;
export type AvatarFallbackProps = AvatarFallbackPropsWithoutHTML &
	Without<PrimitiveSpanAttributes, AvatarFallbackPropsWithoutHTML>;
