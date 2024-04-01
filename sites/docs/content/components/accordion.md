---
title: Accordion
description: Organizes content into collapsible sections, allowing users to focus on one section at a time.
---

<script>
	import { APISection, ComponentPreview, AccordionDemo } from '@/components/index.js'
	export let schemas
</script>

<ComponentPreview name="accordion-demo" comp="Accordion">

<AccordionDemo slot="preview" />

</ComponentPreview>

## Structure

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
</script>

<Accordion.Root>
	<Accordion.Item>
		<Accordion.Header>
			<Accordion.Trigger />
		</Accordion.Header>
		<Accordion.Content />
	</Accordion.Item>
</Accordion.Root>
```

<APISection {schemas} />

## Examples

### Multiple

Multiple accordion items open at the same time using the `multiple` prop.

```svelte showLineNumbers {1}
<Accordion.Root multiple>
	<!-- ... -->
</Accordion.Root>
```

### Controlled

You can programmatically control the active of the accordion item(s) using the `value` prop.

```svelte showLineNumbers
<script lang="ts">
	let value = "item-1";
</script>

<Accordion.Root bind:value>
	<Accordion.Item value="item-1">
		<Accordion.Header>
			<Accordion.Trigger />
		</Accordion.Header>
		<Accordion.Content />
	</Accordion.Item>
	<Accordion.Item value="item-2">
		<Accordion.Header>
			<Accordion.Trigger />
		</Accordion.Header>
		<Accordion.Content />
	</Accordion.Item>
</Accordion.Root>
```
