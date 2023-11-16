import type { PropSchema } from "@/types";
import * as C from "@/content/constants";

export const asChild = {
	type: C.BOOLEAN,
	default: C.FALSE,
	description: "Whether to use [render delegation](/docs/delegation) with this component or not."
};
export const arrowProps = {
	asChild,
	size: {
		type: C.NUMBER,
		default: "8",
		description: "The height and width of the arrow in pixels."
	}
};

const transitionProp: PropSchema = {
	type: {
		type: C.FUNCTION,
		definition: "(node: Element, params?: any) => TransitionConfig"
	},
	description: "A Svelte transition function to use when transitioning the content in and out."
};

const transitionConfigProp: PropSchema = {
	type: C.OBJECT,
	description: "The Svelte `TransitionConfig` object to apply to the transition."
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
	return types.join(" | ");
}

export function enums(...values: string[]): string {
	return values.map((value) => `'${value}'`).join(" | ");
}
