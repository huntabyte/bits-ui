import type {
	PaginationNextButtonPropsWithoutHTML,
	PaginationPagePropsWithoutHTML,
	PaginationPrevButtonPropsWithoutHTML,
	PaginationRootPropsWithoutHTML,
} from "bits-ui";
import { pageItemProp, withChildProps } from "./shared.js";
import {
	PaginationChildSnippetProps,
	PaginationChildrenSnippetProps,
	PaginationOnPageChangeProp,
} from "./extended-types/pagination/index.js";
import { OrientationProp } from "./extended-types/shared/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumProp,
	defineFunctionProp,
	defineNumberProp,
	defineSimpleDataAttr,
} from "../utils.js";

export const root = defineComponentApiSchema<PaginationRootPropsWithoutHTML>({
	title: "Root",
	description: "The root pagination component which contains all other pagination components.",
	props: {
		count: defineNumberProp({
			description: "The total number of items.",
			required: true,
		}),
		page: defineNumberProp({
			description:
				"The selected page. You can bind this to a variable to control the selected page from outside the component.",
			bindable: true,
		}),
		onPageChange: defineFunctionProp({
			definition: PaginationOnPageChangeProp,
			description: "A function called when the selected page changes.",
			stringDefinition: "(page: number) => void",
		}),
		perPage: defineNumberProp({
			description: "The number of items per page.",
			default: 1,
		}),
		siblingCount: defineNumberProp({
			description: "The number of page triggers to show on either side of the current page.",
			default: 1,
		}),
		loop: defineBooleanProp({
			default: false,
			description:
				"Whether or not the pagination should loop through the items when reaching the end while navigating with the keyboard.",
		}),
		orientation: defineEnumProp({
			options: ["horizontal", "vertical"],
			default: "horizontal",
			description:
				"The orientation of the pagination. This determines how keyboard navigation will work with the component.",
			definition: OrientationProp,
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			child: {
				definition: PaginationChildSnippetProps,
				stringDefinition: `type Page = {
	type: "page";
	value: number;
};

type Ellipsis = {
	type: "ellipsis";
};

type PageItem = (Page | Ellipsis) & {
	/**  A unique key to be used as the key in a svelte #each block. */
	key: string;
};

type ChildSnippetProps = {
	/** The items to iterate over and render for the pagination component */
	pages: PageItem[];
	/** The range of pages to render */
	range: { start: number; end: number };
	/** The currently active page */
	currentPage: number;
	props: Record<string, unknown>;
};`,
			},
			children: {
				definition: PaginationChildrenSnippetProps,
				stringDefinition: `type Page = {
	type: "page";
	value: number;
};

type Ellipsis = {
	type: "ellipsis";
};

type PageItem = (Page | Ellipsis) & {
	/**  A unique key to be used as the key in a svelte #each block. */
	key: string;
};

type ChildrenSnippetProps = {
	/** The items to iterate over and render for the pagination component */
	pages: PageItem[];
	/** The range of pages to render */
	range: { start: number; end: number };
	/** The currently active page */
	currentPage: number;
};`,
			},
		}),
	},
});

export const page = defineComponentApiSchema<PaginationPagePropsWithoutHTML>({
	title: "Page",
	description: "A button that triggers a page change.",
	props: {
		page: {
			...pageItemProp,
			description: "The page item this component represents.",
		},
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "selected",
			description: "Present on the current page element.",
		}),
		defineSimpleDataAttr({
			name: "pagination-page",
			description: "Present on the page trigger element.",
		}),
	],
});

export const prevButton = defineComponentApiSchema<PaginationPrevButtonPropsWithoutHTML>({
	title: "PrevButton",
	description: "The previous button of the pagination.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "pagination-prev-button",
			description: "Present on the previous button element.",
		}),
	],
});

export const nextButton = defineComponentApiSchema<PaginationNextButtonPropsWithoutHTML>({
	title: "NextButton",
	description: "The next button of the pagination.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "pagination-next-button",
			description: "Present on the next button element.",
		}),
	],
});

export const pagination = [root, page, prevButton, nextButton];
