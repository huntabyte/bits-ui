import type {
	ToolbarButtonPropsWithoutHTML,
	ToolbarGroupItemPropsWithoutHTML,
	ToolbarGroupPropsWithoutHTML,
	ToolbarLinkPropsWithoutHTML,
	ToolbarRootPropsWithoutHTML,
} from "bits-ui";
import {
	controlledValueProp,
	createApiSchema,
	createBooleanProp,
	createEnumProp,
	createFunctionProp,
	createStringProp,
	createUnionProp,
	enums,
	union,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const root = createApiSchema<ToolbarRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component which contains the toolbar.",
	props: {
		loop: createBooleanProp({
			default: C.TRUE,
			description: "Whether or not the toolbar should loop when navigating.",
		}),
		orientation: createEnumProp({
			options: [C.HORIZONTAL, C.VERTICAL],
			default: C.HORIZONTAL,
			description: "The orientation of the toolbar.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "orientation",
			description: "The orientation of the toolbar.",
		},
		{
			name: "toolbar-root",
			description: "Present on the root element.",
		},
	],
});

const button = createApiSchema<ToolbarButtonPropsWithoutHTML>({
	title: "Button",
	description: "A button in the toolbar.",
	props: {
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the button is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		{
			name: "toolbar-button",
			description: "Present on the button element.",
		},
	],
});

const link = createApiSchema<ToolbarLinkPropsWithoutHTML>({
	title: "Link",
	description: "A link in the toolbar.",
	props: withChildProps({ elType: "HTMLAnchorElement" }),
	dataAttributes: [
		{
			name: "toolbar-link",
			description: "Present on the link element.",
		},
	],
});

const group = createApiSchema<ToolbarGroupPropsWithoutHTML>({
	title: "Group",
	description: "A group of toggle items in the toolbar.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			default: "'single'",
			description: "The type of toggle group.",
			required: true,
		}),
		value: createUnionProp({
			options: ["string", "string[]"],
			description:
				"The value of the toggle group. If the type is multiple, this will be an array of strings, otherwise it will be a string.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: union("(value: string) => void", "(value: string[]) => void"),
			description: "A callback function called when the value changes.",
		}),
		controlledValue: controlledValueProp,
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is disabled.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "toolbar-group",
			description: "Present on the group element.",
		},
	],
});

const groupItem = createApiSchema<ToolbarGroupItemPropsWithoutHTML>({
	title: "GroupItem",
	description: "A toggle item in the toolbar toggle group.",
	props: {
		value: createStringProp({
			description:
				"The value of the toolbar toggle group item. When the toolbar toggle group item is selected, toolbar the toggle group's value will be set to this value if in single mode, or this value will be pushed to the toggle group's array value if in multiple mode.",
			required: true,
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the item is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		{
			name: "state",
			description: "Whether the toolbar toggle item is in the on or off state.",
			value: enums("on", "off"),
			isEnum: true,
		},
		{
			name: "value",
			description: "The value of the toolbar toggle item.",
		},
		{
			name: "disabled",
			description: "Present when the toolbar toggle item is disabled.",
		},
		{
			name: "toolbar-item",
			description: "Present on the item element.",
		},
	],
});

export const toolbar = [root, button, link, group, groupItem];
