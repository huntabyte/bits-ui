---
title: Calendar
description: Displays dates and days of the week, facilitating date-related interactions.
---

<script>
	import { APISection, ComponentPreview, CalendarDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="calendar-demo" comp="Calendar">

<CalendarDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Calendar } from "bits-ui";
</script>

<Calendar.Root let:months let:weekdays>
	<Calendar.Header>
		<Calendar.PrevButton />
		<Calendar.Heading />
		<Calendar.NextButton />
	</Calendar.Header>

	{#each months as month}
		<Calendar.Grid>
			<Calendar.GridHead>
				<Calendar.GridRow>
					{#each weekdays as day}
						<Calendar.HeadCell>
							{day}
						</Calendar.HeadCell>
					{/each}
				</Calendar.GridRow>
			</Calendar.GridHead>
			<Calendar.GridBody>
				{#each month.weeks as weekDates}
					<Calendar.GridRow>
						{#each weekDates as date}
							<Calendar.Cell {date}>
								<Calendar.Day {date} month={month.value} />
							</Calendar.Cell>
						{/each}
					</Calendar.GridRow>
				{/each}
			</Calendar.GridBody>
		</Calendar.Grid>
	{/each}
</Calendar.Root>
```

<APISection {schemas} />
