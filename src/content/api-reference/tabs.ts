import type { APISchema } from "@/types";
import * as C from "@/content/constants.js";
import {
	union,
	enums,
	builderAndAttrsSlotProps,
	domElProps
} from "@/content/api-reference/helpers.js";
import type * as Tabs from "$lib/bits/tabs/_types.js";

const root: APISchema<Tabs.Props> = {
	title: "Root",
	description: "The root tabs component which contains the other tab components.",
	props: {
		value: {
			type: {
				type: C.UNION,
				definition: union("string", "undefined")
			},
			description: "The active tab value."
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: string | undefined) => void"
			},
			description: "A callback function called when the active tab value changes."
		},
		activateOnFocus: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether or not to activate the tab when it receives focus."
		},
		autoSet: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether or not to automatically set the tab value when it receives focus."
		},
		loop: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether or not the tabs should loop when navigating with the keyboard."
		},
		orientation: {
			default: C.HORIZONTAL,
			type: {
				type: C.ENUM,
				definition: enums(C.HORIZONTAL, C.VERTICAL)
			},
			description: "The orientation of the tabs."
		},
		...domElProps("HTMLDivElement")
	},
	slotProps: {
		...builderAndAttrsSlotProps,
		value: {
			type: C.STRING,
			description: "The currently active tab value."
		}
	},
	dataAttributes: [
		{
			name: "orientation",
			value: enums("horizontal", "vertical"),
			description: "The orientation of the tabs."
		},
		{
			name: "tabs-root",
			description: "Present on the root element."
		}
	]
};

const list: APISchema<Tabs.ListProps> = {
	title: "List",
	description: "The component containing the tab triggers.",
	props: domElProps("HTMLDivElement"),
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "orientation",
			value: enums("horizontal", "vertical"),
			description: "The orientation of the tabs."
		},
		{
			name: "tabs-list",
			description: "Present on the list element."
		}
	]
};

const trigger: APISchema<Tabs.TriggerProps> = {
	title: "Trigger",
	description: "The trigger for a tab.",
	props: {
		value: {
			required: true,
			type: "string",
			description: "The value of the tab this trigger represents."
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the tab is disabled."
		},
		...domElProps("HTMLButtonElement")
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "state",
			description: "The state of the tab trigger.",
			value: enums("active", "inactive"),
			isEnum: true
		},
		{
			name: "value",
			description: "The value of the tab this trigger represents."
		},
		{
			name: "orientation",
			description: "The orientation of the tabs.",
			value: enums("horizontal", "vertical"),
			isEnum: true
		},
		{
			name: "disabled",
			description: "Present when the tab trigger is disabled."
		},
		{
			name: "tabs-trigger",
			description: "Present on the trigger elements."
		}
	]
};

const content: APISchema<Tabs.ContentProps> = {
	title: "Content",
	description: "The panel containing the contents of a tab.",
	props: {
		value: {
			required: true,
			type: "string",
			description: "The value of the tab this content represents."
		},
		...domElProps("HTMLDivElement")
	},
	slotProps: { ...builderAndAttrsSlotProps },
	dataAttributes: [
		{
			name: "tabs-content",
			description: "Present on the content elements."
		}
	]
};

export const tabs = [root, list, trigger, content];
