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

export const navigation: Navigation = {
	main: [
		{
			title: "Docs",
			href: "/docs"
		}
	],
	sidebar: [
		{
			title: "Getting Started",
			items: [
				{
					title: "Introduction",
					href: "/docs/introduction",
					items: []
				},
				{
					title: "Installation",
					href: "/docs/installation",
					items: []
				},
				{
					title: "Quick Start",
					href: "/docs/quick-start",
					items: []
				}
			]
		}
	]
};
