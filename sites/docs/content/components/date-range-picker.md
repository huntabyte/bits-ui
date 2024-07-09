---
title: Date Range Picker
description: Facilitates the selection of date ranges through an input and calendar-based interface.
---

<script>
	import { APISection, ComponentPreview, DateRangePickerDemo } from '$lib/components/index.js'
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
	{#each ["start", "end"] as const as type}
		<DateRangePicker.Input {type}>
			{#snippet children({ segments })}
				{#each segments as { part, value }}
					<DateRangePicker.Segment {part}>
						{value}
					</DateRangePicker.Segment>
				{/each}
			{/snippet}
		</DateRangePicker.Input>
	{/each}
	<DateRangePicker.Trigger />
	<DateRangePicker.Content>
		<DateRangePicker.Calendar>
			{#snippet children({ months, weekdays })}
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
										<DateRangePicker.Cell {date} month={month.value}>
											<DateRangePicker.Day>
												{date.day}
											</DateRangePicker.Day>
										</DateRangePicker.Cell>
									{/each}
								</DateRangePicker.GridRow>
							{/each}
						</DateRangePicker.GridBody>
					</DateRangePicker.Grid>
				{/each}
			{/snippet}
		</DateRangePicker.Calendar>
	</DateRangePicker.Content>
</DateRangePicker.Root>
```

<APISection {schemas} />
