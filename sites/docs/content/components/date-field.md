---
title: Date Field
description: Enables users to input specific dates within a designated field.
---

<script>
	import { APISection, ComponentPreviewV2, DateFieldDemo } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="date-field-demo" comp="Date Field">

{#snippet preview()}
<DateFieldDemo />
{/snippet}

</ComponentPreviewV2>

-   add docs about leap years/birthdays and placeholder date

## Structure

```svelte
<script lang="ts">
	import { DateField } from "$lib";
</script>

<DateField.Root>
	<DateField.Label>Check-in date</DateField.Label>
	<DateField.Input>
		{#snippet children({ segments })}
			{#each segments as { part, value }}
				<DateField.Segment {part}>
					{value}
				</DateField.Segment>
			{/each}
		{/snippet}
	</DateField.Input>
</DateField.Root>
```

<APISection {schemas} />
