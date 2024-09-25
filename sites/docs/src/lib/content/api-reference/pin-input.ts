import type { PinInputCellPropsWithoutHTML, PinInputRootPropsWithoutHTML } from "bits-ui";
import {
	PinInputCellCellProp,
	PinInputRootChildSnippetProps,
	PinInputRootChildrenSnippetProps,
	PinInputRootOnCompleteProp,
	PinInputRootPushPasswordManagerStrategyProp,
	PinInputRootTextAlignProp,
} from "./extended-types/pin-input/index.js";
import { OnStringValueChangeProp } from "./extended-types/shared/index.js";
import {
	controlledValueProp,
	createApiSchema,
	createBooleanProp,
	createDataAttrSchema,
	createEnumProp,
	createFunctionProp,
	createNumberProp,
	createObjectProp,
	createStringProp,
	withChildProps,
} from "$lib/content/api-reference/helpers.js";
import * as C from "$lib/content/constants.js";

const root = createApiSchema<PinInputRootPropsWithoutHTML>({
	title: "Root",
	description: "The pin input container component.",
	props: {
		value: createStringProp({
			description: "The value of the input.",
			bindable: true,
		}),
		onValueChange: createFunctionProp({
			description: "A callback function that is called when the value of the input changes.",
			definition: OnStringValueChangeProp,
		}),
		controlledValue: controlledValueProp,
		disabled: createBooleanProp({
			default: C.FALSE,
			description: "Whether or not the pin input is disabled.",
		}),
		textalign: createEnumProp({
			description:
				"Where is the text located within the input. Affects click-holding or long-press behavior",
			options: ["left", "center", "right"],
			definition: PinInputRootTextAlignProp,
			default: "'left'",
		}),
		maxlength: createNumberProp({
			description: "The maximum length of the pin input.",
			default: "6",
		}),
		onComplete: createFunctionProp({
			description: "A callback function that is called when the input is completely filled.",
			definition: PinInputRootOnCompleteProp,
		}),
		inputId: createStringProp({
			description: "Optionally provide an ID to apply to the hidden input element.",
		}),
		pushPasswordManagerStrategy: createEnumProp({
			description:
				"Enabled by default, it's an optional strategy for detecting Password Managers in the page and then shifting their badges to the right side, outside the input.",
			definition: PinInputRootPushPasswordManagerStrategyProp,
			options: ["increase-width", "none"],
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			childDef: PinInputRootChildSnippetProps,
			childrenDef: PinInputRootChildrenSnippetProps,
		}),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "pin-input-root",
			description: "Present on the root element.",
		}),
	],
});

const cell = createApiSchema<PinInputCellPropsWithoutHTML>({
	title: "Cell",
	description: "A single cell of the pin input.",
	props: {
		cell: createObjectProp({
			definition: PinInputCellCellProp,
			description:
				"The cell object provided by the `cells` snippet prop from the `PinInput.Root` component.",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		createDataAttrSchema({
			name: "active",
			description: "Present when the cell is active.",
		}),
		createDataAttrSchema({
			name: "inactive",
			description: "Present when the cell is inactive.",
		}),
		createDataAttrSchema({
			name: "pin-input-cell",
			description: "Present on the cell element.",
		}),
	],
});

export const pinInput = [root, cell];
