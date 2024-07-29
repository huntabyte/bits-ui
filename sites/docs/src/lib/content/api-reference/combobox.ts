import type {
	ComboboxArrowPropsWithoutHTML,
	ComboboxContentPropsWithoutHTML,
	ComboboxInputPropsWithoutHTML,
	ComboboxItemPropsWithoutHTML,
	ComboboxGroupLabelPropsWithoutHTML,
	ComboboxRootPropsWithoutHTML,
	ComboboxTriggerPropsWithoutHTML,
	ComboboxGroupPropsWithoutHTML,
} from "bits-ui";
import {
	arrowProps,
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
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
	description: "The combobox's open state.",
});

export const root = createApiSchema<ComboboxRootPropsWithoutHTML>({
	title: "Root",
	description: "The root combobox component which manages & scopes the state of the combobox.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			description: "The type of combobox.",
			required: true,
		}),
		value: createUnionProp({
			options: ["string", "string[]"],
			default: "",
			description:
				"The value of the combobox. When the type is `'single'`, this should be a string. When the type is `'multiple'`, this should be an array of strings.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: "(value: string) => void | (value: string[]) => void",
			description:
				"A callback that is fired when the combobox value changes. When the type is `'single'`, the argument will be a string. When the type is `'multiple'`, the argument will be an array of strings.",
		}),
		open: createBooleanProp({
			default: C.FALSE,
			description: "The open state of the combobox menu.",
			bindable: true,
		}),
		onOpenChange: createFunctionProp({
			definition: "(open: boolean) => void",
			description: "A callback that is fired when the combobox menu's open state changes.",
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
		}),
		loop: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the combobox menu should loop through items.",
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
		...dismissableLayerProps,
		...focusScopeProps,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		dir: dirProp,
		loop: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the combobox should loop through items when reaching the end.",
		}),
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
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
			definition: "() => void",
			description: "A callback that is fired when the item is highlighted.",
		}),
		onUnhighlight: createFunctionProp({
			definition: "()) => void",
			description: "A callback that is fired when the item is unhighlighted.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "value",
			description: "The value of the combobox item.",
		}),
		createDataAttrSchema({
			name: "label",
			description: "The label of the combobox item.",
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
		...withChildProps({ elType: "HTMLInputElement" }),
	},
	dataAttributes: [
		createEnumDataAttr({
			name: "state",
			options: ["open", "closed"],
			description: "The combobox's open state.",
		}),
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
		createEnumDataAttr({
			name: "state",
			options: ["open", "closed"],
			description: "The combobox's open state.",
		}),
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

export const groupLabel = createApiSchema<ComboboxGroupLabelPropsWithoutHTML>({
	title: "GroupLabel",
	description:
		"A label for the parent combobox group. This is used to describe a group of related combobox items.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "combobox-group-label",
			description: "Present on the group label element.",
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

export const combobox = [root, content, item, input, groupLabel, arrow];
