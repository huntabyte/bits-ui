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
import { CommandFilterProp } from "./extended-types/command/index.js";
import {
	createApiSchema,
	createBooleanProp,
	createCSSVarSchema,
	createDataAttrSchema,
	createFunctionProp,
	createNumberProp,
	createPropSchema,
	createStringProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const root = createApiSchema<CommandRootPropsWithoutHTML>({
	title: "Root",
	description: "The root command component which manages & scopes the state of the command.",
	props: {
		value: createStringProp({
			default: "",
			description: "The value of the command.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: OnStringValueChangeProp,
			description: "A callback that is fired when the command value changes.",
		}),
		label: createStringProp({
			description:
				"An accessible label for the command menu. This is not visible and is only used for screen readers.",
		}),
		filter: createFunctionProp({
			definition: CommandFilterProp,
			description:
				"A custom filter function used to filter items. This function should return a number between `0` and `1`, with `1` being a perfect match, and `0` being no match, resulting in the item being hidden entirely. The items are  sorted/filtered based on this score.",
		}),
		shouldFilter: createBooleanProp({
			default: C.TRUE,
			description:
				"Whether or not the command menu should filter items. This is useful when you want to apply custom filtering logic outside of the Command component.",
		}),
		loop: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the command menu should loop through items when navigating with the keyboard.",
		}),
		disablePointerSelection: createBooleanProp({
			default: C.FALSE,
			description:
				"Set this to true to prevent items from being selected when the users pointer moves over them.",
		}),
		vimBindings: createBooleanProp({
			default: C.TRUE,
			description:
				"Whether VIM bindings should be enabled or not, which allow the user to navigate using ctrl+n/j/p/k",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
		}),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "command-root",
			description: "Present on the root element.",
		}),
	],
});

const input = createApiSchema<CommandInputPropsWithoutHTML>({
	title: "Input",
	description:
		"A representation of the combobox input element, which is typically displayed in the content.",
	props: {
		value: createStringProp({
			description:
				"The value of the search query. This is used to filter items and to search for items.",
			bindable: true,
		}),
		...withChildProps({ elType: "HTMLInputElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "command-input",
			description: "Present on the input element.",
		}),
	],
});

const list = createApiSchema<CommandListPropsWithoutHTML>({
	title: "List",
	description: "The container for the viewport and its items of the command menu.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "command-list",
			description: "Present on the list element.",
		}),
	],
	cssVars: [
		createCSSVarSchema({
			name: "--bits-command-list-height",
			description:
				"The height of the command list element, which is computed by the `Command.Viewport` component.",
		}),
	],
});

const viewport = createApiSchema<CommandViewportPropsWithoutHTML>({
	title: "Viewport",
	description:
		"The viewport component which contains the items of the command menu. This component tracks the height of the viewport and updates the `--bits-command-list-height` CSS variable on the `Command.List` component.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "command-viewport",
			description: "Present on the viewport element.",
		}),
	],
});

const group = createApiSchema<CommandGroupPropsWithoutHTML>({
	title: "Group",
	description: "A group of items within the command menu.",
	props: {
		value: createStringProp({
			description:
				"If a `Command.GroupHeading` is used within this group, the contents of the heading will be used as the value. If the content is dynamic or you wish to have a more specific value, you can provide a unique value for the group here.",
		}),
		forceMount: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the group should always be mounted to the DOM, regardless of the internal filtering logic",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "command-group",
			description: "Present on the group element.",
		}),
	],
});

const groupHeading = createApiSchema<CommandGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description: "A heading for a group of items within the command menu.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "command-group-heading",
			description: "Present on the group heading element.",
		}),
	],
});

const groupItems = createApiSchema<CommandGroupItemsPropsWithoutHTML>({
	title: "GroupItems",
	description: "The container for the items within a group.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "command-group-items",
			description: "Present on the group items element.",
		}),
	],
});

const item = createApiSchema<CommandItemPropsWithoutHTML>({
	title: "Item",
	description:
		"Represents a single item within the command menu. If you wish to render an anchor element to link to a page, use the `Command.LinkItem` component.",
	props: {
		value: createStringProp({
			description: "The value of the item.",
			required: true,
		}),
		keywords: createPropSchema({
			type: "string[]",
			description:
				"An array of additional keywords or aliases that will be used to filter the item.",
		}),
		forceMount: createBooleanProp({
			description:
				"Whether or not the item should always be mounted to the DOM, regardless of the internal filtering logic",
			default: C.FALSE,
		}),
		onSelect: createFunctionProp({
			definition: NoopProp,
			description: "A callback that is fired when the item is selected.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the combobox item is disabled. This will prevent interaction/selection.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the item is disabled.",
		}),
		createDataAttrSchema({
			name: "selected",
			description: "Present when the item is selected.",
		}),
		createDataAttrSchema({
			name: "command-item",
			description: "Present on the item element.",
		}),
	],
});

const linkItem = createApiSchema<CommandLinkItemPropsWithoutHTML>({
	...item,
	title: "LinkItem",
	description:
		"Similar to the `Command.Item` component, but renders an anchor element to take advantage of preloading before navigation.",
});

const empty = createApiSchema<CommandEmptyPropsWithoutHTML>({
	title: "Empty",
	description: "The empty state of the command menu. Shown when there are no items to display.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "command-empty",
			description: "Present on the empty element.",
		}),
	],
});

const loading = createApiSchema<CommandLoadingPropsWithoutHTML>({
	title: "Loading",
	description: "The loading state of the command menu. Shown when the menu is loading items.",
	props: {
		progress: createNumberProp({
			default: "0",
			description: "The progress of the loading state.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "command-loading",
			description: "Present on the loading element.",
		}),
	],
});

const separator = createApiSchema<CommandSeparatorPropsWithoutHTML>({
	title: "Separator",
	description:
		"A visual separator for use between items and groups. Visible when the search query is empty or the `forceMount` prop is `true`.",
	props: {
		forceMount: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the separator should always be mounted to the DOM, regardless of the internal filtering logic",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
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
