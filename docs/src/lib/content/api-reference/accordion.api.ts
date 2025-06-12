import type {
	AccordionContentPropsWithoutHTML,
	AccordionHeaderPropsWithoutHTML,
	AccordionItemPropsWithoutHTML,
	AccordionRootPropsWithoutHTML,
	AccordionTriggerPropsWithoutHTML,
} from "bits-ui";
import { disabledDataAttr, forceMountProp, orientationDataAttr, withChildProps } from "./shared.js";
import {
	HeaderLevelProp,
	OnChangeStringOrArrayProp,
	OpenClosedProp,
	OrientationProp,
	SingleOrMultipleProp,
	StringOrArrayStringProp,
} from "./extended-types/shared/index.js";
import { ContentChildSnippetProps } from "./extended-types/accordion/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineCSSVarSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineSimpleDataAttr,
	defineStringProp,
	defineUnionProp,
} from "../utils.js";

const stateDataAttr = defineEnumDataAttr({
	name: "state",
	description: "Whether the accordion item is open or closed.",
	options: ["open", "closed"],
	value: OpenClosedProp,
});

const root = defineComponentApiSchema<AccordionRootPropsWithoutHTML>({
	title: "Root",
	description: "The root accordion component used to set and manage the state of the accordion.",
	props: {
		type: defineEnumProp({
			options: ["single", "multiple"],
			definition: SingleOrMultipleProp,
			description:
				"The type of accordion. If set to `'multiple'`, the accordion will allow multiple items to be open at the same time. If set to `single`, the accordion will only allow a single item to be open.",
			required: true,
		}),
		value: defineUnionProp({
			options: ["string[]", "string"],
			definition: StringOrArrayStringProp,
			description:
				"The value of the currently active accordion item. If `type` is `'single'`, this should be a string. If `type` is `'multiple'`, this should be an array of strings.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: OnChangeStringOrArrayProp,
			description:
				"A callback function called when the active accordion item value changes. If the `type` is `'single'`, the argument will be a string. If `type` is `'multiple'`, the argument will be an array of strings.",
			stringDefinition: "string | string[]",
		}),
		disabled: defineBooleanProp({
			description:
				"Whether or not the accordion is disabled. When disabled, the accordion cannot be interacted with.",
			default: false,
		}),
		loop: defineBooleanProp({
			description:
				"Whether or not the accordion should loop through items when reaching the end.",
			default: false,
		}),
		orientation: defineEnumProp({
			options: ["vertical", "horizontal"],
			definition: OrientationProp,
			description: "The orientation of the accordion.",
			default: "vertical",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		orientationDataAttr,
		disabledDataAttr,
		defineSimpleDataAttr({
			name: "accordion-root",
			description: "Present on the root element.",
		}),
	],
});

const item = defineComponentApiSchema<AccordionItemPropsWithoutHTML>({
	title: "Item",
	description: "An accordion item.",
	props: {
		disabled: defineBooleanProp({
			description: "Whether or not the accordion item is disabled.",
			default: false,
		}),
		value: defineStringProp({
			description:
				"The value of the accordion item. This is used to identify when the item is open or closed. If not provided, a unique ID will be generated for this value.",
			default: "A random unique ID",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		stateDataAttr,
		disabledDataAttr,
		orientationDataAttr,
		defineSimpleDataAttr({
			name: "accordion-item",
			description: "Present on the item element.",
		}),
	],
});

const trigger = defineComponentApiSchema<AccordionTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button responsible for toggling the accordion item.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
	dataAttributes: [
		orientationDataAttr,
		disabledDataAttr,
		defineSimpleDataAttr({
			name: "accordion-trigger",
			description: "Present on the trigger element.",
		}),
	],
});

const content = defineComponentApiSchema<AccordionContentPropsWithoutHTML>({
	title: "Content",
	description: "The accordion item content, which is displayed when the item is open.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({
			elType: "HTMLDivElement",
			child: {
				definition: ContentChildSnippetProps,
				stringDefinition: `type SnippetProps = {
	open: boolean;
	props: Record<string, unknown>;
};`,
			},
		}),
	},
	dataAttributes: [
		orientationDataAttr,
		disabledDataAttr,
		defineSimpleDataAttr({
			name: "accordion-content",
			description: "Present on the content element.",
		}),
	],
	cssVars: [
		defineCSSVarSchema({
			name: "--bits-accordion-content-height",
			description: "The height of the accordion content element.",
		}),
		defineCSSVarSchema({
			name: "--bits-accordion-content-width",
			description: "The width of the accordion content element.",
		}),
	],
});

const header = defineComponentApiSchema<AccordionHeaderPropsWithoutHTML>({
	title: "Header",
	description: "The header of the accordion item.",
	props: {
		level: defineUnionProp({
			options: ["1", "2", "3", "4", "5", "6"],
			definition: HeaderLevelProp,
			description:
				"The heading level of the header. This will be set as the `aria-level` attribute.",
			default: "3",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		orientationDataAttr,
		disabledDataAttr,
		defineEnumDataAttr({
			name: "heading-level",
			description: "The heading level of the element.",
			options: ["1", "2", "3", "4", "5", "6"],
			value: HeaderLevelProp,
		}),
		defineSimpleDataAttr({
			name: "accordion-header",
			description: "Present on the header element.",
		}),
	],
});

export const accordion = [root, item, header, trigger, content];
