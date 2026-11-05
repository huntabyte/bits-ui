<script lang="ts">
	import { Collapsible } from "bits-ui";

	let { count = 3, busyMs = 50 }: { count?: number; busyMs?: number } = $props();

	// keep the main thread busy while the collapsibles mount, like a heavy page would
	$effect(() => {
		const end = performance.now() + busyMs;
		while (performance.now() < end) {
			// busy
		}
	});
</script>

{#each { length: count }, i (i)}
	<Collapsible.Root open>
		<Collapsible.Trigger data-testid="trigger-{i}">Trigger {i}</Collapsible.Trigger>
		<Collapsible.Content data-testid="content-{i}">Content {i}</Collapsible.Content>
	</Collapsible.Root>
{/each}
