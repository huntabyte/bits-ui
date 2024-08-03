---
title: Date Field
description: Enables users to input specific dates within a designated field.
---

<script>
	import { APISection, ComponentPreviewV2, DateFieldDemo, DateFieldDemoCustom } from '$lib/components/index.js'
	export let schemas;
</script>

<ComponentPreviewV2 name="date-field-demo" comp="Date Field">

{#snippet preview()}
<DateFieldDemo />
{/snippet}

</ComponentPreviewV2>

-   add docs about leap years/birthdays and placeholder date

Before jumping into the `DateField` component, it's important to understand how dates and times are handled in Bits UI. You can learn more about this on the [Dates](/docs/dates) page.

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

## Reusable Components

It's recommended to use the `DateField` primitives to build your own custom date field component that can be used throughout your application.

The following example shows how you might create a reusable `MyDateField` component that can be used throughout your application. For style inspiration, reference the featured demo at the top of this page.

```svelte title="MyDateField.svelte"
<script lang="ts">
	import { DateField, type WithoutChildrenOrChild } from "bits-ui";

	type Props = WithoutChildrenOrChild<DateField.RootProps> & {
		labelText: string;
	};

	let { value, placeholder, name, ...restProps }: Props = $props();
</script>

<DateField.Root bind:value bind:placeholder {name} {...restProps}>
	<DateField.Label>{labelText}</DateField.Label>
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

We'll be using the following `MyDateField` component in the following demos and examples to prevent repeating the same code over and over.

<ComponentPreviewV2 size="xs" fileName="MyDateField.svelte" containerClass="mt-4" name="date-field-demo-custom" comp="DateField">

{#snippet preview()}
<DateFieldDemoCustom labelText="Select a date" />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
