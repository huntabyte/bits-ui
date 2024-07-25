import type {
	ComboboxArrowPropsWithoutHTML,
	ComboboxContentPropsWithoutHTML,
	ComboboxInputPropsWithoutHTML,
	ComboboxItemPropsWithoutHTML,
	ComboboxGroupLabelPropsWithoutHTML,
	ComboboxRootPropsWithoutHTML,
} from "bits-ui";
import {
	arrowProps,
	childrenSnippet,
	createApiSchema,
	createBooleanProp,
	createEnumProp,
	createFunctionProp,
	createStringProp,
	createUnionProp,
	dirProp,
	dismissableLayerProps,
	enums,
	escapeLayerProps,
	floatingProps,
	focusScopeProps,
	forceMountProp,
	preventOverflowTextSelectionProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

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
		{
			name: "combobox-content",
			description: "Present on the content element.",
		},
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
		{
			name: "state",
			description: "The state of the item.",
			value: enums("selected", "hovered"),
			isEnum: true,
		},
		{
			name: "disabled",
			description: "Present when the item is disabled.",
		},
		{
			name: "highlighted",
			description: "Present when the item is highlighted, via keyboard navigation or hover.",
		},
		{
			name: "combobox-item",
			description: "Present on the item element.",
		},
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
		{
			name: "combobox-input",
			description: "Present on the input element.",
		},
	],
});

export const groupLabel = createApiSchema<ComboboxGroupLabelPropsWithoutHTML>({
	title: "Label",
	description:
		"A label for the combobox input element, which is typically displayed in the content.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		{
			name: "combobox-label",
			description: "Present on the label element.",
		},
	],
});

export const arrow = createApiSchema<ComboboxArrowPropsWithoutHTML>({
	title: "Arrow",
	description: "An optional arrow element which points to the content when open.",
	props: arrowProps,
	dataAttributes: [
		{
			name: "arrow",
			description: "Present on the arrow element.",
		},
	],
});

export const combobox = [root, content, item, input, groupLabel, arrow];
