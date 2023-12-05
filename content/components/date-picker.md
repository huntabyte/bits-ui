---
title: Date Picker
description: Facilitates the selection of dates through an input and calendar-based interface.
---

<script>
	import { APISection, ComponentPreview, DatePickerDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="date-picker-demo" comp="Date Picker">

<DatePickerDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { DatePicker } from "bits-ui";
</script>

<DatePicker.Root>
	<DatePicker.Label />
	<DatePicker.Input let:segments>
		{#each segments as { part, value }}
			<DatePicker.Segment {part}>
				{value}
			</DatePicker.Segment>
		{/each}
		<DatePicker.Trigger />
	</DatePicker.Input>
	<DatePicker.Content>
		<DatePicker.Calendar let:months let:weekdays>
			<DatePicker.Header>
				<DatePicker.PrevButton />
				<DatePicker.Heading />
				<DatePicker.NextButton />
			</DatePicker.Header>
			{#each months as month}
				<DatePicker.Grid>
					<DatePicker.GridHead>
						<DatePicker.GridRow>
							{#each weekdays as day}
								<DatePicker.HeadCell>
									{day}
								</DatePicker.HeadCell>
							{/each}
						</DatePicker.GridRow>
					</DatePicker.GridHead>
					<DatePicker.GridBody>
						{#each month.weeks as weekDates}
							<DatePicker.GridRow>
								{#each weekDates as date}
									<DatePicker.Cell {date}>
										<DatePicker.Day {date} month={month.value} />
									</DatePicker.Cell>
								{/each}
							</DatePicker.GridRow>
						{/each}
					</DatePicker.GridBody>
				</DatePicker.Grid>
			{/each}
		</DatePicker.Calendar>
	</DatePicker.Content>
</DatePicker.Root>
```

<APISection {schemas} />
