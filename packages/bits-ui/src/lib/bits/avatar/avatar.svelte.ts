import { getContext, setContext } from "svelte";
import type { ImageLoadingStatus } from "@melt-ui/svelte";
import type { AvatarImageLoadingStatus } from "./types.js";
import { styleToString } from "$lib/internal/style.js";
import {
	type Box,
	type ReadonlyBox,
	type ReadonlyBoxedValues,
	readonlyBox,
} from "$lib/internal/box.svelte.js";
import type { StyleProperties } from "$lib/shared/index.js";

/**
 * ROOT
 */
type AvatarRootStateProps = {
	delayMs: ReadonlyBox<number>;
	loadingStatus: Box<AvatarImageLoadingStatus>;
	style: ReadonlyBox<StyleProperties>;
};

type AvatarImageSrc = string | null | undefined;

class AvatarRootState {
	src = readonlyBox<AvatarImageSrc>(() => null);
	delayMs: ReadonlyBox<number>;
	loadingStatus = undefined as unknown as Box<ImageLoadingStatus>;
	styleProp = undefined as unknown as ReadonlyBox<StyleProperties>;

	constructor(props: AvatarRootStateProps) {
		this.delayMs = props.delayMs;
		this.loadingStatus = props.loadingStatus;

		$effect.pre(() => {
			if (!this.src.value) return;
			return this.#loadImage(this.src.value);
		});
	}

	#loadImage(src: string) {
		let imageTimerId: NodeJS.Timeout;
		const image = new Image();
		image.src = src;
		this.loadingStatus.value = "loading";
		image.onload = () => {
			imageTimerId = setTimeout(() => {
				this.loadingStatus.value = "loaded";
			}, this.delayMs.value);
		};
		image.onerror = () => {
			this.loadingStatus.value = "error";
		};
		return () => clearTimeout(imageTimerId);
	}

	createImage(props: AvatarImageStateProps) {
		return new AvatarImageState(props, this);
	}

	createFallback(props: AvatarFallbackStateProps) {
		return new AvatarFallbackState(props, this);
	}

	get props() {
		return {
			"data-avatar-root": "",
			"data-status": this.loadingStatus.value,
			style: styleToString(this.styleProp.value),
		} as const;
	}
}

/**
 * IMAGE
 */

type AvatarImageStateProps = ReadonlyBoxedValues<{
	src: AvatarImageSrc;
	style: StyleProperties;
}>;

class AvatarImageState {
	root = undefined as unknown as AvatarRootState;
	styleProp = undefined as unknown as ReadonlyBox<StyleProperties>;

	constructor(props: AvatarImageStateProps, root: AvatarRootState) {
		this.root = root;
		this.styleProp = props.style;
		root.src = props.src;
	}

	get props() {
		return {
			style: styleToString({
				...this.styleProp.value,
				display: this.root.loadingStatus.value === "loaded" ? "block" : "none",
			}),
			"data-avatar-image": "",
			src: this.root.src.value,
		} as const;
	}
}

/**
 * FALLBACK
 */

type AvatarFallbackStateProps = ReadonlyBoxedValues<{
	style: StyleProperties;
}>;

class AvatarFallbackState {
	root = undefined as unknown as AvatarRootState;
	styleProp = undefined as unknown as ReadonlyBox<StyleProperties>;

	constructor(props: AvatarFallbackStateProps, root: AvatarRootState) {
		this.styleProp = props.style;
		this.root = root;
	}

	get props() {
		return {
			style: styleToString({
				...this.styleProp.value,
				display: this.root.loadingStatus.value === "loaded" ? "none" : "block",
			}),
			"data-avatar-fallback": "",
		} as const;
	}
}

/**
 * CONTEXT METHODS
 */

export const AVATAR_ROOT_KEY = Symbol("Avatar.Root");

export function setAvatarRootState(props: AvatarRootStateProps) {
	return setContext(AVATAR_ROOT_KEY, new AvatarRootState(props));
}

export function getAvatarRootState(): AvatarRootState {
	return getContext(AVATAR_ROOT_KEY);
}

export function getAvatarImageState(props: AvatarImageStateProps) {
	return getAvatarRootState().createImage(props);
}

export function getAvatarFallbackState(props: AvatarFallbackStateProps) {
	return getAvatarRootState().createFallback(props);
}
