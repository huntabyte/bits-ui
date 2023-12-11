---
title: Range Calendar
description: Presents a calendar view tailored for selecting date ranges.
---

<script>
	import { APISection, ComponentPreview, RangeCalendarDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="range-calendar-demo" comp="Range Calendar">

<RangeCalendarDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { RangeCalendar } from "bits-ui";
</script>

<RangeCalendar.Root let:months let:weekdays>
	<RangeCalendar.Header>
		<RangeCalendar.PrevButton />
		<RangeCalendar.Heading />
		<RangeCalendar.NextButton />
	</RangeCalendar.Header>
	{#each months as month}
		<RangeCalendar.Grid>
			<RangeCalendar.GridHead>
				<RangeCalendar.GridRow>
					{#each weekdays as day}
						<RangeCalendar.HeadCell>
							{day}
						</RangeCalendar.HeadCell>
					{/each}
				</RangeCalendar.GridRow>
			</RangeCalendar.GridHead>
			<RangeCalendar.GridBody>
				{#each month.weeks as weekDates}
					<RangeCalendar.GridRow>
						{#each weekDates as date}
							<RangeCalendar.Cell {date}>
								<RangeCalendar.Day {date} month={month.value} />
							</RangeCalendar.Cell>
						{/each}
					</RangeCalendar.GridRow>
				{/each}
			</RangeCalendar.GridBody>
		</RangeCalendar.Grid>
	{/each}
</RangeCalendar.Root>
```

<APISection {schemas} />
