import type { RatingGroupItemPropsWithoutHTML, RatingGroupRootPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumProp,
	createFunctionProp,
	createNumberProp,
	createStringProp,
	createUnionProp,
	withChildProps,
} from "./shared.js";
import { OnNumberValueChangeProp, OrientationProp } from "./extended-types/shared/index.js";
import { RadioGroupStateAttr } from "./extended-types/radio-group/index.js";
import * as C from "$lib/content/constants.js";
import {
	RatingGroupAriaValuetext,
	RatingGroupItemChildrenSnippetProps,
	RatingGroupItemChildSnippetProps,
	RatingGroupRootChildrenSnippetProps,
	RatingGroupRootChildSnippetProps,
} from "./extended-types/rating-group/index.js";

export const root = createApiSchema<RatingGroupRootPropsWithoutHTML>({
	title: "Root",
	description:
		"The rating group component used to group rating items under a common name for form submission.",
	props: {
		value: createNumberProp({
			description:
				"The value of the rating group. You can bind to this value to control the rating group's value from outside the component.",
			bindable: true,
			default: "0",
		}),
		onValueChange: createFunctionProp({
			definition: OnNumberValueChangeProp,
			description: "A callback that is fired when the rating group's value changes.",
			stringDefinition: "(value: number) => void",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the radio group is disabled. This prevents the user from interacting with it.",
		}),
		required: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the radio group is required.",
		}),
		name: createStringProp({
			description:
				"The name of the rating group used in form submission. If provided, a hidden input element will be rendered to submit the value of the rating group.",
		}),
		min: createNumberProp({
			description: "The minimum value of the rating group.",
			default: "0",
		}),
		max: createNumberProp({
			description: "The maximum value of the rating group.",
			default: "5",
		}),
		allowHalf: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the rating group allows half values.",
		}),
		readonly: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the rating group is readonly.",
		}),
		orientation: createEnumProp({
			options: ["vertical", "horizontal"],
			default: "'horizontal'",
			description:
				"The orientation of the rating group. This will determine how keyboard navigation will work within the component.",
			definition: OrientationProp,
		}),
		hoverPreview: createBooleanProp({
			default: C.FALSE,
			description:
				"Whether or not the rating group shows a preview of the rating when hovering over the items.",
		}),
		"aria-valuetext": createUnionProp({
			description: "The text that describes the rating group's value.",
			options: ["string", "(value: number, max: number) => string"],
			default: "`${value} out of ${max}`",
			definition: RatingGroupAriaValuetext,
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			childDef: RatingGroupRootChildSnippetProps,
			childrenDef: RatingGroupRootChildrenSnippetProps,
		}),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "orientation",
			definition: OrientationProp,
			description: "The orientation of the rating group.",
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the rating group is disabled.",
		}),
		createDataAttrSchema({
			name: "readonly",
			description: "Present when the rating group is readonly.",
		}),
		createDataAttrSchema({
			name: "rating-group-root",
			description: "Present on the root element.",
		}),
	],
});

export const item = createApiSchema<RatingGroupItemPropsWithoutHTML>({
	title: "Item",
	description: "An rating item, which must be a child of the `RatingGroup.Root` component.",
	props: {
		index: createNumberProp({
			description: "The index of the rating item.",
			required: true,
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether the rating item is disabled.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			childDef: RatingGroupItemChildSnippetProps,
			childrenDef: RatingGroupItemChildrenSnippetProps,
		}),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "disabled",
			description: "Present when the rating group is disabled.",
		}),
		createDataAttrSchema({
			name: "readonly",
			description: "Present when the rating group is readonly.",
		}),
		createDataAttrSchema({
			name: "value",
			description: "The value of the rating item.",
		}),
		createDataAttrSchema({
			name: "state",
			definition: RadioGroupStateAttr,
			description: "The rating item's checked state.",
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "orientation",
			definition: OrientationProp,
			description: "The orientation of the parent rating group.",
			isEnum: true,
		}),
		createDataAttrSchema({
			name: "rating-group-item",
			description: "Present on the rating item element.",
		}),
	],
});

export const ratingGroup = [root, item];
