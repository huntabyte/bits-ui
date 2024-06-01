import { untrack } from "svelte";
import type { ReadableBox, WritableBox } from "svelte-toolbelt";
import type { AvatarImageLoadingStatus } from "./types.js";
import { createContext } from "$lib/internal/createContext.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";

const ROOT_ATTR = "data-avatar-root";
const IMAGE_ATTR = "data-avatar-image";
const FALLBACK_ATTR = "data-avatar-fallback";

/**
 * ROOT
 */
type AvatarRootStateProps = {
	delayMs: ReadableBox<number>;
	loadingStatus: WritableBox<AvatarImageLoadingStatus>;
};

type AvatarImageSrc = string | null | undefined;

class AvatarRootState {
	delayMs: AvatarRootStateProps["delayMs"];
	loadingStatus: AvatarRootStateProps["loadingStatus"];
	props = $derived.by(
		() =>
			({
				[ROOT_ATTR]: "",
				"data-status": this.loadingStatus.value,
			}) as const
	);

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

type AvatarImageStateProps = ReadableBoxedValues<{
	src: AvatarImageSrc;
}>;

class AvatarImageState {
	src: AvatarImageStateProps["src"];
	root: AvatarRootState;
	props = $derived.by(
		() =>
			({
				style: {
					display: this.root.loadingStatus.value === "loaded" ? "block" : "none",
				},
				[IMAGE_ATTR]: "",
				src: this.src.value,
			}) as const
	);

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
	root: AvatarRootState;
	props = $derived.by(
		() =>
			({
				style: {
					display: this.root.loadingStatus.value === "loaded" ? "none" : "block",
				},
				[FALLBACK_ATTR]: "",
			}) as const
	);

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
