<script lang="ts">
	import { DateField, TimeField } from "bits-ui";
	import { CalendarDateTime, Time } from "@internationalized/date";
	let { count, kind }: { count: number; kind: "date" | "time" } = $props();
</script>

{#each { length: count }, i (i)}
	{#if kind === "date"}
		<DateField.Root
			value={new CalendarDateTime(2025, 1, 1, 10, 30)}
			granularity="minute"
			locale="en-US"
		>
			<DateField.Label>Date</DateField.Label>
			<DateField.Input>
				{#snippet children({ segments })}
					{#each segments as { part, value }, s (s)}
						<DateField.Segment {part}>{value}</DateField.Segment>
					{/each}
				{/snippet}
			</DateField.Input>
		</DateField.Root>
	{:else}
		<TimeField.Root value={new Time(10, 30)} locale="en-US">
			<TimeField.Label>Time</TimeField.Label>
			<TimeField.Input>
				{#snippet children({ segments })}
					{#each segments as { part, value }, s (s)}
						<TimeField.Segment {part}>{value}</TimeField.Segment>
					{/each}
				{/snippet}
			</TimeField.Input>
		</TimeField.Root>
	{/if}
{/each}
