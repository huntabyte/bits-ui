import type {
	TabsContentPropsWithoutHTML,
	TabsListPropsWithoutHTML,
	TabsRootPropsWithoutHTML,
	TabsTriggerPropsWithoutHTML,
} from "bits-ui";
import { enums, union, withChildProps } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

const root: APISchema<TabsRootPropsWithoutHTML> = {
	title: "Root",
	description: "The root tabs component which contains the other tab components.",
	props: {
		value: {
			type: {
				type: C.UNION,
				definition: union("string", "undefined"),
			},
			description: "The active tab value.",
			bindable: true,
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: string | undefined) => void",
			},
			description: "A callback function called when the active tab value changes.",
		},
		activationMode: {
			type: {
				type: C.ENUM,
				definition: enums("manual", "automatic"),
			},
			description:
				"How the activation of tabs should be handled. If set to `'automatic'`, the tab will be activated when the trigger is focused. If set to `'manual'`, the tab will be activated when the trigger is pressed.",
			default: "automatic",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the tabs are disabled.",
		},

		loop: {
			default: C.TRUE,
			type: C.BOOLEAN,
			description: "Whether or not the tabs should loop when navigating with the keyboard.",
		},
		orientation: {
			default: C.HORIZONTAL,
			type: {
				type: C.ENUM,
				definition: enums(C.HORIZONTAL, C.VERTICAL),
			},
			description: "The orientation of the tabs.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "orientation",
			value: enums("horizontal", "vertical"),
			description: "The orientation of the tabs.",
		},
		{
			name: "tabs-root",
			description: "Present on the root element.",
		},
	],
};

const list: APISchema<TabsListPropsWithoutHTML> = {
	title: "List",
	description: "The component containing the tab triggers.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		{
			name: "orientation",
			value: enums("horizontal", "vertical"),
			description: "The orientation of the tabs.",
		},
		{
			name: "tabs-list",
			description: "Present on the list element.",
		},
	],
};

const trigger: APISchema<TabsTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description: "The trigger for a tab.",
	props: {
		value: {
			required: true,
			type: "string",
			description: "The value of the tab this trigger represents.",
		},
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the tab is disabled.",
		},
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		{
			name: "state",
			description: "The state of the tab trigger.",
			value: enums("active", "inactive"),
			isEnum: true,
		},
		{
			name: "value",
			description: "The value of the tab this trigger represents.",
		},
		{
			name: "orientation",
			description: "The orientation of the tabs.",
			value: enums("horizontal", "vertical"),
			isEnum: true,
		},
		{
			name: "disabled",
			description: "Present when the tab trigger is disabled.",
		},
		{
			name: "tabs-trigger",
			description: "Present on the trigger elements.",
		},
	],
};

const content: APISchema<TabsContentPropsWithoutHTML> = {
	title: "Content",
	description: "The panel containing the contents of a tab.",
	props: {
		value: {
			required: true,
			type: "string",
			description: "The value of the tab this content represents.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		{
			name: "tabs-content",
			description: "Present on the content elements.",
		},
	],
};

export const tabs = [root, list, trigger, content];
