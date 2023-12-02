---
title: Accordion
description: Organizes content into collapsible sections, allowing users to focus on one section at a time.
---

<script>
	import { APISection, ComponentPreview, AccordionDemo } from '@/components'
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
