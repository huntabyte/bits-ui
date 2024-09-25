---
title: Accordion
description: Organizes content into collapsible sections, allowing users to focus on one or more sections at a time.
---

<script>
	import { APISection, ComponentPreviewV2, AccordionDemo, AccordionDemoTransitions, AccordionDemoCustom } from '$lib/components/index.js'
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

For each invidual item, you need an `Accordion.Item`, `Accordion.Header`, `Accordion.Trigger` and `Accordion.Content` component. We can combine these into a single `MyccordionItem` component that makes it easier to reuse.

```svelte title="MyAccordionItem.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";

	type Props = WithoutChildrenOrChild<Accordion.ItemProps> & {
		title: string;
		content: string;
	};

	let { title, content, ...restProps }: Props = $props();
</script>

<Accordion.Item {...restProps}>
	<Accordion.Header>
		<Accordion.Trigger>{item.title}</Accordion.Trigger>
	</Accordion.Header>
	<Accordion.Content>
		{content}
	</Accordion.Content>
</Accordion.Item>
```

We used the [`WithoutChildrenOrChild`](/docs/type-helpers/without-children-or-child) type helper to omit the `child` and `children` snippet props from `Accordion.ItemProps`, since we are opting out of using [Delegation](/docs/delegation) and are already taking care of rendering the children as text via the `content` prop.

For our `MyAccordion` component, we'll accept all the props that `Accordion.Root` accepts, as well as an additional `items` prop that will be used to render the `MyAccordionItem` components.

```svelte title="MyAccordion.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
	import MyAccordionItem from "$lib/components/MyAccordionItem.svelte";

	type Item = {
		value?: string;
		title: string;
		content: string;
		disabled?: boolean;
	};

	let {
		value = $bindable(),
		ref = $bindable(null),
		...restProps
	}: WithoutChildrenOrChild<Accordion.RootProps> & {
		items: Item[];
	} = $props();
</script>

<!--
 Since we have to destructure the `value` to make it `$bindable`, we need to use `as any` here to avoid
 type errors from the discriminated union of `"single" | "multiple"`.
 (an unfortunate consequence of having to destructure bindable values)
  -->
<Accordion.Root bind:value bind:ref {...restProps as any}>
	{#each items as item, i (item.title + i)}
		<MyAccordionItem {...item} />
	{/each}
</Accordion.Root>
```

```svelte title="+page.svelte"
<script lang="ts">
	import { MyAccordion, MyAccordionItem } from "$lib/components";
</script>

<MyAccordion type="single">
	<MyAccordionItem title="Item 1">Content 1</MyAccordionItem>
	<MyAccordionItem title="Item 2">Content 2</MyAccordionItem>
	<MyAccordionItem title="Item 3">Content 3</MyAccordionItem>
</MyAccordion>
```

## Managing Value State

The `value` prop is used to determine which accordion item(s) are currently open. Bits UI provides flexible options for controlling and synchronizing the Accordion's value state.

### Two-Way Binding

Use the `bind:value` directive for effortless two-way synchronization between your local state and the Accordion's internal state.

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";

	let myValue = $state<string[]>([]);
</script>

<button
	onclick={() => {
		myValue = ["item-1", "item-2"];
	}}
>
	Open Items 1 and 2
</button>

<Accordion.Root type="multiple" bind:value={myValue}>
	<Accordion.Item value="item-1">
		<!-- ... -->
	</Accordion.Item>
	<Accordion.Item value="item-2">
		<!-- ... -->
	</Accordion.Item>
	<Accordion.Item value="item-3">
		<!-- ... -->
	</Accordion.Item>
</Accordion.Root>
```

This setup enables opening the Accordion items via the custom button and ensures the local `myValue` state updates when the Accordion closes through any internal means (e.g., clicking on an item's trigger).

### Change Handler

You can also use the `onValueChange` prop to update local state when the Accordion's `value` state changes. This is useful when you don't want two-way binding for one reason or another, or you want to perform additional logic when the Accordion opens or closes.

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";

	let myValue = $state<string[]>([]);
</script>

<Accordion.Root
	type="multiple"
	value={myValue}
	onValueChange={(value) => {
		myValue = value;
		// additional logic here.
	}}
>
	<Accordion.Item value="item-1">
		<!-- ... -->
	</Accordion.Item>
	<Accordion.Item value="item-2">
		<!-- ... -->
	</Accordion.Item>
	<Accordion.Item value="item-3">
		<!-- ... -->
	</Accordion.Item>
</Accordion.Root>
```

### Controlled

Sometimes, you may want complete control over the accordion's value state, meaning you will be "kept in the loop" and be required to apply the value state change yourself. While you will rarely need this, it's possible to do so by setting the `controlledValue` prop to `true`.

You will then be responsible for updating a local value state variable that is passed as the `value` prop to the `Accordion.Root` component.

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";

	let myValue = $state<string>("");
</script>

<Accordion.Root controlledValue value={myValue} onValueChange={(v) => (myValue = v)}>
	<!-- ... -->
</Accordion.Root>
```

See the [Controlled State](/docs/controlled-state) documentation for more information about controlled values.

## Single Type

Set the `type` prop to `"single"` to allow only one accordion item to be open at a time.

```svelte /type="single"/
<CustomAccordion type="single" />
```

<AccordionDemoCustom type="single" />

## Multiple Type

Set the `type` prop to `"multiple"` to allow multiple accordion items to be open at the same time.

```svelte /type="multiple"/
<CustomAccordion type="multiple" />
```

<AccordionDemoCustom type="multiple" />

## Default Open Items

To set default open items, pass them as the `value` prop, which will be an array if the `type` is `"multiple"`, or a string if the `type` is `"single"`.

```svelte /value={["A", "C"]}/
<CustomAccordion value={["A", "C"]} type="multiple" />
```

<AccordionDemoCustom value={["A", "C"]} type="multiple" />

## Disable Items

To disable an individual accordion item, set the `disabled` prop to `true`. This will prevent users from interacting with the item.

```svelte {2}
<Accordion.Root type="single">
	<Accordion.Item value="item-1" disabled>
		<!-- ... -->
	</Accordion.Item>
</Accordion.Root>
```

## Svelte Transitions

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

For more information on using transitions with Bits UI components, see the [Transitions](/docs/transitions) documentation.

<APISection {schemas} />
