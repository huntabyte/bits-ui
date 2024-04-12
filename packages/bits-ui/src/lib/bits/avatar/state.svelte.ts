import { getContext, setContext } from "svelte";
import type { AvatarImageLoadingStatus } from "./types.js";
import type { OnChangeFn } from "$lib/internal/types.js";
import { styleToString } from "$lib/internal/style.js";

/**
 * ROOT
 */
interface AvatarStateProps {
	delayMs?: number;
	loadingStatus?: AvatarImageLoadingStatus;
	onLoadingStatusChange?: OnChangeFn<AvatarImageLoadingStatus>;
}

interface AvatarRootAttrs {
	"data-bits-avatar-root": string;
}

type AvatarImageSrc = string | null | undefined;

class AvatarRootState {
	src: AvatarImageSrc = $state(null);
	delayMs: number = $state(0);
	loadingStatus: AvatarImageLoadingStatus = $state("loading");
	onLoadingStatusChange: AvatarStateProps["onLoadingStatusChange"] = $state(() => {});
	attrs: AvatarRootAttrs = {
		"data-bits-avatar-root": "",
	};

	#imageTimerId: number = 0;

	constructor(props: AvatarStateProps) {
		this.delayMs = props.delayMs ?? this.delayMs;
		this.onLoadingStatusChange = props.onLoadingStatusChange ?? this.onLoadingStatusChange;

		$effect.pre(() => {
			if (!this.src) return;
			window.clearTimeout(this.#imageTimerId);
			this.#loadImage(this.src);
		});
	}

	#loadImage(src: string) {
		const image = new Image();
		image.src = src;
		image.onload = () => {
			if (this.delayMs) {
				this.#imageTimerId = window.setTimeout(() => {
					this.loadingStatus = "loaded";
				}, this.delayMs);
			} else {
				this.loadingStatus = "loaded";
			}
		};
		image.onerror = () => {
			this.loadingStatus = "error";
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
	"data-bits-avatar-image": string;
}

class AvatarImageState {
	root: AvatarRootState = undefined as unknown as AvatarRootState;
	attrs: AvatarImageAttrs = $derived({
		style: styleToString({
			display: this.root.loadingStatus === "loaded" ? "block" : "none",
		}),
		"data-bits-avatar-image": "",
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
	"data-bits-avatar-fallback": string;
}

class AvatarFallbackState {
	root: AvatarRootState = undefined as unknown as AvatarRootState;
	attrs: AvatarFallbackAttrs = $derived({
		style: styleToString({
			display: this.root.loadingStatus === "loaded" ? "none" : "block",
		}),
		"data-bits-avatar-fallback": "",
	});

	constructor(root: AvatarRootState) {
		this.root = root;
	}
}

/**
 * CONTEXT METHODS
 */

export const AVATAR_ROOT_KEY = Symbol("Avatar.Root");

export function setAvatarRootState(props: AvatarStateProps) {
	const rootState = new AvatarRootState(props);
	setContext(AVATAR_ROOT_KEY, rootState);
	return rootState;
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
