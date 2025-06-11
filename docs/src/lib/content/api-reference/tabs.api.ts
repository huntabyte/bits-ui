import type {
	TabsContentPropsWithoutHTML,
	TabsListPropsWithoutHTML,
	TabsRootPropsWithoutHTML,
	TabsTriggerPropsWithoutHTML,
} from "bits-ui";
import { OnStringValueChangeProp, OrientationProp } from "./extended-types/shared/index.js";
import { TabsRootActivationModeProp, TabsTriggerStateProp } from "./extended-types/tabs/index.js";
import { withChildProps } from "$lib/content/api-reference/shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineSimpleDataAttr,
	defineStringProp,
} from "../utils.js";

const root = defineComponentApiSchema<TabsRootPropsWithoutHTML>({
	title: "Root",
	description: "The root tabs component which contains the other tab components.",
	props: {
		value: defineStringProp({
			description: "The active tab value.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: OnStringValueChangeProp,
			description: "A callback function called when the active tab value changes.",
			stringDefinition: "(value: string) => void",
		}),
		activationMode: defineEnumProp({
			options: ["automatic", "manual"],
			description:
				"How the activation of tabs should be handled. If set to `'automatic'`, the tab will be activated when the trigger is focused. If set to `'manual'`, the tab will be activated when the trigger is pressed.",
			default: "automatic",
			definition: TabsRootActivationModeProp,
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the tabs are disabled.",
		}),
		loop: defineBooleanProp({
			default: true,
			description: "Whether or not the tabs should loop when navigating with the keyboard.",
		}),
		orientation: defineEnumProp({
			options: ["horizontal", "vertical"],
			default: "horizontal",
			description: "The orientation of the tabs.",
			definition: OrientationProp,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "orientation",
			description: "The orientation of the tabs.",
			options: ["horizontal", "vertical"],
			value: OrientationProp,
		}),
		defineSimpleDataAttr({
			name: "tabs-root",
			description: "Present on the root element.",
		}),
	],
});

const list = defineComponentApiSchema<TabsListPropsWithoutHTML>({
	title: "List",
	description: "The component containing the tab triggers.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineEnumDataAttr({
			name: "orientation",
			description: "The orientation of the tabs.",
			options: ["horizontal", "vertical"],
			value: OrientationProp,
		}),
		defineSimpleDataAttr({
			name: "tabs-list",
			description: "Present on the list element.",
		}),
	],
});

const trigger = defineComponentApiSchema<TabsTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The trigger for a tab.",
	props: {
		value: defineStringProp({
			required: true,
			description: "The value of the tab this trigger represents.",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the tab is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
	dataAttributes: [
		defineEnumDataAttr({
			name: "state",
			description: "The state of the tab trigger.",
			options: ["active", "inactive"],
			value: TabsTriggerStateProp,
		}),
		defineSimpleDataAttr({
			name: "value",
			description: "The value of the tab this trigger represents.",
		}),
		defineEnumDataAttr({
			name: "orientation",
			description: "The orientation of the tabs.",
			options: ["horizontal", "vertical"],
			value: OrientationProp,
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the tab trigger is disabled.",
		}),
		defineSimpleDataAttr({
			name: "tabs-trigger",
			description: "Present on the trigger elements.",
		}),
	],
});

const content = defineComponentApiSchema<TabsContentPropsWithoutHTML>({
	title: "Content",
	description: "The panel containing the contents of a tab.",
	props: {
		value: defineStringProp({
			required: true,
			description: "The value of the tab this content represents.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "tabs-content",
			description: "Present on the content elements.",
		}),
	],
});

export const tabs = [root, list, trigger, content];
