import type {
	DrawerBackdropPropsWithoutHTML,
	DrawerClosePropsWithoutHTML,
	DrawerContentPropsWithoutHTML,
	DrawerDescriptionPropsWithoutHTML,
	DrawerIndentBackgroundPropsWithoutHTML,
	DrawerIndentPropsWithoutHTML,
	DrawerPopupPropsWithoutHTML,
	DrawerPortalPropsWithoutHTML,
	DrawerProviderPropsWithoutHTML,
	DrawerRootPropsWithoutHTML,
	DrawerSwipeAreaPropsWithoutHTML,
	DrawerTitlePropsWithoutHTML,
	DrawerTriggerPropsWithoutHTML,
	DrawerViewportPropsWithoutHTML,
} from "bits-ui";
import {
	childrenSnippet,
	dismissibleLayerProps,
	escapeLayerProps,
	focusScopeProps,
	forceMountProp,
	onOpenChangeCompleteProp,
	onOpenChangeProp,
	openChildDefinition,
	portalProps,
	preventOverflowTextSelectionProp,
	preventScrollProp,
	restoreScrollDelayProp,
	transitionStyleDataAttrs,
	withChildProps,
} from "./shared.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineSimpleDataAttr,
	defineSimplePropSchema,
	defineUnionProp,
} from "../utils.js";

const drawerTetherProp = defineSimplePropSchema({
	type: "DrawerTether<any>",
	description:
		"A shared tether object created by `Drawer.createTether()` used to connect detached triggers and infer root snippet payload types.",
});

const snapPointProp = defineUnionProp({
	options: ["number", "string", "null"],
	description:
		"The active snap point. Numbers from 0 to 1 represent viewport fractions, larger numbers are pixels, and strings support `px`/`rem` units.",
	definition: null as never,
});

const swipeDirectionProp = defineUnionProp({
	options: ["up", "down", "left", "right"],
	description: "The direction used to dismiss the drawer.",
	definition: null as never,
	default: "down",
});

const triggerIdProp = defineSimplePropSchema({
	type: "string | null",
	description:
		"The active trigger id for tethered / singleton drawers. Use with `bind:triggerId` and programmatic open alongside `bind:open`.",
	default: "null",
	bindable: true,
});

const root = defineComponentApiSchema<DrawerRootPropsWithoutHTML>({
	title: "Root",
	description:
		"The root component used to manage drawer state and gesture behavior. With a `tether`, children snippet props include `triggerId` and `payload` (see Tether in the Drawer docs).",
	props: {
		open: defineBooleanProp({
			default: false,
			description: "Whether the drawer is open.",
			bindable: true,
		}),
		onOpenChange: onOpenChangeProp,
		onOpenChangeComplete: onOpenChangeCompleteProp,
		swipeDirection: swipeDirectionProp,
		snapPoints: defineUnionProp({
			options: ["(number | string)[]", "undefined"],
			description: "The snap points used to size vertical drawers.",
			definition: null as never,
		}),
		snapPoint: { ...snapPointProp, bindable: true },
		onSnapPointChange: onOpenChangeProp,
		snapToSequentialPoints: defineBooleanProp({
			default: false,
			description: "When `true`, swipes advance through snap points sequentially.",
		}),
		tether: drawerTetherProp,
		triggerId: triggerIdProp,
		children: childrenSnippet(),
	},
});

const provider = defineComponentApiSchema<DrawerProviderPropsWithoutHTML>({
	title: "Provider",
	description: "Coordinates indent/background effects across any descendant drawers.",
	props: {
		children: childrenSnippet(),
	},
});

const indentBackground = defineComponentApiSchema<DrawerIndentBackgroundPropsWithoutHTML>({
	title: "IndentBackground",
	description: "A background layer that reacts to provider-level drawer activity.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "active",
			description: "Present when any provider-scoped drawer is active.",
		}),
		defineSimpleDataAttr({
			name: "inactive",
			description: "Present when no provider-scoped drawers are active.",
		}),
	],
});

const indent = defineComponentApiSchema<DrawerIndentPropsWithoutHTML>({
	title: "Indent",
	description: "Wraps app content that should visually respond when drawers open.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "active",
			description: "Present when any provider-scoped drawer is active.",
		}),
		defineSimpleDataAttr({
			name: "inactive",
			description: "Present when no provider-scoped drawers are active.",
		}),
	],
	cssVars: [
		{
			name: "--drawer-swipe-progress",
			description: "The active swipe progress from the frontmost drawer.",
		},
		{
			name: "--drawer-frontmost-height",
			description: "The measured height of the frontmost drawer.",
		},
	],
});

const trigger = defineComponentApiSchema<DrawerTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The element that opens the drawer.",
	props: {
		...withChildProps({ elType: "HTMLButtonElement" }),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether the trigger is disabled.",
		}),
		tether: drawerTetherProp,
		payload: defineUnionProp({
			options: ["unknown", "undefined"],
			description: "Optional payload passed into a tether-driven drawer.",
			definition: null as never,
		}),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "drawer-trigger",
			description: "Present on the trigger.",
		}),
	],
});

const portal = defineComponentApiSchema<DrawerPortalPropsWithoutHTML>({
	title: "Portal",
	description: "A portal which renders the drawer into the body when it is open.",
	props: portalProps,
});

const backdrop = defineComponentApiSchema<DrawerBackdropPropsWithoutHTML>({
	title: "Backdrop",
	description: "The overlay displayed beneath the drawer popup.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement", child: openChildDefinition }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "drawer-backdrop",
			description: "Present on the backdrop.",
		}),
		defineSimpleDataAttr({
			name: "nested-drawer-open",
			description:
				"Present while this drawer has at least one nested drawer open (count &gt; 0). Clears when the child begins closing.",
		}),
		defineSimpleDataAttr({
			name: "nested-drawer-stacked",
			description:
				"Present while stack layout applies: a nested drawer is open or still exiting. Prefer this for height/transform stacking; use `data-nested-drawer-open` for dimming or hiding parent chrome.",
		}),
		defineSimpleDataAttr({
			name: "swiping",
			description: "Present while the drawer is actively being swiped.",
		}),
		...transitionStyleDataAttrs,
	],
	cssVars: [
		{ name: "--drawer-swipe-progress", description: "The current gesture progress." },
		{
			name: "--drawer-backdrop-interpolate",
			description:
				"Interpolation factor for backdrop opacity transitions (0 during enter/exit, 1 otherwise).",
		},
		{
			name: "--drawer-swipe-strength",
			description: "A scalar used to tune swipe release transition duration.",
		},
	],
});

const viewport = defineComponentApiSchema<DrawerViewportPropsWithoutHTML>({
	title: "Viewport",
	description: "The positioning container that listens for drag gestures.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement", child: openChildDefinition }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "drawer-viewport",
			description: "Present on the viewport.",
		}),
		defineSimpleDataAttr({
			name: "nested",
			description: "Present when this viewport belongs to a nested drawer.",
		}),
	],
	cssVars: [
		{
			name: "--drawer-keyboard-inset",
			description:
				"The iOS keyboard inset measured by the viewport. Use this in userland styles (for example, viewport or popup padding) to lift content above the keyboard.",
		},
	],
});

const popup = defineComponentApiSchema<DrawerPopupPropsWithoutHTML>({
	title: "Popup",
	description: "The swipeable drawer surface.",
	props: {
		...escapeLayerProps,
		...dismissibleLayerProps,
		...focusScopeProps,
		forceMount: forceMountProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: preventScrollProp,
		restoreScrollDelay: restoreScrollDelayProp,
		...withChildProps({ elType: "HTMLDivElement", child: openChildDefinition }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "drawer-popup",
			description: "Present on the popup.",
		}),
		defineSimpleDataAttr({
			name: "expanded",
			description: "Present when the drawer is at the fully expanded snap point.",
		}),
		defineSimpleDataAttr({
			name: "nested-drawer-open",
			description:
				"Present while this drawer has at least one nested drawer open (count &gt; 0). Clears when the child begins closing.",
		}),
		defineSimpleDataAttr({
			name: "nested-drawer-stacked",
			description:
				"Present while stack layout applies: a nested drawer is open or still exiting. Prefer this for height/transform stacking; use `data-nested-drawer-open` for dimming or hiding parent chrome.",
		}),
		defineSimpleDataAttr({
			name: "nested-drawer-swiping",
			description: "Present when a nested drawer is actively being swiped.",
		}),
		defineSimpleDataAttr({
			name: "swipe-dismiss",
			description: "Present when the drawer is dismissing via swipe.",
		}),
		defineSimpleDataAttr({
			name: "swiping",
			description: "Present while the drawer is actively being swiped.",
		}),
		defineSimpleDataAttr({
			name: "swipe-direction",
			description: "The active swipe direction of the drawer.",
		}),
		...transitionStyleDataAttrs,
	],
	cssVars: [
		{ name: "--nested-drawers", description: "The number of nested drawers currently open." },
		{ name: "--drawer-height", description: "The measured popup height." },
		{
			name: "--drawer-frontmost-height",
			description: "The measured height of the frontmost drawer in the stack.",
		},
		{ name: "--drawer-swipe-movement-x", description: "The swipe movement on the X axis." },
		{ name: "--drawer-swipe-movement-y", description: "The swipe movement on the Y axis." },
		{
			name: "--drawer-snap-point-offset",
			description: "The active snap-point offset used for transforms.",
		},
		{
			name: "--drawer-swipe-strength",
			description: "A scalar used to tune swipe release transitions.",
		},
		{
			name: "--drawer-transition-slide-x",
			description: "The horizontal slide offset used for enter/exit transitions.",
		},
		{
			name: "--drawer-transition-slide-y",
			description: "The vertical slide offset used for enter/exit transitions.",
		},
	],
});

const content = defineComponentApiSchema<DrawerContentPropsWithoutHTML>({
	title: "Content",
	description: "The semantic content wrapper rendered inside the popup.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "drawer-content",
			description: "Present on the content wrapper.",
		}),
	],
});

const title = defineComponentApiSchema<DrawerTitlePropsWithoutHTML>({
	title: "Title",
	description: "An accessible title for the drawer.",
	props: {
		level: defineUnionProp({
			options: ["1", "2", "3", "4", "5", "6"],
			description: "The heading level of the title.",
			definition: null as never,
			default: "2",
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "drawer-title",
			description: "Present on the title.",
		}),
	],
});

const description = defineComponentApiSchema<DrawerDescriptionPropsWithoutHTML>({
	title: "Description",
	description: "An accessible description for the drawer.",
	props: withChildProps({ elType: "HTMLDivElement" }),
	dataAttributes: [
		defineSimpleDataAttr({
			name: "drawer-description",
			description: "Present on the description.",
		}),
	],
});

const close = defineComponentApiSchema<DrawerClosePropsWithoutHTML>({
	title: "Close",
	description: "A button used to close the drawer.",
	props: {
		...withChildProps({ elType: "HTMLButtonElement" }),
		disabled: defineBooleanProp({
			default: false,
			description: "Whether the close button is disabled.",
		}),
		tether: drawerTetherProp,
		payload: defineUnionProp({
			options: ["unknown", "undefined"],
			description: "Unused for close buttons. Included for API parity with trigger props.",
			definition: null as never,
		}),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "drawer-close",
			description: "Present on the close button.",
		}),
	],
});

const swipeArea = defineComponentApiSchema<DrawerSwipeAreaPropsWithoutHTML>({
	title: "SwipeArea",
	description: "An invisible edge hit-area used to open a drawer with a swipe.",
	props: {
		disabled: defineBooleanProp({
			default: false,
			description: "Whether the swipe area is disabled.",
		}),
		swipeDirection: swipeDirectionProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
	dataAttributes: [
		defineSimpleDataAttr({
			name: "drawer-swipe-area",
			description: "Present on the swipe area.",
		}),
		defineSimpleDataAttr({
			name: "disabled",
			description: "Present when the swipe area is disabled.",
		}),
		defineSimpleDataAttr({
			name: "swiping",
			description: "Present while the swipe area is being dragged.",
		}),
		defineSimpleDataAttr({
			name: "swipe-direction",
			description: "The active swipe direction of the swipe area.",
		}),
	],
});

export const drawer = [
	provider,
	indentBackground,
	indent,
	root,
	trigger,
	swipeArea,
	portal,
	backdrop,
	viewport,
	popup,
	content,
	title,
	description,
	close,
];
