import type { TagsInputRootPropsWithoutHTML } from "bits-ui";
import {
	TagsInputBlurBehaviorProp,
	TagsInputOnValueChangeProp,
	TagsInputValidateProp,
} from "./extended-types/tags-input/index.js";
import {
	controlledValueProp,
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumProp,
	createFunctionProp,
	createPropSchema,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

export const root = createApiSchema<TagsInputRootPropsWithoutHTML>({
	title: "Root",
	description: "An enhanced label component that can be used with any input.",
	props: {
		value: createPropSchema({
			type: "string[]",
			description: "The value of the tags input. An array of tag values/strings.",
			bindable: true,
			default: "[]",
		}),
		onValueChange: createFunctionProp({
			definition: TagsInputOnValueChangeProp,
			description:
				"A callback function called when the active accordion item value changes. If the `type` is `'single'`, the argument will be a string. If `type` is `'multiple'`, the argument will be an array of strings.",
		}),
		controlledValue: controlledValueProp,
		delimiters: createPropSchema({
			type: "string[]",
			description: "An array of delimiters to use to splitting the input value.",
			default: "[',']",
		}),
		blurBehavior: createEnumProp({
			options: ["clear", "add", "none"],
			description: "The behavior to use when the input is blurred with text in it.",
			default: "'none'",
			definition: TagsInputBlurBehaviorProp,
		}),
		pasteBehavior: createEnumProp({
			options: ["add", "none"],
			description: "How text is handled when it is pasted into the input.",
			default: "'add'",
			definition: TagsInputBlurBehaviorProp,
		}),
		validate: createFunctionProp({
			description:
				"A validation function to determine if the individual tag being added/edited is valid. Return `true` to allow the tag to be added/edited, or `false` to prevent it from being added/confirm edited.",
			definition: TagsInputValidateProp,
		}),
		editable: createBooleanProp({
			description:
				"Whether or not the individual tags are editable or not. This applies to all tags. If you wish to override a specific tag's editable state, you can use the `editable` prop on the `TagInput.Tag` component.",
			default: C.TRUE,
		}),
		name: createPropSchema({
			type: "string",
			description:
				"If provided, a hidden input element will be rendered for each tag to submit the values with a form.",
		}),
		required: createBooleanProp({
			description:
				"Whether or not the hidden input element should be marked as required or not.",
			default: C.FALSE,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "tags-input-root",
			description: "Present on the root element.",
		}),
	],
});

export const label = [root];
