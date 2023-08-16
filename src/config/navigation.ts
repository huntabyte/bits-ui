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
		},
		{
			title: "Components",
			items: [
				{
					title: "Accordion",
					href: "/docs/accordion",
					items: []
				},
				{
					title: "Alert Dialog",
					href: "/docs/alert-dialog",
					items: []
				},
				{
					title: "Aspect Ratio",
					href: "/docs/aspect-ratio",
					items: []
				},
				{
					title: "Avatar",
					href: "/docs/avatar",
					items: []
				},
				{
					title: "Button",
					href: "/docs/button",
					items: []
				},
				{
					title: "Checkbox",
					href: "/docs/checkbox",
					items: []
				},
				{
					title: "Collapsible",
					href: "/docs/collapsible",
					items: []
				},
				{
					title: "Dialog",
					href: "/docs/dialog",
					items: []
				},
				{
					title: "Dropdown Menu",
					href: "/docs/dropdown-menu",
					items: []
				},
				{
					title: "Hover Card",
					href: "/docs/hover-card",
					items: []
				},
				{
					title: "Label",
					href: "/docs/label",
					items: []
				},
				{
					title: "Menubar",
					href: "/docs/menubar",
					items: []
				},
				{
					title: "Popover",
					href: "/docs/popover",
					items: []
				},
				{
					title: "Progress",
					href: "/docs/progress",
					items: []
				},
				{
					title: "Radio Group",
					href: "/docs/radio-group",
					items: []
				},
				{
					title: "Select",
					href: "/docs/select",
					items: []
				},
				{
					title: "Separator",
					href: "/docs/separator",
					items: []
				},
				{
					title: "Slider",
					href: "/docs/slider",
					items: []
				},
				{
					title: "Switch",
					href: "/docs/switch",
					items: []
				},
				{
					title: "Tabs",
					href: "/docs/tabs",
					items: []
				},
				{
					title: "Toggle",
					href: "/docs/toggle",
					items: []
				},
				{
					title: "Tooltip",
					href: "/docs/tooltip",
					items: []
				}
			]
		}
	]
};
