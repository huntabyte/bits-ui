<script lang="ts">
	import type { Snippet } from "svelte";
	import DemoContainer from "./demo-container.svelte";
	import DemoCodeContainer from "./demo-code-container.svelte";

	type Props = {
		preview: Snippet;
		children: Snippet;
		class?: string;
	};

	let { preview, children, class: className }: Props = $props();
</script>

<DemoContainer>
	{@render preview()}
</DemoContainer>
<DemoCodeContainer class={className}>
	{@render children()}
</DemoCodeContainer>
