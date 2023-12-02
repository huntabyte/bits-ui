---
title: Date Range Field
description: Allows users to input a range of dates within a designated field.
---

<script>
	import { APISection, ComponentPreview, DateRangeFieldDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="date-range-field-demo" comp="Date Range Field">

<DateRangeFieldDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { DateField } from "$lib";
</script>

<DateField.Root>
	<DateField.Label>Check-in date</DateField.Label>
	<DateField.Input let:segments>
		{#each segments as { part, value }}
			<DateField.Segment {part}>
				{value}
			</DateField.Segment>
		{/each}
	</DateField.Input>
</DateField.Root>
```

<APISection {schemas} />
