import {
	allComponentDocs,
	allUtilityDocs,
	allTypeHelperDocs,
} from "../../../.contentlayer/generated/index.mjs";

export type NavItem = {
	title: string;
	href?: string;
	disabled?: boolean;
	external?: boolean;
	label?: string;
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

const filteredComponents = allComponentDocs.filter((comp) => comp.title !== "Listbox");

/**
 * Generates the navigation items for the components section of the sidebar.
 */
function generateComponentsNav() {
	const componentNavItems: SidebarNavItem[] = [];

	for (const comp of filteredComponents) {
		componentNavItems.push({
			title: comp.title,
			href: `/docs/components/${comp.slug}`,
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
				},
				{
					title: "Getting Started",
					href: "/docs/getting-started",
					items: [],
				},
				{
					title: "Delegation",
					href: "/docs/delegation",
					items: [],
				},
				{
					title: "Ref",
					href: "/docs/ref",
					items: [],
				},
				{
					title: "Styling",
					href: "/docs/styling",
					items: [],
				},
				{
					title: "Dates",
					href: "/docs/dates",
					items: [],
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
