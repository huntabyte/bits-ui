declare module "*.md" {
	import type { Component } from "svelte";
	const component: Component;
	export default component;
}

declare module "*.md?raw" {
	const content: string;
	export default content;
}
