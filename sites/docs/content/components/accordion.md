---
title: Accordion
description: Organizes content into collapsible sections, allowing users to focus on one section at a time.
---

<script>
	import { APISection, ComponentPreviewV2, AccordionDemo } from '$lib/components/index.js'
	export let schemas
</script>

<ComponentPreviewV2 name="accordion-demo" comp="Accordion">

{#snippet preview()}
<AccordionDemo />
{/snippet}

</ComponentPreviewV2>

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

Alternatively, you can use `bind:value` with an `$effect` block to handle side effects when the value of the accordion changes.

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

## Reusable Wrappers

### Entire Component

If you're going to be using the same accordion component multiple places throughout your app, you can create a reusable wrapper to reduce the amount of code you need to write each time.

```svelte title="CustomAccordion.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildren } from "bits-ui";

	type Props = WithoutChildren<Accordion.RootProps> & {
		items: Array<{
			value: string;
			disabled?: boolean;
			title: string;
			content: string;
		}>;
	};

	let { items, value = $bindable(""), ...restProps }: Props = $props();
</script>

<Accordion.Root bind:value {...restProps}>
	{#each items as item}
		<Accordion.Item value={item.value} disabled={item.disabled}>
			<Accordion.Header>
				<Accordion.Trigger>{item.title}</Accordion.Trigger>
			</Accordion.Header>
			<Accordion.Content>{item.content}</Accordion.Content>
		</Accordion.Item>
	{/each}
</Accordion.Root>
```

### Individual Item

For each invidual item, you need an `Accordion.Item`, `Accordion.Header`, `Accordion.Trigger` and `Accordion.Content` component. You can make a reusable wrapper to reduce the amount of code you need to write each time.

```svelte title="CustomAcccordionItem.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildren } from "bits-ui";

	type Props = WithoutChildren<Accordion.ItemProps> & {
		title: string;
		content: string;
	};

	let { title, content, ...restProps }: Props = $props();
</script>

<Accordion.Item {...restProps}>
	<Accordion.Header>
		<Accordion.Trigger>
			{title}
		</Accordion.Trigger>
	</Accordion.Header>
	<Accordion.Content>
		{content}
	</Accordion.Content>
</Accordion.Item>
```

```svelte title="+page.svelte"
<script lang="ts">
	import { Accordion } from "bits-ui";
	import CustomAccordionItem from "$lib/components/CustomAccordionItem.svelte";
</script>

<Accordion.Root type="single">
	<CustomAccordionItem title="Item 1" content="Content 1" />
	<CustomAccordionItem title="Item 2" content="Content 2" />
	<CustomAccordionItem title="Item 3" content="Content 3" />
</Accordion.Root>
```

<APISection {schemas} />
