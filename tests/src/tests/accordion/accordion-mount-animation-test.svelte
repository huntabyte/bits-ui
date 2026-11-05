<script lang="ts">
	import { Accordion } from "bits-ui";

	let { count = 3, busyMs = 50 }: { count?: number; busyMs?: number } = $props();

	const values = Array.from({ length: count }, (_, i) => `item-${i}`);

	// keep the main thread busy while the accordion mounts, like a heavy page would
	$effect(() => {
		const end = performance.now() + busyMs;
		while (performance.now() < end) {
			// busy
		}
	});
</script>

<Accordion.Root type="multiple" value={values}>
	{#each values as value, i (value)}
		<Accordion.Item {value}>
			<Accordion.Header>
				<Accordion.Trigger data-testid="trigger-{i}">Trigger {i}</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content data-testid="content-{i}">Content {i}</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
