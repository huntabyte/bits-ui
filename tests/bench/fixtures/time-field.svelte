<script lang="ts">
	import { TimeField } from "bits-ui";
	import { Time } from "@internationalized/date";
	let { count, day = 1 }: { count: number; day?: number } = $props();
	const value = $derived(new Time(10, day));
</script>

{#each { length: count }, i (i)}
	<TimeField.Root {value}>
		<TimeField.Label>label</TimeField.Label>
		<TimeField.Input>
			{#snippet children({ segments })}
				{#each segments as { part, value }, s (s)}
					<TimeField.Segment {part} data-bench="segment">{value}</TimeField.Segment>
				{/each}
			{/snippet}
		</TimeField.Input>
	</TimeField.Root>
{/each}
