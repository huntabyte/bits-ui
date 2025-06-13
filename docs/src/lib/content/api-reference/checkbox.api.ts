import type {
	CheckboxGroupLabelPropsWithoutHTML,
	CheckboxGroupPropsWithoutHTML,
	CheckboxRootPropsWithoutHTML,
} from "bits-ui";
import { checkboxChildDefinition, checkboxChildrenDefinition, withChildProps } from "./shared.js";
import {
	CheckboxGroupOnValueChangeProp,
	CheckboxRootOnCheckedChangeProp,
	CheckboxRootOnIndeterminateChangeProp,
	CheckboxRootStateDataAttr,
} from "./extended-types/checkbox/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineFunctionProp,
	defineSimpleDataAttr,
	defineStringProp,
	defineSimplePropSchema,
} from "../utils.js";

export const root = defineComponentApiSchema<CheckboxRootPropsWithoutHTML>({
	title: "Root",
	description: "The button component used to toggle the state of the checkbox.",
	props: {
		checked: defineBooleanProp({
			default: false,
			description: "The checkbox button's checked state.",
			bindable: true,
		}),
		onCheckedChange: defineFunctionProp({
			definition: CheckboxRootOnCheckedChangeProp,
			description:
				"A callback that is fired when the checkbox button's checked state changes.",
			stringDefinition: "(checked: boolean) => void",
		}),
		indeterminate: defineBooleanProp({
			default: false,
			description: "Whether the checkbox is an indeterminate state or not.",
			bindable: true,
		}),
		onIndeterminateChange: defineFunctionProp({
			definition: CheckboxRootOnIndeterminateChangeProp,
			description: "A callback that is fired when the indeterminate state changes.",
			stringDefinition: "(indeterminate: boolean) => void",
		}),
		disabled: defineBooleanProp({
			default: false,
			description:
				"Whether or not the checkbox button is disabled. This prevents the user from interacting with it.",
		}),
		required: defineBooleanProp({
			default: false,
			description: "Whether or not the checkbox is required.",
		}),
		name: defineStringProp({
			description:
				"The name of the checkbox. If provided a hidden input will be render to use for form submission. If not provided, the hidden input will not be rendered.",
		}),
		value: defineStringProp({
			description:
				"The value of the checkbox. This is what is submitted with the form when the checkbox is checked.",
		}),
		...withChildProps({
			elType: "HTMLButtonElement",
			child: checkboxChildDefinition,
			children: checkboxChildrenDefinition,
		}),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "state",
			options: ["checked", "unchecked", "indeterminate"],
			description: "The checkbox's state of checked, unchecked, or indeterminate.",
			value: CheckboxRootStateDataAttr,
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the checkbox is disabled.",
		}),
		defineSimpleDataAttr({
			name: "checkbox-root",
			description: "Present on the root element.",
		}),
	],
});

export const group = defineComponentApiSchema<CheckboxGroupPropsWithoutHTML>({
	title: "Group",
	description: "A group that synchronizes its value state with its descendant checkboxes.",
	props: {
		value: defineSimplePropSchema({
			description:
				"The value of the group. This is an array of the values of the checked checkboxes within the group.",
			bindable: true,
			default: "[]",
			type: "string[]",
		}),
		onValueChange: defineFunctionProp({
			definition: CheckboxGroupOnValueChangeProp,
			description: "A callback that is fired when the checkbox group's value state changes.",
			stringDefinition: "(value: string[]) => void",
		}),
		disabled: defineBooleanProp({
			default: false,
			description:
				"Whether or not the checkbox group is disabled. If `true`, all checkboxes within the group will be disabled. To disable a specific checkbox in the group, pass the `disabled` prop to the checkbox.",
		}),
		required: defineBooleanProp({
			default: false,
			description: "Whether or not the checkbox group is required for form submission.",
		}),
		name: defineStringProp({
			description:
				"The name of the checkbox group. If provided a hidden input will be rendered to use for form submission.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
		}),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the checkbox group is disabled.",
		}),
		defineSimpleDataAttr({
			name: "checkbox-group",
			description: "Present on the group element.",
		}),
	],
});

export const groupLabel = defineComponentApiSchema<CheckboxGroupLabelPropsWithoutHTML>({
	title: "GroupLabel",
	description: "An accessible label for the checkbox group.",
	props: withChildProps({
		elType: "HTMLLabelElement",
	}),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the checkbox group is disabled.",
		}),
		defineSimpleDataAttr({
			name: "checkbox-group-label",
			description: "Present on the label element.",
		}),
	],
});

export const checkbox = [root, group, groupLabel];
