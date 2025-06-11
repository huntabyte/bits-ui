<script lang="ts">
	import { Calendar } from "bits-ui";
	import type { CalendarDate } from "@internationalized/date";

	let {
		placeholder,
		months,
		years,
		monthFormat,
		yearFormat,
		disabled = false,
		readonly = false,
		minValue,
		maxValue,
	}: {
		placeholder?: CalendarDate;
		months?: number[];
		years?: number[];
		monthFormat?: Intl.DateTimeFormatOptions["month"];
		yearFormat?: Intl.DateTimeFormatOptions["year"];
		disabled?: boolean;
		readonly?: boolean;
		minValue?: CalendarDate;
		maxValue?: CalendarDate;
	} = $props();
</script>

<Calendar.Root
	type="single"
	{placeholder}
	{disabled}
	{readonly}
	{minValue}
	{maxValue}
	data-testid="calendar"
>
	{#snippet children({ months: calendarMonths })}
		<div data-testid="header">
			<Calendar.MonthSelect data-testid="month-select" {months} {monthFormat} />
			<Calendar.YearSelect data-testid="year-select" {years} {yearFormat} />
		</div>
		<div data-testid="calendar-grid">
			{#each calendarMonths as month, i (i)}
				<Calendar.Grid data-testid="grid-{month.value.month}">
					<Calendar.GridHead>
						<Calendar.GridRow>
							<Calendar.HeadCell>Day</Calendar.HeadCell>
						</Calendar.GridRow>
					</Calendar.GridHead>
					<Calendar.GridBody>
						{#each month.weeks as weekDates, j (j)}
							<Calendar.GridRow data-week>
								{#each weekDates as date, k (k)}
									<Calendar.Cell {date} month={month.value}>
										<Calendar.Day data-testid="date-{date.month}-{date.day}">
											{date.day}
										</Calendar.Day>
									</Calendar.Cell>
								{/each}
							</Calendar.GridRow>
						{/each}
					</Calendar.GridBody>
				</Calendar.Grid>
			{/each}
		</div>
	{/snippet}
</Calendar.Root>
