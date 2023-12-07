---
title: Date Range Picker
description: Facilitates the selection of date ranges through an input and calendar-based interface.
---

<script>
	import { APISection, ComponentPreview, DateRangePickerDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="date-range-picker-demo" comp="Date Range Picker">

<DateRangePickerDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { DateRangePicker } from "bits-ui";
</script>

<DateRangePicker.Root>
	<DateRangePicker.Label />
	<DateRangePicker.Input let:segments>
		{#each segments as { part, value }}
			<DateRangePicker.Segment {part}>
				{value}
			</DateRangePicker.Segment>
		{/each}
		<DateRangePicker.Trigger />
	</DateRangePicker.Input>
	<DateRangePicker.Content>
		<DateRangePicker.Calendar let:months let:weekdays>
			<DateRangePicker.Header>
				<DateRangePicker.PrevButton />
				<DateRangePicker.Heading />
				<DateRangePicker.NextButton />
			</DateRangePicker.Header>
			{#each months as month}
				<DateRangePicker.Grid>
					<DateRangePicker.GridHead>
						<DateRangePicker.GridRow>
							{#each weekdays as day}
								<DateRangePicker.HeadCell>
									{day}
								</DateRangePicker.HeadCell>
							{/each}
						</DateRangePicker.GridRow>
					</DateRangePicker.GridHead>
					<DateRangePicker.GridBody>
						{#each month.weeks as weekDates}
							<DateRangePicker.GridRow>
								{#each weekDates as date}
									<DateRangePicker.Cell {date}>
										<DateRangePicker.Day {date} month={month.value} />
									</DateRangePicker.Cell>
								{/each}
							</DateRangePicker.GridRow>
						{/each}
					</DateRangePicker.GridBody>
				</DateRangePicker.Grid>
			{/each}
		</DateRangePicker.Calendar>
	</DateRangePicker.Content>
</DateRangePicker.Root>
```

<APISection {schemas} />
