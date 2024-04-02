import type {
	ToolbarButtonPropsWithoutHTML,
	ToolbarGroupItemPropsWithoutHTML,
	ToolbarGroupPropsWithoutHTML,
	ToolbarLinkPropsWithoutHTML,
	ToolbarPropsWithoutHTML,
} from "bits-ui";
import {
	builderAndAttrsSlotProps,
	domElProps,
	enums,
	union,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<ToolbarPropsWithoutHTML> = {
	title: "Root",
	description: "The root component which contains the toolbar.",
	props: {
		loop: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether or not the toolbar should loop when navigating.",
		},
		orientation: {
			default: C.HORIZONTAL,
			type: {
				type: C.ENUM,
				definition: enums(C.HORIZONTAL, C.VERTICAL),
			},
			description: "The orientation of the toolbar.",
		},
		...domElProps("HTMLDivElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps },
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
};

const button: APISchema<ToolbarButtonPropsWithoutHTML> = {
	title: "Button",
	description: "A button in the toolbar.",
	props: domElProps("HTMLButtonElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "toolbar-button",
			description: "Present on the button element.",
		},
	],
};

const link: APISchema<ToolbarLinkPropsWithoutHTML> = {
	title: "Link",
	description: "A link in the toolbar.",
	props: domElProps("HTMLAnchorElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "toolbar-link",
			description: "Present on the link element.",
		},
	],
};

const group: APISchema<ToolbarGroupPropsWithoutHTML<"multiple">> = {
	title: "Group",
	description: "A group of toggle items in the toolbar.",
	props: {
		value: {
			type: {
				type: C.UNION,
				definition: union(C.STRING, "string[]"),
			},
			description:
				"The value of the toggle group. If the type is multiple, this will be an array of strings, otherwise it will be a string.",
		},
		onValueChange: {
			type: C.FUNCTION,
			description: "A callback function called when the value changes.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the switch is disabled.",
		},
		type: {
			default: "single",
			description: "The type of toggle group.",
			type: {
				type: C.ENUM,
				definition: enums("single", "multiple"),
			},
		},
		...domElProps("HTMLDivElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "toolbar-group",
			description: "Present on the group element.",
		},
	],
};

const groupItem: APISchema<ToolbarGroupItemPropsWithoutHTML> = {
	title: "GroupItem",
	description: "A toggle item in the toolbar toggle group.",
	props: {
		value: {
			type: C.STRING,
			description:
				"The value of the toolbar toggle group item. When the toolbar toggle group item is selected, toolbar the toggle group's value will be set to this value if in single mode, or this value will be pushed to the toggle group's array value if in multiple mode.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the item is disabled.",
		},
		...domElProps("HTMLButtonElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps },
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
};

export const toolbar = [root, button, link, group, groupItem];
