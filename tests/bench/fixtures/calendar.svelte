<script lang="ts">
	import { Calendar } from "bits-ui";
	import { CalendarDate } from "@internationalized/date";
	let {
		count,
		numberOfMonths = 1,
		month = 1,
	}: { count: number; numberOfMonths?: number; month?: number } = $props();
	const placeholder = $derived(new CalendarDate(2025, month, 1));
</script>

{#each { length: count }, c (c)}
	<Calendar.Root type="single" {placeholder} {numberOfMonths}>
		{#snippet children({ months, weekdays })}
			<Calendar.Header>
				<Calendar.PrevButton>prev</Calendar.PrevButton>
				<Calendar.Heading />
				<Calendar.NextButton data-bench="next">next</Calendar.NextButton>
			</Calendar.Header>
			{#each months as m (m.value.toString())}
				<Calendar.Grid>
					<Calendar.GridHead>
						<Calendar.GridRow>
							{#each weekdays as day, i (i)}
								<Calendar.HeadCell>{day}</Calendar.HeadCell>
							{/each}
						</Calendar.GridRow>
					</Calendar.GridHead>
					<Calendar.GridBody>
						{#each m.weeks as week, w (w)}
							<Calendar.GridRow>
								{#each week as date (date.toString())}
									<Calendar.Cell {date} month={m.value}>
										<Calendar.Day data-bench="day" />
									</Calendar.Cell>
								{/each}
							</Calendar.GridRow>
						{/each}
					</Calendar.GridBody>
				</Calendar.Grid>
			{/each}
		{/snippet}
	</Calendar.Root>
{/each}
