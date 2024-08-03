<script lang="ts">
	import type { Snippet } from "svelte";
	import DemoContainer from "./demo-container.svelte";
	import DemoCodeContainer from "./demo-code-container.svelte";

	type Props = {
		fileName?: string;
		preview: Snippet;
		children: Snippet;
		class?: string;
		containerClass?: string;
		size?: "xs" | "sm" | "default" | "lg";
	};

	let { preview, children, fileName, class: className, containerClass, size }: Props = $props();
</script>

<DemoContainer wrapperClass={containerClass} {size}>
	{@render preview()}
</DemoContainer>
<DemoCodeContainer {fileName} class={className}>
	{@render children()}
</DemoCodeContainer>
