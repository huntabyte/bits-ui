import type { RadioGroupItemPropsWithoutHTML, RadioGroupRootPropsWithoutHTML } from "bits-ui";
import { withChildProps } from "./shared.js";
import { OnStringValueChangeProp, OrientationProp } from "./extended-types/shared/index.js";
import { RadioGroupStateAttr } from "./extended-types/radio-group/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineStringDataAttr,
	defineStringProp,
} from "../utils.js";

export const root = defineComponentApiSchema<RadioGroupRootPropsWithoutHTML>({
	title: "Root",
	description:
		"The radio group component used to group radio items under a common name for form submission.",
	props: {
		value: defineStringProp({
			description:
				"The value of the currently selected radio item. You can bind to this value to control the radio group's value from outside the component.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			description: "A callback that is fired when the radio group's value changes.",
			definition: OnStringValueChangeProp,
			stringDefinition: "(value: string) => void",
		}),
		disabled: defineBooleanProp({
			default: false,
			description:
				"Whether or not the radio group is disabled. This prevents the user from interacting with it.",
		}),
		required: defineBooleanProp({
			default: false,
			description: "Whether or not the radio group is required.",
		}),
		name: defineStringProp({
			description:
				"The name of the radio group used in form submission. If provided, a hidden input element will be rendered to submit the value of the radio group.",
		}),
		loop: defineBooleanProp({
			default: false,
			description:
				"Whether or not the radio group should loop through the items when navigating with the arrow keys.",
		}),
		orientation: defineEnumProp({
			options: ["vertical", "horizontal"],
			default: "vertical",
			description:
				"The orientation of the radio group. This will determine how keyboard navigation will work within the component.",
			definition: OrientationProp,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "orientation",
			description: "The orientation of the radio group.",
			options: ["vertical", "horizontal"],
			value: OrientationProp,
		}),
		defineStringDataAttr({
			name: "radio-group-root",
			description: "Present on the root element.",
		}),
	],
});

export const item = defineComponentApiSchema<RadioGroupItemPropsWithoutHTML>({
	title: "Item",
	description: "An radio item, which must be a child of the `RadioGroup.Root` component.",
	props: {
		value: defineStringProp({
			description:
				"The value of the radio item. This should be unique for each radio item in the group.",
			required: true,
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether the radio item is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		defineStringDataAttr({
			name: "disabled",
			description: "Present when the radio item is disabled.",
		}),
		defineStringDataAttr({
			name: "value",
			description: "The value of the radio item.",
		}),
		defineEnumDataAttr({
			name: "state",
			description: "The radio item's checked state.",
			options: ["checked", "unchecked"],
			value: RadioGroupStateAttr,
		}),
		defineStringDataAttr({
			name: "orientation",
			description: "The orientation of the parent radio group.",
		}),
		defineStringDataAttr({
			name: "radio-group-item",
			description: "Present on the radio item element.",
		}),
	],
});

export const radioGroup = [root, item];
