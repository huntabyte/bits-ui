import type { SwitchRootPropsWithoutHTML, SwitchThumbPropsWithoutHTML } from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createFunctionProp,
	createStringProp,
	withChildProps,
} from "./helpers.js";
import { enums } from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";
import SwitchChildSnippetProps from "./extended-types/switch/root-child-snippet-props.md";
import SwitchChildrenSnippetProps from "./extended-types/switch/root-children-snippet-props.md";

const root = createApiSchema<SwitchRootPropsWithoutHTML>({
	title: "Root",
	description: "The root switch component used to set and manage the state of the switch.",
	props: {
		checked: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is checked.",
			bindable: true,
		}),
		onCheckedChange: createFunctionProp({
			definition: "(checked: boolean) => void",
			description: "A callback function called when the checked state of the switch changes.",
		}),
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is disabled.",
		}),
		name: createStringProp({
			description:
				"The name of the hidden input element, used to identify the input in form submissions.",
		}),
		required: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the switch is required to be checked.",
		}),
		value: createStringProp({
			description:
				"The value of the hidden input element to be used in form submissions when the switch is checked.",
		}),
		...withChildProps({
			elType: "HTMLButtonElement",
			childrenDef: SwitchChildrenSnippetProps,
			childDef: SwitchChildSnippetProps,
		}),
	},
	dataAttributes: [
		{
			name: "state",
			description: "The switch's checked state.",
			value: enums("checked", "unchecked"),
			isEnum: true,
		},
		{
			name: "checked",
			description: "Present when the switch is checked.",
		},
		{
			name: "disabled",
			description: "Present when the switch is disabled.",
		},
		{
			name: "switch-root",
			description: "Present on the root element.",
		},
	],
});

const thumb = createApiSchema<SwitchThumbPropsWithoutHTML>({
	title: "Thumb",
	description: "The thumb on the switch used to indicate the switch's state.",
	props: withChildProps({
		elType: "HTMLSpanElement",
		childrenDef: SwitchChildrenSnippetProps,
		childDef: SwitchChildSnippetProps,
	}),
	dataAttributes: [
		{
			name: "state",
			description: "The switch's checked state.",
			value: enums("checked", "unchecked"),
			isEnum: true,
		},
		{
			name: "checked",
			description: "Present when the switch is checked.",
		},
		{
			name: "switch-thumb",
			description: "Present on the thumb element.",
		},
	],
});

export const switchData = [root, thumb];
