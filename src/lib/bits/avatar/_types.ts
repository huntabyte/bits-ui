/**
 * We define prop types without the HTMLAttributes here so that we can use them
 * to type-check our API documentation, which requires we document each prop,
 * but we don't want to document the HTML attributes.
 */

import type { Expand, AsChild, OnChangeFn } from "$lib/internal/index.js";
import type { CreateAvatarProps } from "@melt-ui/svelte";

type Props = Expand<
	Omit<CreateAvatarProps, "onLoadingStatusChange" | "loadingStatus" | "src"> & {
		loadingStatus?: "loading" | "loaded" | "error";
		onLoadingStatusChange?: OnChangeFn<"loading" | "loaded" | "error">;
	} & AsChild
>;

type ImageProps = AsChild;

type FallbackProps = AsChild;

export type { Props, ImageProps, FallbackProps };
