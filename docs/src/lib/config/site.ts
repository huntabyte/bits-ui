import { defineSiteConfig } from "$lib/utils/use-site-config.svelte.js";

export const siteConfig = defineSiteConfig({
	name: "Bits UI",
	url: "https://www.bits-ui.com",
	description:
		"Headless components for Svelte - flexible, unstyled, and accessible primitives that provide the foundation for building your own high-quality component library.",
	ogImage: {
		url: "https://www.bits-ui.com/og.png",
		height: "630",
		width: "1200",
	},
	author: "Huntabyte",
	license: {
		name: "MIT",
		url: "https://github.com/huntabyte/bits-ui/blob/main/LICENSE",
	},
	links: {
		x: "https://x.com/huntabyte",
		github: "https://github.com/huntabyte/bits-ui",
	},
	keywords: [
		"Svelte",
		"SvelteKit",
		"Svelte Components",
		"Headless Svelte",
		"Components",
		"Headless UI Svelte",
	],
});

export type SiteConfig = typeof siteConfig;
