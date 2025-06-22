import type {
	NavigationMenuContentPropsWithoutHTML,
	NavigationMenuIndicatorPropsWithoutHTML,
	NavigationMenuItemPropsWithoutHTML,
	NavigationMenuLinkPropsWithoutHTML,
	NavigationMenuListPropsWithoutHTML,
	NavigationMenuRootPropsWithoutHTML,
	NavigationMenuSubPropsWithoutHTML,
	NavigationMenuTriggerPropsWithoutHTML,
	NavigationMenuViewportPropsWithoutHTML,
} from "bits-ui";
import {
	dirProp,
	dismissibleLayerProps,
	escapeLayerProps,
	forceMountProp,
	withChildProps,
} from "./shared.js";
import {
	NoopProp,
	OnStringValueChangeProp,
	OrientationProp,
} from "./extended-types/shared/index.js";
import {
	defineBooleanProp,
	defineComponentApiSchema,
	defineEnumProp,
	defineFunctionProp,
	defineNumberProp,
	defineStringProp,
} from "../utils.js";

export const root = defineComponentApiSchema<NavigationMenuRootPropsWithoutHTML>({
	title: "Root",
	description:
		"The root navigation menu component which manages & scopes the state of the navigation menu.",
	props: {
		value: defineStringProp({
			description: "The value of the currently active menu.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: OnStringValueChangeProp,
			description:
				"A callback function called when the active menu value changes. Called with an empty string when the menu closes.",
			stringDefinition: "(value: string) => void",
		}),
		dir: dirProp,
		skipDelayDuration: defineNumberProp({
			default: 300,
			description:
				"How much time a user has to enter another trigger without incurring a delay again.",
		}),
		delayDuration: defineNumberProp({
			default: 200,
			description:
				"The duration from when the mouse enters a trigger until the content opens.",
		}),
		orientation: defineEnumProp({
			options: ["horizontal", "vertical"],
			default: "horizontal",
			description: "The orientation of the menu.",
			definition: OrientationProp,
		}),
		...withChildProps({ elType: "HTMLNavElement" }),
	},
});

export const sub = defineComponentApiSchema<NavigationMenuSubPropsWithoutHTML>({
	title: "Sub",
	description:
		"A sub navigation menu component which manages & scopes the state of a submenu, inside the content of a Root menu.",
	props: {
		value: defineStringProp({
			description: "The value of the currently active submenu.",
			bindable: true,
		}),
		onValueChange: defineFunctionProp({
			definition: OnStringValueChangeProp,
			description: "A callback function called when the active menu value changes.",
			stringDefinition: "(value: string) => void",
		}),
		orientation: defineEnumProp({
			options: ["horizontal", "vertical"],
			default: "horizontal",
			description: "The orientation of the menu.",
			definition: OrientationProp,
		}),
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const list = defineComponentApiSchema<NavigationMenuListPropsWithoutHTML>({
	title: "List",
	description: "A menu within the menubar.",
	props: withChildProps({ elType: "HTMLUListElement" }),
});

export const item = defineComponentApiSchema<NavigationMenuItemPropsWithoutHTML>({
	title: "Item",
	description: "A list item within the navigation menu.",
	props: {
		value: defineStringProp({
			description: "The value of the item.",
		}),
		openOnHover: defineBooleanProp({
			default: true,
			description:
				"Whether or not the item should open its content when the trigger is hovered. Note: When `false`, the menu will not close when the pointer moves outside of the content and will instead require the user to interact outside of the menu or press escape to close it.",
		}),
		...withChildProps({ elType: "HTMLLiElement" }),
	},
});

export const trigger = defineComponentApiSchema<NavigationMenuTriggerPropsWithoutHTML>({
	title: "Trigger",
	description: "The button element which toggles the dropdown menu.",
	props: {
		disabled: defineBooleanProp({
			default: false,
			description: "Whether or not the trigger is disabled.",
		}),
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
});

export const content = defineComponentApiSchema<NavigationMenuContentPropsWithoutHTML>({
	title: "Content",
	description: "The content displayed when the dropdown menu is open.",
	props: {
		...dismissibleLayerProps,
		...escapeLayerProps,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const link = defineComponentApiSchema<NavigationMenuLinkPropsWithoutHTML>({
	title: "Link",
	description: "A link within the navigation menu.",
	props: {
		active: defineBooleanProp({
			default: false,
			description: "Whether or not the link is active.",
		}),
		onSelect: defineFunctionProp({
			definition: NoopProp,
			description: "A callback function called when the link is selected.",
			stringDefinition: "() => void",
		}),
		...withChildProps({ elType: "HTMLAnchorElement" }),
	},
});

export const indicator = defineComponentApiSchema<NavigationMenuIndicatorPropsWithoutHTML>({
	title: "Indicator",
	description:
		"The indicator element for the navigation menu, which is used to indicate the current active item.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
});

export const viewport = defineComponentApiSchema<NavigationMenuViewportPropsWithoutHTML>({
	title: "Viewport",
	description:
		"An optional viewport element for the navigation menu, which renders the content of the menu items if it is present. The content is rendered in place without it.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
});

export const navigationMenu = [root, sub, list, item, trigger, content, link, viewport, indicator];
