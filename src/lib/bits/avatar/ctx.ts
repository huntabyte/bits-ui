import { createBitAttrs, getOptionUpdater, removeUndefined } from "$lib/internal/index.js";
import { createAvatar, type CreateAvatarProps, type Avatar as AvatarReturn } from "@melt-ui/svelte";
import { getContext, setContext } from "svelte";

export function getAvatarData() {
	const NAME = "avatar" as const;
	const PARTS = ["root", "image", "fallback"] as const;

	return {
		NAME,
		PARTS,
	};
}

type GetReturn = Omit<ReturnType<typeof setCtx>, "updateOption">;

export function setCtx(props: CreateAvatarProps) {
	const { NAME, PARTS } = getAvatarData();
	const getAttrs = createBitAttrs(NAME, PARTS);
	const avatar = { ...createAvatar(removeUndefined(props)), getAttrs };

	setContext(NAME, avatar);
	return {
		...avatar,
		updateOption: getOptionUpdater(avatar.options),
	};
}

export function getImage(src: string | undefined | null = "") {
	const { NAME } = getAvatarData();
	const avatar = getContext<AvatarReturn>(NAME);
	if (!src) {
		avatar.options.src.set("");
	} else {
		avatar.options.src.set(src);
	}
	return avatar;
}

export function getCtx() {
	const { NAME } = getAvatarData();
	return getContext<GetReturn>(NAME);
}
