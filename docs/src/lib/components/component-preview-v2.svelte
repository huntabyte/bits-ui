<script lang="ts">
	import type { Snippet } from "svelte";
	import DemoContainer from "./demo-container.svelte";
	import DemoCodeContainer from "./demo-code-container.svelte";
	import { setCopyToClipboard } from "$lib/utils/copy-to-clipboard.svelte.js";

	let {
		preview,
		children,
		fileName,
		class: className,
		containerClass,
		size,
		name,
		nonExpandableItems = [],
		componentName = fileName,
	}: {
		fileName?: string;
		componentName?: string;
		preview: Snippet;
		children: Snippet;
		class?: string;
		containerClass?: string;
		size?: "xs" | "sm" | "default" | "lg";
		nonExpandableItems?: string[];
		name: string;
	} = $props();

	setCopyToClipboard();
</script>

<DemoContainer wrapperClass={containerClass} {size} {componentName} {name}>
	{@render preview()}
</DemoContainer>
<DemoCodeContainer {fileName} class={className} {nonExpandableItems}>
	{@render children()}
</DemoCodeContainer>
