<script lang="ts">
	import { Accordion } from "bits-ui";
	let { count, value = [] }: { count: number; value?: string[] } = $props();
</script>

<Accordion.Root type="multiple" bind:value>
	{#each { length: count }, i (i)}
		<Accordion.Item value="{i}">
			<Accordion.Header>
				<Accordion.Trigger data-bench="trigger">Item {i}</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content data-bench="content">Content {i}</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
