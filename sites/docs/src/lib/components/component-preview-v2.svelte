<script lang="ts">
	import type { Snippet } from "svelte";
	import DemoContainer from "./demo-container.svelte";
	import DemoCodeContainer from "./demo-code-container.svelte";

	type Props = {
		preview: Snippet;
		children: Snippet;
	};

	let { preview, children }: Props = $props();
</script>

<DemoContainer>
	{@render preview()}
</DemoContainer>
<DemoCodeContainer>
	{@render children()}
</DemoCodeContainer>
