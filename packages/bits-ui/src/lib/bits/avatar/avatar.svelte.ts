import { getContext, setContext } from "svelte";
import type { ImageLoadingStatus } from "@melt-ui/svelte";
import type { AvatarImageLoadingStatus } from "./types.js";
import { styleToString } from "$lib/internal/style.js";
import { type Box, type BoxedValues, box } from "$lib/internal/box.svelte.js";

/**
 * ROOT
 */
type AvatarRootStateProps = BoxedValues<{
	delayMs: number;
	loadingStatus: AvatarImageLoadingStatus;
}>;

interface AvatarRootAttrs {
	"data-avatar-root": string;
	"data-status": ImageLoadingStatus;
}

type AvatarImageSrc = string | null | undefined;

class AvatarRootState {
	src = box<AvatarImageSrc>(() => null);
	delayMs = box(() => 0);
	loadingStatus = box<ImageLoadingStatus>(() => "loading");
	#attrs: AvatarRootAttrs = $derived({
		"data-avatar-root": "",
		"data-status": this.loadingStatus.value,
	});

	#imageTimerId: NodeJS.Timeout | undefined = undefined;

	constructor(props: AvatarRootStateProps) {
		this.delayMs = props.delayMs ?? this.delayMs;
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

	createImage(src: Box<AvatarImageSrc>) {
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

interface AvatarImageAttrs {
	style: string;
	src: AvatarImageSrc;
	"data-avatar-image": string;
}

class AvatarImageState {
	root: AvatarRootState = undefined as unknown as AvatarRootState;
	#attrs: AvatarImageAttrs = $derived({
		style: styleToString({
			display: this.root.loadingStatus.value === "loaded" ? "block" : "none",
		}),
		"data-avatar-image": "",
		src: this.root.src.value,
	});

	constructor(src: Box<AvatarImageSrc>, root: AvatarRootState) {
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

interface AvatarFallbackAttrs {
	style: string;
	"data-avatar-fallback": string;
}

class AvatarFallbackState {
	root: AvatarRootState = undefined as unknown as AvatarRootState;
	#attrs: AvatarFallbackAttrs = $derived({
		style: styleToString({
			display: this.root.loadingStatus.value === "loaded" ? "none" : "block",
		}),
		"data-avatar-fallback": "",
	});

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

export function getAvatarImageState(src: Box<AvatarImageSrc>) {
	return getAvatarRootState().createImage(src);
}

export function getAvatarFallbackState() {
	return getAvatarRootState().createFallback();
}
