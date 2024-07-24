import type {
	NavigationMenuRootPropsWithoutHTML,
	NavigationMenuContentPropsWithoutHTML,
	NavigationMenuIndicatorPropsWithoutHTML,
	NavigationMenuItemPropsWithoutHTML,
	NavigationMenuLinkPropsWithoutHTML,
	NavigationMenuListPropsWithoutHTML,
	NavigationMenuTriggerPropsWithoutHTML,
	NavigationMenuViewportPropsWithoutHTML,
} from "bits-ui";
import {
	dirProp,
	dismissableLayerProps,
	enums,
	escapeLayerProps,
	floatingProps,
	forceMountProp,
	withChildProps,
} from "./helpers.js";
import * as C from "$lib/content/constants.js";
import type { APISchema } from "$lib/types/index.js";

export const root: APISchema<NavigationMenuRootPropsWithoutHTML> = {
	title: "Root",
	description:
		"The root navigation menu component which manages & scopes the state of the navigation menu.",
	props: {
		value: {
			type: C.STRING,
			description: "The value of the currently active menu.",
			bindable: true,
		},
		onValueChange: {
			type: {
				type: C.FUNCTION,
				definition: "(value: string | undefined) => void",
			},
			description: "A callback function called when the active menu value changes.",
		},
		dir: dirProp,
		skipDelayDuration: {
			type: C.NUMBER,
			default: "300",
			description:
				"How much time a user has to enter another trigger without incurring a delay again.",
		},
		delayDuration: {
			type: C.NUMBER,
			default: "200",
			description:
				"The duration from when the mouse enters a trigger until the content opens.",
		},
		orientation: {
			type: {
				type: C.ENUM,
				definition: enums("horizontal", "vertical"),
			},
			default: "horizontal",
			description: "The orientation of the menu.",
		},
		...withChildProps({ elType: "HTMLDivElement" }),
	},
};

export const list: APISchema<NavigationMenuListPropsWithoutHTML> = {
	title: "List",
	description: "A menu within the menubar.",
	props: {
		...withChildProps({ elType: "HTMLUListElement" }),
	},
};

export const item: APISchema<NavigationMenuItemPropsWithoutHTML> = {
	title: "Item",
	description: "A list item within the navigation menu.",
	props: {
		value: {
			type: C.STRING,
			description: "The value of the item.",
		},
		...withChildProps({ elType: "HTMLLiElement" }),
	},
};

export const trigger: APISchema<NavigationMenuTriggerPropsWithoutHTML> = {
	title: "Trigger",
	description: "The button element which toggles the dropdown menu.",
	props: {
		disabled: {
			default: C.FALSE,
			type: C.BOOLEAN,
			description: "Whether or not the trigger is disabled.",
		},
		...withChildProps({ elType: "HTMLButtonElement" }),
	},
};

export const content: APISchema<NavigationMenuContentPropsWithoutHTML> = {
	title: "Content",
	description: "The content displayed when the dropdown menu is open.",
	props: {
		...floatingProps(),
		...dismissableLayerProps,
		...escapeLayerProps,
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
};

export const link: APISchema<NavigationMenuLinkPropsWithoutHTML> = {
	title: "Link",
	description: "A link within the navigation menu.",
	props: {
		active: {
			type: C.BOOLEAN,
			default: C.FALSE,
			description: "Whether or not the link is active.",
		},
		onSelect: {
			type: {
				type: C.FUNCTION,
				definition: "() => void",
			},
			description: "A callback function called when the link is selected.",
		},
		...withChildProps({ elType: "HTMLAnchorElement" }),
	},
};

export const indicator: APISchema<NavigationMenuIndicatorPropsWithoutHTML> = {
	title: "Indicator",
	description:
		"The indicator element for the navigation menu, which is used to indicate the current active item.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLSpanElement" }),
	},
};

export const viewport: APISchema<NavigationMenuViewportPropsWithoutHTML> = {
	title: "Viewport",
	description:
		"The viewport element for the navigation menu, which is used to contain the menu items.",
	props: {
		forceMount: forceMountProp,
		...withChildProps({ elType: "HTMLDivElement" }),
	},
};

export const navigationMenu = [root, list, item, trigger, content, link, viewport, indicator];
