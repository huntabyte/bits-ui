---
title: Date Picker
description: A date picker component.
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
		<DatePicker.Calendar let:months let:daysOfWeek>
			<DatePicker.CalendarHeader>
				<DatePicker.CalendarPrevButton />
				<DatePicker.CalendarHeading />
				<DatePicker.CalendarNextButton />
			</DatePicker.CalendarHeader>
			{#each months as month}
				<DatePicker.CalendarGrid>
					<DatePicker.CalendarGridHead>
						<DatePicker.CalendarGridRow>
							{#each daysOfWeek as day}
								<DatePicker.CalendarHeadCell>
									{day}
								</DatePicker.CalendarHeadCell>
							{/each}
						</DatePicker.CalendarGridRow>
					</DatePicker.CalendarGridHead>
					<DatePicker.CalendarGridBody>
						{#each month.weeks as weekDates}
							<DatePicker.CalendarGridRow>
								{#each weekDates as date}
									<DatePicker.CalendarCell {date}>
										<DatePicker.CalendarDate {date} month={month.value} />
									</DatePicker.CalendarCell>
								{/each}
							</DatePicker.CalendarGridRow>
						{/each}
					</DatePicker.CalendarGridBody>
				</DatePicker.CalendarGrid>
			{/each}
		</DatePicker.Calendar>
	</DatePicker.Content>
</DatePicker.Root>
```

<APISection {schemas} />
