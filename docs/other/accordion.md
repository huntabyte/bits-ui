# Accordion

Organizes content into collapsible sections, allowing users to focus on one or more sections at a time.

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  const items = [
    {
      value: "1",
      title: "What is the meaning of life?",
      content:
        "To become a better person, to help others, and to leave the world a better place than you found it."
    },
    {
      value: "2",
      title: "How do I become a better person?",
      content:
        "Read books, listen to podcasts, and surround yourself with people who inspire you."
    },
    {
      value: "3",
      title: "What is the best way to help others?",
      content: "Give them your time, attention, and love."
    }
  ];
</script>
<Accordion.Root class="w-full sm:max-w-[70%]" type="multiple">
  {#each items as item (item.value)}
    <Accordion.Item
      value={item.value}
      class="border-dark-10 group border-b px-1.5"
    >
      <Accordion.Header>
        <Accordion.Trigger
          class="flex w-full flex-1 select-none items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
        >
          <span class="w-full text-left">
            {item.title}
          </span>
          <span
            class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent"
          >
            <CaretDown class="size-[18px] transition-transform duration-200" />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content
        class="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm tracking-[-0.01em]"
      >
        <div class="pb-[25px]">
          {item.content}
        </div>
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
```

## Overview

The Accordion component is a versatile UI element designed to manage large amounts of content by organizing it into collapsible sections. It's ideal for FAQs, settings panels, or any interface where users need to focus on specific information without being overwhelmed by visual clutter.

## Key Features

- **Single or Multiple Mode**: Toggle between allowing one open section or multiple sections at once.
- **Accessible by Default**: Built-in ARIA attributes and keyboard navigation support.
- **Smooth Transitions**: Leverage CSS variables or Svelte transitions for animated expansions.
- **Flexible State**: Use uncontrolled defaults or take full control with bound values.

## Structure

The Accordion is a compound component made up of several sub-components:

- **`Root`**: Wraps all items and manages state.
- **`Item`**: Represents a single collapsible section.
- **`Header`**: Displays the title or label.
- **`Trigger`**: The clickable element that toggles the content.
- **`Content`**: The collapsible body of each item.

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

MyAccordionItem.svelte

```svelte
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

MyAccordion.svelte

```svelte
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

<Accordion.Root bind:value bind:ref {...restProps as any}>
	{#each items as item, i (item.title + i)}
		<MyAccordionItem {...item} />
	{/each}
</Accordion.Root>
```

### Usage Example

+page.svelte

```svelte
<script lang="ts">
	import MyAccordion from "$lib/components/MyAccordion.svelte";
	const items = [
		{ title: "Item 1", content: "Content 1" },
		{ title: "Item 2", content: "Content 2" },
	];
</script>
<MyAccordion type="single" {items} />
```

##### Tip

Use unique `value` props for each `Item` if you plan to control the state programatically.

## Managing Value State

This section covers how to manage the `value` state of the Accordion.

### Two-Way Binding

Use `bind:value` for simple, automatic state synchronization:

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
	let myValue = $state<string[]>([]);
	const numberOfItemsOpen = $derived(myValue.length);
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
	</Accordion.Item>
	<Accordion.Item value="item-2">
	</Accordion.Item>
	<Accordion.Item value="item-3">
	</Accordion.Item>
</Accordion.Root>
```

### Fully Controlled

Use a [Function Binding](https://svelte.dev/docs/svelte/bind#Function-bindings) for complete control over the state's reads and writes.

```svelte
<script lang="ts">
	import { Accordion } from "bits-ui";
	let myValue = $state("");
	function getValue() {
		return myValue;
	}
	function setValue(newValue: string) {
		myValue = newValue;
	}
</script>
<Accordion.Root type="single" bind:value={getValue, setValue}>
</Accordion.Root>
```

See the [State Management](/docs/state-management) documentation for more information.

## Customization

### Single vs. Multiple

Set the `type` prop to `"single"` to allow only one accordion item to be open at a time.

```svelte
<MyAccordion
	type="single"
	items={[
		{ title: "Title A", content: "Content A" },
		{ title: "Title B", content: "Content B" },
		{ title: "Title C", content: "Content C" },
	]}
/>
```

Set the `type` prop to `"multiple"` to allow multiple accordion items to be open at the same time.

```svelte
<MyAccordion
	type="multiple"
	items={[
		{ title: "Title A", content: "Content A" },
		{ title: "Title B", content: "Content B" },
		{ title: "Title C", content: "Content C" },
	]}
/>
```

### Default Open Items

Set the `value` prop to pre-open items:

```svelte
<MyAccordion value={["A", "C"]} type="multiple" />
```

### Disable Items

Disable specific items with the `disabled` prop:

```svelte
<Accordion.Root type="single">
	<Accordion.Item value="item-1" disabled>
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

- The `forceMount` prop ensures the components are always in the DOM.
- The `child` snippet provides access to the open state and component props.
- Svelte's `#if` block controls when the content is visible.
- Transition directives ( `transition:fade` and `transition:fly` ) apply the animations.

```svelte
<script lang="ts">
  import { Accordion } from "bits-ui";
  import CaretDown from "phosphor-svelte/lib/CaretDown";
  import { slide } from "svelte/transition";
  const items = [
    {
      title: "What is the meaning of life?",
      content:
        "To become a better person, to help others, and to leave the world a better place than you found it."
    },
    {
      title: "How do I become a better person?",
      content:
        "Read books, listen to podcasts, and surround yourself with people who inspire you."
    },
    {
      title: "What is the best way to help others?",
      content: "Give them your time, attention, and love."
    }
  ];
  let value = $state<string[]>([]);
</script>
<Accordion.Root class="w-full sm:max-w-[70%]" type="multiple" bind:value>
  {#each items as item, i}
    <Accordion.Item value={`${i}`} class="border-dark-10 group border-b px-1.5">
      <Accordion.Header>
        <Accordion.Trigger
          class="flex w-full flex-1 items-center justify-between py-5 text-[15px] font-medium transition-all [&[data-state=open]>span>svg]:rotate-180"
        >
          {item.title}
          <span
            class="hover:bg-dark-10 inline-flex size-8 items-center justify-center rounded-[7px] bg-transparent transition-all"
          >
            <CaretDown class="size-[18px] transition-all duration-200" />
          </span>
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content
        forceMount={true}
        class="overflow-hidden text-sm tracking-[-0.01em]"
      >
        {#snippet child({ props, open })}
          {#if open}
            <div {...props} transition:slide={{ duration: 1000 }}>
              <div class="pb-[25px]">
                {item.content}
              </div>
            </div>
          {/if}
        {/snippet}
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>
```

#### Best Practices

For cleaner code and better maintainability, consider creating custom reusable components that encapsulate this transition logic.

MyAccordionContent.svelte

```svelte
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
		</MyAccordionContent>
	</Accordion.Item>
</Accordion.Root>
```

## API Reference

### Accordion.Root

The root accordion component used to set and manage the state of the accordion.

| Property                                                                                    | Type                                                                                                                                                                                                                   | Description                                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `type` required | `enum`See type definition     | The type of accordion. If set to `'multiple'`, the accordion will allow multiple items to be open at the same time. If set to `single`, the accordion will only allow a single item to be open.`Default:  —— undefined`           |
| `value` $bindable                            | `union`See type definition    | The value of the currently active accordion item. If `type` is `'single'`, this should be a string. If `type` is `'multiple'`, this should be an array of strings.`Default:  —— undefined`                                        |
| `onValueChange`                                           | `function`See type definition | A callback function called when the active accordion item value changes. If the `type` is `'single'`, the argument will be a string. If `type` is `'multiple'`, the argument will be an array of strings.`Default:  —— undefined` |
| `disabled`                                                | `boolean`                                                                                                                                                                   | Whether or not the accordion is disabled. When disabled, the accordion cannot be interacted with.`Default: false`                                                                                                                 |
| `loop`                                                    | `boolean`                                                                                                                                                                   | Whether or not the accordion should loop through items when reaching the end.`Default: false`                                                                                                                                     |
| `orientation`                                             | `enum`See type definition     | The orientation of the accordion.`Default: vertical`                                                                                                                                                                              |
| `ref` $bindable                              | `HTMLDivElement`                                                                                                                                                            | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default:  —— undefined`                                                                                                        |
| `children`                                                | `Snippet`                                                                                                                                                                   | The children content to render.`Default:  —— undefined`                                                                                                                                                                           |
| `child`                                                   | `Snippet`See type definition  | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`                                                 |

| Data Attribute                                   | Value                                                                                                                                                                                                      | Description                                                                                     |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `data-orientation` | `enum`See type definition | The orientation of the component.                                        |
| `data-disabled`                                         | `''`                                                                                                                                                                                              | Present when the component is disabled.                                  |
| `data-accordion-root`                                   | `''`                                                                                                                                                                                              | Present on the root element. |

### Accordion.Item

An accordion item.

| Property                                                                  | Type                                                                                                                                                                                                                  | Description                                                                                                                                                                                                          |
| ------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `disabled` | `boolean`                                                                                                                                                                  | Whether or not the accordion item is disabled.`Default: false`                                                                                                                         |
| `value`                                 | `string`                                                                                                                                                                   | The value of the accordion item. This is used to identify when the item is open or closed. If not provided, a unique ID will be generated for this value.`Default: A random unique ID` |
| `ref` $bindable            | `HTMLDivElement`                                                                                                                                                           | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default:  —— undefined`                                                             |
| `children`                              | `Snippet`                                                                                                                                                                  | The children content to render.`Default:  —— undefined`                                                                                                                                |
| `child`                                 | `Snippet`See type definition | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined`      |

| Data Attribute                             | Value                                                                                                                                                                                                      | Description                                                                                     |
| ----------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `data-state` | `enum`See type definition | Whether the accordion item is open or closed.                            |
| `data-disabled`                                   | `''`                                                                                                                                                                                              | Present when the component is disabled.                                  |
| `data-orientation`                                | `enum`See type definition | The orientation of the component.                                        |
| `data-accordion-item`                             | `''`                                                                                                                                                                                              | Present on the item element. |

### Accordion.Header

The header of the accordion item.

| Property                                                               | Type                                                                                                                                                                                                                  | Description                                                                                                                                                                                                     |
| --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `level` | `union`See type definition   | The heading level of the header. This will be set as the `aria-level` attribute.`Default: 3`                                                                                      |
| `ref` $bindable         | `HTMLDivElement`                                                                                                                                                           | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default:  —— undefined`                                                        |
| `children`                           | `Snippet`                                                                                                                                                                  | The children content to render.`Default:  —— undefined`                                                                                                                           |
| `child`                              | `Snippet`See type definition | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |

| Data Attribute                                   | Value                                                                                                                                                                                                      | Description                                                                                       |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-orientation` | `enum`See type definition | The orientation of the component.                                          |
| `data-disabled`                                         | `''`                                                                                                                                                                                              | Present when the component is disabled.                                    |
| `data-heading-level`                                    | `enum`See type definition | The heading level of the element.                                          |
| `data-accordion-header`                                 | `''`                                                                                                                                                                                              | Present on the header element. |

### Accordion.Trigger

The button responsible for toggling the accordion item.

| Property                                                                                    | Type                                                                                                                                                                                                                  | Description                                                                                                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ref` $bindable | `HTMLButtonElement`                                                                                                                                                        | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default:  —— undefined`                                                        |
| `children`                                                | `Snippet`                                                                                                                                                                  | The children content to render.`Default:  —— undefined`                                                                                                                           |
| `child`                                                   | `Snippet`See type definition | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |

| Data Attribute                                   | Value                                                                                                                                                                                                      | Description                                                                                        |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-orientation` | `enum`See type definition | The orientation of the component.                                           |
| `data-disabled`                                         | `''`                                                                                                                                                                                              | Present when the component is disabled.                                     |
| `data-accordion-trigger`                                | `''`                                                                                                                                                                                              | Present on the trigger element. |

### Accordion.Content

The accordion item content, which is displayed when the item is open.

| Property                                                                    | Type                                                                                                                                                                                                                  | Description                                                                                                                                                                                                     |
| -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `forceMount` | `boolean`                                                                                                                                                                  | Whether or not to forcefully mount the content. This is useful if you want to use Svelte transitions or another animation library for the content.`Default: false`                |
| `ref` $bindable              | `HTMLDivElement`                                                                                                                                                           | The underlying DOM element being rendered. You can bind to this to get a reference to the element.`Default:  —— undefined`                                                        |
| `children`                                | `Snippet`See type definition | The children content to render.`Default:  —— undefined`                                                                                                                           |
| `child`                                   | `Snippet`See type definition | Use render delegation to render your own element. See [Child Snippet](/docs/child-snippet) docs for more information.`Default:  —— undefined` |

| Data Attribute                                   | Value                                                                                                                                                                                                      | Description                                                                                        |
| ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `data-orientation` | `enum`See type definition | The orientation of the component.                                           |
| `data-disabled`                                         | `''`                                                                                                                                                                                              | Present when the component is disabled.                                     |
| `data-accordion-content`                                | `''`                                                                                                                                                                                              | Present on the content element. |

| CSS Variable                                                    | Description                                                                                                    |
| -------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `--bits-accordion-content-height` | The height of the accordion content element.                                            |
| `--bits-accordion-content-width`                                       | The width of the accordion content element. |