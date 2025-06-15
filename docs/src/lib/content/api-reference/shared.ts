import {
	ChildDefaultSnippetProps,
	DateOnInvalidProp,
	DateOnRangeChangeProp,
	DateRangeProp,
	DateValidateProp,
	DateValueProp,
	DirProp,
	EscapeKeydownBehaviorProp,
	InteractOutsideBehaviorProp,
	OnAutoFocusProp,
	OnDateValueChangeProp,
	OnEscapeKeydownProp,
	OnFocusOutsideProp,
	OnInteractOutsideProp,
	OnOpenChangeProp,
	OnPlaceholderChangeProp,
	OpenChildSnippetProps,
	OrientationProp,
	SingleOrMultipleProp,
	TimeValueProp,
} from "./extended-types/shared/index.js";
import {
	FloatingAlignProp,
	FloatingCollisionBoundaryProp,
	FloatingCollisionPaddingProp,
	FloatingContentChildSnippetProps,
	FloatingCustomAnchorProp,
	FloatingSideProp,
	FloatingStickyProp,
	FloatingStrategyProp,
	FloatingUpdatePositionStrategyProp,
} from "./extended-types/floating/index.js";
import { PortalToProp } from "./extended-types/portal/index.js";

import type { PropSchema, PropTypeComplex } from "$lib/content/types.js";
import * as C from "$lib/content/constants.js";
import {
	defineBooleanProp,
	defineComponentPropSchema,
	defineEnumDataAttr,
	defineEnumProp,
	defineFunctionProp,
	defineNumberProp,
	defineSimpleDataAttr,
	defineSimplePropSchema,
	defineUnionProp,
	defineCSSVarSchema,
} from "../utils.js";
import { PaginationPageItemProp } from "./extended-types/pagination/index.js";
import {
	CheckboxRootChildrenSnippetProps,
	CheckboxRootChildSnippetProps,
	CheckboxRootOnCheckedChangeProp,
	CheckboxRootOnIndeterminateChangeProp,
} from "./extended-types/checkbox/index.js";
import {
	RadioGroupItemChildrenSnippetProps,
	RadioGroupItemChildSnippetProps,
} from "./extended-types/radio-group/index.js";

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
	| "HTMLNavElement"
	| "HTMLElement"
	| "HTMLSelectElement";

export const arrowProps = {
	width: defineNumberProp({
		description: "The width of the arrow in pixels.",
		default: 8,
	}),
	height: defineNumberProp({
		default: 8,
		description: "The height of the arrow in pixels.",
	}),
	...withChildProps({ elType: "HTMLDivElement" }),
} as const;

export const portalToProp = defineUnionProp({
	definition: PortalToProp,
	options: ["Element", "string"],
	description: "Where to render the content when it is open. Defaults to the body.",
	default: "document.body",
});

export const portalProps = {
	to: portalToProp,
	disabled: defineBooleanProp({
		description:
			"Whether the portal is disabled or not. When disabled, the content will be rendered in its original DOM location.",
		default: false,
	}),
	children: childrenSnippet(),
} as const;

export function childSnippet(opts?: PropTypeComplex): PropSchema {
	return defineComponentPropSchema({
		type: C.SNIPPET,
		definition: opts?.definition ?? ChildDefaultSnippetProps,
		stringDefinition:
			opts?.stringDefinition ??
			`type SnippetProps = {
	props: Record<string, unknown>;
};`,
		description:
			"Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.",
	});
}

export function childrenSnippet(opts?: PropTypeComplex): PropSchema {
	if (opts) {
		return defineComponentPropSchema({
			type: C.SNIPPET,
			definition: opts.definition,
			stringDefinition: opts.stringDefinition,
			description: "The children content to render.",
		});
	}

	return defineSimplePropSchema({
		type: C.SNIPPET,
		description: "The children content to render.",
	});
}

export function refProp({ elType = "HTMLElement" }: { elType?: ElementKind }): PropSchema {
	return defineSimplePropSchema({
		type: elType,
		description:
			"The underlying DOM element being rendered. You can bind to this to get a reference to the element.",
		bindable: true,
		default: "null",
	});
}

type WithChildPropOpts = {
	elType: ElementKind;
	children?: Pick<PropTypeComplex, "definition" | "stringDefinition">;
	child?: Pick<PropTypeComplex, "definition" | "stringDefinition">;
};

export function withChildProps({ elType = "HTMLElement", children, child }: WithChildPropOpts) {
	const childDefinition = child ?? {
		definition: ChildDefaultSnippetProps,
		stringDefinition: `type SnippetProps = {
		props: Record<string, unknown>;
	};`,
	};
	return {
		ref: refProp({ elType }),
		children: childrenSnippet(
			children ? { ...children, variant: "complex", type: "Snippet" } : undefined
		),
		child: childSnippet(
			child ? { ...childDefinition, variant: "complex", type: "Snippet" } : undefined
		),
	} as const;
}

export function floatingSideProp(defaultSide = "bottom"): PropSchema {
	return defineEnumProp({
		options: ["top", "bottom", "left", "right"],
		default: defaultSide,
		description:
			"The preferred side of the anchor to render the floating element against when open. Will be reversed when collisions occur.",
		definition: FloatingSideProp,
	});
}

export const floatingSideOffsetProp = defineNumberProp({
	description: "The distance in pixels from the anchor to the floating element.",
	default: 0,
});

export function floatingAlignProp(defaultAlign = "start"): PropSchema {
	return defineEnumProp({
		options: ["start", "center", "end"],
		default: defaultAlign,
		description:
			"The preferred alignment of the anchor to render the floating element against when open. This may change when collisions occur.",
		definition: FloatingAlignProp,
	});
}

export const floatingAlignOffsetProp = defineNumberProp({
	description: "The distance in pixels from the anchor to the floating element.",
	default: 0,
});

export const floatingArrowPaddingProp = defineNumberProp({
	description:
		"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.",
	default: 0,
});

export const floatingAvoidCollisionsProp = defineBooleanProp({
	description:
		"When `true`, overrides the `side` and `align` options to prevent collisions with the boundary edges.",
	default: true,
});

export const floatingCollisionBoundaryProp = defineUnionProp({
	options: ["Element", "null"],
	description: "A boundary element or array of elements to check for collisions against.",
	definition: FloatingCollisionBoundaryProp,
});

export const floatingCollisionPaddingProp = defineUnionProp({
	options: ["number", "Partial<Record<Side, number>>"],
	description:
		"The amount in pixels of virtual padding around the viewport edges to check for overflow which will cause a collision.",
	default: "0",
	definition: FloatingCollisionPaddingProp,
});

export const floatingStickyProp = defineEnumProp({
	options: ["partial", "always"],
	description:
		"The sticky behavior on the align axis. `'partial'` will keep the content in the boundary as long as the trigger is at least partially in the boundary whilst `'always'` will keep the content in the boundary regardless.",
	default: `partial`,
	definition: FloatingStickyProp,
});

export const floatingHideWhenDetachedProp = defineBooleanProp({
	description:
		"When `true`, hides the content when it is detached from the DOM. This is useful for when you want to hide the content when the user scrolls away.",
	default: true,
});

export const floatingUpdatePositionStrategyProp = defineEnumProp({
	options: ["optimized", "always"],
	description:
		"The strategy to use when updating the position of the content. When `'optimized'` the content will only be repositioned when the trigger is in the viewport. When `'always'` the content will be repositioned whenever the position changes.",
	default: "optimized",
	definition: FloatingUpdatePositionStrategyProp,
});

export const floatingStrategyProp = defineEnumProp({
	options: ["fixed", "absolute"],
	description:
		"The positioning strategy to use for the floating element. When `'fixed'` the element will be positioned relative to the viewport. When `'absolute'` the element will be positioned relative to the nearest positioned ancestor.",
	default: `fixed`,
	definition: FloatingStrategyProp,
});

export const floatingCustomAnchorProp = defineUnionProp({
	options: ["string", "HTMLElement", "Measurable", "null"],
	description:
		"Use an element other than the trigger to anchor the content to. If provided, the content will be anchored to the provided element instead of the trigger.",
	default: "null",
	definition: FloatingCustomAnchorProp,
});

export const preventScrollProp = defineBooleanProp({
	description:
		"When `true`, prevents the body from scrolling when the content is open. This is useful when you want to use the content as a modal.",
	default: true,
});

export const restoreScrollDelayProp = defineNumberProp({
	description:
		"The delay in milliseconds before the scrollbar is restored after closing the dialog. This is only applicable when using the `child` snippet for custom transitions and `preventScroll` and `forceMount` are `true`. You should set this to a value greater than the transition duration to prevent content from shifting during the transition.",
	default: 0,
});

export function floatingProps(props?: {
	defaultSide?: "top" | "right" | "bottom" | "left";
	defaultAlign?: "start" | "center" | "end";
}) {
	return {
		side: floatingSideProp(props?.defaultSide),
		sideOffset: floatingSideOffsetProp,
		align: floatingAlignProp(props?.defaultAlign),
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
		customAnchor: floatingCustomAnchorProp,
	} as const;
}

export const dismissibleOnInteractOutsideProp = defineFunctionProp({
	definition: OnInteractOutsideProp,
	description:
		"Callback fired when an outside interaction event occurs, which is a `pointerdown` event. You can call `event.preventDefault()` to prevent the default behavior of handling the outside interaction.",
	stringDefinition: "(event: PointerEvent) => void",
});

export const dismissibleOnFocusOutsideProp = defineFunctionProp({
	definition: OnFocusOutsideProp,
	description:
		"Callback fired when focus leaves the dismissible layer. You can call `event.preventDefault()` to prevent the default behavior on focus leaving the layer.",
	stringDefinition: "(event: FocusEvent) => void",
});

export const dismissibleInteractOutsideBehaviorProp = defineEnumProp({
	definition: InteractOutsideBehaviorProp,
	options: ["close", "ignore", "defer-otherwise-close", "defer-otherwise-ignore"],
	default: "close",
	description:
		"The behavior to use when an interaction occurs outside of the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.",
});

export const dismissibleLayerProps = {
	onInteractOutside: dismissibleOnInteractOutsideProp,
	onFocusOutside: dismissibleOnFocusOutsideProp,
	interactOutsideBehavior: dismissibleInteractOutsideBehaviorProp,
} as const;

export const escapeEscapeKeydownBehaviorProp = defineEnumProp({
	definition: EscapeKeydownBehaviorProp,
	options: ["close", "ignore", "defer-otherwise-close", "defer-otherwise-ignore"],
	default: "close",
	description:
		"The behavior to use when an escape keydown event occurs in the floating content. `'close'` will close the content immediately. `'ignore'` will prevent the content from closing. `'defer-otherwise-close'` will defer to the parent element if it exists, otherwise it will close the content. `'defer-otherwise-ignore'` will defer to the parent element if it exists, otherwise it will ignore the interaction.",
});

export const escapeOnEscapeKeydownProp = defineFunctionProp({
	definition: OnEscapeKeydownProp,
	description:
		"Callback fired when an escape keydown event occurs in the floating content. You can call `event.preventDefault()` to prevent the default behavior of handling the escape keydown event.",
	stringDefinition: "(event: KeyboardEvent) => void",
});

export const escapeLayerProps = {
	onEscapeKeydown: escapeOnEscapeKeydownProp,
	escapeKeydownBehavior: escapeEscapeKeydownBehaviorProp,
} as const;

export const forceMountProp = defineBooleanProp({
	description:
		"Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.",
	default: false,
});

export const onOpenAutoFocusProp = defineFunctionProp({
	definition: OnAutoFocusProp,
	description:
		"Event handler called when auto-focusing the content as it is opened. Can be prevented.",
	stringDefinition: "(event: Event) => void",
});

export const onCloseAutoFocusProp = defineFunctionProp({
	definition: OnAutoFocusProp,
	description:
		"Event handler called when auto-focusing the content as it is closed. Can be prevented.",
	stringDefinition: "(event: Event) => void",
});

export const trapFocusProp = defineBooleanProp({
	description: "Whether or not to trap the focus within the content when open.",
	default: true,
});

export const focusScopeProps = {
	onOpenAutoFocus: onOpenAutoFocusProp,
	onCloseAutoFocus: onCloseAutoFocusProp,
	trapFocus: trapFocusProp,
} as const;

export const preventOverflowTextSelectionProp = defineBooleanProp({
	description:
		"When `true`, prevents the text selection from overflowing the bounds of the element.",
	default: true,
});

export const dirProp = defineEnumProp({
	definition: DirProp,
	options: ["ltr", "rtl"],
	description: "The reading direction of the app.",
	default: "ltr",
});

export const orientationDataAttr = defineEnumDataAttr({
	name: "orientation",
	options: ["vertical", "horizontal"],
	description: "The orientation of the component.",
	value: OrientationProp,
});

export const disabledDataAttr = defineSimpleDataAttr({
	name: "disabled",
	value: "''",
	description: "Present when the component is disabled.",
});

export const valueDateRangeProp = defineComponentPropSchema({
	type: "DateRange",
	definition: DateRangeProp,
	stringDefinition: `import type { DateValue } from "@internationalized/date";
import { createNumberProp } from './helpers';

type DateRange = {
	start: DateValue | undefined;
	end: DateValue | undefined;
};`,
	description: "The selected date range.",
	bindable: true,
});

export const valueDateRangeChangeFn = defineFunctionProp({
	definition: DateOnRangeChangeProp,
	description: "A function that is called when the selected date range changes.",
	stringDefinition: `(range: DateRange) => void`,
});

export const onOpenChangeProp = defineFunctionProp({
	definition: OnOpenChangeProp,
	description: "A callback function called when the open state changes.",
	stringDefinition: "(open: boolean) => void",
});

export const onOpenChangeCompleteProp = defineFunctionProp({
	definition: OnOpenChangeProp,
	description:
		"A callback function called after the open state changes and all animations have completed.",
	stringDefinition: "(open: boolean) => void",
});

export const openProp = defineBooleanProp({
	description: "The open state of the component.",
	bindable: true,
	default: false,
});

export const typeSingleOrMultipleProp = defineEnumProp({
	options: ["single", "multiple"],
	description:
		"The type of the component, used to determine the type of the value, when `'multiple'` the value will be an array.",
	required: true,
	definition: SingleOrMultipleProp,
});

export const dateValueProp = defineComponentPropSchema({
	type: "DateValue",
	definition: DateValueProp,
	stringDefinition: `import type { CalendarDate, CalendarDateTime, ZonedDateTime } from "@internationalized/date";
	type DateValue = CalendarDate | CalendarDateTime | ZonedDateTime`,
	description: "The date value.",
});

export const timeValueProp = defineComponentPropSchema({
	type: "TimeValue",
	definition: TimeValueProp,
	stringDefinition: `import type { Time, CalendarDateTime, ZonedDateTime } from "@internationalized/date";
	type TimeValue = Time | CalendarDateTime | ZonedDateTime`,
	description: "The time value.",
});

export const pageItemProp = defineComponentPropSchema({
	type: "PageItem",
	definition: PaginationPageItemProp,
	stringDefinition: `export type Page = {
type: "page";
	/** The page number the 'PageItem' represents */
	value: number;
}

export type Ellipsis = {
	type: "ellipsis";
}

export type PageItem = (Page | Ellipsis) & {
	/** Unique key for the item, for svelte #each block */
	key: string;
}`,
	description: "The page item.",
});

export const onPlaceholderChangeProp = defineFunctionProp({
	definition: OnPlaceholderChangeProp,
	description: "A function that is called when the placeholder date changes.",
	stringDefinition: "(date: DateValue) => void",
});

export const onDateValueChangeProp = defineFunctionProp({
	definition: OnDateValueChangeProp,
	description: "A function that is called when the date value changes.",
	stringDefinition: "(date: DateValue) => void",
});

export const dateValidateProp = defineFunctionProp({
	definition: DateValidateProp,
	description: "A function that returns whether or not a date is valid.",
	stringDefinition: "(date: DateValue) => string[] | string | void",
});

export const dateOnInvalidProp = defineFunctionProp({
	definition: DateOnInvalidProp,
	description: "A callback fired when the value is invalid.",
	stringDefinition: "(reason: 'min' | 'max' | 'custom', msg?: string | string[]) => void",
});

export const onCheckedChangeProp = defineFunctionProp({
	definition: CheckboxRootOnCheckedChangeProp,
	description: "A callback that is fired when the checked state changes.",
	stringDefinition: "(checked: boolean) => void",
});

export const onIndeterminateChangeProp = defineFunctionProp({
	definition: CheckboxRootOnIndeterminateChangeProp,
	description: "A callback that is fired when the indeterminate state changes.",
	stringDefinition: "(indeterminate: boolean) => void",
});

export const checkedProp = defineBooleanProp({
	description: "The checked state of the checkbox.",
	bindable: true,
	default: false,
});

export const indeterminateProp = defineBooleanProp({
	description: "The indeterminate state of the checkbox.",
	bindable: true,
	default: false,
});

export function floatingContentCSSVars(componentName: string) {
	return [
		defineCSSVarSchema({
			name: `--bits-${componentName}-content-transform-origin`,
			description: `The transform origin of the content element.`,
		}),
		defineCSSVarSchema({
			name: `--bits-${componentName}-content-available-width`,
			description: `The available width of the content element.`,
		}),
		defineCSSVarSchema({
			name: `--bits-${componentName}-content-available-height`,
			description: `The available height of the content element.`,
		}),
		defineCSSVarSchema({
			name: `--bits-${componentName}-anchor-width`,
			description: `The width of the anchor element.`,
		}),
		defineCSSVarSchema({
			name: `--bits-${componentName}-anchor-height`,
			description: `The height of the anchor element.`,
		}),
	];
}

export const floatingContentChildDefinition = {
	definition: FloatingContentChildSnippetProps,
	stringDefinition: `type ChildSnippetProps = {
	/**
	 * Props for the positioning wrapper
	 * Do not style this element -
	 * styling should be applied to the content element
	 */
	wrapperProps: Record<string, unknown>;

	/**
	 * Props for your content element
	 * Apply your custom styles here
	 */
	props: Record<string, unknown>;

	/**
	 * Content visibility state
	 * Use this for conditional rendering with
	 * Svelte transitions
	 */
	open: boolean;
};`,
};

export const openChildDefinition = {
	definition: OpenChildSnippetProps,
	stringDefinition: `type ChildSnippetProps = {
	open: boolean;
	props: Record<string, unknown>;
};`,
};

export const checkboxChildrenDefinition = {
	definition: CheckboxRootChildrenSnippetProps,
	stringDefinition: `type ChildrenSnippetProps = {
	checked: boolean;
	indeterminate: boolean;
};`,
};

export const checkboxChildDefinition = {
	definition: CheckboxRootChildSnippetProps,
	stringDefinition: `type ChildSnippetProps = {
	props: Record<string, unknown>;
	checked: boolean;
	indeterminate: boolean;
};`,
};

export const radioGroupItemChildrenDefinition = {
	definition: RadioGroupItemChildrenSnippetProps,
	stringDefinition: `type ChildrenSnippetProps = {
	checked: boolean;
};`,
};

export const radioGroupItemChildDefinition = {
	definition: RadioGroupItemChildSnippetProps,
	stringDefinition: `type ChildSnippetProps = {
	props: Record<string, unknown>;
	checked: boolean;
};`,
};
