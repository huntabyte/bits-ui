import type {
	TagsInputClearPropsWithoutHTML,
	TagsInputInputPropsWithoutHTML,
	TagsInputListPropsWithoutHTML,
	TagsInputRootPropsWithoutHTML,
	TagsInputTagContentPropsWithoutHTML,
	TagsInputTagEditPropsWithoutHTML,
	TagsInputTagPropsWithoutHTML,
	TagsInputTagRemovePropsWithoutHTML,
	TagsInputTagTextPropsWithoutHTML,
} from "bits-ui";
import {
	TagsInputBlurBehaviorProp,
	TagsInputInputOnValueChangeProp,
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
	createNumberProp,
	createPropSchema,
	createStringProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const root = createApiSchema<TagsInputRootPropsWithoutHTML>({
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

const list = createApiSchema<TagsInputListPropsWithoutHTML>({
	title: "List",
	description: "The container for the tags.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the list element when the tags input is invalid.",
		}),
		createDataAttrSchema({
			name: "tags-input-list",
			description: "Present on the list element.",
		}),
	],
});

const tag = createApiSchema<TagsInputTagPropsWithoutHTML>({
	title: "Tag",
	description: "The container for a single tag within the tags input.",
	props: {
		value: createStringProp({
			description: "The value of the tag.",
			required: true,
		}),
		index: createNumberProp({
			description: "The index of the tag in the value array.",
			required: true,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "editing",
			description: "Present on the tag element when the tag is being edited.",
		}),
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the tag element when the tags input is marked as invalid.",
		}),
	],
});

const tagText = createApiSchema<TagsInputTagTextPropsWithoutHTML>({
	title: "TagText",
	description: "The text content of the tag.",
	props: withChildProps({ elType: "HTMLSpanElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "tags-input-tag-text",
			description: "Present on the text element.",
		}),
	],
});

const tagEdit = createApiSchema<TagsInputTagEditPropsWithoutHTML>({
	title: "TagEdit",
	description: "The edit button for the tag.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "tags-input-tag-edit",
			description: "Present on the edit element.",
		}),
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the edit element when the tags input is marked as invalid.",
		}),
	],
});

const tagRemove = createApiSchema<TagsInputTagRemovePropsWithoutHTML>({
	title: "TagRemove",
	description: "The remove button for the tag.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "tags-input-tag-remove",
			description: "Present on the remove element.",
		}),
	],
});

const input = createApiSchema<TagsInputInputPropsWithoutHTML>({
	title: "Input",
	description: "The input field for the tags input.",
	props: {
		blurBehavior: createEnumProp({
			options: ["clear", "add", "none"],
			description: "The behavior to use when the input is blurred with text in it.",
			default: "'none'",
			definition: TagsInputBlurBehaviorProp,
		}),
		value: createStringProp({
			description: "The value of the input.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: TagsInputInputOnValueChangeProp,
			description: "A callback function called when the value of the input changes.",
		}),
		controlledValue: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the value is controlled or not. If `true`, the component will not update the value internally, instead it will call `onValueChange` when it would have otherwise, and it is up to you to update the `value` prop that is passed to the component.",
		}),
		...withChildProps({ elType: "HTMLInputElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "invalid",
			description: "Present on the input element when the tags input is marked as invalid.",
		}),
		createDataAttrSchema({
			name: "tags-input-input",
			description: "Present on the input element.",
		}),
	],
});

const clear = createApiSchema<TagsInputClearPropsWithoutHTML>({
	title: "Clear",
	description: "The clear button for the tags input.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "tags-input-clear",
			description: "Present on the clear element.",
		}),
	],
});

const tagContent = createApiSchema<TagsInputTagContentPropsWithoutHTML>({
	title: "TagContent",
	description:
		"The container for the tag content, which typically includes the tag text and edit/remove buttons and does not include the edit input.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		createDataAttrSchema({
			name: "tags-input-tag-content",
		}),
	],
});

export const tagsInput = [root, list, tag, tagContent, tagText, tagRemove, tagEdit, input, clear];
