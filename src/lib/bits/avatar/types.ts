import type {
	Expand,
	AsChild,
	HTMLDivAttributes,
	HTMLSpanAttributes,
	OnChangeFn
} from "$lib/internal/index.js";
import type { CreateAvatarProps } from "@melt-ui/svelte";
import type { HTMLImgAttributes } from "svelte/elements";

type Props = Expand<
	Omit<CreateAvatarProps, "onLoadingStatusChange" | "loadingStatus" | "src"> & {
		loadingStatus?: "loading" | "loaded" | "error";
		onLoadingStatusChange?: OnChangeFn<"loading" | "loaded" | "error">;
	} & AsChild
> &
	HTMLDivAttributes;

type ImageProps = AsChild & HTMLImgAttributes;

type FallbackProps = AsChild & HTMLSpanAttributes;

export type {
	Props,
	ImageProps,
	FallbackProps,
	//
	Props as AvatarProps,
	ImageProps as AvatarImageProps,
	FallbackProps as AvatarFallbackProps
};
