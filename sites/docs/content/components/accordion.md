---
title: Accordion
description: Organizes content into collapsible sections, allowing users to focus on one section at a time.
---

<script>
	import { APISection, ComponentPreviewV2, AccordionDemo, AccordionDemoTransitions } from '$lib/components/index.js'
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

## Reusable Components

If you're planning to use the `Accordion` component throughout your application, it's recommended to create reusable wrapper components to reduce the amount of code you need to write each time.

```svelte title="CustomAccordion.svelte"
<script lang="ts">
	import { Accordion } from "bits-ui";

	let {
		value = $bindable(""),
		ref = $bindable(null),
		...restProps
	}: Accordion.RootProps = $props();
</script>

<Accordion.Root bind:value bind:ref {...restProps} />
```

For each invidual item, you need an `Accordion.Item`, `Accordion.Header`, `Accordion.Trigger` and `Accordion.Content` component. We can combine these into a single `CustomAccordionItem` component that makes it easier to reuse.

```svelte title="CustomAccordionItem.svelte"
<script lang="ts">
	import { Accordion, type WithoutChild } from "bits-ui";

	type Props = WithoutChild<Accordion.ItemProps> & {
		title: string;
	};

	let { title, children, ...restProps }: Props = $props();
</script>

<Accordion.Item {...restProps}>
	<Accordion.Header>
		<Accordion.Trigger>{item.title}</Accordion.Trigger>
	</Accordion.Header>
	<Accordion.Content>
		{@render children?.()}
	</Accordion.Content>
</Accordion.Item>
```

We used the [`WithoutChild`](/docs/type-helpers/without-child) type helper to omit the `child` snippet prop from `Accordion.ItemProps`, since we are opting out of using [Delegation](/docs/delegation) with our custom component.

```svelte title="+page.svelte"
<script lang="ts">
	import { CustomAccordion, CustomAccordionItem } from "$lib/components";
</script>

<CustomAccordion type="single">
	<CustomAccordionItem title="Item 1">Content 1</CustomAccordionItem>
	<CustomAccordionItem title="Item 2">Content 2</CustomAccordionItem>
	<CustomAccordionItem title="Item 3">Content 3</CustomAccordionItem>
</CustomAccordion>
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

```svelte {2,5,7}
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

```svelte {2-4}
<Accordion.Root
	onValueChange={(value) => {
		doSomething(value);
	}}
>
	<!-- ... -->
</Accordion.Root>
```

Alternatively, you can use `bind:value` with an `$effect` block to handle side effects when the value of the accordion changes.

```svelte {4,6-8,11}
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

## Transitions

You can use the `forceMount` prop on the `Accordion.Content` component to forcefully mount the content regardless of whether the accordion item is open or closed. This is useful when you want more control over the transitions when the accordion item opens and closes using something like [Svelte Transitions](https://svelte.dev/docs/svelte-transition).

The `open` snippet prop can be used for conditional rendering of the content based on whether the accordion item is open or closed.

```svelte
<Accordion.Content forceMount={true}>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:slide={{ duration: 1000 }}>
				This is the accordion content that will transition in and out.
			</div>
		{/if}
	{/snippet}
</Accordion.Content>
```

<ComponentPreviewV2 name="accordion-demo-transitions" comp="Accordion">

{#snippet preview()}
<AccordionDemoTransitions />
{/snippet}

</ComponentPreviewV2>

<APISection {schemas} />
