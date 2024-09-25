import type { ToggleGroupItemPropsWithoutHTML, ToggleGroupRootPropsWithoutHTML } from "bits-ui";
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

const root = createApiSchema<ToggleGroupRootPropsWithoutHTML>({
	title: "Root",
	description: "The root component which contains the toggle group items.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			description: "The type of toggle group.",
			required: true,
		}),
		value: createUnionProp({
			options: ["string", "string[]"],
			description:
				"The value of the toggle group. If the `type` is `'multiple'`, this will be an array of strings, otherwise it will be a string.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: union("(value: string) => void", "(value: string[]) => void"),
			description:
				"A callback function called when the value of the toggle group changes. The type of the value is dependent on the type of the toggle group.",
		}),
		controlledValue: controlledValueProp,
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is disabled.",
		}),
		loop: createBooleanProp({
			default: C.TRUE,
			description: "Whether or not the toggle group should loop when navigating.",
		}),
		orientation: createEnumProp({
			options: [C.HORIZONTAL, C.VERTICAL],
			default: C.HORIZONTAL,
			description: "The orientation of the toggle group.",
		}),
		rovingFocus: createBooleanProp({
			default: C.TRUE,
			description: "Whether or not the toggle group should use roving focus when navigating.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
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
});

const item = createApiSchema<ToggleGroupItemPropsWithoutHTML>({
	title: "Item",
	description: "An individual toggle item within the group.",
	props: {
		value: createStringProp({
			description: "The value of the item.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
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
});

export const toggleGroup = [root, item];
