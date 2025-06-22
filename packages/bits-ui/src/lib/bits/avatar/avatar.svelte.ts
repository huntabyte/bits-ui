import {
	DOMContext,
	type ReadableBox,
	type WritableBox,
	attachRef,
	type ReadableBoxedValues,
} from "svelte-toolbelt";
import type { HTMLImgAttributes } from "svelte/elements";
import { Context, watch } from "runed";
import type { AvatarImageLoadingStatus } from "./types.js";
import type { RefAttachment, WithRefOpts } from "$lib/internal/types.js";
import { createBitsAttrs } from "$lib/internal/attrs.js";

const avatarAttrs = createBitsAttrs({
	component: "avatar",
	parts: ["root", "image", "fallback"],
});

type CrossOrigin = HTMLImgAttributes["crossorigin"];
type ReferrerPolicy = HTMLImgAttributes["referrerpolicy"];
type AvatarImageSrc = string | null | undefined;

interface AvatarRootStateOpts extends WithRefOpts {
	delayMs: ReadableBox<number>;
	loadingStatus: WritableBox<AvatarImageLoadingStatus>;
}

const AvatarRootContext = new Context<AvatarRootState>("Avatar.Root");

export class AvatarRootState {
	static create(opts: AvatarRootStateOpts) {
		return AvatarRootContext.set(new AvatarRootState(opts));
	}

	readonly opts: AvatarRootStateOpts;
	readonly domContext: DOMContext;
	readonly attachment: RefAttachment;

	constructor(opts: AvatarRootStateOpts) {
		this.opts = opts;
		this.domContext = new DOMContext(this.opts.ref);
		this.loadImage = this.loadImage.bind(this);
		this.attachment = attachRef(this.opts.ref);
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
			if (!imageTimerId) return;
			this.domContext.clearTimeout(imageTimerId);
		};
	}

	props = $derived.by(
		() =>
			({
				id: this.opts.id.current,
				[avatarAttrs.root]: "",
				"data-status": this.opts.loadingStatus.current,
				...this.attachment,
			}) as const
	);
}

interface AvatarImageStateOpts
	extends WithRefOpts,
		ReadableBoxedValues<{
			src: AvatarImageSrc;
			crossOrigin: CrossOrigin;
			referrerPolicy: ReferrerPolicy;
		}> {}

export class AvatarImageState {
	static create(opts: AvatarImageStateOpts) {
		return new AvatarImageState(opts, AvatarRootContext.get());
	}
	readonly opts: AvatarImageStateOpts;
	readonly root: AvatarRootState;
	readonly attachment: RefAttachment;

	constructor(opts: AvatarImageStateOpts, root: AvatarRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);

		watch.pre(
			[() => this.opts.src.current, () => this.opts.crossOrigin.current],
			([src, crossOrigin]) => {
				if (!src) {
					this.root.opts.loadingStatus.current = "error";
					return;
				}
				this.root.loadImage(src, crossOrigin, this.opts.referrerPolicy.current);
			}
		);
	}

	readonly props = $derived.by(
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
				...this.attachment,
			}) as const
	);
}

interface AvatarFallbackStateOpts extends WithRefOpts {}
export class AvatarFallbackState {
	static create(opts: AvatarFallbackStateOpts) {
		return new AvatarFallbackState(opts, AvatarRootContext.get());
	}

	readonly opts: AvatarFallbackStateOpts;
	readonly root: AvatarRootState;
	readonly attachment: RefAttachment;

	constructor(opts: AvatarFallbackStateOpts, root: AvatarRootState) {
		this.opts = opts;
		this.root = root;
		this.attachment = attachRef(this.opts.ref);
	}

	readonly style = $derived.by(() =>
		this.root.opts.loadingStatus.current === "loaded" ? { display: "none" } : undefined
	);

	readonly props = $derived.by(
		() =>
			({
				style: this.style,
				"data-status": this.root.opts.loadingStatus.current,
				[avatarAttrs.fallback]: "",
				...this.attachment,
			}) as const
	);
}
