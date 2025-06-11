import type {
	CommandEmptyPropsWithoutHTML,
	CommandGroupHeadingPropsWithoutHTML,
	CommandGroupItemsPropsWithoutHTML,
	CommandGroupPropsWithoutHTML,
	CommandInputPropsWithoutHTML,
	CommandItemPropsWithoutHTML,
	CommandLinkItemPropsWithoutHTML,
	CommandListPropsWithoutHTML,
	CommandLoadingPropsWithoutHTML,
	CommandRootPropsWithoutHTML,
	CommandSeparatorPropsWithoutHTML,
	CommandViewportPropsWithoutHTML,
} from "bits-ui";
import { NoopProp, OnStringValueChangeProp } from "./extended-types/shared/index.js";
import { CommandFilterProp, CommandOnStateChangeProp } from "./extended-types/command/index.js";
import { withChildProps } from "$lib/content/api-reference/shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineCSSVarSchema,
	defineFunctionProp,
	defineNumberProp,
	defineSimpleDataAttr,
	defineStringProp,
	defineSimplePropSchema,
} from "../utils.js";

const root = defineComponentApiSchema<CommandRootPropsWithoutHTML>({
	title: "Root",
	description: "The main container that manages the overall state and context of the component.",
	props: {
		value: defineStringProp({
			default: "",
			description: "The value of the command.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: OnStringValueChangeProp,
			description: "A callback that is fired when the command value changes.",
			stringDefinition: "(value: string) => void",
		}),
		label: defineStringProp({
			description:
				"An accessible label for the command menu. This is not visible and is only used for screen readers.",
		}),
		filter: defineFunctionProp({
			definition: CommandFilterProp,
			description:
				"A custom filter function used to filter items. This function should return a number between `0` and `1`, with `1` being a perfect match, and `0` being no match, resulting in the item being hidden entirely. The items are  sorted/filtered based on this score.",
			stringDefinition: "(value: string, search: string, keywords?: string[]) => number;",
		}),
		shouldFilter: defineBooleanProp({
			default: true,
			description:
				"Whether or not the command menu should filter items. This is useful when you want to apply custom filtering logic outside of the Command component.",
		}),
		columns: defineNumberProp({
			description: "The number of columns in the grid layout if ",
		}),
		onStateChange: defineFunctionProp({
			definition: CommandOnStateChangeProp,
			description: `A callback that fires when the command's internal state changes. This callback receives a readonly snapshot of the current state.
			The callback is debounced and only fires once per batch of related updates (e.g., when typing triggers filtering and selection changes).`,
			stringDefinition: `type CommandState = {
	/** The value of the search query */
	search: string;
	/** The value of the selected command menu item */
	value: string;
	/** The filtered items */
	filtered: {
		/** The count of all visible items. */
		count: number;
		/** Map from visible item id to its search store. */
		items: Map<string, number>;
		/** Set of groups with at least one visible item. */
		groups: Set<string>;
	};
};

type onStateChange = (state: Readonly<CommandState>) => void;`,
		}),
		loop: defineBooleanProp({
			default: false,
			description:
				"Whether or not the command menu should loop through items when navigating with the keyboard.",
		}),
		disablePointerSelection: defineBooleanProp({
			default: false,
			description:
				"Set this to true to prevent items from being selected when the users pointer moves over them.",
		}),
		vimBindings: defineBooleanProp({
			default: true,
			description:
				"Whether VIM bindings should be enabled or not, which allow the user to navigate using ctrl+n/j/p/k",
		}),
		disableInitialScroll: defineBooleanProp({
			default: false,
			description:
				"Whether to disable scrolling the selected item into view on initial mount. When `true`, prevents automatic scrolling when the command menu first renders and selects its first item, but still allows scrolling on subsequent selections.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
		}),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "command-root",
			description: "Present on the root element.",
		}),
	],
});

const input = defineComponentApiSchema<CommandInputPropsWithoutHTML>({
	title: "Input",
	description: "The text input field where users can type to search or filter commands.",
	props: {
		value: defineStringProp({
			description:
				"The value of the search query. This is used to filter items and to search for items.",
			bindable: true,
		}),
		...withChildProps({ elType: "HTMLInputElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "command-input",
			description: "Present on the input element.",
		}),
	],
});

const list = defineComponentApiSchema<CommandListPropsWithoutHTML>({
	title: "List",
	description: "The container for the viewport, items, and other elements of the command menu.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "command-list",
			description: "Present on the list element.",
		}),
	],
	cssVars: [
		defineCSSVarSchema({
			name: "--bits-command-list-height",
			description:
				"The height of the command list element, which is computed by the `Command.Viewport` component.",
		}),
	],
});

const viewport = defineComponentApiSchema<CommandViewportPropsWithoutHTML>({
	title: "Viewport",
	description:
		"The visible area of the command list, which applies CSS variables to handle dynamic resizing/animations based on the height of the list.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "command-viewport",
			description: "Present on the viewport element.",
		}),
	],
});

const group = defineComponentApiSchema<CommandGroupPropsWithoutHTML>({
	title: "Group",
	description: "A container for a group of items within the command menu.",
	props: {
		value: defineStringProp({
			description:
				"If a `Command.GroupHeading` is used within this group, the contents of the heading will be used as the value. If the content is dynamic or you wish to have a more specific value, you can provide a unique value for the group here.",
		}),
		forceMount: defineBooleanProp({
			default: false,
			description:
				"Whether or not the group should always be mounted to the DOM, regardless of the internal filtering logic",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "command-group",
			description: "Present on the group element.",
		}),
	],
});

const groupHeading = defineComponentApiSchema<CommandGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description: "A heading element to provide an accessible label for a group of items.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "command-group-heading",
			description: "Present on the group heading element.",
		}),
	],
});

const groupItems = defineComponentApiSchema<CommandGroupItemsPropsWithoutHTML>({
	title: "GroupItems",
	description: "The container for the items within a group.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "command-group-items",
			description: "Present on the group items element.",
		}),
	],
});

const item = defineComponentApiSchema<CommandItemPropsWithoutHTML>({
	title: "Item",
	description:
		"Represents a single item within the command menu. If you wish to render an anchor element to link to a page, use the `Command.LinkItem` component.",
	props: {
		value: defineStringProp({
			description: "The value of the item.",
			required: true,
		}),
		keywords: defineSimplePropSchema({
			type: "string[]",
			description:
				"An array of additional keywords or aliases that will be used to filter the item.",
		}),
		forceMount: defineBooleanProp({
			description:
				"Whether or not the item should always be mounted to the DOM, regardless of the internal filtering logic",
			default: false,
		}),
		onSelect: defineFunctionProp({
			definition: NoopProp,
			description: "A callback that is fired when the item is selected.",
			stringDefinition: "() => void",
		}),
		disabled: defineBooleanProp({
			default: false,
			description:
				"Whether or not the combobox item is disabled. This will prevent interaction/selection.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the item is disabled.",
		}),
		defineSimpleDataAttr({
			name: "selected",
			description: "Present when the item is selected.",
		}),
		defineSimpleDataAttr({
			name: "command-item",
			description: "Present on the item element.",
		}),
	],
});

const linkItem = defineComponentApiSchema<CommandLinkItemPropsWithoutHTML>({
	...item,
	title: "LinkItem",
	description:
		"Similar to the `Command.Item` component, but renders an anchor element to take advantage of preloading before navigation.",
});

const empty = defineComponentApiSchema<CommandEmptyPropsWithoutHTML>({
	title: "Empty",
	description: "A component to display when no results are found.",
	props: {
		forceMount: defineBooleanProp({
			default: false,
			description:
				"Whether or not to forcefully mount the empty state, regardless of the internal filtering logic. Useful when you want to handle filtering yourself.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "command-empty",
			description: "Present on the empty element.",
		}),
	],
});

const loading = defineComponentApiSchema<CommandLoadingPropsWithoutHTML>({
	title: "Loading",
	description: "A component to display while results are being fetched or processed.",
	props: {
		progress: defineNumberProp({
			default: 0,
			description: "The progress of the loading state.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "command-loading",
			description: "Present on the loading element.",
		}),
	],
});

const separator = defineComponentApiSchema<CommandSeparatorPropsWithoutHTML>({
	title: "Separator",
	description:
		"A visual separator to divide different sections of the command list. Visible when the search query is empty or the `forceMount` prop is `true`.",
	props: {
		forceMount: defineBooleanProp({
			default: false,
			description:
				"Whether or not the separator should always be mounted to the DOM, regardless of the internal filtering logic",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "command-separator",
			description: "Present on the separator element.",
		}),
	],
});

export const command = [
	root,
	input,
	list,
	viewport,
	group,
	groupHeading,
	groupItems,
	item,
	linkItem,
	empty,
	loading,
	separator,
];
