<script lang="ts">
	import { RangeCalendar } from "bits-ui";
	import type { CalendarDate } from "@internationalized/date";
	import type { DateRange } from "bits-ui";

	let {
		placeholder,
		value = $bindable(),
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
		value?: DateRange;
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

<RangeCalendar.Root
	{placeholder}
	bind:value
	{disabled}
	{readonly}
	{minValue}
	{maxValue}
	data-testid="calendar"
>
	{#snippet children({ months: calendarMonths })}
		<div data-testid="header">
			<RangeCalendar.MonthSelect data-testid="month-select" {months} {monthFormat} />
			<RangeCalendar.YearSelect data-testid="year-select" {years} {yearFormat} />
		</div>
		<div data-testid="calendar-grid">
			{#each calendarMonths as month (month.value.toString())}
				<RangeCalendar.Grid data-testid="grid-{month.value.month}">
					<RangeCalendar.GridHead>
						<RangeCalendar.GridRow>
							<RangeCalendar.HeadCell>Day</RangeCalendar.HeadCell>
						</RangeCalendar.GridRow>
					</RangeCalendar.GridHead>
					<RangeCalendar.GridBody>
						{#each month.weeks as weekDates (weekDates[0]?.toString())}
							<RangeCalendar.GridRow data-week>
								{#each weekDates as date (date.toString())}
									<RangeCalendar.Cell {date} month={month.value}>
										<RangeCalendar.Day
											data-testid="date-{date.month}-{date.day}"
										>
											{date.day}
										</RangeCalendar.Day>
									</RangeCalendar.Cell>
								{/each}
							</RangeCalendar.GridRow>
						{/each}
					</RangeCalendar.GridBody>
				</RangeCalendar.Grid>
			{/each}
		</div>
	{/snippet}
</RangeCalendar.Root>
