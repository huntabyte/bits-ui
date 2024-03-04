import type { APISchema } from "@/types/index.js";
import { builderAndAttrsSlotProps, domElProps, enums } from "@/content/api-reference/helpers.js";
import type * as ScrollArea from "$lib/bits/scroll-area/_types.js";
import * as C from "@/content/constants.js";

export const root: APISchema<ScrollArea.Props> = {
	title: "Root",
	description: "The container of all scroll area components.",
	props: {
		type: {
			type: {
				type: C.ENUM,
				definition: enums("hover", "scroll", "auto", "always"),
			},
			description: "The type of scroll area.",
		},
		hideDelay: {
			type: "number",
			description:
				"The delay in milliseconds before the scroll area hides itself when using `'hover'` or `'scroll'` type.",
			default: "600",
		},
		dir: {
			type: {
				type: C.ENUM,
				definition: enums("ltr", "rtl"),
			},
			description: "The reading direction of the scroll area.",
		},
		...domElProps("HTMLDivElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "scroll-area-root",
			description: "Present on the root element.",
		},
	],
};

export const viewport: APISchema<ScrollArea.ViewportProps> = {
	title: "Viewport",
	description:
		"The component which wraps the content and is responsible for computing the scroll area size.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "scroll-area-viewport",
			description: "Present on the viewport element.",
		},
	],
};

export const content: APISchema<ScrollArea.ContentProps> = {
	title: "Content",
	description: "The scrollable content of the scroll area.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "scroll-area-content",
			description: "Present on the content element.",
		},
	],
};

export const scrollbarX: APISchema<ScrollArea.ScrollbarXProps> = {
	title: "ScrollbarX",
	description: "The horizontal scrollbar of the scroll area.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			description: "The visibility state of the scrollbar",
			value: enums("visible", "hidden"),
			isEnum: true,
		},
		{
			name: "scroll-area-scrollbar-x",
			description: "Present on the X scrollbar element.",
		},
	],
};

export const scrollbarY: APISchema<ScrollArea.ScrollbarYProps> = {
	title: "ScrollbarY",
	description: "The vertical scrollbar of the scroll area.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			description: "The visibility state of the scrollbar",
			value: enums("visible", "hidden"),
			isEnum: true,
		},
		{
			name: "scroll-area-scrollbar-y",
			description: "Present on the Y scrollbar element.",
		},
	],
};

export const thumbX: APISchema<ScrollArea.ThumbXProps> = {
	title: "ThumbX",
	description: "The thumb of the X scrollbar.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			description: "The visibility state of the scrollbar",
			value: enums("visible", "hidden"),
			isEnum: true,
		},
		{
			name: "scroll-area-thumb-x",
			description: "Present on the X thumb element.",
		},
	],
};

export const thumbY: APISchema<ScrollArea.ThumbYProps> = {
	title: "ThumbY",
	description: "The thumb of the Y scrollbar.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			description: "The visibility state of the scrollbar",
			value: enums("visible", "hidden"),
			isEnum: true,
		},
		{
			name: "scroll-area-thumb-y",
			description: "Present on the Y thumb element.",
		},
	],
};

export const corner: APISchema<ScrollArea.CornerProps> = {
	title: "Corner",
	description: "The corner element between the X and Y scrollbars.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "scroll-area-corner",
			description: "Present on the corner element.",
		},
	],
};

export const scrollArea = [root, viewport, content, scrollbarX, scrollbarY, thumbX, thumbY, corner];
