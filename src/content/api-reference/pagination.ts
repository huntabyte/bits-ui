import type { APISchema } from "@/types";
import type * as Pagination from "$lib/bits/pagination/_types.js";
import { asChild } from "@/content/api-reference/helpers.js"
import { builderAndAttrsSlotProps } from "./helpers";

// TODO: fill missing content
export const root: APISchema<Pagination.Props> = {
	title: "Root",
	description: "The root pagination component which contains all other pagination components."
};

export const pageTrigger: APISchema<Pagination.PageProps> = {
	title: "PageTrigger",
	description: "A button that triggers page change",
	props: {
		asChild,
		page: {
			type: "PageItem",
			description: "The current page."
		}
	},
	slotProps: {
		...builderAndAttrsSlotProps
	},
	dataAttributes: [
		{
			name: "pagination-prev-button",
			description: "Present on the prev button element."
		}
	]
};

export const prevButton: APISchema<Pagination.PrevButtonProps> = {
	title: "PrevButton",
	description: "The previous button of the pagination.",
	props: {
		asChild
	},
	slotProps: {
		...builderAndAttrsSlotProps
	},
	dataAttributes: [
		{
			name: "pagination-prev-button",
			description: "Present on the prev button element."
		}
	]
};

export const nextButton: APISchema<Pagination.NextButtonProps> = {
	title: "NextButton",
	description: "The next button of the pagination.",
	props: {
		asChild
	},
	slotProps: {
		...builderAndAttrsSlotProps
	},
	dataAttributes: [
		{
			name: "pagination-prev-button",
			description: "Present on the prev button element."
		}
	]
};

export const pagination = [root, pageTrigger, prevButton, nextButton];
