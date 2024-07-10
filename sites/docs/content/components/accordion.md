---
title: Accordion
description: Organizes content into collapsible sections, allowing users to focus on one section at a time.
---

<script>
	import { APISection, ComponentPreview, AccordionDemo } from '$lib/components/index.js'
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

## Usage

### Single

Set the `type` prop to `"single"` to allow only one accordion item to be open at a time.

```svelte {1}
<Accordion.Root type="single">
	<!-- ... -->
</Accordion.Root>
```

### Multiple

Set the `type` prop to `"multiple"` to allow multiple accordion items to be open at the same time.

```svelte {1}
<Accordion.Root type="multiple">
	<!-- ... -->
</Accordion.Root>
```

### Disable Items

To disable an individual accordion item, set the `disabled` prop to `true`. This will prevent users from interacting with the item.

```svelte {2}
<Accordion.Root type="single">
	<Accordion.Item value="item-1" disabled>
		<!-- ... -->
	</Accordion.Item>
</Accordion.Root>
```

### Controlled Value

You can programmatically control the active of the accordion item(s) using the `value` prop.

```svelte
<script lang="ts">
	let value = $state("item-1");
</script>

<button onclick={() => (value = "item-2")}>Change value</button>

<Accordion.Root bind:value>
	<!-- ... -->
</Accordion.Root>
```

### Value Change Side Effects

#### onValueChange

You can use the `onValueChange` prop to handle side effects when the value of the accordion changes.

```svelte
<Accordion.Root
	onValueChange={(value) => {
		doSomething(value);
	}}
>
	<!-- ... -->
</Accordion.Root>
```

#### $effect

You can use `bind:value` with an `$effect` block to handle side effects when the value of the accordion changes.

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";

	let value = $state("item-1")

	$effect(() => {
		doSomething(value);
	})
</script>

<Accordion.Root bind:value>
	<!-- ... -->
</Accordion.Item>
```

<APISection {schemas} />
