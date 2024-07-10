<script lang="ts">
	import type { Snippet } from "svelte";
	import DemoContainer from "./demo-container.svelte";
	import DemoCodeContainer from "./demo-code-container.svelte";

	type Props = {
		preview: Snippet;
		children: Snippet;
		invert?: boolean;
	};

	let { preview, children, invert = false }: Props = $props();
</script>

{#if invert}
	<DemoCodeContainer>
		{@render children()}
	</DemoCodeContainer>
	<DemoContainer>
		{@render preview()}
	</DemoContainer>
{:else}
	<DemoContainer>
		{@render preview()}
	</DemoContainer>
	<DemoCodeContainer>
		{@render children()}
	</DemoCodeContainer>
{/if}
