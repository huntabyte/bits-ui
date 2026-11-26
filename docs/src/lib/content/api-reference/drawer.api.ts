import { HeaderLevelProp, OpenChildrenSnippetProps } from "./extended-types/shared/index.js";
import { stringDefinitionFromMarkdown, defineComponentPropSchema } from "../utils.js";
import SwipeDirectionDefinition from "./extended-types/drawer/swipe-direction.md";
import SnapPointDefinition from "./extended-types/drawer/snap-point.md";
import SnapPointsDefinition from "./extended-types/drawer/snap-points.md";
import ModalDefinition from "./extended-types/drawer/modal.md";
import OpenChangeDefinition from "./extended-types/drawer/on-open-change.md";
import OpenChangeDefinitionRaw from "./extended-types/drawer/on-open-change.md?raw";
import SnapPointChangeDefinition from "./extended-types/drawer/on-snap-point-change.md";
import SnapPointChangeDefinitionRaw from "./extended-types/drawer/on-snap-point-change.md?raw";
import ActionsDefinition from "./extended-types/drawer/actions.md";
import ActionsDefinitionRaw from "./extended-types/drawer/actions.md?raw";
import FocusTargetDefinition from "./extended-types/drawer/focus-target.md";
import FocusTargetDefinitionRaw from "./extended-types/drawer/focus-target.md?raw";
import TetherDefinition from "./extended-types/drawer/tether.md";
import TetherDefinitionRaw from "./extended-types/drawer/tether.md?raw";
import PayloadDefinition from "./extended-types/drawer/payload.md";
import PayloadDefinitionRaw from "./extended-types/drawer/payload.md?raw";
import RootChildrenDefinition from "./extended-types/drawer/root-children.md";
import RootChildrenDefinitionRaw from "./extended-types/drawer/root-children.md?raw";
import type {
	DrawerVirtualKeyboardProviderProps,
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
	defineFunctionProp,
	defineEnumProp,
	defineSimpleDataAttr,
	defineSimplePropSchema,
	defineUnionProp,
} from "../utils.js";

const openChildrenDefinition = {
	definition: OpenChildrenSnippetProps,
	stringDefinition: "type ChildrenSnippetProps = { open: boolean };",
};

const drawerTetherProp = defineComponentPropSchema({
	type: "DrawerTether<Payload>",
	definition: TetherDefinition,
	stringDefinition: stringDefinitionFromMarkdown(TetherDefinitionRaw),
	description:
		"A shared tether object created by `Drawer.createTether()` used to connect detached triggers and infer root snippet payload types.",
});

const snapPointProp = defineUnionProp({
	options: ["number", "string", "null"],
	description:
		"The active snap point. Numbers from 0 to 1 represent viewport fractions, larger numbers are pixels, and strings support `px`/`rem` units. When unset or null, the first configured snap point is used.",
	definition: SnapPointDefinition,
});

const swipeDirectionProp = defineEnumProp({
	options: ["up", "down", "left", "right"],
	description: "The direction used to dismiss the drawer.",
	definition: SwipeDirectionDefinition,
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
		onOpenChange: defineFunctionProp({
			definition: OpenChangeDefinition,
			description:
				"Called before a requested change, with reason, originating event, active trigger, cancel(), and preventUnmountOnClose(). Calling cancel() keeps the current open state. Not called when you set open yourself.",
			stringDefinition: stringDefinitionFromMarkdown(OpenChangeDefinitionRaw),
		}),
		modal: defineUnionProp({
			options: ["boolean", "'trap-focus'"],
			definition: ModalDefinition,
			default: "true",
			description:
				"Whether to trap focus and lock scrolling. 'trap-focus' traps focus while allowing page scrolling; false allows outside focus and interaction.",
		}),
		disablePointerDismissal: defineBooleanProp({
			default: false,
			description:
				"Prevent outside-pointer dismissal and, for non-modal drawers, focus-out dismissal. Swipe, escape, and close-button dismissal remain enabled.",
		}),
		actions: defineComponentPropSchema({
			type: "DrawerActions",
			definition: ActionsDefinition,
			stringDefinition: stringDefinitionFromMarkdown(ActionsDefinitionRaw),
			bindable: true,
			description:
				"Bind to close() and unmount(). Use unmount() to finish a close deferred by preventUnmountOnClose().",
		}),
		onOpenChangeComplete: {
			...onOpenChangeCompleteProp,
			description:
				"Called after opening or closing finishes. When preventUnmountOnClose() defers closing, false is reported once actions.unmount() finishes the close.",
		},
		swipeDirection: swipeDirectionProp,
		snapPoints: defineUnionProp({
			options: ["(number | string)[]", "undefined"],
			description: "The snap points used to size vertical drawers.",
			definition: SnapPointsDefinition,
		}),
		snapPoint: { ...snapPointProp, bindable: true },
		onSnapPointChange: defineFunctionProp({
			definition: SnapPointChangeDefinition,
			description:
				"Called before the drawer changes the active snap point. Call details.cancel() to keep the current point. Not called when you set snapPoint yourself; a close reset uses reason none.",
			stringDefinition: stringDefinitionFromMarkdown(SnapPointChangeDefinitionRaw),
		}),
		snapToSequentialPoints: defineBooleanProp({
			default: false,
			description:
				"When `true`, snap point selection uses drag distance without projecting release velocity.",
		}),
		tether: drawerTetherProp,
		triggerId: triggerIdProp,
		children: childrenSnippet({
			variant: "complex",
			type: "Snippet",
			definition: RootChildrenDefinition,
			stringDefinition: stringDefinitionFromMarkdown(RootChildrenDefinitionRaw),
		}),
	},
});

const virtualKeyboardProvider = defineComponentApiSchema<DrawerVirtualKeyboardProviderProps>({
	title: "VirtualKeyboardProvider",
	description:
		"Opts descendant drawers into virtual keyboard viewport adjustments and iOS input handling.",
	props: {
		enabled: defineBooleanProp({
			default: true,
			description: "Enable virtual keyboard handling for descendant drawers.",
		}),
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
			name: "drawer-indent-background",
			description: "Present on the provider’s indent background.",
		}),
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
			name: "drawer-indent",
			description: "Present on the provider’s indent wrapper.",
		}),
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
		payload: defineComponentPropSchema({
			type: "Payload",
			stringDefinition: stringDefinitionFromMarkdown(PayloadDefinitionRaw),
			description: "Optional payload passed into a tether-driven drawer.",
			definition: PayloadDefinition,
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
		...withChildProps({
			elType: "HTMLDivElement",
			child: openChildDefinition,
			children: openChildrenDefinition,
		}),
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
		defineSimpleDataAttr({
			name: "nested",
			description: "Present when this drawer is nested inside another Root.",
		}),
		defineSimpleDataAttr({
			name: "nested-drawer-swiping",
			description: "Present when a nested drawer is actively being swiped.",
		}),
		defineSimpleDataAttr({
			name: "swipe-dismiss",
			description: "Present while this drawer is being dismissed by a swipe.",
		}),
		...transitionStyleDataAttrs,
	],
	cssVars: [
		{
			name: "--drawer-height",
			description:
				"The frontmost drawer height in pixels while a swipe is in progress. Removed when swipe progress returns to zero.",
		},
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
		...withChildProps({
			elType: "HTMLDivElement",
			child: openChildDefinition,
			children: openChildrenDefinition,
		}),
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
				"The virtual keyboard inset in pixels. Requires an enabled VirtualKeyboardProvider around Root; otherwise 0px. Use it in viewport or popup padding to lift content above the keyboard.",
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
		trapFocus: {
			...focusScopeProps.trapFocus,
			default: { variant: "simple", value: "modal !== false" },
			description:
				"Whether to trap focus while open. Defaults to true unless Root has modal={false}; an explicit value overrides Root.",
		},
		initialFocus: defineComponentPropSchema({
			type: "DrawerFocusTarget",
			definition: FocusTargetDefinition,
			stringDefinition: stringDefinitionFromMarkdown(FocusTargetDefinitionRaw),
			description:
				"Defaults to the popup. Use true for the first tabbable element (or popup), false to leave focus, an element, or a callback receiving the interaction type. Callback true uses the default focus behavior; false, null, or no return value skips focus. onOpenAutoFocus can prevent this behavior.",
		}),
		finalFocus: defineComponentPropSchema({
			type: "DrawerFocusTarget",
			definition: FocusTargetDefinition,
			stringDefinition: stringDefinitionFromMarkdown(FocusTargetDefinitionRaw),
			description:
				"Defaults to the trigger or previously focused element. Use false to skip restoration, an element, or a callback receiving the interaction type. Callback true uses default restoration; false, null, or no return value skips it. Non-modal outside dismissal preserves outside focus by default. onCloseAutoFocus can prevent this behavior.",
		}),
		forceMount: forceMountProp,
		preventOverflowTextSelection: preventOverflowTextSelectionProp,
		preventScroll: {
			...preventScrollProp,
			default: { variant: "simple", value: "modal === true" },
			description:
				"Whether to lock page scrolling and outside pointer interactions while open. Defaults to true only when Root has modal={true}; an explicit value overrides Root.",
		},
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
			description:
				"Present when the active snap point is the numeric value 1 (the full viewport fraction).",
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
			description: "Root’s configured dismissal direction: up, down, left, or right.",
		}),
		defineSimpleDataAttr({
			name: "nested",
			description: "Present when this drawer is nested inside another Root.",
		}),
		...transitionStyleDataAttrs,
	],
	cssVars: [
		{ name: "--nested-drawers", description: "The number of nested drawers currently open." },
		{ name: "--drawer-height", description: "The measured popup height." },
		{
			name: "--drawer-swipe-progress",
			description:
				"Nested drawer swipe progress from 0 to 1, used to animate the parent stack.",
		},
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
			definition: HeaderLevelProp,
			default: "2",
		}),
		...withChildProps({ elType: "HTMLElement" }),
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
		tether: {
			...drawerTetherProp,
			description:
				"Inherited from the trigger prop type, but unused by Close. Close always dismisses its nearest Root.",
		},
		payload: defineComponentPropSchema({
			type: "Payload",
			stringDefinition: stringDefinitionFromMarkdown(PayloadDefinitionRaw),
			description: "Unused for close buttons. Included for API parity with trigger props.",
			definition: PayloadDefinition,
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
		swipeDirection: defineEnumProp({
			options: ["up", "down", "left", "right"],
			description:
				"The direction to swipe to open the drawer. Defaults to the opposite of Root.swipeDirection.",
			definition: SwipeDirectionDefinition,
		}),
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
	virtualKeyboardProvider,
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
