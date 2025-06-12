import type { RatingGroupItemPropsWithoutHTML, RatingGroupRootPropsWithoutHTML } from "bits-ui";
import { withChildProps } from "./shared.js";
import { OnNumberValueChangeProp, OrientationProp } from "./extended-types/shared/index.js";
import { RadioGroupStateAttr } from "./extended-types/radio-group/index.js";
import {
	RatingGroupAriaValuetext,
	RatingGroupItemChildrenSnippetProps,
	RatingGroupItemChildSnippetProps,
	RatingGroupRootChildrenSnippetProps,
	RatingGroupRootChildSnippetProps,
} from "./extended-types/rating-group/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineNumberProp,
	defineSimpleDataAttr,
	defineStringProp,
	defineUnionProp,
} from "../utils.js";

export const root = defineComponentApiSchema<RatingGroupRootPropsWithoutHTML>({
	title: "Root",
	description:
		"The rating group component used to group rating items under a common name for form submission.",
	props: {
		value: defineNumberProp({
			description:
				"The value of the rating group. You can bind to this value to control the rating group's value from outside the component.",
			bindable: true,
			default: 0,
		}),
		onValueChange: defineFunctionProp({
			definition: OnNumberValueChangeProp,
			description: "A callback that is fired when the rating group's value changes.",
			stringDefinition: "(value: number) => void",
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
				"The name of the rating group used in form submission. If provided, a hidden input element will be rendered to submit the value of the rating group.",
		}),
		min: defineNumberProp({
			description: "The minimum value of the rating group.",
			default: 0,
		}),
		max: defineNumberProp({
			description: "The maximum value of the rating group.",
			default: 5,
		}),
		allowHalf: defineBooleanProp({
			default: false,
			description: "Whether or not the rating group allows half values.",
		}),
		readonly: defineBooleanProp({
			default: false,
			description: "Whether or not the rating group is readonly.",
		}),
		orientation: defineEnumProp({
			options: ["vertical", "horizontal"],
			default: "horizontal",
			description:
				"The orientation of the rating group. This will determine how keyboard navigation will work within the component.",
			definition: OrientationProp,
		}),
		hoverPreview: defineBooleanProp({
			default: false,
			description:
				"Whether or not the rating group shows a preview of the rating when hovering over the items.",
		}),
		"aria-valuetext": defineUnionProp({
			description: "The text that describes the rating group's value.",
			options: ["string", "(value: number, max: number) => string"],
			default: "`${value} out of ${max}`",
			definition: RatingGroupAriaValuetext,
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			child: {
				definition: RatingGroupRootChildSnippetProps,
				stringDefinition: `type RatingGroupItemState = "active" | "partial" | "inactive";

type RatingGroupItemData = {
	index: number;
	state: RatingGroupItemState;
};

type ChildSnippetProps = {
	items: RatingGroupItemData[];
	value: number;
	max: number;
	props: Record<string, unknown>;
};`,
			},
			children: {
				definition: RatingGroupRootChildrenSnippetProps,
				stringDefinition: `type RatingGroupItemState = "active" | "partial" | "inactive";

type RatingGroupItemData = {
	index: number;
	state: RatingGroupItemState;
};

type ChildrenSnippetProps = {
	items: RatingGroupItemData[];
	value: number;
	max: number;
};`,
			},
		}),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "orientation",
			description: "The orientation of the rating group.",
			options: ["vertical", "horizontal"],
			value: OrientationProp,
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the rating group is disabled.",
		}),
		defineSimpleDataAttr({
			name: "readonly",
			description: "Present when the rating group is readonly.",
		}),
		defineSimpleDataAttr({
			name: "rating-group-root",
			description: "Present on the root element.",
		}),
	],
});

export const item = defineComponentApiSchema<RatingGroupItemPropsWithoutHTML>({
	title: "Item",
	description: "An rating item, which must be a child of the `RatingGroup.Root` component.",
	props: {
		index: defineNumberProp({
			description: "The index of the rating item.",
			required: true,
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether the rating item is disabled.",
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			child: {
				definition: RatingGroupItemChildSnippetProps,
				stringDefinition: `type RatingGroupItemState = "active" | "partial" | "inactive";

type ChildSnippetProps = {
	state: RatingGroupItemState;
	props: Record<string, unknown>;
};`,
			},
			children: {
				definition: RatingGroupItemChildrenSnippetProps,
				stringDefinition: `type RatingGroupItemState = "active" | "partial" | "inactive";

type ChildrenSnippetProps = {
	state: RatingGroupItemState;
};`,
			},
		}),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the rating group is disabled.",
		}),
		defineSimpleDataAttr({
			name: "readonly",
			description: "Present when the rating group is readonly.",
		}),
		defineSimpleDataAttr({
			name: "value",
			description: "The value of the rating item.",
		}),
		defineEnumDataAttr({
			name: "state",
			description: "The rating item's checked state.",
			options: ["checked", "unchecked"],
			value: RadioGroupStateAttr,
		}),
		defineEnumDataAttr({
			name: "orientation",
			description: "The orientation of the parent rating group.",
			options: ["vertical", "horizontal"],
			value: OrientationProp,
		}),
		defineSimpleDataAttr({
			name: "rating-group-item",
			description: "Present on the rating item element.",
		}),
	],
});

export const ratingGroup = [root, item];
