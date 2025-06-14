import { untrack } from "svelte";
import {
	DOMContext,
	type ReadableBox,
	type WritableBox,
	attachRef,
	type ReadableBoxedValues,
} from "svelte-toolbelt";
import type { HTMLImgAttributes } from "svelte/elements";
import { Context } from "runed";
import type { AvatarImageLoadingStatus } from "./types.js";
import type { WithRefProps } from "$lib/internal/types.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";

const avatarAttrs = createBitsAttrs({
	component: "avatar",
	parts: ["root", "image", "fallback"],
});

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
	readonly opts: AvatarRootStateProps;
	readonly domContext: DOMContext;

	constructor(opts: AvatarRootStateProps) {
		this.opts = opts;
		this.domContext = new DOMContext(this.opts.ref);
		this.loadImage = this.loadImage.bind(this);
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
			imageTimerId = this.domContext.setTimeout(() => {
				this.opts.loadingStatus.current = "loaded";
			}, this.opts.delayMs.current);
		};
		image.onerror = () => {
			this.opts.loadingStatus.current = "error";
		};
		return () => {
			this.domContext.clearTimeout(imageTimerId);
		};
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[avatarAttrs.root]: "",
				"data-status": this.opts.loadingStatus.current,
				...attachRef(this.opts.ref),
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
	readonly opts: AvatarImageStateProps;
	readonly root: AvatarRootState;

	constructor(opts: AvatarImageStateProps, root: AvatarRootState) {
		this.opts = opts;
		this.root = root;

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
				[avatarAttrs.image]: "",
				src: this.opts.src.current,
				crossorigin: this.opts.crossOrigin.current,
				referrerpolicy: this.opts.referrerPolicy.current,
				...attachRef(this.opts.ref),
			}) as const
	);
}

/**
 * FALLBACK
 */

type AvatarFallbackStateProps = WithRefProps;

class AvatarFallbackState {
	readonly opts: AvatarFallbackStateProps;
	readonly root: AvatarRootState;

	constructor(opts: AvatarFallbackStateProps, root: AvatarRootState) {
		this.opts = opts;
		this.root = root;
	}

	style = $derived.by(() =>
		this.root.opts.loadingStatus.current === "loaded" ? { display: "none" } : undefined
	);

	props = $derived.by(
		() =>
			({
				style: this.style,
				"data-status": this.root.opts.loadingStatus.current,
				[avatarAttrs.fallback]: "",
				...attachRef(this.opts.ref),
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
