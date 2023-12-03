<script lang="ts">
	import { DateRangeField } from "$lib";
	import { CalendarDate } from "@internationalized/date";

	let value = {
		start: new CalendarDate(2022, 1, 1),
		end: new CalendarDate(2022, 3, 1)
	};
</script>

<DateRangeField.Root bind:value>
	<div class="flex min-w-[200px] flex-col gap-1">
		<DateRangeField.Label class="block select-none"
			>Hotel dates</DateRangeField.Label
		>
		<DateRangeField.Input
			let:segments
			class="flex h-input w-full max-w-[300px] select-none items-center rounded-input border border-border-input bg-background p-3 text-sm shadow-mini"
		>
			{#each segments.start as { part, value }}
				<div class="inline-block select-none">
					<DateRangeField.Segment
						type="start"
						{part}
						class="rounded-[3px] px-1 data-[segment=literal]:px-px data-[segment=literal]:text-muted-foreground"
					>
						{value}
					</DateRangeField.Segment>
				</div>
			{/each}
			<div aria-hidden class="px-1">-</div>
			{#each segments.end as { part, value }}
				<div class="inline-block select-none">
					<DateRangeField.Segment
						type="end"
						{part}
						class="rounded-[3px] px-1 data-[segment=literal]:px-px data-[segment=literal]:text-muted-foreground"
					>
						{value}
					</DateRangeField.Segment>
				</div>
			{/each}
		</DateRangeField.Input>
	</div>
</DateRangeField.Root>
