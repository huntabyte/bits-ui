<script lang="ts">
	import { TimeRangeField } from "bits-ui";
	import { Time } from "@internationalized/date";
	let { count, day = 1 }: { count: number; day?: number } = $props();
	const mk = (d: number) => new Time(10, d);
	const value = $derived({ start: mk(day), end: mk(day + 5) });
</script>

{#each { length: count }, i (i)}
	<TimeRangeField.Root {value}>
		<TimeRangeField.Label>label</TimeRangeField.Label>
		{#each ["start", "end"] as const as type (type)}
			<TimeRangeField.Input {type}>
				{#snippet children({ segments })}
					{#each segments as { part, value }, s (s)}
						<TimeRangeField.Segment {part} data-bench="segment">{value}</TimeRangeField.Segment>
					{/each}
				{/snippet}
			</TimeRangeField.Input>
		{/each}
	</TimeRangeField.Root>
{/each}
