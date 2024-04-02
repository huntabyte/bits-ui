import type {
	ScrollAreaContentPropsWithoutHTML,
	ScrollAreaCornerPropsWithoutHTML,
	ScrollAreaPropsWithoutHTML,
	ScrollAreaScrollbarPropsWithoutHTML,
	ScrollAreaThumbPropsWithoutHTML,
	ScrollAreaViewportPropsWithoutHTML,
} from "bits-ui";
import { builderAndAttrsSlotProps, domElProps, enums } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<ScrollAreaPropsWithoutHTML> = {
	title: "Root",
	description:
		"The container of all scroll area components. Overflow is hidden on this element to prevent double scrollbars.",
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

export const viewport: APISchema<ScrollAreaViewportPropsWithoutHTML> = {
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

export const content: APISchema<ScrollAreaContentPropsWithoutHTML> = {
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

export const scrollbar: APISchema<ScrollAreaScrollbarPropsWithoutHTML> = {
	title: "Scrollbar",
	description: "A scrollbar of the scroll area.",
	props: {
		orientation: {
			type: {
				type: C.ENUM,
				definition: enums("horizontal", "vertical"),
			},
			description: "The orientation of the scrollbar.",
			required: true,
		},
		...domElProps("HTMLDivElement"),
	},
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
			description: "Present on `'horizontal'` scrollbar element.",
		},
		{
			name: "scroll-area-scrollbar-y",
			description: "Present on the `'vertical'` scrollbar element.",
		},
	],
};

export const thumb: APISchema<ScrollAreaThumbPropsWithoutHTML> = {
	title: "Thumb",
	description: "A thumb of a scrollbar in the scroll area.",
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
			description: "Present on `'horizontal'` thumb element.",
		},
		{
			name: "scroll-area-thumb-y",
			description: "Present on the `'vertical'` thumb element.",
		},
	],
};

export const corner: APISchema<ScrollAreaCornerPropsWithoutHTML> = {
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

export const scrollArea = [root, viewport, content, scrollbar, thumb, corner];
