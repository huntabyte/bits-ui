---
title: Date Range Field
description: Allows users to input a range of dates within a designated field.
---

<script>
	import { APISection, ComponentPreview, DateRangeFieldDemo } from '$lib/components/index.js'
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

<DateRangeField.Root>
	<DateRangeField.Label>Check-in date</DateRangeField.Label>
	{#each ["start", "end"] as const as type}
		<DateRangeField.Input {type}>
			{#snippet children({ segments })}
				{#each segments as { part, value }}
					<DateRangeField.Segment {part}>
						{value}
					</DateRangeField.Segment>
				{/each}
			{/snippet}
		</DateRangeField.Input>
	{/each}
</DateRangeField.Root>
```

<APISection {schemas} />
