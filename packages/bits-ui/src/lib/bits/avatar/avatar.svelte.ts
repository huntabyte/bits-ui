import { untrack } from "svelte";
import type { AvatarImageLoadingStatus } from "./types.js";
import type { Box, ReadonlyBox, ReadonlyBoxedValues } from "$lib/internal/box.svelte.js";
import { createContext } from "$lib/internal/createContext.js";

/**
 * ROOT
 */
type AvatarRootStateProps = {
	delayMs: ReadonlyBox<number>;
	loadingStatus: Box<AvatarImageLoadingStatus>;
};

type AvatarImageSrc = string | null | undefined;

class AvatarRootState {
	delayMs = undefined as unknown as AvatarRootStateProps["delayMs"];
	loadingStatus = undefined as unknown as AvatarRootStateProps["loadingStatus"];
	props = $derived({
		"data-avatar-root": "",
		"data-status": this.loadingStatus.value,
	} as const);

	constructor(props: AvatarRootStateProps) {
		this.delayMs = props.delayMs;
		this.loadingStatus = props.loadingStatus;
	}

	loadImage(src: string) {
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
		return () => {
			clearTimeout(imageTimerId);
		};
	}

	createImage(props: AvatarImageStateProps) {
		return new AvatarImageState(props, this);
	}

	createFallback() {
		return new AvatarFallbackState(this);
	}
}

/**
 * IMAGE
 */

type AvatarImageStateProps = ReadonlyBoxedValues<{
	src: AvatarImageSrc;
}>;

class AvatarImageState {
	src = undefined as unknown as AvatarImageStateProps["src"];
	root = undefined as unknown as AvatarRootState;
	props = $derived({
		style: {
			display: this.root.loadingStatus.value === "loaded" ? "block" : "none",
		},
		"data-avatar-image": "",
		src: this.src.value,
	});

	constructor(props: AvatarImageStateProps, root: AvatarRootState) {
		this.root = root;
		this.src = props.src;

		$effect.pre(() => {
			if (!this.src.value) return;
			untrack(() => this.root.loadImage(this.src.value ?? ""));
		});
	}
}

/**
 * FALLBACK
 */

class AvatarFallbackState {
	root = undefined as unknown as AvatarRootState;
	props = $derived({
		style: {
			display: this.root.loadingStatus.value === "loaded" ? "none" : "block",
		},
		"data-avatar-fallback": "",
	} as const);

	constructor(root: AvatarRootState) {
		this.root = root;
	}
}

/**
 * CONTEXT METHODS
 */

const [setAvatarRootContext, getAvatarRootContext] = createContext<AvatarRootState>("Avatar.Root");

export function useAvatarRoot(props: AvatarRootStateProps) {
	return setAvatarRootContext(new AvatarRootState(props));
}

export function useAvatarImage(props: AvatarImageStateProps) {
	return getAvatarRootContext().createImage(props);
}

export function useAvatarFallback() {
	return getAvatarRootContext().createFallback();
}
