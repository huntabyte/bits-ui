import type { APISchema } from "@/types";
import { attrsSlotProp, enums } from "@/content/api-reference/helpers.js";
import type * as Avatar from "$lib/bits/avatar/_types";
import * as C from "@/content/constants.js";
import { builderAndAttrsSlotProps, domElProps } from "./helpers";

export const root: APISchema<Avatar.Props> = {
	title: "Root",
	description: "The root component used to set and manage the state of the avatar.",
	props: {
		delayMs: {
			type: C.NUMBER,
			default: "0",
			description:
				"How long to wait before showing the image after it has loaded. This can be useful to prevent a harsh flickering effect when the image loads quickly."
		},
		loadingStatus: {
			type: {
				type: "LoadingStatus",
				definition: enums("loading", "loaded", "error")
			},
			description:
				"The loading status of the avatars source image. You can bind a variable to track the status outside of the component and use it to show a loading indicator or error message."
		},
		onLoadingStatusChange: {
			type: {
				type: C.FUNCTION,
				definition: "(status: LoadingStatus) => void"
			},
			description: "A callback function called when the loading status of the image changes."
		},
		...domElProps("HTMLDivElement")
	},
	slotProps: {
		attrs: attrsSlotProp
	},
	dataAttributes: [
		{
			name: "avatar-root",
			description: "Present on the root element."
		}
	]
};

export const image: APISchema<Avatar.ImageProps> = {
	title: "Image",
	description: "The avatar image displayed once it has loaded.",
	props: domElProps("HTMLImageElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "avatar-image",
			description: "Present on the image element."
		}
	]
};

export const fallback: APISchema<Avatar.FallbackProps> = {
	title: "Fallback",
	description: "The fallback displayed while the avatar image is loading or if it fails to load",
	props: domElProps("HTMLSpanElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "avatar-fallback",
			description: "Present on the fallback element."
		}
	]
};

export const avatar = [root, image, fallback];
