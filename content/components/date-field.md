---
title: Date Field
description: Enables users to input specific dates within a designated field.
---

<script>
	import { APISection, ComponentPreview, DateFieldDemo } from '@/components'
	export let schemas;
</script>

<ComponentPreview name="date-field-demo" comp="Date Field">

<DateFieldDemo slot="preview" />

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
