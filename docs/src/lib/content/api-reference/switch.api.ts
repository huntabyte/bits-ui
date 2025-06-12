import type { SwitchRootPropsWithoutHTML, SwitchThumbPropsWithoutHTML } from "bits-ui";
import { checkedProp, onCheckedChangeProp, withChildProps } from "./shared.js";
import {
	SwitchCheckedDataAttr,
	SwitchRootChildSnippetProps,
	SwitchRootChildrenSnippetProps,
} from "./extended-types/switch/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineSimpleDataAttr,
	defineStringProp,
} from "../utils.js";

const stateDataAttr = defineEnumDataAttr({
	name: "state",
	description: "The switch's checked state.",
	options: ["checked", "unchecked"],
	value: SwitchCheckedDataAttr,
});

const root = defineComponentApiSchema<SwitchRootPropsWithoutHTML>({
	title: "Root",
	description: "The root switch component used to set and manage the state of the switch.",
	props: {
		checked: checkedProp,
		onCheckedChange: onCheckedChangeProp,
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the switch is disabled.",
		}),
		name: defineStringProp({
			description:
				"The name of the hidden input element, used to identify the input in form submissions.",
		}),
		required: defineBooleanProp({
			default: false,
			description: "Whether or not the switch is required to be checked.",
		}),
		value: defineStringProp({
			description:
				"The value of the hidden input element to be used in form submissions when the switch is checked.",
		}),
		...withChildProps({
			elType: "HTMLButtonElement",
			children: {
				definition: SwitchRootChildrenSnippetProps,
				stringDefinition: `type ChildrenSnippetProps = {
	checked: boolean;
};`,
			},
			child: {
				definition: SwitchRootChildSnippetProps,
				stringDefinition: `type ChildSnippetProps = {
	checked: boolean;
	props: Record<string, unknown>;
};`,
			},
		}),
	},
	dataAttributes: [
		stateDataAttr,
		defineSimpleDataAttr({
			name: "checked",
			description: "Present when the switch is checked.",
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the switch is disabled.",
		}),
		defineSimpleDataAttr({
			name: "switch-root",
			description: "Present on the root element.",
		}),
	],
});

const thumb = defineComponentApiSchema<SwitchThumbPropsWithoutHTML>({
	title: "Thumb",
	description: "The thumb on the switch used to indicate the switch's state.",
	props: withChildProps({
		elType: "HTMLSpanElement",
		children: {
			definition: SwitchRootChildrenSnippetProps,
			stringDefinition: `type ChildrenSnippetProps = {
	checked: boolean;
};`,
		},
		child: {
			definition: SwitchRootChildSnippetProps,
			stringDefinition: `type ChildSnippetProps = {
	checked: boolean;
	props: Record<string, unknown>;
};`,
		},
	}),
	dataAttributes: [
		stateDataAttr,
		defineSimpleDataAttr({
			name: "checked",
			description: "Present when the switch is checked.",
		}),
		defineSimpleDataAttr({
			name: "switch-thumb",
			description: "Present on the thumb element.",
		}),
	],
});

export const switchData = [root, thumb];
