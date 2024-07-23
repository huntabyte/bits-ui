import { monthsPropType } from "./extended-types/index.js";
import * as C from "$lib/content/constants.js";
import type { PropSchema } from "$lib/types/api.js";

export const asChild = {
	type: C.BOOLEAN,
	default: C.FALSE,
	description: "Whether to use [render delegation](/docs/delegation) with this component or not.",
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
			description: `Whether to use [render delegation](/docs/delegation) with this component or not.`,
		},
		ref: {
			type: elType,
			description:
				"The underlying DOM element being rendered. You can bind to this to get a reference to the element.",
		},
	};
}

const builderSlotProp: PropSchema = {
	type: {
		type: C.OBJECT,
		definition: "{ [k: string]: any; action: Action<any, any, any>&nbsp;}",
	},
	description:
		"The builder attributes and actions to apply to the element if using the `asChild` prop with [delegation](/docs/delegation).",
};

export const attrsSlotProp: PropSchema = {
	type: {
		type: C.OBJECT,
		definition: "Record&lt;string, string&gt;",
	},
	description:
		"Additional attributes to apply to the element if using the `asChild` prop with [delegation](/docs/delegation).",
};

export const builderAndAttrsSlotProps: Record<string, PropSchema> = {
	builder: builderSlotProp,
};

export const monthsSlotProp: PropSchema = {
	type: monthsPropType,
	description: "The current months to display in the calendar. Used to render the calendar.",
};

export const weekdaysSlotProp: PropSchema = {
	type: "string[]",
	description:
		"The days of the week to display in the calendar, typically used within the table header.",
};

export const idsSlotProp: PropSchema = {
	type: {
		type: C.OBJECT,
		definition: "Record<string, string>",
	},
	description:
		"The ids of the elements within the component, useful when you don't necessarily want to provide a custom ID, but still want access to the ID being assigned (if any).",
};

export const arrowProps = {
	width: {
		type: C.NUMBER,
		default: "8",
		description: "The width of the arrow in pixels.",
	},
	height: {
		type: C.NUMBER,
		default: "8",
		description: "The height of the arrow in pixels.",
	},
	...withChildProps({ elType: "HTMLDivElement" }),
};

const transitionProp: PropSchema = {
	type: {
		type: C.FUNCTION,
		definition: "(node: Element, params?: any) => TransitionConfig",
	},
	description: "A Svelte transition function to use when transitioning the content in and out.",
};

const transitionConfigProp: PropSchema = {
	type: "TransitionConfig",
	description: "The configuration to apply to the transition.",
};

export const transitionProps = {
	transition: transitionProp,
	transitionConfig: transitionConfigProp,
	inTransition: transitionProp,
	inTransitionConfig: transitionConfigProp,
	outTransition: transitionProp,
	outTransitionConfig: transitionConfigProp,
};

export function portalProp(compName = "content") {
	return {
		type: {
			type: C.UNION,
			definition: union("string", "HTMLElement", "null", "undefined"),
		},
		description: `Where to render the ${compName} when it is open. Defaults to the body. Can be disabled by passing \`null\``,
	};
}

export const portalProps = {
	to: {
		type: {
			type: C.UNION,
			definition: union("string", "HTMLElement", "null", "undefined"),
		},
		description: `Where to render the content when it is open. Defaults to the body. Can be disabled by passing \`null\``,
	},
	disabled: {
		type: C.BOOLEAN,
		default: C.FALSE,
		description: "Whether the portal is disabled or not.",
	},
	children: childrenSnippet(),
};

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
	[/}/g, "&#125;"],
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
		definition: "(event: PointerEvent) => void",
	},
	description:
		"A callback function called when a click occurs outside of the element. If `event.preventDefault()` is called, the default behavior of closing the element will be prevented.",
};

export function childSnippet(definition?: string): PropSchema {
	return {
		type: {
			type: C.SNIPPET,
			definition: definition || "{ props: Record<string, unknown> }",
		},
		description:
			"Use render delegation to render your own element. See [render delegation](/docs/delegation) for more information.",
	};
}

export function childrenSnippet(definition?: string): PropSchema {
	if (definition) {
		return {
			type: {
				type: C.SNIPPET,
				definition,
			},
			description: "The children content to render.",
		};
	}

	return {
		type: C.SNIPPET,
		description: "The children content to render.",
	};
}

export function refProp({ elType = "HTMLElement" }: { elType?: ElementKind }): PropSchema {
	return {
		type: elType,
		description:
			"The underlying DOM element being rendered. You can bind to this to get a reference to the element.",
	};
}

export function withChildProps({
	elType = "HTMLElement",
	def,
}: {
	elType: ElementKind;
	def?: string;
}) {
	return {
		child: childSnippet(def),
		children: childrenSnippet(def),
		ref: refProp({ elType }),
	} as const;
}

export function floatingSideProp(side = "bottom"): PropSchema {
	return {
		type: {
			type: C.ENUM,
			definition: enums("top", "bottom", "left", "right"),
		},
		default: side,
		description:
			"The preferred side of the anchor to render the floating element against when open. Will be reversed when collisions occur.",
	};
}

export function floatingSideOffsetProp(): PropSchema {
	return {
		type: C.NUMBER,
		description: "The distance in pixels from the anchor to the floating element.",
		default: "0",
	};
}

export function floatingAlignProp(align = "start"): PropSchema {
	return {
		type: {
			type: C.ENUM,
			definition: enums("start", "center", "end"),
		},
		default: align,
		description:
			"The preferred alignment of the anchor to render the floating element against when open. This may change when collisions occur.",
	};
}

export function floatingAlignOffsetProp(): PropSchema {
	return {
		type: C.NUMBER,
		description: "The distance in pixels from the anchor to the floating element.",
		default: "0",
	};
}

export function floatingArrowPaddingProp(): PropSchema {
	return {
		type: C.NUMBER,
		description:
			"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.",
		default: "0",
	};
}

export function floatingAvoidCollisionsProp(): PropSchema {
	return {
		type: C.BOOLEAN,
		default: C.TRUE,
		description:
			"When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges.",
	};
}

export function floatingCollisionBoundaryProp(): PropSchema {
	return {
		type: {
			type: C.UNION,
			definition: union("Element", "null"),
		},
		description: "A boundary element or array of elements to check for collisions against.",
	};
}

export function floatingCollisionPaddingProp(): PropSchema {
	return {
		type: {
			type: C.UNION,
			definition: `number | Partial<Record<${union("top", "right", "bottom", "left")}, number>>`,
		},
		description:
			"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.",
		default: "0",
	};
}

export function floatingStickyProp(): PropSchema {
	return {
		type: {
			type: C.ENUM,
			definition: enums("partial", "always"),
		},
		default: "partial",
		description:
			"The sticky behavior on the align axis. `'partial'` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst `'always'` will keep the content in the boundary regardless.",
	};
}

export function floatingHideWhenDetachedProp(): PropSchema {
	return {
		type: C.BOOLEAN,
		default: C.TRUE,
		description:
			"When `true`, hides the content when it is detached from the DOM. This is useful for when you want to hide the content when the user scrolls away.",
	};
}

export function floatingUpdatePositionStrategyProp(): PropSchema {
	return {
		type: {
			type: C.ENUM,
			definition: enums("optimized", "always"),
		},
		default: "optimized",
		description:
			"The strategy to use when updating the position of the content. When `'optimized'` the content will only be repositioned when the trigger is in the viewport. When `'always'` the content will be repositioned whenever the position changes.",
	};
}

export function floatingStrategyProp(): PropSchema {
	return {
		type: {
			type: C.ENUM,
			definition: enums("fixed", "absolute"),
		},
		default: "fixed",
		description:
			"The positioning strategy to use for the floating element. When `'fixed'` the element will be positioned relative to the viewport. When `'absolute'` the element will be positioned relative to the nearest positioned ancestor.",
	};
}

export function preventScrollProp(): PropSchema {
	return {
		type: C.BOOLEAN,
		default: C.TRUE,
		description:
			"When `true`, prevents the body from scrolling when the content is open. This is useful when you want to use the content as a modal.",
	};
}

export function floatingProps(props?: {
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
}) {
	return {
		side: floatingSideProp(props?.side),
		sideOffset: floatingSideOffsetProp(),
		align: floatingAlignProp(props?.align),
		alignOffset: floatingAlignOffsetProp(),
		arrowPadding: floatingArrowPaddingProp(),
		avoidCollisions: floatingAvoidCollisionsProp(),
		collisionBoundary: floatingCollisionBoundaryProp(),
		collisionPadding: floatingCollisionPaddingProp(),
		sticky: floatingStickyProp(),
		hideWhenDetached: floatingHideWhenDetachedProp(),
		updatePositionStrategy: floatingUpdatePositionStrategyProp(),
		strategy: floatingStrategyProp(),
		preventScroll: preventScrollProp(),
	} as const;
}

export const dismissableOnInteractOutsideProp: PropSchema = {
	type: {
		type: C.FUNCTION,
		definition: "(event: PointerEvent | MouseEvent | TouchEvent) => void",
	},
	description:
		"Callback fired when an outside interaction event completes, which is either a `pointerup`, `mouseup`, or `touchend` event, depending on the user's input device. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.",
};

export const dismissableOnInteractOutsideStartProp: PropSchema = {
	type: {
		type: C.FUNCTION,
		definition: "(event: PointerEvent | MouseEvent | TouchEvent) => void",
	},
	description:
		"Callback fired when an outside interaction event starts, which is either a `pointerdown`, `mousedown`, or `touchstart` event, depending on the user's input device. You can call `event.preventDefault()` to prevent the continuation of the outside interaction.",
};

export const dismissableOnFocusOutsideProp: PropSchema = {
	type: {
		type: C.FUNCTION,
		definition: "(event: FocusEvent) => void",
	},
	description:
		"Callback fired when focus leaves the dismissable layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.",
};

export const dismissableInteractOutsideBehaviorProp: PropSchema = {
	type: {
		type: C.ENUM,
		definition: enums("close", "ignore", "defer-otherwise-close", "defer-otherwise-ignore"),
	},
	default: "close",
	description:
		"The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.",
};

export const dismissableLayerProps = {
	onInteractOutside: dismissableOnInteractOutsideProp,
	onInteractOutsideStart: dismissableOnInteractOutsideStartProp,
	onFocusOutside: dismissableOnFocusOutsideProp,
	interactOutsideBehavior: dismissableInteractOutsideBehaviorProp,
} as const;

export const escapeEscapeKeydownBehaviorProp: PropSchema = {
	type: {
		type: C.ENUM,
		definition: enums("close", "ignore", "defer-otherwise-close", "defer-otherwise-ignore"),
	},
	default: "close",
	description:
		"The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.",
};

export const escapeOnEscapeKeydownProp: PropSchema = {
	type: {
		type: C.FUNCTION,
		definition: "(event: KeyboardEvent) => void",
	},
	description:
		"Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.",
};

export const escapeLayerProps = {
	onEscapeKeydown: escapeOnEscapeKeydownProp,
	escapeKeydownBehavior: escapeEscapeKeydownBehaviorProp,
} as const;

export const forceMountProp: PropSchema = {
	type: C.BOOLEAN,
	default: C.FALSE,
	description:
		"Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animnation library for the content.",
};

export const onMountAutoFocusProp: PropSchema = {
	type: {
		type: C.FUNCTION,
		definition: "(event: FocusEvent) => void",
	},
	description:
		"Event handler called when auto-focusing the content as it is mounted. Can be prevented.",
};

export const onDestroyAutoFocusProp: PropSchema = {
	type: {
		type: C.FUNCTION,
		definition: "(event: FocusEvent) => void",
	},
	description:
		"Event handler called when auto-focusing the content as it is destroyed. Can be prevented.",
};

export const focusScopeProps = {
	onMountAutoFocus: onMountAutoFocusProp,
	onDestroyAutoFocus: onDestroyAutoFocusProp,
} as const;

export const preventOverflowTextSelectionProp: PropSchema = {
	type: C.BOOLEAN,
	default: C.TRUE,
	description:
		"When `true`, prevents the text selection from overflowing the bounds of the element.",
};

export const dirProp: PropSchema = {
	type: {
		type: C.ENUM,
		definition: enums("ltr", "rtl"),
	},
	default: "ltr",
	description: "The reading direction of the app.",
};
