---
title: Accordion
description: Organizes content into collapsible sections, allowing users to focus on one or more sections at a time.
---

<script>
	import { APISection, ComponentPreviewV2, AccordionDemo, AccordionDemoTransitions, AccordionDemoCustom, Callout } from '$lib/components/index.js'
	let { schemas } = $props()
</script>

<ComponentPreviewV2 name="accordion-demo" comp="Accordion">

{#snippet preview()}
<AccordionDemo />
{/snippet}

</ComponentPreviewV2>

## Overview

The Accordion component is a versatile UI element designed to manage large amounts of content by organizing it into collapsible sections. It's ideal for FAQs, settings panels, or any interface where users need to focus on specific information without being overwhelmed by visual clutter.

## Key Features

-   **Single or Multiple Mode**: Toggle between allowing one open section or multiple sections at once.
-   **Accessible by Default**: Built-in ARIA attributes and keyboard navigation support.
-   **Smooth Transitions**: Leverage CSS variables or Svelte transitions for animated expansions.
-   **Flexible State**: Use uncontrolled defaults or take full control with bound values.

## Structure

The Accordion is a compound component made up of several sub-components:

-   **`Root`**: Wraps all items and manages state.
-   **`Item`**: Represents a single collapsible section.
-   **`Header`**: Displays the title or label.
-   **`Trigger`**: The clickable element that toggles the content.
-   **`Content`**: The collapsible body of each item.

Here's a basic example:

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
</script>

<Accordion.Root>
	<Accordion.Item value="item-1">
		<Accordion.Header>
			<Accordion.Trigger>Section 1</Accordion.Trigger>
		</Accordion.Header>
		<Accordion.Content>Content for section 1 goes here.</Accordion.Content>
	</Accordion.Item>
</Accordion.Root>
```

## Reusable Components

To streamline usage in larger applications, create custom wrapper components for repeated patterns. Below is an example of a reusable `MyAccordionItem` and `MyAccordion`.

### Item Wrapper

Combines `Item`, `Header`, `Trigger`, and `Content` into a single component:

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

### Accordion Wrapper

Wraps `Root` and renders multiple `MyAccordionItem` components:

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

### Usage Example

```svelte title="+page.svelte"
<script lang="ts">
	import MyAccordion from "$lib/components/MyAccordion.svelte";
	const items = [
		{ title: "Item 1", content: "Content 1" },
		{ title: "Item 2", content: "Content 2" },
	];
</script>

<MyAccordion type="single" {items} />
```

<Callout type="tip">

Use unique `value` props for each `Item` if you plan to control the state programatically.

</Callout>

## State Management

The Accordion supports multiple ways to manage which items are open, catering to different use cases.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

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

#### Why Use It?

-   Effortless state updates
-   External controls (e.g., buttons) work out of the box

### Change Handler

Use `onValueChange` for custom logic on state changes:

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
</script>

<Accordion.Root
	type="multiple"
	onValueChange={(value) => {
		console.log("Accordion state changed!");
	}}
></Accordion.Root>
```

#### When to Use?

-   Add logging, validation, or side effects.

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for total control:

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
	let myValue = $state("");
</script>

<Accordion.Root type="single" bind:value={() => myValue, (newValue) => (myValue = newValue)}>
	<!-- ... -->
</Accordion.Root>
```

#### When to Use

-   Implementing complex open/close logic
-   Coordinating multiple UI elements
-   Debugging state-related issues

<Callout type="warning">

Fully controlled state requires careful management to avoid bugs. Prefer two-way binding unless you need fine-grained control.

</Callout>

## Customization

### Single vs. Multiple

Set the `type` prop to `"single"` to allow only one accordion item to be open at a time.

```svelte /type="single"/
<MyAccordion
	type="single"
	items={[
		{ title: "Title A", content: "Content A" },
		{ title: "Title B", content: "Content B" },
		{ title: "Title C", content: "Content C" },
	]}
/>
```

<AccordionDemoCustom type="single" />

Set the `type` prop to `"multiple"` to allow multiple accordion items to be open at the same time.

```svelte /type="multiple"/
<MyAccordion
	type="multiple"
	items={[
		{ title: "Title A", content: "Content A" },
		{ title: "Title B", content: "Content B" },
		{ title: "Title C", content: "Content C" },
	]}
/>
```

<AccordionDemoCustom type="single" />

### Default Open Items

Set the `value` prop to pre-open items:

```svelte /value={["A", "C"]}/
<MyAccordion value={["A", "C"]} type="multiple" />
```

<AccordionDemoCustom value={["A", "C"]} type="multiple" />

### Disable Items

Disable specific items with the `disabled` prop:

```svelte {2}
<Accordion.Root type="single">
	<Accordion.Item value="item-1" disabled>
		<!-- ... -->
	</Accordion.Item>
</Accordion.Root>
```

### Svelte Transitions

The Accordion component can be enhanced with Svelte's built-in transition effects or other animation libraries.

#### Using `forceMount` and `child` Snippets

To apply Svelte transitions to Accordion components, use the `forceMount` prop in combination with the `child` snippet. This approach gives you full control over the mounting behavior and animation of the `Accordion.Content`.

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

In this example:

-   The `forceMount` prop ensures the components are always in the DOM.
-   The `child` snippet provides access to the open state and component props.
-   Svelte's `#if` block controls when the content is visible.
-   Transition directives (`transition:fade` and `transition:fly`) apply the animations.

<ComponentPreviewV2 name="accordion-demo-transitions" comp="Accordion">

{#snippet preview()}
<AccordionDemoTransitions />
{/snippet}

</ComponentPreviewV2>

#### Best Practices

For cleaner code and better maintainability, consider creating custom reusable components that encapsulate this transition logic.

```svelte title="MyAccordionContent.svelte"
<script lang="ts">
	import { Accordion, type WithoutChildrenOrChild } from "bits-ui";
	import type { Snippet } from "svelte";
	import { fade } from "svelte/transition";

	let {
		ref = $bindable(null),
		duration = 200,
		children,
		...restProps
	}: WithoutChildrenOrChild<Accordion.ContentProps> & {
		duration?: number;
		children: Snippet;
	} = $props();
</script>

<Accordion.Content forceMount bind:ref {...restProps}>
	{#snippet child({ props, open })}
		{#if open}
			<div {...props} transition:fade={{ duration }}>
				{@render children?.()}
			</div>
		{/if}
	{/snippet}
</Accordion.Content>
```

You can then use the `MyAccordionContent` component alongside the other `Accordion` primitives throughout your application:

```svelte
<Accordion.Root>
	<Accordion.Item value="A">
		<Accordion.Header>
			<Accordion.Trigger>A</Accordion.Trigger>
		</Accordion.Header>
		<MyAccordionContent duration={300}>
			<!-- ... -->
		</MyAccordionContent>
	</Accordion.Item>
</Accordion.Root>
```

<APISection {schemas} />
