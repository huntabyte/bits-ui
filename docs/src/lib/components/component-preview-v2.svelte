<script lang="ts">
	import type { Snippet } from "svelte";
	import DemoContainer from "./demo-container.svelte";
	import DemoCodeContainer from "./demo-code-container.svelte";
	import { setCopyToClipboard } from "$lib/utils/copy-to-clipboard.svelte.js";

	type Props = {
		fileName?: string;
		preview: Snippet;
		children: Snippet;
		class?: string;
		containerClass?: string;
		size?: "xs" | "sm" | "default" | "lg";
		nonExpandableItems?: string[];
		name: string;
	};

	let {
		preview,
		children,
		fileName,
		class: className,
		containerClass,
		size,
		name,
		nonExpandableItems = [],
	}: Props = $props();

	setCopyToClipboard();
</script>

<DemoContainer wrapperClass={containerClass} {size}>
	{@render preview()}
</DemoContainer>
<DemoCodeContainer {fileName} class={className} {nonExpandableItems} {name}>
	{@render children()}
</DemoCodeContainer>
