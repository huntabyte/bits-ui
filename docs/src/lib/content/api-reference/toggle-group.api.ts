import type { ToggleGroupItemPropsWithoutHTML, ToggleGroupRootPropsWithoutHTML } from "bits-ui";
import {
	OnChangeStringOrArrayProp,
	OrientationProp,
	StringOrArrayStringProp,
} from "./extended-types/shared/index.js";
import { ToggleRootStateDataAttr } from "./extended-types/toggle/index.js";
import { typeSingleOrMultipleProp, withChildProps } from "$lib/content/api-reference/shared.js";
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

const root = defineComponentApiSchema<ToggleGroupRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component which contains the toggle group items.",
	props: {
		type: typeSingleOrMultipleProp,
		value: defineUnionProp({
			options: ["string", "string[]"],
			definition: StringOrArrayStringProp,
			description:
				"The value of the toggle group. If the `type` is `'multiple'`, this will be an array of strings, otherwise it will be a string.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: OnChangeStringOrArrayProp,
			description:
				"A callback function called when the value of the toggle group changes. The type of the value is dependent on the type of the toggle group.",
			stringDefinition: "(value: string) => void | (value: string[]) => void",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the switch is disabled.",
		}),
		loop: defineBooleanProp({
			default: true,
			description: "Whether or not the toggle group should loop when navigating.",
		}),
		orientation: defineEnumProp({
			options: ["horizontal", "vertical"],
			default: "horizontal",
			definition: OrientationProp,
			description: "The orientation of the toggle group.",
		}),
		rovingFocus: defineBooleanProp({
			default: true,
			description: "Whether or not the toggle group should use roving focus when navigating.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "orientation",
			description: "The orientation of the toggle group.",
			options: ["horizontal", "vertical"],
			value: OrientationProp,
		}),
		defineSimpleDataAttr({
			name: "toggle-group-root",
			description: "Present on the root element.",
		}),
	],
});

const item = defineComponentApiSchema<ToggleGroupItemPropsWithoutHTML>({
	title: "Item",
	description: "An individual toggle item within the group.",
	props: {
		value: defineStringProp({
			description: "The value of the item.",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the switch is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "state",
			description: "Whether the toggle item is in the on or off state.",
			options: ["on", "off"],
			value: ToggleRootStateDataAttr,
		}),
		defineSimpleDataAttr({
			name: "value",
			description: "The value of the toggle item.",
		}),
		defineEnumDataAttr({
			name: "orientation",
			description: "The orientation of the toggle group.",
			options: ["horizontal", "vertical"],
			value: OrientationProp,
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the toggle item is disabled.",
		}),
		defineSimpleDataAttr({
			name: "toggle-group-item",
			description: "Present on the toggle group item.",
		}),
	],
});

export const toggleGroup = [root, item];
