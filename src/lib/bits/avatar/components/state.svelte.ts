import { styleToString } from "$lib/internal";
import { getContext, setContext } from "svelte";

export type AvatarLoadingStatus = "loading" | "loaded" | "error";

export type AvatarRootStateProps = {
	loadingStatus?: AvatarLoadingStatus;
	delayMs?: number;
};

const defaultAvatarRootStateProps: Required<AvatarRootStateProps> = {
	loadingStatus: "loading",
	delayMs: 0
};

export class AvatarRootState {
	loadingStatus: AvatarLoadingStatus = $state("loading");
	delayMs: number = $state(0);
	fallbackStyle?: string = $state(undefined);
	imageStyle?: string = $state(undefined);

	constructor(props: AvatarRootStateProps = {}) {
		const mergedProps = { ...defaultAvatarRootStateProps, ...props } satisfies AvatarRootStateProps;
		this.loadingStatus = mergedProps.loadingStatus;
		this.delayMs = mergedProps.delayMs;
		this.fallbackStyle = undefined;
		this.imageStyle = styleToString({ display: "none" });

		$effect(() => {
			// If the loading status is "loaded", then we want to show the image
			if (this.loadingStatus === "loaded") {
				this.imageStyle = styleToString({ display: "block" });
				this.fallbackStyle = styleToString({ display: "none" });
			} else {
				// Otherwise, we want to show the fallback
				this.fallbackStyle = styleToString({ display: "block" });
				this.imageStyle = styleToString({ display: "none" });
			}
		});
	}

	initImage(src: string) {
		const image = new Image();
		image.src = src;
		image.onload = () => {
			if (this.delayMs > 0) {
				const timeout = setTimeout(() => {
					this.loadingStatus = "loaded";
				}, this.delayMs);
				return () => window.clearTimeout(timeout);
			} else {
				this.loadingStatus = "loaded";
			}
		};
		image.onerror = () => {
			this.loadingStatus = "error";
		};
	}
}

const AVATAR_ROOT_CONTEXT = "AVATAR_ROOT_CONTEXT";

export type AvatarRootContext = AvatarRootState;

export function setAvatarRootContext(ctx: AvatarRootContext) {
	setContext(AVATAR_ROOT_CONTEXT, ctx);
}

export function getAvatarRootContext(): AvatarRootContext {
	return getContext(AVATAR_ROOT_CONTEXT);
}
