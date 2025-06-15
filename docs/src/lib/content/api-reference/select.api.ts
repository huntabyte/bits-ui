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
	openProp,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	typeSingleOrMultipleProp,
	withChildProps,
} from "$lib/content/api-reference/shared.js";
import type {
	SelectArrowPropsWithoutHTML,
	SelectContentPropsWithoutHTML,
	SelectContentStaticPropsWithoutHTML,
	SelectGroupHeadingPropsWithoutHTML,
	SelectGroupPropsWithoutHTML,
	SelectItemPropsWithoutHTML,
	SelectPortalPropsWithoutHTML,
	SelectRootPropsWithoutHTML,
	SelectScrollDownButtonPropsWithoutHTML,
	SelectScrollUpButtonPropsWithoutHTML,
	SelectTriggerPropsWithoutHTML,
	SelectViewportPropsWithoutHTML,
} from "bits-ui";
import { ComboboxScrollAlignmentProp } from "./extended-types/combobox/index.js";
import { DelayProp, ItemsProp } from "./extended-types/select/index.js";
import {
	NoopProp,
	OnChangeStringOrArrayProp,
	OpenClosedProp,
	StringOrArrayStringProp,
} from "./extended-types/shared/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineObjectProp,
	definePropSchema,
	defineSimpleDataAttr,
	defineStringProp,
	defineUnionProp,
} from "../utils.js";

const stateDataAttr = defineEnumDataAttr({
	name: "state",
	options: ["open", "closed"],
	description: "The select's open state.",
	value: OpenClosedProp,
});

export const root = defineComponentApiSchema<SelectRootPropsWithoutHTML>({
	title: "Root",
	description: "The root select component which manages & scopes the state of the select.",
	props: {
		type: typeSingleOrMultipleProp,
		value: defineUnionProp({
			options: ["string", "string[]"],
			default: "string",
			description:
				"The value of the select. When the type is `'single'`, this should be a string. When the type is `'multiple'`, this should be an array of strings.",
			bindable: true,
			definition: StringOrArrayStringProp,
		}),
		onValueChange: defineFunctionProp({
			definition: OnChangeStringOrArrayProp,
			description:
				"A callback that is fired when the select value changes. When the type is `'single'`, the argument will be a string. When the type is `'multiple'`, the argument will be an array of strings.",
			stringDefinition: "(value: string) => void | (value: string[]) => void",
		}),
		open: openProp,
		onOpenChange: onOpenChangeProp,
		onOpenChangeComplete: onOpenChangeCompleteProp,
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the select component is disabled.",
		}),
		name: defineStringProp({
			description:
				"The name to apply to the hidden input element for form submission. If provided, a hidden input element will be rendered to submit the value of the select.",
		}),
		required: defineBooleanProp({
			default: false,
			description: "Whether or not the select menu is required.",
		}),
		scrollAlignment: defineEnumProp({
			options: ["nearest", "center"],
			default: "nearest",
			description: "The alignment of the highlighted item when scrolling.",
			definition: ComboboxScrollAlignmentProp,
		}),
		loop: defineBooleanProp({
			default: false,
			description: "Whether or not the select menu should loop through items.",
		}),
		allowDeselect: defineBooleanProp({
			default: false,
			description:
				"Whether or not the user can deselect the selected item by pressing it in a single select.",
		}),
		items: defineObjectProp({
			definition: ItemsProp,
			description:
				"Optionally provide an array of `value` and `label` pairs that will be used to match and trigger selection when the trigger is focused and a key is pressed while the content is closed. Additionally, this will be used for form autofill when the type is single.",
			stringDefinition: `{ value: string; label: string; disabled?: boolean}[]`,
		}),
		autocomplete: defineStringProp({
			description: "The autocomplete attribute to forward to the hidden input element.",
		}),
		children: childrenSnippet(),
	},
});

export const content = defineComponentApiSchema<SelectContentPropsWithoutHTML>({
	title: "Content",
	description: "The element which contains the select's items.",
	props: {
		...floatingProps(),
		...escapeLayerProps,
		...dismissibleLayerProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		loop: defineBooleanProp({
			default: false,
			description:
				"Whether or not the select should loop through items when reaching the end.",
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
			name: "select-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: floatingContentCSSVars("select"),
});

export const contentStatic = defineComponentApiSchema<SelectContentStaticPropsWithoutHTML>({
	title: "ContentStatic",
	description: "The element which contains the select's items. (Static/No Floating UI)",
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
				"Whether or not the select should loop through items when reaching the end.",
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
			name: "select-content",
			description: "Present on the content element.",
		}),
	],
});

export const item = defineComponentApiSchema<SelectItemPropsWithoutHTML>({
	title: "Item",
	description: "A select item, which must be a child of the `select.Content` component.",
	props: {
		value: defineStringProp({
			description: "The value of the item.",
			required: true,
		}),
		label: defineStringProp({
			description:
				"The label of the item, which is what the list will be filtered by using typeahead behavior.",
		}),
		disabled: defineBooleanProp({
			default: false,
			description:
				"Whether or not the select item is disabled. This will prevent interaction/selection.",
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
			description: "The value of the select item.",
			value: "string",
		}),
		defineSimpleDataAttr({
			name: "label",
			description: "The label of the select item.",
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
			name: "select-item",
			description: "Present on the item element.",
		}),
	],
});

export const trigger = defineComponentApiSchema<SelectTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "A button which toggles the select's open state.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		stateDataAttr,
		defineSimpleDataAttr({
			name: "placeholder",
			description: "Present when the select does not have a value.",
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the select is disabled.",
		}),
		defineSimpleDataAttr({
			name: "select-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

export const viewport = defineComponentApiSchema<SelectViewportPropsWithoutHTML>({
	title: "Viewport",
	description:
		"An optional element to track the scroll position of the select for rendering the scroll up/down buttons.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "select-viewport",
			description: "Present on the viewport element.",
		}),
	],
});

const scrollButtonProps = {
	delay: definePropSchema({
		...defineFunctionProp({
			definition: DelayProp,
			description:
				"Controls the initial delay (tick 0) and delay between auto-scrolls in milliseconds.",
			stringDefinition: "(tick: number) => number",
		}),
		default: {
			variant: "simple",
			value: "() => 50",
		},
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
};

export const scrollUpButton = defineComponentApiSchema<SelectScrollUpButtonPropsWithoutHTML>({
	title: "ScrollUpButton",
	description:
		"An optional scroll up button element to improve the scroll experience within the select. Should be used in conjunction with the `select.Viewport` component.",
	props: scrollButtonProps,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "select-scroll-up-button",
			description: "Present on the scroll up button element.",
		}),
	],
});

export const scrollDownButton = defineComponentApiSchema<SelectScrollDownButtonPropsWithoutHTML>({
	title: "ScrollDownButton",
	description:
		"An optional scroll down button element to improve the scroll experience within the select. Should be used in conjunction with the `select.Viewport` component.",
	props: scrollButtonProps,
	dataAttributes: [
		defineSimpleDataAttr({
			name: "select-scroll-down-button",
			description: "Present on the scroll down button element.",
		}),
	],
});

export const group = defineComponentApiSchema<SelectGroupPropsWithoutHTML>({
	title: "Group",
	description: "A group of related select items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "select-group",
			description: "Present on the group element.",
		}),
	],
});

export const groupHeading = defineComponentApiSchema<SelectGroupHeadingPropsWithoutHTML>({
	title: "GroupHeading",
	description:
		"A heading for the parent select group. This is used to describe a group of related select items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "select-group-heading",
			description: "Present on the group heading element.",
		}),
	],
});

export const arrow = defineComponentApiSchema<SelectArrowPropsWithoutHTML>({
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

export const portal = defineComponentApiSchema<SelectPortalPropsWithoutHTML>({
	title: "Portal",
	description:
		"When used, will render the select content into the body or custom `to` element when open",
	props: portalProps,
});

export const select = [
	root,
	trigger,
	content,
	contentStatic,
	portal,
	item,
	viewport,
	scrollUpButton,
	scrollDownButton,
	group,
	groupHeading,
	arrow,
];
