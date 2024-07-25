import * as C from "$lib/content/constants.js";
import type { APISchema, PropSchema } from "$lib/types/api.js";

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
	| "HTMLUListElement"
	| "HTMLLiElement"
	| "HTMLElement";

type SharedPropOptions = {
	description: string;
	required?: boolean;
	bindable?: boolean;
	default?: string;
};

export function createApiSchema<T>(schema: APISchema<T>) {
	return schema;
}

export function createPropSchema(schema: PropSchema) {
	return schema;
}

export function createUnionProp({
	options,
	description,
	required = false,
	bindable = false,
	default: defaultProp,
}: { options: string[] } & SharedPropOptions): PropSchema {
	return {
		type: {
			type: C.UNION,
			definition: union(...options),
		},
		description,
		required,
		bindable,
		default: defaultProp,
	};
}

export function createEnumProp({
	options,
	description,
	required = false,
	bindable = false,
	default: defaultProp,
}: { options: string[] } & SharedPropOptions): PropSchema {
	return {
		type: {
			type: C.ENUM,
			definition: enums(...options),
		},
		description,
		required,
		bindable,
		default: defaultProp,
	};
}

export function createObjectProp({
	definition,
	description,
	required = false,
	bindable = false,
	default: defaultProp,
}: { definition: string } & SharedPropOptions): PropSchema {
	return {
		type: {
			type: C.OBJECT,
			definition,
		},
		description,
		required,
		bindable,
		default: defaultProp,
	};
}

export function createFunctionProp({
	definition,
	description,
	required = false,
	bindable = false,
	default: defaultProp,
}: { definition: string } & SharedPropOptions): PropSchema {
	return {
		type: {
			type: C.FUNCTION,
			definition,
		},
		description,
		required,
		bindable,
		default: defaultProp,
	};
}

export function createBooleanProp({
	required = false,
	bindable = false,
	description,
	default: defaultProp,
}: SharedPropOptions): PropSchema {
	return {
		type: C.BOOLEAN,
		required,
		bindable,
		default: defaultProp,
		description,
	};
}

export function createStringProp({
	required = false,
	bindable = false,
	description,
	default: defaultProp,
}: SharedPropOptions): PropSchema {
	return {
		type: C.STRING,
		required,
		bindable,
		default: defaultProp,
		description,
	};
}

export function createNumberProp({
	required = false,
	bindable = false,
	description,
	default: defaultProp,
}: SharedPropOptions): PropSchema {
	return {
		type: C.NUMBER,
		required,
		bindable,
		default: defaultProp,
		description,
	};
}

export const arrowProps = {
	width: createNumberProp({
		default: "8",
		description: "The width of the arrow in pixels.",
	}),
	height: createNumberProp({
		default: "8",
		description: "The height of the arrow in pixels.",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
};

export const portalProps = {
	to: createUnionProp({
		options: ["string", "HTMLElement", "null", "undefined"],
		description: `Where to render the content when it is open. Defaults to the body. Can be disabled by passing \`null\``,
		default: "body",
	}),
	disabled: createBooleanProp({
		description:
			"Whether the portal is disabled or not. When disabled, the content will be rendered in its original DOM location.",
		default: C.FALSE,
	}),
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

export function escape(str: string): string {
	const entities = [
		[/</g, "&lt;"],
		[/>/g, "&gt;"],
		[/{/g, "&#123;"],
		[/}/g, "&#125;"],
	] as const;
	for (let i = 0; i < entities.length; i += 1) {
		str = str.replace(entities[i][0], entities[i][1]);
	}
	return str;
}

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
	return createEnumProp({
		options: ["top", "bottom", "left", "right"],
		default: side,
		description:
			"The preferred side of the anchor to render the floating element against when open. Will be reversed when collisions occur.",
	});
}

export const floatingSideOffsetProp = createNumberProp({
	description: "The distance in pixels from the anchor to the floating element.",
	default: "0",
});

export function floatingAlignProp(align = "start"): PropSchema {
	return createEnumProp({
		options: ["start", "center", "end"],
		default: align,
		description:
			"The preferred alignment of the anchor to render the floating element against when open. This may change when collisions occur.",
	});
}

export const floatingAlignOffsetProp = createNumberProp({
	description: "The distance in pixels from the anchor to the floating element.",
	default: "0",
});

export const floatingArrowPaddingProp = createNumberProp({
	description:
		"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.",
	default: "0",
});

export const floatingAvoidCollisionsProp = createBooleanProp({
	description:
		"When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges.",
	default: C.TRUE,
});

export const floatingCollisionBoundaryProp = createUnionProp({
	options: ["Element", "null"],
	description: "A boundary element or array of elements to check for collisions against.",
});

export const floatingCollisionPaddingProp = createUnionProp({
	options: ["number", "Partial<Record<Side, number>>"],
	description:
		"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.",
	default: "0",
});

export const floatingStickyProp = createEnumProp({
	options: ["partial", "always"],
	description:
		"The sticky behavior on the align axis. `'partial'` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst `'always'` will keep the content in the boundary regardless.",
	default: "partial",
});

export const floatingHideWhenDetachedProp = createBooleanProp({
	description:
		"When `true`, hides the content when it is detached from the DOM. This is useful for when you want to hide the content when the user scrolls away.",
	default: C.TRUE,
});

export const floatingUpdatePositionStrategyProp = createEnumProp({
	options: ["optimized", "always"],
	description:
		"The strategy to use when updating the position of the content. When `'optimized'` the content will only be repositioned when the trigger is in the viewport. When `'always'` the content will be repositioned whenever the position changes.",
	default: "optimized",
});

export const floatingStrategyProp = createEnumProp({
	options: ["fixed", "absolute"],
	description:
		"The positioning strategy to use for the floating element. When `'fixed'` the element will be positioned relative to the viewport. When `'absolute'` the element will be positioned relative to the nearest positioned ancestor.",
	default: "fixed",
});

export const preventScrollProp = createBooleanProp({
	description:
		"When `true`, prevents the body from scrolling when the content is open. This is useful when you want to use the content as a modal.",
	default: C.TRUE,
});

export function floatingProps(props?: {
	side?: "top" | "right" | "bottom" | "left";
	align?: "start" | "center" | "end";
}) {
	return {
		side: floatingSideProp(props?.side),
		sideOffset: floatingSideOffsetProp,
		align: floatingAlignProp(props?.align),
		alignOffset: floatingAlignOffsetProp,
		arrowPadding: floatingArrowPaddingProp,
		avoidCollisions: floatingAvoidCollisionsProp,
		collisionBoundary: floatingCollisionBoundaryProp,
		collisionPadding: floatingCollisionPaddingProp,
		sticky: floatingStickyProp,
		hideWhenDetached: floatingHideWhenDetachedProp,
		updatePositionStrategy: floatingUpdatePositionStrategyProp,
		strategy: floatingStrategyProp,
		preventScroll: preventScrollProp,
	} as const;
}

export const dismissableOnInteractOutsideProp = createFunctionProp({
	definition: "(event: PointerEvent | MouseEvent | TouchEvent) => void",
	description:
		"Callback fired when an outside interaction event completes, which is either a `pointerup`, `mouseup`, or `touchend` event, depending on the user's input device. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.",
});

export const dismissableOnInteractOutsideStartProp: PropSchema = createFunctionProp({
	definition: "(event: PointerEvent | MouseEvent | TouchEvent) => void",
	description:
		"Callback fired when an outside interaction event starts, which is either a `pointerdown`, `mousedown`, or `touchstart` event, depending on the user's input device. You can call `event.preventDefault()` to prevent the continuation of the outside interaction.",
});

export const dismissableOnFocusOutsideProp = createFunctionProp({
	definition: "(event: FocusEvent) => void",
	description:
		"Callback fired when focus leaves the dismissable layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.",
});

export const dismissableInteractOutsideBehaviorProp: PropSchema = createEnumProp({
	options: ["close", "ignore", "defer-otherwise-close", "defer-otherwise-ignore"],
	default: "close",
	description:
		"The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.",
});

export const dismissableLayerProps = {
	onInteractOutside: dismissableOnInteractOutsideProp,
	onInteractOutsideStart: dismissableOnInteractOutsideStartProp,
	onFocusOutside: dismissableOnFocusOutsideProp,
	interactOutsideBehavior: dismissableInteractOutsideBehaviorProp,
} as const;

export const escapeEscapeKeydownBehaviorProp: PropSchema = createEnumProp({
	options: ["close", "ignore", "defer-otherwise-close", "defer-otherwise-ignore"],
	default: "close",
	description:
		"The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.",
});

export const escapeOnEscapeKeydownProp: PropSchema = createFunctionProp({
	definition: "(event: KeyboardEvent) => void",
	description:
		"Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.",
});

export const escapeLayerProps = {
	onEscapeKeydown: escapeOnEscapeKeydownProp,
	escapeKeydownBehavior: escapeEscapeKeydownBehaviorProp,
} as const;

export const forceMountProp = createBooleanProp({
	description:
		"Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animnation library for the content.",
	default: C.FALSE,
});

export const onMountAutoFocusProp = createFunctionProp({
	definition: "(event: FocusEvent) => void",
	description:
		"Event handler called when auto-focusing the content as it is mounted. Can be prevented.",
});

export const onDestroyAutoFocusProp = createFunctionProp({
	definition: "(event: FocusEvent) => void",
	description:
		"Event handler called when auto-focusing the content as it is destroyed. Can be prevented.",
});

export const focusScopeProps = {
	onMountAutoFocus: onMountAutoFocusProp,
	onDestroyAutoFocus: onDestroyAutoFocusProp,
} as const;

export const preventOverflowTextSelectionProp = createBooleanProp({
	description:
		"When `true`, prevents the text selection from overflowing the bounds of the element.",
	default: C.TRUE,
});

export const dirProp = createEnumProp({
	options: ["ltr", "rtl"],
	description: "The reading direction of the app.",
	default: "ltr",
});
