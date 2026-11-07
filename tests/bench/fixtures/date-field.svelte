<script lang="ts">
	import { DateField } from "bits-ui";
	import { CalendarDate } from "@internationalized/date";
	let { count, day = 1 }: { count: number; day?: number } = $props();
	const value = $derived(new CalendarDate(2025, 1, day));
</script>

{#each { length: count }, i (i)}
	<DateField.Root {value}>
		<DateField.Label>label</DateField.Label>
		<DateField.Input>
			{#snippet children({ segments })}
				{#each segments as { part, value }, s (s)}
					<DateField.Segment {part} data-bench="segment">{value}</DateField.Segment>
				{/each}
			{/snippet}
		</DateField.Input>
	</DateField.Root>
{/each}
