<script lang="ts">
	import { Collapsible } from "bits-ui";
	let { count, open = false }: { count: number; open?: boolean } = $props();
</script>

{#each { length: count }, i (i)}
	<Collapsible.Root {open}>
		<Collapsible.Trigger>toggle</Collapsible.Trigger>
		<Collapsible.Content data-bench="content">content {i}</Collapsible.Content>
	</Collapsible.Root>
{/each}
