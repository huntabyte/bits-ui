import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createAvatar, type CreateAvatarProps, type Avatar as AvatarReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

const NAME = "avatar";
const PARTS = ["root", "image", "fallback"] as const;

export const getAttrs = createBitAttrs(NAME, PARTS);

export function setCtx(props: CreateAvatarProps) {
	const avatar = createAvatar(removeUndefined(props));
	setContext(NAME, avatar);
	return {
		...avatar,
		updateOption: getOptionUpdater(avatar.options)
	};
}

export function getImage(src: string | undefined | null = "") {
	const avatar = getContext<AvatarReturn>(NAME);
	if (!src) {
		avatar.options.src.set("");
	} else {
		avatar.options.src.set(src);
	}
	return avatar;
}

export function getCtx() {
	return getContext<AvatarReturn>(NAME);
}
