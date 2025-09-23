<script lang="ts">
	import { Collapsible } from "bits-ui";

	let {
		open = false,
		hiddenUntilFound = true,
		...restProps
	}: Omit<Collapsible.RootProps, "asChild" | "child" | "children"> & {
		hiddenUntilFound?: boolean;
	} = $props();
</script>

<main>
	<p data-testid="binding">{open}</p>
	<Collapsible.Root data-testid="root" bind:open {...restProps}>
		<Collapsible.Trigger data-testid="trigger">Trigger</Collapsible.Trigger>
		<Collapsible.Content data-testid="content" {hiddenUntilFound}>
			<div data-testid="searchable-content">
				This is some searchable content that should be found by the browser's search
				functionality. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
				<p data-testid="nested-content">Nested paragraph with more searchable text.</p>
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
	<button data-testid="alt-trigger" onclick={() => (open = !open)}>Toggle</button>
</main>
