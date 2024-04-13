import { getContext, setContext } from "svelte";
import type { ImageLoadingStatus } from "@melt-ui/svelte";
import type { AvatarImageLoadingStatus } from "./types.js";
import type { OnChangeFn } from "$lib/internal/types.js";
import { styleToString } from "$lib/internal/style.js";
import { type Box, box } from "$lib/internal/box.svelte.js";

/**
 * ROOT
 */
interface AvatarRootStateProps {
	delayMs: Box<number>;
	loadingStatus: Box<AvatarImageLoadingStatus>;
}

interface AvatarRootAttrs {
	"data-avatar-root": string;
}

type AvatarImageSrc = string | null | undefined;

class AvatarRootState {
	src: AvatarImageSrc = $state(null);
	delayMs = box(() => 0);
	loadingStatus = box<ImageLoadingStatus>(() => "loading");
	attrs: AvatarRootAttrs = {
		"data-avatar-root": "",
	};

	#imageTimerId: number = 0;

	constructor(props: AvatarRootStateProps) {
		this.delayMs = props.delayMs ?? this.delayMs;
		this.loadingStatus = props.loadingStatus;

		$effect.pre(() => {
			if (!this.src) return;
			this.#loadImage(this.src);
		});
	}

	#loadImage(src: string) {
		// clear any existing timers before creating a new one
		window.clearTimeout(this.#imageTimerId);
		const image = new Image();
		image.src = src;
		image.onload = () => {
			// if its 0 then we don't need to add a delay
			if (this.delayMs.value !== 0) {
				this.#imageTimerId = window.setTimeout(() => {
					this.loadingStatus.value = "loaded";
				}, this.delayMs.value);
			} else {
				this.loadingStatus.value = "loaded";
			}
		};
		image.onerror = () => {
			this.loadingStatus.value = "error";
		};
	}

	createImage(src: AvatarImageSrc) {
		return new AvatarImageState(src, this);
	}

	createFallback() {
		return new AvatarFallbackState(this);
	}
}

/**
 * IMAGE
 */

interface AvatarImageAttrs {
	style: string;
	"data-avatar-image": string;
}

class AvatarImageState {
	root: AvatarRootState = undefined as unknown as AvatarRootState;
	attrs: AvatarImageAttrs = $derived({
		style: styleToString({
			display: this.root.loadingStatus.value === "loaded" ? "block" : "none",
		}),
		"data-avatar-image": "",
	});

	constructor(src: AvatarImageSrc, root: AvatarRootState) {
		this.root = root;
		root.src = src;
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
	attrs: AvatarFallbackAttrs = $derived({
		style: styleToString({
			display: this.root.loadingStatus.value === "loaded" ? "none" : "block",
		}),
		"data-avatar-fallback": "",
	});

	constructor(root: AvatarRootState) {
		this.root = root;
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

export function getAvatarImageState(src: AvatarImageSrc) {
	return getAvatarRootState().createImage(src);
}

export function getAvatarFallbackState() {
	return getAvatarRootState().createFallback();
}
