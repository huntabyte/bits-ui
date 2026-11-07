<script lang="ts">
	import { RangeCalendar } from "bits-ui";
	import { CalendarDate } from "@internationalized/date";
	let {
		count,
		numberOfMonths = 1,
		month = 1,
	}: { count: number; numberOfMonths?: number; month?: number } = $props();
	const placeholder = $derived(new CalendarDate(2025, month, 1));
</script>

{#each { length: count }, c (c)}
	<RangeCalendar.Root {placeholder} {numberOfMonths}>
		{#snippet children({ months, weekdays })}
			<RangeCalendar.Header>
				<RangeCalendar.PrevButton>prev</RangeCalendar.PrevButton>
				<RangeCalendar.Heading />
				<RangeCalendar.NextButton data-bench="next">next</RangeCalendar.NextButton>
			</RangeCalendar.Header>
			{#each months as m (m.value.toString())}
				<RangeCalendar.Grid>
					<RangeCalendar.GridHead>
						<RangeCalendar.GridRow>
							{#each weekdays as day, i (i)}
								<RangeCalendar.HeadCell>{day}</RangeCalendar.HeadCell>
							{/each}
						</RangeCalendar.GridRow>
					</RangeCalendar.GridHead>
					<RangeCalendar.GridBody>
						{#each m.weeks as week, w (w)}
							<RangeCalendar.GridRow>
								{#each week as date (date.toString())}
									<RangeCalendar.Cell {date} month={m.value}>
										<RangeCalendar.Day data-bench="day" />
									</RangeCalendar.Cell>
								{/each}
							</RangeCalendar.GridRow>
						{/each}
					</RangeCalendar.GridBody>
				</RangeCalendar.Grid>
			{/each}
		{/snippet}
	</RangeCalendar.Root>
{/each}
