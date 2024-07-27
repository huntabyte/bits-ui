import type {
	AccordionContentPropsWithoutHTML,
	AccordionHeaderPropsWithoutHTML,
	AccordionItemPropsWithoutHTML,
	AccordionRootPropsWithoutHTML,
	AccordionTriggerPropsWithoutHTML,
} from "bits-ui";
import {
	createApiSchema,
	createBooleanProp,
	createEnumProp,
	createFunctionProp,
	createStringProp,
	createUnionProp,
	forceMountProp,
	withChildProps,
} from "./helpers.js";
import * as C from "$lib/content/constants.js";
import StringOrArrayString from "./extended-types/string-or-array-string.md";
import SingleOrMultiple from "./extended-types/single-or-multiple.md";
import StringOrArrayChangeFn from "./extended-types/string-or-array-change-fn.md";
import Orientation from "./extended-types/orientation.md";
import HeaderLevel from "./extended-types/header-level.md";

const root = createApiSchema<AccordionRootPropsWithoutHTML>({
	title: "Root",
	description: "The root accordion component used to set and manage the state of the accordion.",
	props: {
		type: createEnumProp({
			options: ["single", "multiple"],
			definition: SingleOrMultiple,
			description:
				"The type of accordion. If set to `'multiple'`, the accordion will allow multiple items to be open at the same time. If set to `single`, the accordion will only allow a single item to be open.",
			required: true,
		}),
		value: createUnionProp({
			options: ["string[]", "string"],
			definition: StringOrArrayString,
			description:
				"The value of the currently active accordion item. If `type` is `'single'`, this should be a string. If `type` is `'multiple'`, this should be an array of strings.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			definition: StringOrArrayChangeFn,
			description:
				"A callback function called when the active accordion item value changes. If the `type` is `'single'`, the argument will be a string. If `type` is `'multiple'`, the argument will be an array of strings.",
		}),
		disabled: createBooleanProp({
			description:
				"Whether or not the accordion is disabled. When disabled, the accordion cannot be interacted with.",
			default: C.FALSE,
		}),
		loop: createBooleanProp({
			description:
				"Whether or not the accordion should loop through items when reaching the end.",
			default: C.FALSE,
		}),
		orientation: createEnumProp({
			options: ["vertical", "horizontal"],
			definition: Orientation,
			description: "The orientation of the accordion.",
			default: "vertical",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

const item = createApiSchema<AccordionItemPropsWithoutHTML>({
	title: "Item",
	description: "An accordion item.",
	props: {
		disabled: createBooleanProp({
			description: "Whether or not the accordion item is disabled.",
			default: C.FALSE,
		}),
		value: createStringProp({
			description:
				"The value of the accordion item. This is used to identify when the item is open or closed.",
			required: true,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

const trigger = createApiSchema<AccordionTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button responsible for toggling the accordion item.",
	props: withChildProps({ elType: "HTMLButtonElement" }),
});

const content = createApiSchema<AccordionContentPropsWithoutHTML>({
	title: "Content",
	description: "The accordion item content, which is displayed when the item is open.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

const header = createApiSchema<AccordionHeaderPropsWithoutHTML>({
	title: "Header",
	description: "The header of the accordion item.",
	props: {
		level: createUnionProp({
			options: ["1", "2", "3", "4", "5", "6"],
			definition: HeaderLevel,
			description:
				"The heading level of the header. This will be set as the `aria-level` attribute.",
			default: "3",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const accordion = [root, item, header, trigger, content];
