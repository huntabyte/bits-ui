import type { Component } from "svelte";
import Sticker from "phosphor-svelte/lib/Sticker";
import CodeBlock from "phosphor-svelte/lib/CodeBlock";
import Compass from "phosphor-svelte/lib/Compass";
import Palette from "phosphor-svelte/lib/Palette";
import CalendarBlank from "phosphor-svelte/lib/CalendarBlank";
import CableCar from "phosphor-svelte/lib/CableCar";
import Leaf from "phosphor-svelte/lib/Leaf";
import Joystick from "phosphor-svelte/lib/Joystick";
import {
	allComponentDocs,
	allTypeHelperDocs,
	allUtilityDocs,
} from "../../../.contentlayer/generated/index.mjs";

export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
	icon?: Component;
};

export type SidebarNavItem = NavItem & {
	items: SidebarNavItem[];
};

export type NavItemWithChildren = NavItem & {
	items: NavItemWithChildren[];
};

export type Navigation = {
	main: NavItem[];
	sidebar: SidebarNavItem[];
};

const filteredComponents = allComponentDocs;

/**
 * Generates the navigation items for the components section of the sidebar.
 */
function generateComponentsNav() {
	const componentNavItems: SidebarNavItem[] = [];

	for (const comp of filteredComponents) {
		componentNavItems.push({
			title: comp.title,
			href: `/docs/components/${comp.slug}`,
			label: "navLabel" in comp ? (comp.navLabel as string) : undefined,
			items: [],
		});
	}

	componentNavItems.sort((a, b) => a.title.localeCompare(b.title));
	return componentNavItems;
}

/**
 * Generates the navigation items for the utilities section of the sidebar.
 */
function generateUtilitiesNav(): SidebarNavItem[] {
	const utilityNavItems: SidebarNavItem[] = [];

	for (const comp of allUtilityDocs) {
		utilityNavItems.push({
			title: comp.title,
			href: `/docs/utilities/${comp.slug}`,
			items: [],
		});
	}

	utilityNavItems.sort((a, b) => a.title.localeCompare(b.title));
	return utilityNavItems;
}

/**
 * Generates the navigation items for the type helpers section of the sidebar.
 */
function generateTypeHelpersNav(): SidebarNavItem[] {
	const utilityNavItems: SidebarNavItem[] = [];

	for (const comp of allTypeHelperDocs) {
		utilityNavItems.push({
			title: comp.title,
			href: `/docs/type-helpers/${comp.slug}`,
			items: [],
		});
	}

	utilityNavItems.sort((a, b) => a.title.localeCompare(b.title));
	return utilityNavItems;
}

export const navigation: Navigation = {
	main: [
		{
			title: "Docs",
			href: "/docs",
		},
	],
	sidebar: [
		{
			title: "Overview",
			items: [
				{
					title: "Introduction",
					href: "/docs/introduction",
					items: [],
					icon: Sticker,
				},
				{
					title: "Getting Started",
					href: "/docs/getting-started",
					items: [],
					icon: Compass,
				},
				{
					title: "Child Snippet",
					href: "/docs/child-snippet",
					items: [],
					icon: CodeBlock,
				},
				{
					title: "Ref",
					href: "/docs/ref",
					items: [],
					icon: Leaf,
				},
				{
					title: "Transitions",
					href: "/docs/transitions",
					items: [],
					icon: CableCar,
				},
				{
					title: "Styling",
					href: "/docs/styling",
					items: [],
					icon: Palette,
				},
				{
					title: "Dates",
					href: "/docs/dates",
					items: [],
					icon: CalendarBlank,
				},
				{
					title: "Controlled State",
					href: "/docs/controlled-state",
					items: [],
					icon: Joystick,
				},
			],
		},
		{
			title: "Components",
			items: generateComponentsNav(),
		},
		{
			title: "Utilities",
			items: generateUtilitiesNav(),
		},
		{
			title: "Type Helpers",
			items: generateTypeHelpersNav(),
		},
	],
};
