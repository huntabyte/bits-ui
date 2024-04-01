import type {
	AccordionContentPropsWithoutHTML,
	AccordionHeaderPropsWithoutHTML,
	AccordionItemPropsWithoutHTML,
	AccordionPropsWithoutHTML,
	AccordionTriggerPropsWithoutHTML,
} from "bits-ui";
import { builderAndAttrsSlotProps, domElProps } from "./helpers.js";
import { enums, transitionProps, union } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<AccordionPropsWithoutHTML<false>> = {
	title: "Root",
	description: "The root accordion component used to set and manage the state of the accordion.",
	props: {
		multiple: {
			default: "false",
			type: C.BOOLEAN,
			description: "Whether or not multiple accordion items can be active at the same time.",
		},
		disabled: {
			default: "false",
			type: C.BOOLEAN,
			description: "Whether or not the accordion is disabled.",
		},
		value: {
			type: {
				type: C.UNION,
				definition: union("string", "undefined"),
			},
			description: "The active accordion item value.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: string | undefined) => void",
			},
			description: "A callback function called when the active accordion item value changes.",
		},
		...domElProps("HTMLDivElement"),
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
		...domElProps("HTMLDivElement"),
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
	props: { ...domElProps("HTMLButtonElement") },
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
	props: { ...transitionProps, ...domElProps("HTMLDivElement") },
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
		...domElProps("HTMLDivElement"),
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
