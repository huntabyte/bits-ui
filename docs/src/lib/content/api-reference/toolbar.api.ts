import type {
	ToolbarButtonPropsWithoutHTML,
	ToolbarGroupItemPropsWithoutHTML,
	ToolbarGroupPropsWithoutHTML,
	ToolbarLinkPropsWithoutHTML,
	ToolbarRootPropsWithoutHTML,
} from "bits-ui";
import {
	OnChangeStringOrArrayProp,
	OrientationProp,
	StringOrArrayStringProp,
} from "./extended-types/shared/index.js";
import { ToggleRootStateDataAttr } from "./extended-types/toggle/index.js";
import {
	orientationDataAttr,
	typeSingleOrMultipleProp,
	withChildProps,
} from "$lib/content/api-reference/shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineSimpleDataAttr,
	defineStringProp,
	defineUnionProp,
} from "../utils.js";

const root = defineComponentApiSchema<ToolbarRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component which contains the toolbar.",
	props: {
		loop: defineBooleanProp({
			default: true,
			description: "Whether or not the toolbar should loop when navigating.",
		}),
		orientation: defineEnumProp({
			options: ["horizontal", "vertical"],
			definition: OrientationProp,
			default: "horizontal",
			description: "The orientation of the toolbar.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		orientationDataAttr,
		defineSimpleDataAttr({
			name: "toolbar-root",
			description: "Present on the root element.",
		}),
	],
});

const button = defineComponentApiSchema<ToolbarButtonPropsWithoutHTML>({
	title: "Button",
	description: "A button in the toolbar.",
	props: {
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the button is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "toolbar-button",
			description: "Present on the button element.",
		}),
	],
});

const link = defineComponentApiSchema<ToolbarLinkPropsWithoutHTML>({
	title: "Link",
	description: "A link in the toolbar.",
	props: withChildProps({ elType: "HTMLAnchorElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "toolbar-link",
			description: "Present on the link element.",
		}),
	],
});

const group = defineComponentApiSchema<ToolbarGroupPropsWithoutHTML>({
	title: "Group",
	description: "A group of toggle items in the toolbar.",
	props: {
		type: typeSingleOrMultipleProp,
		value: defineUnionProp({
			options: ["string", "string[]"],
			description:
				"The value of the toggle group. If the type is multiple, this will be an array of strings, otherwise it will be a string.",
			definition: StringOrArrayStringProp,
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: OnChangeStringOrArrayProp,
			description: "A callback function called when the value changes.",
			stringDefinition: "(value: string) => void | (value: string[]) => void",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the switch is disabled.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "toolbar-group",
			description: "Present on the group element.",
		}),
	],
});

const groupItem = defineComponentApiSchema<ToolbarGroupItemPropsWithoutHTML>({
	title: "GroupItem",
	description: "A toggle item in the toolbar toggle group.",
	props: {
		value: defineStringProp({
			description:
				"The value of the toolbar toggle group item. When the toolbar toggle group item is selected, toolbar the toggle group's value will be set to this value if in single mode, or this value will be pushed to the toggle group's array value if in multiple mode.",
			required: true,
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the item is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "state",
			description: "Whether the toolbar toggle item is in the on or off state.",
			options: ["on", "off"],
			value: ToggleRootStateDataAttr,
		}),
		defineSimpleDataAttr({
			name: "value",
			description: "The value of the toolbar toggle item.",
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the toolbar toggle item is disabled.",
		}),
		defineSimpleDataAttr({
			name: "toolbar-item",
			description: "Present on the toolbar toggle item.",
		}),
	],
});

export const toolbar = [root, button, link, group, groupItem];
