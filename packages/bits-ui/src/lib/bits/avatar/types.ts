import type { OnChangeFn, WithChild, Without } from "$lib/internal/types.js";
import type {
	BitsPrimitiveDivAttributes,
	BitsPrimitiveImgAttributes,
	BitsPrimitiveSpanAttributes,
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
	 *
	 * If you are confident that the image exists and will load successfully, you can
	 * set this to `"loaded"` to skip the loading process (which shows the fallback)
	 * and immediately show the image.
	 *
	 * @default "loading"
	 */
	loadingStatus?: AvatarImageLoadingStatus;

	/**
	 * A callback invoked when the loading status of the image changes.
	 */
	onLoadingStatusChange?: OnChangeFn<AvatarImageLoadingStatus>;
}>;

export type AvatarRootProps = AvatarRootPropsWithoutHTML &
	Without<BitsPrimitiveDivAttributes, AvatarRootPropsWithoutHTML>;

export type AvatarImagePropsWithoutHTML = WithChild;
export type AvatarImageProps = AvatarImagePropsWithoutHTML &
	Without<BitsPrimitiveImgAttributes, AvatarImagePropsWithoutHTML>;

export type AvatarFallbackPropsWithoutHTML = WithChild;
export type AvatarFallbackProps = AvatarFallbackPropsWithoutHTML &
	Without<BitsPrimitiveSpanAttributes, AvatarFallbackPropsWithoutHTML>;
