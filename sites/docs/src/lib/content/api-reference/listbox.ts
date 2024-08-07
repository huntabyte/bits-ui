import type {
	ListboxArrowPropsWithoutHTML,
	ListboxContentPropsWithoutHTML,
	ListboxGroupLabelPropsWithoutHTML,
	ListboxGroupPropsWithoutHTML,
	ListboxItemPropsWithoutHTML,
	ListboxRootPropsWithoutHTML,
	ListboxScrollDownButtonPropsWithoutHTML,
	ListboxScrollUpButtonPropsWithoutHTML,
	ListboxTriggerPropsWithoutHTML,
	ListboxViewportPropsWithoutHTML,
} from "bits-ui";
import {
	NoopProp,
	OnChangeStringOrArrayProp,
	OnOpenChangeProp,
	OpenChildSnippetProps,
	OpenChildrenSnippetProps,
	OpenClosedProp,
	SingleOrMultipleProp,
	StringOrArrayStringProp,
} from "./extended-types/shared/index.js";
import { ComboboxScrollAlignmentProp } from "./extended-types/combobox/index.js";
import {
	arrowProps,
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
	createCSSVarSchema,
	createDataAttrSchema,
	createEnumDataAttr,
	createEnumProp,
	createFunctionProp,
	createStringProp,
	createUnionProp,
	dirProp,
	dismissableLayerProps,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	preventOverflowTextSelectionProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const stateDataAttr = createEnumDataAttr({
	name: "state",
	options: ["open", "closed"],
	description: "The listbox's open state.",
	definition: OpenClosedProp,
});

export const root = createApiSchema<ListboxRootPropsWithoutHTML>({
	title: "Root",
	description: "The root listbox component which manages & scopes the state of the listbox.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			description: "The type of selection to use for the listbox.",
			required: true,
			definition: SingleOrMultipleProp,
		}),
		value: createUnionProp({
			options: ["string", "string[]"],
			default: "",
			description:
				"The value of the listbox. When the type is `'single'`, this should be a string. When the type is `'multiple'`, this should be an array of strings.",
			bindable: true,
			definition: StringOrArrayStringProp,
		}),
		onValueChange: createFunctionProp({
			definition: OnChangeStringOrArrayProp,
			description:
				"A callback that is fired when the listbox value changes. When the type is `'single'`, the argument will be a string. When the type is `'multiple'`, the argument will be an array of strings.",
		}),
		open: createBooleanProp({
			default: C.FALSE,
			description: "The open state of the listbox menu.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: OnOpenChangeProp,
			description: "A callback that is fired when the listbox menu's open state changes.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the listbox component is disabled.",
		}),
		name: createStringProp({
			description:
				"The name to apply to the hidden input element for form submission. If provided, a hidden input element will be rendered to submit the value of the listbox.",
		}),
		required: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the listbox menu is required.",
		}),
		scrollAlignment: createEnumProp({
			options: ["nearest", "center"],
			default: "'nearest'",
			description: "The alignment of the highlighted item when scrolling.",
			definition: ComboboxScrollAlignmentProp,
		}),
		loop: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the listbox menu should loop through items.",
		}),
		children: childrenSnippet(),
	},
});

export const content = createApiSchema<ListboxContentPropsWithoutHTML>({
	title: "Content",
	description: "The element which contains the listbox's items.",
	props: {
		...floatingProps(),
		...escapeLayerProps,
		...dismissableLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		loop: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the listbox should loop through items when reaching the end.",
		}),
		forceMount: forceMountProp,
		...withChildProps({
			elType: "HTMLDivElement",
			childrenDef: OpenChildrenSnippetProps,
			childDef: OpenChildSnippetProps,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "listbox-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: [
		createCSSVarSchema({
			name: "--bits-listbox-content-transform-origin",
			description: "The transform origin of the listbox content element.",
		}),
		createCSSVarSchema({
			name: "--bits-listbox-content-available-width",
			description: "The available width of the listbox content element.",
		}),
		createCSSVarSchema({
			name: "--bits-listbox-content-available-height",
			description: "The available height of the listbox content element.",
		}),
		createCSSVarSchema({
			name: "--bits-listbox-trigger-width",
			description: "The width of the listbox trigger element.",
		}),
		createCSSVarSchema({
			name: "--bits-listbox-trigger-height",
			description: "The height of the listbox trigger element.",
		}),
	],
});

export const item = createApiSchema<ListboxItemPropsWithoutHTML>({
	title: "Item",
	description: "A listbox item, which must be a child of the `Listbox.Content` component.",
	props: {
		value: createStringProp({
			description: "The value of the item.",
			required: true,
		}),
		label: createStringProp({
			description:
				"The label of the item, which is what the list will be filtered by using typeahead behavior.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the listbox item is disabled. This will prevent interaction/selection.",
		}),
		onHighlight: createFunctionProp({
			definition: NoopProp,
			description: "A callback that is fired when the item is highlighted.",
		}),
		onUnhighlight: createFunctionProp({
			definition: NoopProp,
			description: "A callback that is fired when the item is unhighlighted.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "value",
			description: "The value of the listbox item.",
			value: "string",
		}),
		createDataAttrSchema({
			name: "label",
			description: "The label of the listbox item.",
			value: "string",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the item is disabled.",
		}),
		createDataAttrSchema({
			name: "highlighted",
			description:
				"Present when the item is highlighted, which is either via keyboard navigation of the menu or hover.",
		}),
		createDataAttrSchema({
			name: "selected",
			description: "Present when the item is selected.",
		}),
		createDataAttrSchema({
			name: "listbox-item",
			description: "Present on the item element.",
		}),
	],
});

export const trigger = createApiSchema<ListboxTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "A button which toggles the listbox's open state.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		createEnumDataAttr({
			name: "state",
			options: ["open", "closed"],
			description: "The listbox's open state.",
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the listbox is disabled.",
		}),
		createDataAttrSchema({
			name: "listbox-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const viewport = createApiSchema<ListboxViewportPropsWithoutHTML>({
	title: "Viewport",
	description:
		"An optional element to track the scroll position of the listbox for rendering the scroll up/down buttons.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "listbox-viewport",
			description: "Present on the viewport element.",
		}),
	],
});

export const scrollUpButton = createApiSchema<ListboxScrollUpButtonPropsWithoutHTML>({
	title: "ScrollUpButton",
	description:
		"An optional scroll up button element to improve the scroll experience within the listbox. Should be used in conjunction with the `Listbox.Viewport` component.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "listbox-scroll-up-button",
			description: "Present on the scroll up button element.",
		}),
	],
});

export const scrollDownButton = createApiSchema<ListboxScrollDownButtonPropsWithoutHTML>({
	title: "ScrollDownButton",
	description:
		"An optional scroll down button element to improve the scroll experience within the listbox. Should be used in conjunction with the `Listbox.Viewport` component.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "listbox-scroll-down-button",
			description: "Present on the scroll down button element.",
		}),
	],
});

export const group = createApiSchema<ListboxGroupPropsWithoutHTML>({
	title: "Group",
	description: "A group of related listbox items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "listbox-group",
			description: "Present on the group element.",
		}),
	],
});

export const groupLabel = createApiSchema<ListboxGroupLabelPropsWithoutHTML>({
	title: "GroupLabel",
	description:
		"A label for the parent listbox group. This is used to describe a group of related listbox items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "listbox-group-label",
			description: "Present on the group label element.",
		}),
	],
});

export const arrow = createApiSchema<ListboxArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the content when open.",
	props: arrowProps,
	dataAttributes: [
		createDataAttrSchema({
			name: "arrow",
			description: "Present on the arrow element.",
		}),
	],
});

export const listbox = [
	root,
	trigger,
	content,
	item,
	viewport,
	scrollUpButton,
	scrollDownButton,
	group,
	groupLabel,
	arrow,
];
