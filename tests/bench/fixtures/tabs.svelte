<script lang="ts">
	import { Tabs } from "bits-ui";
	let { count, value = "0" }: { count: number; value?: string } = $props();
</script>

<Tabs.Root bind:value>
	<Tabs.List>
		{#each { length: count }, i (i)}
			<Tabs.Trigger value="{i}" data-bench="trigger">Tab {i}</Tabs.Trigger>
		{/each}
	</Tabs.List>
	{#each { length: count }, i (i)}
		<Tabs.Content value="{i}">Panel {i}</Tabs.Content>
	{/each}
</Tabs.Root>
