import type { PropSchema } from "@/types/api.js";
import * as C from "@/content/constants.js";
import { monthsPropType } from "./extended-types";

export const asChild = {
	type: C.BOOLEAN,
	default: C.FALSE,
	description: "Whether to use [render delegation](/docs/delegation) with this component or not."
};

type ElementKind =
	| "HTMLDivElement"
	| "HTMLButtonElement"
	| "HTMLSpanElement"
	| "HTMLAnchorElement"
	| "HTMLTableCellElement"
	| "HTMLTableSectionElement"
	| "HTMLTableRowElement"
	| "HTMLTableElement"
	| "HTMLLabelElement"
	| "HTMLHeadingElement"
	| "HTMLImageElement"
	| "HTMLInputElement"
	| "HTMLElement";

export function domElProps(elType: ElementKind) {
	return {
		asChild: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: `Whether to use [render delegation](/docs/delegation) with this component or not.`
		},
		el: {
			type: elType,
			description:
				"The underlying DOM element being rendered. You can bind to this to programatically interact with the element."
		}
	};
}

const builderSlotProp: PropSchema = {
	type: {
		type: C.OBJECT,
		definition: "{ [k: string]: any; action: Action<any, any, any>&nbsp;}"
	},
	description:
		"The builder attributes and actions to apply to the element if using the `asChild` prop with [delegation](/docs/delegation)."
};

export const attrsSlotProp: PropSchema = {
	type: {
		type: C.OBJECT,
		definition: "Record&lt;string, string&gt;"
	},
	description:
		"Additional attributes to apply to the element if using the `asChild` prop with [delegation](/docs/delegation)."
};

export const builderAndAttrsSlotProps: Record<string, PropSchema> = {
	builder: builderSlotProp
};

export const monthsSlotProp: PropSchema = {
	type: monthsPropType,
	description: "The current months to display in the calendar. Used to render the calendar."
};

export const weekdaysSlotProp: PropSchema = {
	type: "string[]",
	description:
		"The days of the week to display in the calendar, typically used within the table header."
};

export const idsSlotProp: PropSchema = {
	type: {
		type: C.OBJECT,
		definition: "Record<string, string>"
	},
	description:
		"The ids of the elements within the component, useful when you don't necessarily want to provide a custom ID, but still want access to the ID being assigned (if any)."
};

export const arrowProps = {
	size: {
		type: C.NUMBER,
		default: "8",
		description: "The height and width of the arrow in pixels."
	},
	...domElProps("HTMLDivElement")
};

const transitionProp: PropSchema = {
	type: {
		type: C.FUNCTION,
		definition: "(node: Element, params?: any) => TransitionConfig"
	},
	description: "A Svelte transition function to use when transitioning the content in and out."
};

const transitionConfigProp: PropSchema = {
	type: "TransitionConfig",
	description: "The configuration to apply to the transition."
};

export const transitionProps = {
	transition: transitionProp,
	transitionConfig: transitionConfigProp,
	inTransition: transitionProp,
	inTransitionConfig: transitionConfigProp,
	outTransition: transitionProp,
	outTransitionConfig: transitionConfigProp
};

export function portalProp(compName = "content") {
	return {
		type: {
			type: C.UNION,
			definition: union("string", "HTMLElement", "null", "undefined")
		},
		description: `Where to render the ${compName} when it is open. Defaults to the body. Can be disabled by passing \`null\``
	};
}

export function union(...types: string[]): string {
	return escape(types.join(" | "));
}

export function enums(...values: string[]): string {
	return values.map((value) => `'${value}'`).join(" | ");
}

export function seeFloating(content: string, link: string) {
	return `${content} [Floating UI reference](${link}).`;
}

const entities = [
	[/</g, "&lt;"],
	[/>/g, "&gt;"],
	[/{/g, "&#123;"],
	[/}/g, "&#125;"]
] as const;

export function escape(str: string): string {
	for (let i = 0; i < entities.length; i += 1) {
		str = str.replace(entities[i][0], entities[i][1]);
	}
	return str;
}

export const onOutsideClickProp: PropSchema = {
	type: {
		type: C.FUNCTION,
		definition: "(event: PointerEvent) => void"
	},
	description:
		"A callback function called when a click occurs outside of the element. If `event.preventDefault()` is called, the default behavior of closing the element will be prevented."
};
