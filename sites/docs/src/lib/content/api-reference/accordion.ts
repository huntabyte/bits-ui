import type {
	AccordionContentPropsWithoutHTML,
	AccordionHeaderPropsWithoutHTML,
	AccordionItemPropsWithoutHTML,
	AccordionRootPropsWithoutHTML,
	AccordionTriggerPropsWithoutHTML,
} from "bits-ui";
import { builderAndAttrsSlotProps, forceMountProp, withChildProps } from "./helpers.js";
import { enums, union } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<AccordionRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root accordion component used to set and manage the state of the accordion.",
	props: {
		type: {
			type: {
				type: C.ENUM,
				definition: enums("single", "multiple"),
			},
			description:
				"The type of accordion. If set to `'multiple'`, the accordion will allow multiple items to be open at the same time. If set to `single`, the accordion will only allow a single item to be open.",
			required: true,
		},
		value: {
			type: {
				type: C.UNION,
				definition: union("string", "string[]"),
			},
			description:
				"The active accordion item value. If `type` is `'multiple'`, this should be an array of values. If `type` is `'single'`, this should be a string.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: union("(value: string) => void", "(value: string[]) => void"),
			},
			description: "A callback function called when the active accordion item value changes.",
		},
		disabled: {
			default: "false",
			type: C.BOOLEAN,
			description: "Whether or not the accordion is disabled.",
		},
		loop: {
			default: "false",
			type: C.BOOLEAN,
			description:
				"Whether or not the accordion should loop through items when reaching the end.",
		},
		orientation: {
			type: {
				type: C.ENUM,
				definition: enums("horizontal", "vertical"),
			},
			description: "The orientation of the accordion.",
			default: "vertical",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	slotProps: {
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "orientation",
			value: enums("horizontal", "vertical"),
			description: "The orientation of the accordion.",
			isEnum: true,
		},
		{
			name: "accordion-root",
			value: "",
			description: "Present on the root element.",
		},
	],
};

const item: APISchema<AccordionItemPropsWithoutHTML> = {
	title: "Item",
	description: "An accordion item.",
	props: {
		value: {
			required: true,
			type: "string",
			description: "The value of the accordion item.",
		},
		disabled: {
			default: "false",
			type: "boolean",
			description: "Whether or not the accordion item is disabled.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	slotProps: {
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The state of the accordion item.",
			isEnum: true,
		},
		{
			name: "disabled",
			value: "",
			description: "Present when the accordion item is disabled.",
		},
		{
			name: "accordion-item",
			description: "Present on the item element.",
		},
	],
};

const trigger: APISchema<AccordionTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description: "The accordion item trigger, which opens and closes the accordion item.",
	props: {
		...withChildProps({ elType: "HTMLButtonElement" }),
		disabled: {
			type: {
				type: C.UNION,
				definition: union("boolean", "null", "undefined"),
			},
			default: "false",
			description: "Whether or not the accordion item trigger is disabled.",
		},
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The state of the accordion item.",
			isEnum: true,
		},
		{
			name: "disabled",
			description: "Present when the accordion item is disabled.",
		},
		{
			name: "value",
			description: "The value of the accordion item.",
		},
		{
			name: "accordion-trigger",
			description: "Present on the trigger element.",
		},
	],
};

const content: APISchema<AccordionContentPropsWithoutHTML> = {
	title: "Content",
	description: "The accordion item content, which is displayed when the item is open.",
	props: {
		...withChildProps({ elType: "HTMLDivElement" }),
		forceMount: forceMountProp,
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			value: enums("open", "closed"),
			description: "The state of the accordion item.",
			isEnum: true,
		},
		{
			name: "disabled",
			description: "Present when the accordion item is disabled.",
		},
		{
			name: "value",
			description: "The value of the accordion item.",
		},
		{
			name: "accordion-content",
			description: "Present on the content element.",
		},
	],
};

const header: APISchema<AccordionHeaderPropsWithoutHTML> = {
	title: "Header",
	description: "The accordion item header, which wraps the trigger and makes it more accessible.",
	props: {
		level: {
			type: {
				type: C.ENUM,
				definition: union("1", "2", "3", "4", "5", "6"),
			},
			description:
				"The heading level to use for the header. This will be set as the `aria-level` attribute.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	slotProps: {
		...builderAndAttrsSlotProps,
	},
	dataAttributes: [
		{
			name: "heading-level",
			value: enums("1", "2", "3", "4", "5", "6"),
			description: "The heading level of the header.",
			isEnum: true,
		},
		{
			name: "accordion-header",
			description: "Present on the header element.",
		},
	],
};

export const accordion = [root, item, header, trigger, content];
