import { getContext, setContext } from "svelte";
import type { ImageLoadingStatus } from "@melt-ui/svelte";
import type { AvatarImageLoadingStatus } from "./types.js";
import { styleToString } from "$lib/internal/style.js";
import { type Box, type ReadonlyBox, readonlyBox } from "$lib/internal/box.svelte.js";

/**
 * ROOT
 */
type AvatarRootStateProps = {
	delayMs: ReadonlyBox<number>;
	loadingStatus: Box<AvatarImageLoadingStatus>;
};

type AvatarImageSrc = string | null | undefined;

class AvatarRootState {
	src = readonlyBox<AvatarImageSrc>(() => null);
	delayMs: ReadonlyBox<number>;
	loadingStatus: Box<ImageLoadingStatus> = undefined as unknown as Box<ImageLoadingStatus>;
	#attrs = $derived({
		"data-avatar-root": "",
		"data-status": this.loadingStatus.value,
	} as const);

	#imageTimerId: NodeJS.Timeout | undefined = undefined;

	constructor(props: AvatarRootStateProps) {
		this.delayMs = props.delayMs;
		this.loadingStatus = props.loadingStatus;

		$effect.pre(() => {
			if (!this.src.value) return;
			this.#loadImage(this.src.value);
		});
	}

	#loadImage(src: string) {
		// clear any existing timers before creating a new one
		clearTimeout(this.#imageTimerId);
		const image = new Image();
		image.src = src;
		image.onload = () => {
			this.#imageTimerId = setTimeout(() => {
				this.loadingStatus.value = "loaded";
			}, this.delayMs.value);
		};
		image.onerror = () => {
			this.loadingStatus.value = "error";
		};
	}

	createImage(src: ReadonlyBox<AvatarImageSrc>) {
		return new AvatarImageState(src, this);
	}

	createFallback() {
		return new AvatarFallbackState(this);
	}

	get props() {
		return this.#attrs;
	}
}

/**
 * IMAGE
 */

class AvatarImageState {
	root: AvatarRootState = undefined as unknown as AvatarRootState;
	#attrs = $derived({
		style: styleToString({
			display: this.root.loadingStatus.value === "loaded" ? "block" : "none",
		}),
		"data-avatar-image": "",
		src: this.root.src.value,
	} as const);

	constructor(src: ReadonlyBox<AvatarImageSrc>, root: AvatarRootState) {
		this.root = root;
		root.src = src;
	}

	get props() {
		return this.#attrs;
	}
}

/**
 * FALLBACK
 */

class AvatarFallbackState {
	root: AvatarRootState = undefined as unknown as AvatarRootState;
	#attrs = $derived({
		style: styleToString({
			display: this.root.loadingStatus.value === "loaded" ? "none" : "block",
		}),
		"data-avatar-fallback": "",
	} as const);

	constructor(root: AvatarRootState) {
		this.root = root;
	}

	get props() {
		return this.#attrs;
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

export function getAvatarImageState(src: ReadonlyBox<AvatarImageSrc>) {
	return getAvatarRootState().createImage(src);
}

export function getAvatarFallbackState() {
	return getAvatarRootState().createFallback();
}
