<script lang="ts">
	import { Calendar, RangeCalendar } from "bits-ui";
	import { CalendarDate, JapaneseCalendar, toCalendar } from "@internationalized/date";

	let { range = false }: { range?: boolean } = $props();
	const calendar = new JapaneseCalendar();
	const placeholder = toCalendar(new CalendarDate(1989, 1, 8), calendar);
	const dates = [
		{ id: "before", date: toCalendar(new CalendarDate(1989, 1, 7), calendar) },
		{ id: "after", date: placeholder },
		{ id: "outside", date: toCalendar(new CalendarDate(1989, 2, 1), calendar) },
	];
</script>

{#if range}
	<RangeCalendar.Root {placeholder}>
		{#each dates as { id, date } (id)}
			<RangeCalendar.Cell {date} month={placeholder}>
				<RangeCalendar.Day data-testid={id} />
			</RangeCalendar.Cell>
		{/each}
	</RangeCalendar.Root>
{:else}
	<Calendar.Root type="single" {placeholder}>
		{#each dates as { id, date } (id)}
			<Calendar.Cell {date} month={placeholder}>
				<Calendar.Day data-testid={id} />
			</Calendar.Cell>
		{/each}
	</Calendar.Root>
{/if}
