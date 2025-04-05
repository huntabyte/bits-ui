import { untrack } from "svelte";
import { type ReadableBox, type WritableBox, useRefById } from "svelte-toolbelt";
import type { HTMLImgAttributes } from "svelte/elements";
import { Context } from "runed";
import type { AvatarImageLoadingStatus } from "./types.js";
import type { ReadableBoxedValues } from "$lib/internal/box.svelte.js";
import type { WithRefProps } from "$lib/internal/types.js";

const AVATAR_ROOT_ATTR = "data-avatar-root";
const AVATAR_IMAGE_ATTR = "data-avatar-image";
const AVATAR_FALLBACK_ATTR = "data-avatar-fallback";

type CrossOrigin = HTMLImgAttributes["crossorigin"];
type ReferrerPolicy = HTMLImgAttributes["referrerpolicy"];

/**
 * ROOT
 */
type AvatarRootStateProps = WithRefProps<{
	delayMs: ReadableBox<number>;
	loadingStatus: WritableBox<AvatarImageLoadingStatus>;
}>;

type AvatarImageSrc = string | null | undefined;

class AvatarRootState {
	constructor(readonly opts: AvatarRootStateProps) {
		this.loadImage = this.loadImage.bind(this);
		useRefById(opts);
	}

	loadImage(src: string, crossorigin?: CrossOrigin, referrerPolicy?: ReferrerPolicy) {
		if (this.opts.loadingStatus.current === "loaded") return;
		let imageTimerId: number;
		const image = new Image();

		image.src = src;
		if (crossorigin !== undefined) image.crossOrigin = crossorigin;
		if (referrerPolicy) image.referrerPolicy = referrerPolicy;

		this.opts.loadingStatus.current = "loading";
		image.onload = () => {
			imageTimerId = window.setTimeout(() => {
				this.opts.loadingStatus.current = "loaded";
			}, this.opts.delayMs.current);
		};
		image.onerror = () => {
			this.opts.loadingStatus.current = "error";
		};
		return () => {
			window.clearTimeout(imageTimerId);
		};
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[AVATAR_ROOT_ATTR]: "",
				"data-status": this.opts.loadingStatus.current,
			}) as const
	);
}

/**
 * IMAGE
 */

type AvatarImageStateProps = WithRefProps<
	ReadableBoxedValues<{
		src: AvatarImageSrc;
		crossOrigin: CrossOrigin;
		referrerPolicy: ReferrerPolicy;
	}>
>;

class AvatarImageState {
	constructor(
		readonly opts: AvatarImageStateProps,
		readonly root: AvatarRootState
	) {
		useRefById(opts);

		$effect.pre(() => {
			if (!this.opts.src.current) {
				this.root.opts.loadingStatus.current = "error";
				return;
			}
			// dependency on crossorigin
			this.opts.crossOrigin.current;
			untrack(() =>
				this.root.loadImage(
					this.opts.src.current ?? "",
					this.opts.crossOrigin.current,
					this.opts.referrerPolicy.current
				)
			);
		});
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				style: {
					display: this.root.opts.loadingStatus.current === "loaded" ? "block" : "none",
				},
				"data-status": this.root.opts.loadingStatus.current,
				[AVATAR_IMAGE_ATTR]: "",
				src: this.opts.src.current,
				crossorigin: this.opts.crossOrigin.current,
				referrerpolicy: this.opts.referrerPolicy.current,
			}) as const
	);
}

/**
 * FALLBACK
 */

type AvatarFallbackStateProps = WithRefProps;

class AvatarFallbackState {
	constructor(
		readonly opts: AvatarFallbackStateProps,
		readonly root: AvatarRootState
	) {
		useRefById(opts);
	}

	style = $derived.by(() => {
		return this.root.opts.loadingStatus.current === "loaded" ? { display: "none" } : undefined;
	});

	props = $derived.by(
		() =>
			({
				style: this.style,
				"data-status": this.root.opts.loadingStatus.current,
				[AVATAR_FALLBACK_ATTR]: "",
			}) as const
	);
}

const AvatarRootContext = new Context<AvatarRootState>("Avatar.Root");

export function useAvatarRoot(props: AvatarRootStateProps) {
	return AvatarRootContext.set(new AvatarRootState(props));
}

export function useAvatarImage(props: AvatarImageStateProps) {
	return new AvatarImageState(props, AvatarRootContext.get());
}

export function useAvatarFallback(props: AvatarFallbackStateProps) {
	return new AvatarFallbackState(props, AvatarRootContext.get());
}
