import type { PinInputCellPropsWithoutHTML, PinInputRootPropsWithoutHTML } from "bits-ui";
import {
	PinInputCellCellProp,
	PinInputRootChildSnippetProps,
	PinInputRootChildrenSnippetProps,
	PinInputRootOnCompleteProp,
	PinInputRootPasteTransformerProp,
	PinInputRootPushPasswordManagerStrategyProp,
	PinInputRootTextAlignProp,
} from "./extended-types/pin-input/index.js";
import pinInputCellCellPropRaw from "./extended-types/pin-input/pin-input-cell-cell-prop.md?raw";
import pinInputRootChildSnippetPropsRaw from "./extended-types/pin-input/pin-input-root-child-snippet-props.md?raw";
import pinInputRootChildrenSnippetPropsRaw from "./extended-types/pin-input/pin-input-root-children-snippet-props.md?raw";
import { OnStringValueChangeProp } from "./extended-types/shared/index.js";
import { withChildProps } from "$lib/content/api-reference/shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumProp,
	defineFunctionProp,
	defineNumberProp,
	defineObjectProp,
	defineSimpleDataAttr,
	defineSimplePropSchema,
	defineStringProp,
	stringDefinitionFromMarkdown,
} from "../utils.js";

const root = defineComponentApiSchema<PinInputRootPropsWithoutHTML>({
	title: "Root",
	description: "The pin input container component.",
	props: {
		value: defineStringProp({
			description: "The value of the input.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			description: "A callback function that is called when the value of the input changes.",
			definition: OnStringValueChangeProp,
			stringDefinition: "(value: string) => void",
		}),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the pin input is disabled.",
		}),
		textalign: defineEnumProp({
			description:
				"Where is the text located within the input. Affects click-holding or long-press behavior",
			options: ["left", "center", "right"],
			definition: PinInputRootTextAlignProp,
			default: "left",
		}),
		maxlength: defineNumberProp({
			description: "The maximum length of the pin input.",
			default: 6,
		}),
		onComplete: defineFunctionProp({
			description: "A callback function that is called when the input is completely filled.",
			definition: PinInputRootOnCompleteProp,
			stringDefinition: "(...args: any[]) => void",
		}),
		pasteTransformer: defineFunctionProp({
			description:
				"A callback function that is called when the user pastes text into the input. It receives the pasted text as an argument and should return the sanitized text. Useful for cleaning up pasted text, like removing hyphens or other characters that should not make it into the input.",
			definition: PinInputRootPasteTransformerProp,
			stringDefinition: "(text: string) => string",
		}),
		inputId: defineStringProp({
			description: "Optionally provide an ID to apply to the hidden input element.",
		}),
		inputRef: defineSimplePropSchema({
			type: "HTMLInputElement",
			description:
				"The hidden `<input>` element that holds the OTP value. Bind to this to call `focus()`, read the selection, etc.",
			bindable: true,
			default: "null",
		}),
		pushPasswordManagerStrategy: defineEnumProp({
			description:
				"Enabled by default, it's an optional strategy for detecting Password Managers in the page and then shifting their badges to the right side, outside the input.",
			definition: PinInputRootPushPasswordManagerStrategyProp,
			options: ["increase-width", "none"],
		}),
		...withChildProps({
			elType: "HTMLDivElement",
			child: {
				definition: PinInputRootChildSnippetProps,
				stringDefinition: stringDefinitionFromMarkdown(pinInputRootChildSnippetPropsRaw),
			},
			children: {
				definition: PinInputRootChildrenSnippetProps,
				stringDefinition: stringDefinitionFromMarkdown(pinInputRootChildrenSnippetPropsRaw),
			},
		}),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "pin-input-root",
			description: "Present on the root element.",
		}),
	],
});

const cell = defineComponentApiSchema<PinInputCellPropsWithoutHTML>({
	title: "Cell",
	description: "A single cell of the pin input.",
	props: {
		cell: defineObjectProp({
			definition: PinInputCellCellProp,
			description:
				"The cell object provided by the `cells` snippet prop from the `PinInput.Root` component.",
			stringDefinition: stringDefinitionFromMarkdown(pinInputCellCellPropRaw),
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "active",
			description: "Present when the cell is active.",
		}),
		defineSimpleDataAttr({
			name: "inactive",
			description: "Present when the cell is inactive.",
		}),
		defineSimpleDataAttr({
			name: "pin-input-cell",
			description: "Present on the cell element.",
		}),
	],
});

export const pinInput = [root, cell];
