import type { HTMLDivAttributes, HTMLSpanAttributes } from "$lib/internal";
import type { HTMLImgAttributes } from "svelte/elements";
import type { AvatarLoadingStatus } from "./state.svelte";

export type AvatarProps = {
	/**
	 * The amount of time to wait before showing the image once
	 * it has been loaded. This is useful for preventing quick
	 * flashes of images.
	 */
	delayMs: number;

	/**
	 * The loading state of the image.
	 */
	loadingStatus: AvatarLoadingStatus;

	/**
	 * Whether or not to delegate rendering of the element
	 */
	asChild: boolean;
} & HTMLDivAttributes;

export type AvatarWithoutHTML = Omit<AvatarProps, keyof HTMLDivAttributes>;

export type AvatarImageProps = {
	/**
	 * The source URL of the image.
	 */
	src: string;

	/**
	 * Whether or not to delegate rendering of the element
	 */
	asChild: boolean;
} & HTMLImgAttributes;

export type AvatarImageWithoutHTML = Omit<AvatarImageProps, keyof HTMLImgAttributes>;

export type AvatarFallbackProps = {
	/**
	 * Whether or not to delegate rendering of the element
	 */
	asChild: boolean;
} & HTMLSpanAttributes;

export type AvatarFallbackWithoutHTML = Omit<AvatarFallbackProps, keyof HTMLSpanAttributes>;
