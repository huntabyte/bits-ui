import type {
	ComboboxArrowPropsWithoutHTML,
	ComboboxContentPropsWithoutHTML,
	ComboboxContentStaticPropsWithoutHTML,
	ComboboxGroupHeadingPropsWithoutHTML,
	ComboboxGroupPropsWithoutHTML,
	ComboboxInputPropsWithoutHTML,
	ComboboxItemPropsWithoutHTML,
	ComboboxPortalPropsWithoutHTML,
	ComboboxRootPropsWithoutHTML,
	ComboboxTriggerPropsWithoutHTML,
	ComboboxViewportPropsWithoutHTML,
	SelectScrollDownButtonPropsWithoutHTML,
	SelectScrollUpButtonPropsWithoutHTML,
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
import { DelayProp, ItemsProp } from "./extended-types/select/index.js";
import { FloatingContentChildSnippetProps } from "./extended-types/floating/index.js";
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
	createPropSchema,
	createStringProp,
	createUnionProp,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const stateDataAttr = createEnumDataAttr({
	name: "state",
	options: ["open", "closed"],
	description: "The combobox's open state.",
	definition: OpenClosedProp,
});

export const root = createApiSchema<ComboboxRootPropsWithoutHTML>({
	title: "Root",
	description: "The root combobox component which manages & scopes the state of the combobox.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			description: "The type of combobox.",
			required: true,
			definition: SingleOrMultipleProp,
		}),
		value: createUnionProp({
			options: ["string", "string[]"],
			default: "",
			description:
				"The value of the combobox. When the type is `'single'`, this should be a string. When the type is `'multiple'`, this should be an array of strings.",
			bindable: true,
			definition: StringOrArrayStringProp,
		}),
		onValueChange: createFunctionProp({
			definition: OnChangeStringOrArrayProp,
			description:
				"A callback that is fired when the combobox value changes. When the type is `'single'`, the argument will be a string. When the type is `'multiple'`, the argument will be an array of strings.",
			stringDefinition: "(string) => void | (string[]) => void",
		}),
		open: createBooleanProp({
			default: C.FALSE,
			description: "The open state of the combobox menu.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: OnOpenChangeProp,
			description: "A callback that is fired when the combobox menu's open state changes.",
			stringDefinition: "(open: boolean) => void",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the combobox component is disabled.",
		}),
		name: createStringProp({
			description:
				"The name to apply to the hidden input element for form submission. If provided, a hidden input element will be rendered to submit the value of the combobox.",
		}),
		required: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the combobox menu is required.",
		}),
		scrollAlignment: createEnumProp({
			options: ["nearest", "center"],
			default: "'nearest'",
			description: "The alignment of the highlighted item when scrolling.",
			definition: ComboboxScrollAlignmentProp,
		}),
		loop: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the combobox menu should loop through items.",
		}),
		allowDeselect: createBooleanProp({
			default: C.TRUE,
			description:
				"Whether or not the user can deselect the selected item by pressing it in a single select.",
		}),
		items: createPropSchema({
			type: {
				type: "array",
				definition: ItemsProp,
				stringDefinition: `{ value: string; label: string; disabled?: boolean}[]`,
			},
			description:
				"Optionally provide an array of objects representing the items in the select for autofill capabilities. Only applicable to combobox's with type `single`",
		}),
		inputValue: createStringProp({
			description:
				"A read-only value that controls the text displayed in the combobox input. Use this to programmatically update the input value when the selection changes outside the component, ensuring the displayed text stays in sync with the actual value.",
		}),
		children: childrenSnippet(),
	},
});

export const content = createApiSchema<ComboboxContentPropsWithoutHTML>({
	title: "Content",
	description: "The element which contains the combobox's items.",
	props: {
		...floatingProps(),
		...escapeLayerProps,
		...dismissibleLayerProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		loop: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the combobox should loop through items when reaching the end.",
		}),
		forceMount: forceMountProp,
		preventScroll: {
			...preventScrollProp,
			default: C.FALSE,
		},
		...withChildProps({
			elType: "HTMLDivElement",
			childrenDef: OpenChildrenSnippetProps,
			childDef: FloatingContentChildSnippetProps,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "combobox-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: [
		createCSSVarSchema({
			name: "--bits-combobox-content-transform-origin",
			description: "The transform origin of the combobox content element.",
		}),
		createCSSVarSchema({
			name: "--bits-combobox-content-available-width",
			description: "The available width of the combobox content element.",
		}),
		createCSSVarSchema({
			name: "--bits-combobox-content-available-height",
			description: "The available height of the combobox content element.",
		}),
		createCSSVarSchema({
			name: "--bits-combobox-anchor-width",
			description: "The width of the combobox trigger element.",
		}),
		createCSSVarSchema({
			name: "--bits-combobox-anchor-height",
			description: "The height of the combobox trigger element.",
		}),
	],
});

export const contentStatic = createApiSchema<ComboboxContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description: "The element which contains the combobox's items. (Static/No Floating UI)",
	props: {
		...escapeLayerProps,
		...dismissibleLayerProps,
		...focusScopeProps,
		preventScroll: preventScrollProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		loop: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the combobox should loop through items when reaching the end.",
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
			name: "combobox-content",
			description: "Present on the content element.",
		}),
	],
});

export const item = createApiSchema<ComboboxItemPropsWithoutHTML>({
	title: "Item",
	description: "A combobox item, which must be a child of the `Combobox.Content` component.",
	props: {
		value: createStringProp({
			description: "The value of the item.",
			required: true,
		}),
		label: createStringProp({
			description: "The label of the item, which is what the list will be filtered by.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the combobox item is disabled. This will prevent interaction/selection.",
		}),
		onHighlight: createFunctionProp({
			definition: NoopProp,
			description: "A callback that is fired when the item is highlighted.",
			stringDefinition: "() => void",
		}),
		onUnhighlight: createFunctionProp({
			definition: NoopProp,
			description: "A callback that is fired when the item is unhighlighted.",
			stringDefinition: "() => void",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "value",
			description: "The value of the combobox item.",
			value: "string",
		}),
		createDataAttrSchema({
			name: "label",
			description: "The label of the combobox item.",
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
			name: "combobox-item",
			description: "Present on the item element.",
		}),
	],
});

export const input = createApiSchema<ComboboxInputPropsWithoutHTML>({
	title: "Input",
	description:
		"A representation of the combobox input element, which is typically displayed in the content.",
	props: {
		defaultValue: createStringProp({
			description:
				"The default value of the input. This is not a reactive prop and is only used to populate the input when the combobox is first mounted if there is already a value set.",
		}),
		clearOnDeselect: createBooleanProp({
			description: "Whether to clear the input when the last item is deselected.",
			default: C.FALSE,
		}),
		...withChildProps({ elType: "HTMLInputElement" }),
	},
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the combobox is disabled.",
		}),
		createDataAttrSchema({
			name: "combobox-input",
			description: "Present on the input element.",
		}),
	],
});

export const trigger = createApiSchema<ComboboxTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "A button which toggles the combobox's open state.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		stateDataAttr,
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the combobox is disabled.",
		}),
		createDataAttrSchema({
			name: "combobox-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const group = createApiSchema<ComboboxGroupPropsWithoutHTML>({
	title: "Group",
	description: "A group of related combobox items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "combobox-group",
			description: "Present on the group element.",
		}),
	],
});

export const groupHeading = createApiSchema<ComboboxGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description:
		"A heading for the parent combobox group. This is used to describe a group of related combobox items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "combobox-group-heading",
			description: "Present on the group heading element.",
		}),
	],
});

export const arrow = createApiSchema<ComboboxArrowPropsWithoutHTML>({
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

export const portal = createApiSchema<ComboboxPortalPropsWithoutHTML>({
	title: "Portal",
	description:
		"When used, will render the combobox content into the body or custom `to` element when open",
	props: portalProps,
});

const scrollButtonProps = {
	delay: createFunctionProp({
		definition: DelayProp,
		description:
			"Controls the initial delay (tick 0) and delay between auto-scrolls in milliseconds.",
		stringDefinition: "(tick: number) => number",
		default: "() => 50",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
};

export const scrollUpButton = createApiSchema<SelectScrollUpButtonPropsWithoutHTML>({
	title: "ScrollUpButton",
	description:
		"An optional scroll up button element to improve the scroll experience within the combobox. Should be used in conjunction with the `Combobox.Viewport` component.",
	props: scrollButtonProps,
	dataAttributes: [
		createDataAttrSchema({
			name: "combobox-scroll-up-button",
			description: "Present on the scroll up button element.",
		}),
	],
});

export const scrollDownButton = createApiSchema<SelectScrollDownButtonPropsWithoutHTML>({
	title: "ScrollDownButton",
	description:
		"An optional scroll down button element to improve the scroll experience within the combobox. Should be used in conjunction with the `Combobox.Viewport` component.",
	props: scrollButtonProps,
	dataAttributes: [
		createDataAttrSchema({
			name: "combobox-scroll-down-button",
			description: "Present on the scroll down button element.",
		}),
	],
});

export const viewport = createApiSchema<ComboboxViewportPropsWithoutHTML>({
	title: "Viewport",
	description:
		"An optional element to track the scroll position of the combobox for rendering the scroll up/down buttons.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "combobox-viewport",
			description: "Present on the viewport element.",
		}),
	],
});

export const combobox = [
	root,
	trigger,
	viewport,
	content,
	contentStatic,
	portal,
	item,
	input,
	group,
	groupHeading,
	scrollUpButton,
	scrollDownButton,
	arrow,
];
