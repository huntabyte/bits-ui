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
	OpenClosedProp,
	SingleOrMultipleProp,
	StringOrArrayStringProp,
} from "./extended-types/shared/index.js";
import { ComboboxScrollAlignmentProp } from "./extended-types/combobox/index.js";
import { DelayProp, ItemsProp } from "./extended-types/select/index.js";
import {
	arrowProps,
	childrenSnippet,
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	floatingContentChildDefinition,
	floatingContentCSSVars,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	onOpenChangeCompleteProp,
	onOpenChangeProp,
	openChildDefinition,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	withChildProps,
} from "$lib/content/api-reference/shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineComponentPropSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	definePropSchema,
	defineSimpleDataAttr,
	defineStringProp,
	defineUnionProp,
} from "../utils.js";

const stateDataAttr = defineEnumDataAttr({
	name: "state",
	options: ["open", "closed"],
	description: "The combobox's open state.",
	value: OpenClosedProp,
});

export const root = defineComponentApiSchema<ComboboxRootPropsWithoutHTML>({
	title: "Root",
	description: "The root combobox component which manages & scopes the state of the combobox.",
	props: {
		type: defineEnumProp({
			options: ["single", "multiple"],
			description: "The type of combobox.",
			required: true,
			definition: SingleOrMultipleProp,
		}),
		value: defineUnionProp({
			options: ["string", "string[]"],
			default: "",
			description:
				"The value of the combobox. When the type is `'single'`, this should be a string. When the type is `'multiple'`, this should be an array of strings.",
			bindable: true,
			definition: StringOrArrayStringProp,
		}),
		onValueChange: defineFunctionProp({
			definition: OnChangeStringOrArrayProp,
			description:
				"A callback that is fired when the combobox value changes. When the type is `'single'`, the argument will be a string. When the type is `'multiple'`, the argument will be an array of strings.",
			stringDefinition: "(string) => void | (string[]) => void",
		}),
		open: defineBooleanProp({
			default: false,
			description: "The open state of the combobox menu.",
			bindable: true,
		}),
		onOpenChange: onOpenChangeProp,
		onOpenChangeComplete: onOpenChangeCompleteProp,
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the combobox component is disabled.",
		}),
		name: defineStringProp({
			description:
				"The name to apply to the hidden input element for form submission. If provided, a hidden input element will be rendered to submit the value of the combobox.",
		}),
		required: defineBooleanProp({
			default: false,
			description: "Whether or not the combobox menu is required.",
		}),
		scrollAlignment: defineEnumProp({
			options: ["nearest", "center"],
			default: "'nearest'",
			description: "The alignment of the highlighted item when scrolling.",
			definition: ComboboxScrollAlignmentProp,
		}),
		loop: defineBooleanProp({
			default: false,
			description: "Whether or not the combobox menu should loop through items.",
		}),
		allowDeselect: defineBooleanProp({
			default: true,
			description:
				"Whether or not the user can deselect the selected item by pressing it in a single select.",
		}),
		items: defineComponentPropSchema({
			definition: ItemsProp,
			stringDefinition: `{ value: string; label: string; disabled?: boolean}[]`,
			type: "Item[]",
			description:
				"Optionally provide an array of objects representing the items in the select for autofill capabilities. Only applicable to combobox's with type `single`",
		}),
		inputValue: defineStringProp({
			description:
				"A read-only value that controls the text displayed in the combobox input. Use this to programmatically update the input value when the selection changes outside the component, ensuring the displayed text stays in sync with the actual value.",
		}),
		children: childrenSnippet(),
	},
});

export const content = defineComponentApiSchema<ComboboxContentPropsWithoutHTML>({
	title: "Content",
	description: "The element which contains the combobox's items.",
	props: {
		...floatingProps(),
		...escapeLayerProps,
		...dismissibleLayerProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		loop: defineBooleanProp({
			default: false,
			description:
				"Whether or not the combobox should loop through items when reaching the end.",
		}),
		forceMount: forceMountProp,
		preventScroll: definePropSchema({
			...preventScrollProp,
			default: {
				variant: "simple",
				value: "false",
			},
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			child: floatingContentChildDefinition,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		defineSimpleDataAttr({
			name: "combobox-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: floatingContentCSSVars("combobox"),
});

export const contentStatic = defineComponentApiSchema<ComboboxContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description: "The element which contains the combobox's items. (Static/No Floating UI)",
	props: {
		...escapeLayerProps,
		...dismissibleLayerProps,
		...focusScopeProps,
		preventScroll: preventScrollProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		loop: defineBooleanProp({
			default: false,
			description:
				"Whether or not the combobox should loop through items when reaching the end.",
		}),
		forceMount: forceMountProp,
		...withChildProps({
			elType: "HTMLDivElement",
			child: openChildDefinition,
		}),
	},
	dataAttributes: [
		stateDataAttr,
		defineSimpleDataAttr({
			name: "combobox-content",
			description: "Present on the content element.",
		}),
	],
});

export const item = defineComponentApiSchema<ComboboxItemPropsWithoutHTML>({
	title: "Item",
	description: "A combobox item, which must be a child of the `Combobox.Content` component.",
	props: {
		value: defineStringProp({
			description: "The value of the item.",
			required: true,
		}),
		label: defineStringProp({
			description: "The label of the item, which is what the list will be filtered by.",
		}),
		disabled: defineBooleanProp({
			default: false,
			description:
				"Whether or not the combobox item is disabled. This will prevent interaction/selection.",
		}),
		onHighlight: defineFunctionProp({
			definition: NoopProp,
			description: "A callback that is fired when the item is highlighted.",
			stringDefinition: "() => void",
		}),
		onUnhighlight: defineFunctionProp({
			definition: NoopProp,
			description: "A callback that is fired when the item is unhighlighted.",
			stringDefinition: "() => void",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "value",
			description: "The value of the combobox item.",
			value: "string",
		}),
		defineSimpleDataAttr({
			name: "label",
			description: "The label of the combobox item.",
			value: "string",
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the item is disabled.",
		}),
		defineSimpleDataAttr({
			name: "highlighted",
			description:
				"Present when the item is highlighted, which is either via keyboard navigation of the menu or hover.",
		}),
		defineSimpleDataAttr({
			name: "selected",
			description: "Present when the item is selected.",
		}),
		defineSimpleDataAttr({
			name: "combobox-item",
			description: "Present on the item element.",
		}),
	],
});

export const input = defineComponentApiSchema<ComboboxInputPropsWithoutHTML>({
	title: "Input",
	description:
		"A representation of the combobox input element, which is typically displayed in the content.",
	props: {
		defaultValue: defineStringProp({
			description:
				"The default value of the input. This is not a reactive prop and is only used to populate the input when the combobox is first mounted if there is already a value set.",
		}),
		clearOnDeselect: defineBooleanProp({
			description: "Whether to clear the input when the last item is deselected.",
			default: false,
		}),
		...withChildProps({ elType: "HTMLInputElement" }),
	},
	dataAttributes: [
		stateDataAttr,
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the combobox is disabled.",
		}),
		defineSimpleDataAttr({
			name: "combobox-input",
			description: "Present on the input element.",
		}),
	],
});

export const trigger = defineComponentApiSchema<ComboboxTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "A button which toggles the combobox's open state.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		stateDataAttr,
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the combobox is disabled.",
		}),
		defineSimpleDataAttr({
			name: "combobox-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const group = defineComponentApiSchema<ComboboxGroupPropsWithoutHTML>({
	title: "Group",
	description: "A group of related combobox items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "combobox-group",
			description: "Present on the group element.",
		}),
	],
});

export const groupHeading = defineComponentApiSchema<ComboboxGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description:
		"A heading for the parent combobox group. This is used to describe a group of related combobox items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "combobox-group-heading",
			description: "Present on the group heading element.",
		}),
	],
});

export const arrow = defineComponentApiSchema<ComboboxArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the content when open.",
	props: arrowProps,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "arrow",
			description: "Present on the arrow element.",
		}),
	],
});

export const portal = defineComponentApiSchema<ComboboxPortalPropsWithoutHTML>({
	title: "Portal",
	description:
		"When used, will render the combobox content into the body or custom `to` element when open",
	props: portalProps,
});

const scrollButtonProps = {
	delay: defineFunctionProp({
		definition: DelayProp,
		description:
			"Controls the initial delay (tick 0) and delay between auto-scrolls in milliseconds.",
		stringDefinition: "(tick: number) => number",
		default: "() => 50",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
};

export const scrollUpButton = defineComponentApiSchema<SelectScrollUpButtonPropsWithoutHTML>({
	title: "ScrollUpButton",
	description:
		"An optional scroll up button element to improve the scroll experience within the combobox. Should be used in conjunction with the `Combobox.Viewport` component.",
	props: scrollButtonProps,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "combobox-scroll-up-button",
			description: "Present on the scroll up button element.",
		}),
	],
});

export const scrollDownButton = defineComponentApiSchema<SelectScrollDownButtonPropsWithoutHTML>({
	title: "ScrollDownButton",
	description:
		"An optional scroll down button element to improve the scroll experience within the combobox. Should be used in conjunction with the `Combobox.Viewport` component.",
	props: scrollButtonProps,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "combobox-scroll-down-button",
			description: "Present on the scroll down button element.",
		}),
	],
});

export const viewport = defineComponentApiSchema<ComboboxViewportPropsWithoutHTML>({
	title: "Viewport",
	description:
		"An optional element to track the scroll position of the combobox for rendering the scroll up/down buttons.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
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
