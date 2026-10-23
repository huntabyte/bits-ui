<script lang="ts">
	import { DateRangeField } from "bits-ui";
	import { CalendarDate } from "@internationalized/date";
	let { count, day = 1 }: { count: number; day?: number } = $props();
	const mk = (d: number) => new CalendarDate(2025, 1, d);
	const value = $derived({ start: mk(day), end: mk(day + 5) });
</script>

{#each { length: count }, i (i)}
	<DateRangeField.Root {value}>
		<DateRangeField.Label>label</DateRangeField.Label>
		{#each ["start", "end"] as const as type (type)}
			<DateRangeField.Input {type}>
				{#snippet children({ segments })}
					{#each segments as { part, value }, s (s)}
						<DateRangeField.Segment {part} data-bench="segment">{value}</DateRangeField.Segment>
					{/each}
				{/snippet}
			</DateRangeField.Input>
		{/each}
	</DateRangeField.Root>
{/each}
