import type { ToggleGroupItemPropsWithoutHTML, ToggleGroupPropsWithoutHTML } from "bits-ui";
import {
	builderAndAttrsSlotProps,
	domElProps,
	enums,
	union,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<ToggleGroupPropsWithoutHTML<"multiple">> = {
	title: "Root",
	description: "The root component which contains the toggle group items.",
	props: {
		value: {
			type: union(C.STRING, "string[]"),
			description:
				"The value of the toggle group. If the type is multiple, this will be an array of strings, otherwise it will be a string.",
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: union("(value: string) => void", "(value: string[]) => void"),
			},
			description:
				"A callback function called when the value of the toggle group changes. The type of the value is dependent on the type of the toggle group.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the switch is disabled.",
		},
		loop: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether or not the toggle group should loop when navigating.",
		},
		orientation: {
			default: C.HORIZONTAL,
			type: enums(C.HORIZONTAL, C.VERTICAL),
			description: "The orientation of the toggle group.",
		},
		rovingFocus: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether or not the toggle group should use roving focus when navigating.",
		},
		type: {
			default: "single",
			description: "The type of toggle group.",
			type: enums("single", "multiple"),
		},
		...domElProps("HTMLDivElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "orientation",
			description: "The orientation of the toggle group.",
		},
		{
			name: "toggle-group-root",
			description: "Present on the root element.",
		},
	],
};

const item: APISchema<ToggleGroupItemPropsWithoutHTML> = {
	title: "Item",
	description: "An individual toggle item within the group.",
	props: {
		value: {
			type: C.STRING,
			description: "The value of the item.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the switch is disabled.",
		},
		...domElProps("HTMLButtonElement"),
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			description: "Whether the toggle item is in the on or off state.",
			value: enums("on", "off"),
			isEnum: true,
		},
		{
			name: "value",
			description: "The value of the toggle item.",
		},
		{
			name: "orientation",
			description: "The orientation of the toggle group.",
		},
		{
			name: "disabled",
			description: "Present when the toggle item is disabled.",
		},
		{
			name: "toggle-group-item",
			description: "Present on the item elements.",
		},
	],
};

export const toggleGroup = [root, item];
